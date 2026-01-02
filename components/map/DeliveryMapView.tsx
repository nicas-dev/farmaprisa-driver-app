import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import config from '../../config/config';
import { Colors } from '../../constants/colors';
import locationService from '../../services/location-service';
import { Delivery, DeliveryStatus, Location } from '../../types/delivery-types';

interface DeliveryMapViewProps {
    deliveries: Delivery[];
    currentLocation?: Location | null;
    showRoute?: boolean;
}

export default function DeliveryMapView({
    deliveries,
    currentLocation,
    showRoute = true,
}: DeliveryMapViewProps) {
    const mapRef = useRef<MapView>(null);
    const [route, setRoute] = useState<Location[]>([]);

    useEffect(() => {
        if (deliveries.length > 0 && mapRef.current) {
            // Fit map to show all markers
            const coordinates = deliveries.map(d => d.customer.location);
            if (currentLocation) {
                coordinates.push(currentLocation);
            }

            if (coordinates.length > 0) {
                mapRef.current.fitToCoordinates(coordinates, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                });
            }
        }
    }, [deliveries, currentLocation]);

    useEffect(() => {
        if (showRoute && currentLocation && deliveries.length > 0) {
            calculateOptimalRoute();
        }
    }, [deliveries, currentLocation, showRoute]);

    const calculateOptimalRoute = () => {
        if (!currentLocation) return;

        const pendingDeliveries = deliveries.filter(
            d => d.status === DeliveryStatus.PENDING
        );

        if (pendingDeliveries.length === 0) return;

        // Get optimized order
        const deliveryLocations = pendingDeliveries.map(d => ({
            id: d.id,
            location: d.customer.location,
        }));

        const optimizedOrder = locationService.optimizeRoute(
            currentLocation,
            deliveryLocations
        );

        // Create route coordinates
        const routeCoordinates: Location[] = [currentLocation];
        optimizedOrder.forEach(deliveryId => {
            const delivery = pendingDeliveries.find(d => d.id === deliveryId);
            if (delivery) {
                routeCoordinates.push(delivery.customer.location);
            }
        });

        setRoute(routeCoordinates);
    };

    const getMarkerColor = (status: DeliveryStatus) => {
        switch (status) {
            case DeliveryStatus.PENDING:
                return Colors.light.markerPending;
            case DeliveryStatus.IN_PROGRESS:
                return Colors.light.markerInProgress;
            case DeliveryStatus.COMPLETED:
                return Colors.light.markerCompleted;
            default:
                return Colors.light.textSecondary;
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={config.DEFAULT_MAP_REGION}
                showsUserLocation={false}
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
            >
                {/* Driver's current location */}
                {currentLocation && (
                    <Marker
                        coordinate={currentLocation}
                        title="Tu ubicación"
                        description="Conductor"
                    >
                        <View style={styles.driverMarker}>
                            <Ionicons name="car" size={24} color="#FFFFFF" />
                        </View>
                    </Marker>
                )}

                {/* Delivery locations */}
                {deliveries.map((delivery, index) => (
                    <Marker
                        key={delivery.id}
                        coordinate={delivery.customer.location}
                        title={delivery.customer.name}
                        description={delivery.customer.address}
                    >
                        <View
                            style={[
                                styles.deliveryMarker,
                                { backgroundColor: getMarkerColor(delivery.status) },
                            ]}
                        >
                            <Text style={styles.markerText}>{index + 1}</Text>
                        </View>
                    </Marker>
                ))}

                {/* Optimized route */}
                {showRoute && route.length > 1 && (
                    <Polyline
                        coordinates={route}
                        strokeColor={Colors.light.routeLine}
                        strokeWidth={4}
                        lineDashPattern={[1]}
                    />
                )}
            </MapView>

            {deliveries.length === 0 && (
                <View style={styles.emptyState}>
                    <Ionicons name="map-outline" size={64} color={Colors.light.textLight} />
                    <Text style={styles.emptyText}>No hay entregas para mostrar</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    driverMarker: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    deliveryMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    markerText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyState: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    emptyText: {
        fontSize: 16,
        color: Colors.light.textSecondary,
        marginTop: 16,
    },
});
