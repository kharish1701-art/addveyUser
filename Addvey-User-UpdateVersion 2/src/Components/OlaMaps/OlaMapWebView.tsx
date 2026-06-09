import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { getOlaMapHtml } from './OlaMapHtml';
import { OLA_MAPS_CONFIG } from '../../config/olaMapsConfig';

export interface OlaMapMarker {
    id: string;
    lat: number;
    lng: number;
    title?: string;
    description?: string;
    icon?: string;
    color?: string;
    data?: any;
}

export interface OlaMapRegion {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
}

export interface OlaMapWebViewProps {
    style?: ViewStyle;
    initialRegion?: OlaMapRegion;
    region?: OlaMapRegion;
    markers?: OlaMapMarker[];
    showsUserLocation?: boolean;
    userLocation?: { lat: number; lng: number };
    routeCoordinates?: Array<{ lat: number; lng: number }>;
    onMapReady?: () => void;
    onMapPress?: (event: { lat: number; lng: number }) => void;
    onMarkerPress?: (marker: OlaMapMarker) => void;
    onRegionChange?: (region: { lat: number; lng: number; zoom: number }) => void;
    onError?: (error: { error: string }) => void;
}

export interface OlaMapWebViewRef {
    flyTo: (location: { lat: number; lng: number; zoom?: number }) => void;
    fitToCoordinates: (coordinates: Array<{ lat: number; lng: number }>, options?: any) => void;
    animateToRegion: (region: OlaMapRegion, duration?: number) => void;
    drawRoute: (coordinates: Array<{ lat: number; lng: number }>) => void;
    clearRoute: () => void;
    updateMarkers: (markers: OlaMapMarker[]) => void;
}

