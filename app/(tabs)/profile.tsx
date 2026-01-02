import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../contexts/auth-context';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            console.error('Error logging out:', error);
                        }
                    },
                },
            ]
        );
    };

    const MenuItem = ({
        icon,
        title,
        subtitle,
        onPress,
        showArrow = true,
    }: {
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        subtitle?: string;
        onPress?: () => void;
        showArrow?: boolean;
    }) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.menuItemIcon}>
                <Ionicons name={icon} size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{title}</Text>
                {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
            </View>
            {showArrow && (
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.light.textLight}
                />
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={48} color="#FFFFFF" />
                </View>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                    <Ionicons name="car" size={16} color={Colors.light.primary} />
                    <Text style={styles.roleText}>Conductor</Text>
                </View>
            </View>

            {/* Account Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cuenta</Text>
                <View style={styles.card}>
                    <MenuItem
                        icon="person-outline"
                        title="Información Personal"
                        subtitle={user?.name}
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="call-outline"
                        title="Teléfono"
                        subtitle={user?.phone || 'No configurado'}
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="mail-outline"
                        title="Correo Electrónico"
                        subtitle={user?.email}
                        showArrow={false}
                    />
                </View>
            </View>

            {/* Statistics Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Estadísticas</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="checkmark-circle" size={32} color={Colors.light.success} />
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Completadas Hoy</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="time" size={32} color={Colors.light.warning} />
                        <Text style={styles.statValue}>4</Text>
                        <Text style={styles.statLabel}>Pendientes</Text>
                    </View>
                </View>
            </View>

            {/* Settings Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Configuración</Text>
                <View style={styles.card}>
                    <MenuItem
                        icon="notifications-outline"
                        title="Notificaciones"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="location-outline"
                        title="Permisos de Ubicación"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="help-circle-outline"
                        title="Ayuda y Soporte"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color={Colors.light.error} />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Farmaprisa Driver v1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        marginBottom: 12,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: Colors.light.primary + '20',
        borderRadius: 16,
    },
    roleText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.primary,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 2,
    },
    menuItemSubtitle: {
        fontSize: 13,
        color: Colors.light.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.light.divider,
        marginLeft: 68,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        textAlign: 'center',
        marginTop: 4,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginTop: 32,
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.light.error,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.error,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    footerText: {
        fontSize: 12,
        color: Colors.light.textLight,
    },
});
