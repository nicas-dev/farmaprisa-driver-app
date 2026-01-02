import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeliveryMapView from '../../components/map/DeliveryMapView';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Colors } from '../../constants/colors';
import deliveryService from '../../services/delivery-service';
import locationService from '../../services/location-service';
import { Delivery, DeliveryStatus, Location } from '../../types/delivery-types';

export default function MapScreen() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    loadData();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (isTracking) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    return () => {
      stopLocationTracking();
    };
  }, [isTracking]);

  const loadData = async () => {
    try {
      // Load pending deliveries
      const data = await deliveryService.getDeliveries(DeliveryStatus.PENDING);
      setDeliveries(data);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const hasPermission = await locationService.hasPermissions();
      if (!hasPermission) {
        const granted = await locationService.requestPermissions();
        if (!granted) {
          Alert.alert(
            'Permisos Requeridos',
            'La aplicación necesita acceso a tu ubicación para funcionar correctamente.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      // Get initial location
      const location = await locationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const startLocationTracking = () => {
    locationService.startWatchingLocation((location) => {
      setCurrentLocation(location);
      // Send location update to backend
      locationService.sendLocationUpdate(location);
    });
  };

  const stopLocationTracking = () => {
    locationService.stopWatchingLocation();
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  const refreshLocation = async () => {
    const location = await locationService.getCurrentLocation();
    if (location) {
      setCurrentLocation(location);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <DeliveryMapView
        deliveries={deliveries}
        currentLocation={currentLocation}
        showRoute={true}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mapa de Entregas</Text>
          <Text style={styles.headerSubtitle}>
            {deliveries.length} {deliveries.length === 1 ? 'entrega pendiente' : 'entregas pendientes'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.trackingButton,
            isTracking && styles.trackingButtonActive,
          ]}
          onPress={toggleTracking}
        >
          <Ionicons
            name={isTracking ? 'navigate' : 'navigate-outline'}
            size={24}
            color={isTracking ? '#FFFFFF' : Colors.light.primary}
          />
          <Text
            style={[
              styles.trackingButtonText,
              isTracking && styles.trackingButtonTextActive,
            ]}
          >
            {isTracking ? 'Rastreando' : 'Iniciar Rastreo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshLocation}
        >
          <Ionicons name="refresh-outline" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {/* Location Info */}
      {currentLocation && (
        <View style={styles.locationInfo}>
          <Ionicons name="location" size={16} color={Colors.light.success} />
          <Text style={styles.locationText}>
            Ubicación: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  controls: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  trackingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  trackingButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  trackingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  trackingButtonTextActive: {
    color: '#FFFFFF',
  },
  refreshButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  locationInfo: {
    position: 'absolute',
    bottom: 108,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: 'monospace',
  },
});