export const OlaMapWebView = forwardRef<OlaMapWebViewRef, OlaMapWebViewProps>((props, ref) => {
    const {
        style,
        initialRegion,
        region,
        markers = [],
        showsUserLocation = false,
        userLocation,
        routeCoordinates,
        onMapReady,
        onMapPress,
        onMarkerPress,
        onRegionChange,
        onError,
    } = props;

    const webViewRef = useRef<WebView>(null);
    const isMapReady = useRef(false);
    const lastRegionRef = useRef<string>('');
    const lastMarkersRef = useRef<string>('');

    // Send message to WebView
    const sendMessage = useCallback((type: string, payload: any) => {
        if (webViewRef.current && isMapReady.current) {
            webViewRef.current.postMessage(JSON.stringify({ type, payload }));
        }
    }, []);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        flyTo: (location) => {
            sendMessage('FLY_TO', location);
        },
        fitToCoordinates: (coordinates, options) => {
            sendMessage('FIT_BOUNDS', { coordinates, options });
        },
        animateToRegion: (regionArg, duration = 1000) => {
            sendMessage('ANIMATE_TO_REGION', { region: regionArg, duration });
        },
        drawRoute: (coordinates) => {
            sendMessage('DRAW_ROUTE', coordinates);
        },
        clearRoute: () => {
            sendMessage('CLEAR_ROUTE', {});
        },
        updateMarkers: (newMarkers) => {
            sendMessage('UPDATE_MARKERS', newMarkers);
        },
    }), [sendMessage]);

    // Initialize map when WebView loads
    const handleWebViewLoad = useCallback(() => {
        const initPayload = {
            lat: initialRegion?.latitude || region?.latitude || 12.9716,
            lng: initialRegion?.longitude || region?.longitude || 77.5946,
            zoom: initialRegion ? Math.log2(360 / (initialRegion.latitudeDelta || 0.01)) - 1 : 12,
            apiKey: OLA_MAPS_CONFIG.API_KEY,
            styleUrl: OLA_MAPS_CONFIG.TILES_URL,
        };

        webViewRef.current?.postMessage(JSON.stringify({ type: 'INIT', payload: initPayload }));
    }, [initialRegion?.latitude, initialRegion?.longitude, initialRegion?.latitudeDelta]);

    // Handle messages from WebView
    const handleMessage = useCallback((event: WebViewMessageEvent) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);

            switch (message.type) {
                case 'LOG':
                    console.log('[OlaMap]', message.payload);
                    break;
                case 'MAP_READY':
                    isMapReady.current = true;
                    // Send initial markers if any
                    if (markers.length > 0) {
                        sendMessage('UPDATE_MARKERS', markers);
                        lastMarkersRef.current = JSON.stringify(markers);
                    }
                    if (userLocation && showsUserLocation) {
                        sendMessage('UPDATE_USER_LOCATION', userLocation);
                    }
                    if (routeCoordinates && routeCoordinates.length > 0) {
                        sendMessage('DRAW_ROUTE', routeCoordinates);
                    }
                    onMapReady?.();
                    break;
                case 'MAP_ERROR':
                    console.error('[OlaMap Error]', message.payload);
                    onError?.(message.payload);
                    break;
                case 'MAP_PRESS':
                    onMapPress?.(message.payload);
                    break;
                case 'MARKER_PRESS':
                    onMarkerPress?.(message.payload);
                    break;
                case 'REGION_CHANGE':
                    // Don't call onRegionChange to prevent infinite loops
                    // Parent components should use ref methods instead
                    break;
            }
        } catch (error) {
            console.error('[OlaMap] Failed to parse message:', error);
        }
    }, [markers, userLocation, showsUserLocation, routeCoordinates, onMapReady, onMapPress, onMarkerPress, onError, sendMessage]);

    // Create a stable string representation for markers to prevent unnecessary updates
    const markersKey = useMemo(() => {
        return JSON.stringify(markers.map(m => ({ id: m.id, lat: m.lat, lng: m.lng })));
    }, [markers]);

    // Update markers when they actually change (compare by content, not reference)
    useEffect(() => {
        if (isMapReady.current && markersKey !== lastMarkersRef.current) {
            sendMessage('UPDATE_MARKERS', markers);
            lastMarkersRef.current = markersKey;
        }
    }, [markersKey, markers, sendMessage]);

    // Update user location
    useEffect(() => {
        if (isMapReady.current && userLocation && showsUserLocation) {
            sendMessage('UPDATE_USER_LOCATION', userLocation);
        }
    }, [userLocation?.lat, userLocation?.lng, showsUserLocation, sendMessage]);

    // Update route
    useEffect(() => {
        if (isMapReady.current && routeCoordinates) {
            if (routeCoordinates.length > 0) {
                sendMessage('DRAW_ROUTE', routeCoordinates);
            } else {
                sendMessage('CLEAR_ROUTE', {});
            }
        }
    }, [routeCoordinates, sendMessage]);

    // Handle region prop changes - only animate if significantly different
    useEffect(() => {
        if (isMapReady.current && region) {
            const regionKey = `${region.latitude.toFixed(4)},${region.longitude.toFixed(4)}`;
            if (regionKey !== lastRegionRef.current) {
                lastRegionRef.current = regionKey;
                sendMessage('ANIMATE_TO_REGION', { region, duration: 500 });
            }
        }
    }, [region?.latitude, region?.longitude, sendMessage]);

    const html = useMemo(() => getOlaMapHtml(OLA_MAPS_CONFIG.API_KEY), []);

    return (
        <View style={[styles.container, style]}>
            <WebView
                ref={webViewRef}
                source={{ html }}
                style={styles.webview}
                onLoad={handleWebViewLoad}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                mixedContentMode="compatibility"
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                geolocationEnabled={true}
                originWhitelist={['*']}
                scrollEnabled={false}
                bounces={false}
                overScrollMode="never"
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                cacheEnabled={true}
                cacheMode="LOAD_CACHE_ELSE_NETWORK"
                onError={(syntheticEvent: any) => {
                    const { nativeEvent } = syntheticEvent;
                    console.error('[OlaMap WebView Error]', nativeEvent);
                }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
});

export default OlaMapWebView;
