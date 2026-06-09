import { OLA_MAPS_CONFIG } from '../config/olaMapsConfig';

interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

interface CachedToken {
    token: string;
    expiresAt: number;
}

interface GeocodeResult {
    lat: number;
    lng: number;
    formatted_address: string;
    place_id?: string;
}

interface AutocompleteResult {
    description: string;
    place_id: string;
    structured_formatting?: {
        main_text: string;
        secondary_text: string;
    };
}

interface DirectionsResult {
    routes: Array<{
        legs: Array<{
            distance: { value: number; text: string };
            duration: { value: number; text: string };
            steps: Array<{
                distance: { value: number; text: string };
                duration: { value: number; text: string };
                instruction: string;
                polyline: string;
            }>;
        }>;
        overview_polyline: string;
    }>;
}

let cachedToken: CachedToken | null = null;

export const OlaMapsService = {
    /**
     * Get OAuth2 access token from Ola Maps
     * Tokens are cached and automatically refreshed before expiry
     */
    getAccessToken: async (): Promise<string> => {
        // Check if we have a valid cached token (with 5 min buffer)
        if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
            return cachedToken.token;
        }

        try {
            const response = await fetch(OLA_MAPS_CONFIG.TOKEN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: OLA_MAPS_CONFIG.CLIENT_ID,
                    client_secret: OLA_MAPS_CONFIG.CLIENT_SECRET,
                    scope: 'openid',
                }).toString(),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Token fetch failed:', errorText);
                throw new Error(`Token fetch failed: ${response.status}`);
            }

            const data: TokenResponse = await response.json();

            // Cache the token
            cachedToken = {
                token: data.access_token,
                expiresAt: Date.now() + (data.expires_in * 1000),
            };

            console.log('Ola Maps token fetched successfully');
            return data.access_token;
        } catch (error) {
            console.error('Failed to get Ola Maps token:', error);
            // Fallback to API key if token fetch fails
            return OLA_MAPS_CONFIG.API_KEY;
        }
    },

    /**
     * Get the API key for direct API calls
     */
    getApiKey: (): string => {
        return OLA_MAPS_CONFIG.API_KEY;
    },

    /**
     * Get the map style URL with authentication
     */
    getMapStyleUrl: (): string => {
        return `${OLA_MAPS_CONFIG.TILES_URL}?api_key=${OLA_MAPS_CONFIG.API_KEY}`;
    },

    /**
     * Geocode an address to coordinates
     */
    geocode: async (address: string): Promise<GeocodeResult | null> => {
        try {
            const url = `${OLA_MAPS_CONFIG.GEOCODE_URL}?address=${encodeURIComponent(address)}&api_key=${OLA_MAPS_CONFIG.API_KEY}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Geocode failed: ${response.status}`);

            const data = await response.json();

            if (data.geocodingResults && data.geocodingResults.length > 0) {
                const result = data.geocodingResults[0];
                return {
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                    formatted_address: result.formatted_address,
                    place_id: result.place_id,
                };
            }
            return null;
        } catch (error) {
            console.error('Geocode error:', error);
            return null;
        }
    },

    /**
     * Reverse geocode coordinates to address
     */
    reverseGeocode: async (lat: number, lng: number): Promise<GeocodeResult | null> => {
        try {
            const url = `${OLA_MAPS_CONFIG.REVERSE_GEOCODE_URL}?latlng=${lat},${lng}&api_key=${OLA_MAPS_CONFIG.API_KEY}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Reverse geocode failed: ${response.status}`);

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                return {
                    lat,
                    lng,
                    formatted_address: result.formatted_address,
                    place_id: result.place_id,
                };
            }
            return null;
        } catch (error) {
            console.error('Reverse geocode error:', error);
            return null;
        }
    },

    /**
     * Get autocomplete suggestions for a query
     */
    autocomplete: async (query: string, location?: { lat: number; lng: number }): Promise<AutocompleteResult[]> => {
        try {
            let url = `${OLA_MAPS_CONFIG.AUTOCOMPLETE_URL}?input=${encodeURIComponent(query)}&api_key=${OLA_MAPS_CONFIG.API_KEY}`;

            if (location) {
                url += `&location=${location.lat},${location.lng}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Autocomplete failed: ${response.status}`);

            const data = await response.json();

            return data.predictions || [];
        } catch (error) {
            console.error('Autocomplete error:', error);
            return [];
        }
    },

    /**
     * Get directions between two points
     */
    getDirections: async (
        origin: { lat: number; lng: number },
        destination: { lat: number; lng: number },
        waypoints?: Array<{ lat: number; lng: number }>
    ): Promise<DirectionsResult | null> => {
        try {
            let url = `${OLA_MAPS_CONFIG.DIRECTIONS_URL}?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&api_key=${OLA_MAPS_CONFIG.API_KEY}`;

            if (waypoints && waypoints.length > 0) {
                const waypointsStr = waypoints.map(wp => `${wp.lat},${wp.lng}`).join('|');
                url += `&waypoints=${waypointsStr}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Directions failed: ${response.status}`);

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Directions error:', error);
            return null;
        }
    },

    /**
     * Decode a polyline string to an array of coordinates
     */
    decodePolyline: (encoded: string): Array<{ lat: number; lng: number }> => {
        const points: Array<{ lat: number; lng: number }> = [];
        let index = 0;
        let lat = 0;
        let lng = 0;

        while (index < encoded.length) {
            let b;
            let shift = 0;
            let result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            points.push({
                lat: lat / 1e5,
                lng: lng / 1e5,
            });
        }

        return points;
    },
};
