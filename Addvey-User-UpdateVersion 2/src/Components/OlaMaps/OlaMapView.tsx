/**
 * OlaMapView - Drop-in replacement for react-native-maps MapView
 * 
 * This component provides a react-native-maps compatible API while using
 * Ola Maps (MapLibre) under the hood via WebView.
 * 
 * Usage:
 * Replace:
 *   import MapView, { Marker } from 'react-native-maps';
 * With:
 *   import { OlaMapView as MapView, OlaMarker as Marker } from '../Components/OlaMaps';
 */

import React, { forwardRef, useRef, useImperativeHandle, useCallback, ReactNode, Children, isValidElement, useMemo } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import OlaMapWebView, { OlaMapWebViewRef, OlaMapMarker, OlaMapRegion } from './OlaMapWebView';

// Re-export types
export type { OlaMapMarker, OlaMapRegion };

export interface MarkerProps {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    identifier?: string;
    title?: string;
    description?: string;
    image?: any;
    pinColor?: string;
    onPress?: () => void;
    children?: ReactNode;
}

export interface MapViewProps {
    style?: ViewStyle;
    initialRegion?: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
    region?: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
    showsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    showsCompass?: boolean;
    toolbarEnabled?: boolean;
    provider?: any; // Ignored, but kept for compatibility
    onMapReady?: () => void;
    onPress?: (event: any) => void;
    onRegionChange?: (region: any) => void;
    onRegionChangeComplete?: (region: any) => void;
    children?: ReactNode;
}

export interface MapViewRef {
    animateToRegion: (region: any, duration?: number) => void;
    fitToCoordinates: (coordinates: Array<{ latitude: number; longitude: number }>, options?: any) => void;
    getCamera: () => Promise<any>;
    setCamera: (camera: any) => void;
}

/**
 * OlaMarker - Compatible with react-native-maps Marker
 */
export const OlaMarker: React.FC<MarkerProps> = () => {
    // This component is used for extracting marker data, not for rendering
    return null;
};

/**
 * OlaMapView - Compatible with react-native-maps MapView
 */
export const OlaMapView = forwardRef<MapViewRef, MapViewProps>((props, ref) => {
    const {
        style,
        initialRegion,
        region,
        showsUserLocation = false,
        onMapReady,
        onPress,
        children,
    } = props;

    const webViewRef = useRef<OlaMapWebViewRef>(null);
    const currentRegion = useRef<any>(null);

    // Store onPress handlers for markers
    const markerHandlers = useRef<Map<string, () => void>>(new Map());

    // Extract markers from children - memoized to prevent unnecessary recalculations
    const markers = useMemo((): OlaMapMarker[] => {
        const result: OlaMapMarker[] = [];
        markerHandlers.current.clear();

        Children.forEach(children, (child, index) => {
            if (isValidElement(child)) {
                const childProps = child.props as MarkerProps;

                if (childProps.coordinate) {
                    const id = childProps.identifier || `marker-${index}`;
                    result.push({
                        id,
                        lat: childProps.coordinate.latitude,
                        lng: childProps.coordinate.longitude,
                        title: childProps.title,
                        description: childProps.description,
                        color: childProps.pinColor,
                    });

                    if (childProps.onPress) {
                        markerHandlers.current.set(id, childProps.onPress);
                    }
                }
            }
        });

        return result;
    }, [children]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        animateToRegion: (regionArg, duration = 1000) => {
            webViewRef.current?.animateToRegion({
                latitude: regionArg.latitude,
                longitude: regionArg.longitude,
                latitudeDelta: regionArg.latitudeDelta,
                longitudeDelta: regionArg.longitudeDelta,
            }, duration);
        },
        fitToCoordinates: (coordinates, options) => {
            const coords = coordinates.map(c => ({
                lat: c.latitude,
                lng: c.longitude,
            }));
            webViewRef.current?.fitToCoordinates(coords, {
                padding: options?.edgePadding,
                duration: options?.animated !== false ? 1000 : 0,
            });
        },
        getCamera: async () => {
            return {
                center: currentRegion.current,
                zoom: 12,
            };
        },
        setCamera: (camera) => {
            if (camera.center) {
                webViewRef.current?.flyTo({
                    lat: camera.center.latitude,
                    lng: camera.center.longitude,
                    zoom: camera.zoom,
                });
            }
        },
    }), []);

    // Handle map press
    const handleMapPress = useCallback((event: { lat: number; lng: number }) => {
        if (onPress) {
            onPress({
                nativeEvent: {
                    coordinate: {
                        latitude: event.lat,
                        longitude: event.lng,
                    },
                },
            });
        }
    }, [onPress]);

    // Handle marker press
    const handleMarkerPress = useCallback((marker: OlaMapMarker) => {
        const handler = markerHandlers.current.get(marker.id);
        if (handler) {
            handler();
        }
    }, []);

    return (
        <View style={[styles.container, style]}>
            <OlaMapWebView
                ref={webViewRef}
                style={styles.map}
                initialRegion={initialRegion}
                region={region}
                markers={markers}
                showsUserLocation={showsUserLocation}
                onMapReady={onMapReady}
                onMapPress={handleMapPress}
                onMarkerPress={handleMarkerPress}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});

// Named exports for easy import
export { OlaMapView as MapView, OlaMarker as Marker };

// Default export
export default OlaMapView;
