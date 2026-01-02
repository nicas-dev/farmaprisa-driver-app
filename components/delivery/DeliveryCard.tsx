import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Delivery, DeliveryStatus } from '../../types/delivery-types';

interface DeliveryCardProps {
    delivery: Delivery;
    onPress?: () => void;
}

export default function DeliveryCard({ delivery, onPress }: DeliveryCardProps) {
    const getStatusColor = (status: DeliveryStatus) => {
        switch (status) {
            case DeliveryStatus.PENDING:
                return Colors.light.warning;
            case DeliveryStatus.IN_PROGRESS:
                return Colors.light.info;
            case DeliveryStatus.COMPLETED:
                return Colors.light.success;
            case DeliveryStatus.CANCELLED:
                return Colors.light.error;
            default:
                return Colors.light.textSecondary;
        }
    };

    const getStatusText = (status: DeliveryStatus) => {
        switch (status) {
            case DeliveryStatus.PENDING:
                return 'Pendiente';
            case DeliveryStatus.IN_PROGRESS:
                return 'En Progreso';
            case DeliveryStatus.COMPLETED:
                return 'Completada';
            case DeliveryStatus.CANCELLED:
                return 'Cancelada';
            default:
                return status;
        }
    };

    const formatCurrency = (amount: number) => {
        return `RD$${amount.toFixed(2)}`;
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>#{delivery.orderId}</Text>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(delivery.status) + '20' },
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                { color: getStatusColor(delivery.status) },
                            ]}
                        >
                            {getStatusText(delivery.status)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.amount}>{formatCurrency(delivery.totalAmount)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.customerSection}>
                <View style={styles.iconRow}>
                    <Ionicons name="person-outline" size={18} color={Colors.light.primary} />
                    <Text style={styles.customerName}>{delivery.customer.name}</Text>
                </View>

                <View style={styles.iconRow}>
                    <Ionicons name="location-outline" size={18} color={Colors.light.primary} />
                    <Text style={styles.address} numberOfLines={2}>
                        {delivery.customer.address}
                    </Text>
                </View>

                <View style={styles.iconRow}>
                    <Ionicons name="call-outline" size={18} color={Colors.light.primary} />
                    <Text style={styles.phone}>{delivery.customer.phone}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.footerItem}>
                    <Ionicons name="cube-outline" size={16} color={Colors.light.textSecondary} />
                    <Text style={styles.footerText}>
                        {delivery.items.length} {delivery.items.length === 1 ? 'artículo' : 'artículos'}
                    </Text>
                </View>

                {delivery.distance && (
                    <View style={styles.footerItem}>
                        <Ionicons name="navigate-outline" size={16} color={Colors.light.textSecondary} />
                        <Text style={styles.footerText}>{delivery.distance} km</Text>
                    </View>
                )}
            </View>

            {delivery.notes && (
                <View style={styles.notesContainer}>
                    <Ionicons name="information-circle-outline" size={16} color={Colors.light.info} />
                    <Text style={styles.notes}>{delivery.notes}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: Colors.light.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderInfo: {
        flex: 1,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 6,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    amount: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.light.divider,
        marginVertical: 12,
    },
    customerSection: {
        gap: 8,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    customerName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
        flex: 1,
    },
    address: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        flex: 1,
        lineHeight: 20,
    },
    phone: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    footer: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 16,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    footerText: {
        fontSize: 13,
        color: Colors.light.textSecondary,
    },
    notesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 12,
        padding: 10,
        backgroundColor: Colors.light.info + '10',
        borderRadius: 8,
    },
    notes: {
        fontSize: 13,
        color: Colors.light.info,
        flex: 1,
        fontStyle: 'italic',
    },
});
