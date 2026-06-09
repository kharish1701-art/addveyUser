import { OLA_MAPS_CONFIG } from '../../config/olaMapsConfig';

export const getOlaMapHtml = (apiKey: string = OLA_MAPS_CONFIG.API_KEY) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Ola Maps</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html { width: 100%; height: 100%; overflow: hidden; }
        #map { width: 100%; height: 100%; }
        
        .custom-marker {
            width: 32px;
            height: 32px;
            cursor: pointer;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center bottom;
        }
        
        .user-location-marker {
            width: 20px;
            height: 20px;
            background: #4285F4;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        
        .user-location-accuracy {
            width: 50px;
            height: 50px;
            background: rgba(66, 133, 244, 0.2);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    </style>
    <link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />
    <script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
</head>
<body>
    <div id="map"></div>
    <script>
        let map;
        let markers = {};
        let userLocationMarker = null;
        let routeLayerId = 'route-layer';
        let routeSourceId = 'route-source';
        
        // Send message to React Native
        function sendToRN(type, payload) {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
            }
        }
        
        function log(msg) {
            sendToRN('LOG', msg);
        }
        
        // Initialize the map
        function initMap(config) {
            try {
                const styleUrl = config.styleUrl || 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json';
                
                map = new maplibregl.Map({
                    container: 'map',
                    style: styleUrl + '?api_key=${apiKey}',
                    center: [config.lng || 77.5946, config.lat || 12.9716],
                    zoom: config.zoom || 12,
                    attributionControl: false,
                    transformRequest: (url, resourceType) => {
                        if (url.includes('api.olamaps.io') && !url.includes('api_key')) {
                            const separator = url.includes('?') ? '&' : '?';
                            return { url: url + separator + 'api_key=${apiKey}' };
                        }
                        return { url };
                    }
                });
                
                map.on('load', () => {
                    log('Map loaded successfully');
                    sendToRN('MAP_READY', { 
                        center: map.getCenter(),
                        zoom: map.getZoom()
                    });
                    
                    // Add route source (empty initially)
                    map.addSource(routeSourceId, {
                        type: 'geojson',
                        data: { type: 'FeatureCollection', features: [] }
                    });
                    
                    // Add route layer
                    map.addLayer({
                        id: routeLayerId,
                        type: 'line',
                        source: routeSourceId,
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#7B61FF',
                            'line-width': 5,
                            'line-opacity': 0.8
                        }
                    });
                });
                
                map.on('error', (e) => {
                    log('Map error: ' + JSON.stringify(e.error || e));
                    sendToRN('MAP_ERROR', { error: e.error?.message || 'Unknown error' });
                });
                
                map.on('click', (e) => {
                    sendToRN('MAP_PRESS', { 
                        lat: e.lngLat.lat, 
                        lng: e.lngLat.lng 
                    });
                });
                
                map.on('moveend', () => {
                    const center = map.getCenter();
                    sendToRN('REGION_CHANGE', {
                        lat: center.lat,
                        lng: center.lng,
                        zoom: map.getZoom()
                    });
                });
                
                // Add navigation controls
                map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
                
            } catch (e) {
                log('Init error: ' + e.message);
                sendToRN('MAP_ERROR', { error: e.message });
            }
        }
        
        // Update/add markers
        function updateMarkers(markersData) {
            if (!map) return;
            
            // Track which markers to keep
            const newMarkerIds = new Set(markersData.map(m => m.id));
            
            // Remove markers that are no longer in the data
            Object.keys(markers).forEach(id => {
                if (!newMarkerIds.has(id)) {
                    markers[id].remove();
                    delete markers[id];
                }
            });
            
            // Add or update markers
            markersData.forEach(data => {
                if (markers[data.id]) {
                    // Update existing marker position
                    markers[data.id].setLngLat([data.lng, data.lat]);
                } else {
                    // Create new marker
                    const el = document.createElement('div');
                    el.className = 'custom-marker';
                    
                    if (data.icon) {
                        el.style.backgroundImage = 'url(' + data.icon + ')';
                    } else {
                        // Default pin icon
                        el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="' + (data.color || '#7B61FF') + '" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
                    }
                    
                    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
                        .setLngLat([data.lng, data.lat])
                        .addTo(map);
                    
                    el.addEventListener('click', (e) => {
                        e.stopPropagation();
                        sendToRN('MARKER_PRESS', data);
                    });
                    
                    markers[data.id] = marker;
                }
            });
        }
        
        // Update user location
        function updateUserLocation(location) {
            if (!map) return;
            
            if (userLocationMarker) {
                userLocationMarker.setLngLat([location.lng, location.lat]);
            } else {
                const el = document.createElement('div');
                el.className = 'user-location-marker';
                
                userLocationMarker = new maplibregl.Marker({ element: el })
                    .setLngLat([location.lng, location.lat])
                    .addTo(map);
            }
        }
        
        // Fly to a location
        function flyTo(location) {
            if (!map) return;
            
            map.flyTo({
                center: [location.lng, location.lat],
                zoom: location.zoom || 15,
                essential: true,
                duration: 1000
            });
        }
        
        // Fit bounds to show all coordinates
        function fitBounds(coordinates, options = {}) {
            if (!map || !coordinates || coordinates.length === 0) return;
            
            const bounds = new maplibregl.LngLatBounds();
            coordinates.forEach(coord => {
                bounds.extend([coord.lng, coord.lat]);
            });
            
            map.fitBounds(bounds, {
                padding: options.padding || { top: 50, bottom: 100, left: 50, right: 50 },
                duration: options.duration || 1000
            });
        }
        
        // Draw a route polyline
        function drawRoute(coordinates) {
            if (!map) return;
            
            const geojson = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates.map(c => [c.lng, c.lat])
                }
            };
            
            map.getSource(routeSourceId)?.setData(geojson);
        }
        
        // Clear the route
        function clearRoute() {
            if (!map) return;
            map.getSource(routeSourceId)?.setData({ type: 'FeatureCollection', features: [] });
        }
        
        // Animate to a region (similar to react-native-maps)
        function animateToRegion(region, duration = 1000) {
            if (!map) return;
            
            const zoom = Math.log2(360 / (region.longitudeDelta || 0.01)) - 1;
            
            map.flyTo({
                center: [region.longitude, region.latitude],
                zoom: Math.min(zoom, 18),
                duration: duration
            });
        }
        
        // Handle messages from React Native
        function handleMessage(data) {
            try {
                const message = JSON.parse(data);
                
                switch (message.type) {
                    case 'INIT':
                        initMap(message.payload);
                        break;
                    case 'UPDATE_MARKERS':
                        updateMarkers(message.payload);
                        break;
                    case 'UPDATE_USER_LOCATION':
                        updateUserLocation(message.payload);
                        break;
                    case 'FLY_TO':
                        flyTo(message.payload);
                        break;
                    case 'FIT_BOUNDS':
                        fitBounds(message.payload.coordinates, message.payload.options);
                        break;
                    case 'DRAW_ROUTE':
                        drawRoute(message.payload);
                        break;
                    case 'CLEAR_ROUTE':
                        clearRoute();
                        break;
                    case 'ANIMATE_TO_REGION':
                        animateToRegion(message.payload.region, message.payload.duration);
                        break;
                }
            } catch (e) {
                log('Handle message error: ' + e.message);
            }
        }
        
        // Listen for messages from React Native
        document.addEventListener('message', (e) => handleMessage(e.data));
        window.addEventListener('message', (e) => handleMessage(e.data));
    </script>
</body>
</html>
`;
