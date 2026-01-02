// App Configuration
export const config = {
    // API Configuration
    API_BASE_URL: 'https://api.farmaprisa.com', // Replace with your actual API URL

    // Google Maps Configuration
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your actual API key

    // Location Tracking Configuration
    LOCATION_UPDATE_INTERVAL: 30000, // 30 seconds
    LOCATION_DISTANCE_FILTER: 50, // meters

    // App Constants
    DEFAULT_MAP_REGION: {
        latitude: 18.4861, // Santo Domingo, Dominican Republic
        longitude: -69.9312,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    },

    // Mock Mode
    USE_MOCK_DATA: true, // Set to false when connecting to real API
};

export default config;
