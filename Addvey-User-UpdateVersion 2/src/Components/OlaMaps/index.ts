/**
 * Ola Maps Components
 * 
 * Drop-in replacement for react-native-maps
 * 
 * Usage:
 * Replace:
 *   import MapView, { Marker } from 'react-native-maps';
 * With:
 *   import MapView, { Marker } from '../Components/OlaMaps';
 */

export { OlaMapView as default, OlaMapView, OlaMarker as Marker, MapView } from './OlaMapView';
export { OlaMapWebView } from './OlaMapWebView';
export { OlaMapsService } from '../../services/OlaMapsService';
export { getOlaMapHtml } from './OlaMapHtml';
export { OLA_MAPS_CONFIG } from '../../config/olaMapsConfig';

// Re-export types
export type { OlaMapMarker, OlaMapRegion, OlaMapWebViewRef, OlaMapWebViewProps } from './OlaMapWebView';
export type { MapViewProps, MapViewRef, MarkerProps } from './OlaMapView';

// Compatibility constants (to match react-native-maps)
export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = undefined;
