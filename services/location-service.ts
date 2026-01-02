import * as Location from 'expo-location';
import { Location as LocationType } from '../types/delivery-types';

class LocationService {
    private watchSubscription: Location.LocationSubscription | null = null;

    /**
     * Request location permissions
     */
    async requestPermissions(): Promise<boolean> {
        try {
            const { status: foregroundStatus } =
                await Location.requestForegroundPermissionsAsync();

            if (foregroundStatus !== 'granted') {
                return false;
            }

            const { status: backgroundStatus } =
                await Location.requestBackgroundPermissionsAsync();

            return backgroundStatus === 'granted';
        } catch (error) {
            console.error('Error requesting location permissions:', error);
            return false;
        }
    }

    /**
     * Check if location permissions are granted
     */
    async hasPermissions(): Promise<boolean> {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Error checking location permissions:', error);
            return false;
        }
    }

    /**
     * Get current location
     */
    async getCurrentLocation(): Promise<LocationType | null> {
        try {
            const hasPermission = await this.hasPermissions();
            if (!hasPermission) {
                const granted = await this.requestPermissions();
                if (!granted) {
                    throw new Error('Permisos de ubicación no concedidos');
                }
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
        } catch (error) {
            console.error('Error getting current location:', error);
            return null;
        }
    }

    /**
     * Start watching location changes
     */
    async startWatchingLocation(
        callback: (location: LocationType) => void
    ): Promise<void> {
        try {
            const hasPermission = await this.hasPermissions();
            if (!hasPermission) {
                const granted = await this.requestPermissions();
                if (!granted) {
                    throw new Error('Permisos de ubicación no concedidos');
                }
            }

            this.watchSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 50, // Update every 50 meters
                    timeInterval: 30000, // Update every 30 seconds
                },
                (location) => {
                    callback({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    });
                }
            );
        } catch (error) {
            console.error('Error watching location:', error);
            throw error;
        }
    }

    /**
     * Stop watching location changes
     */
    stopWatchingLocation(): void {
        if (this.watchSubscription) {
            this.watchSubscription.remove();
            this.watchSubscription = null;
        }
    }

    /**
     * Calculate distance between two points (in kilometers)
     */
    calculateDistance(
        from: LocationType,
        to: LocationType
    ): number {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRad(to.latitude - from.latitude);
        const dLon = this.toRad(to.longitude - from.longitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(from.latitude)) *
            Math.cos(this.toRad(to.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance * 10) / 10; // Round to 1 decimal
    }

    /**
     * Convert degrees to radians
     */
    private toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    /**
     * Send location update to backend (mock)
     */
    async sendLocationUpdate(location: LocationType): Promise<void> {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('Location update sent:', location);
    }

    /**
     * Optimize route for multiple deliveries
     * Returns optimized order of delivery IDs
     */
    optimizeRoute(
        currentLocation: LocationType,
        deliveryLocations: Array<{ id: string; location: LocationType }>
    ): string[] {
        // Simple nearest-neighbor algorithm for route optimization
        const unvisited = [...deliveryLocations];
        const route: string[] = [];
        let current = currentLocation;

        while (unvisited.length > 0) {
            // Find nearest unvisited location
            let nearestIndex = 0;
            let minDistance = this.calculateDistance(current, unvisited[0].location);

            for (let i = 1; i < unvisited.length; i++) {
                const distance = this.calculateDistance(current, unvisited[i].location);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestIndex = i;
                }
            }

            // Add to route and remove from unvisited
            const nearest = unvisited[nearestIndex];
            route.push(nearest.id);
            current = nearest.location;
            unvisited.splice(nearestIndex, 1);
        }

        return route;
    }
}

export default new LocationService();
