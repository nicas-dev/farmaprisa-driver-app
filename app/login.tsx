import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Colors } from '../constants/colors';
import { useAuth } from '../contexts/auth-context';

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): boolean => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');

        // Email validation
        if (!email.trim()) {
            setEmailError('El correo electrónico es requerido');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Ingrese un correo electrónico válido');
            isValid = false;
        }

        // Password validation
        if (!password.trim()) {
            setPasswordError('La contraseña es requerida');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await login({ email: email.trim(), password });
            // Navigation is handled by the root layout
        } catch (error: any) {
            Alert.alert(
                'Error de autenticación',
                error.message || 'No se pudo iniciar sesión. Por favor, intente de nuevo.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoIcon}>💊</Text>
                    </View>
                    <Text style={styles.title}>Farmaprisa Driver</Text>
                    <Text style={styles.subtitle}>
                        Inicia sesión para gestionar tus entregas
                    </Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Correo Electrónico"
                        placeholder="conductor@farmaprisa.com"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError('');
                        }}
                        error={emailError}
                        icon="mail-outline"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                    />

                    <Input
                        label="Contraseña"
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setPasswordError('');
                        }}
                        error={passwordError}
                        icon="lock-closed-outline"
                        secureTextEntry
                        autoComplete="password"
                    />

                    <Button
                        title="Iniciar Sesión"
                        onPress={handleLogin}
                        loading={isLoading}
                        style={styles.loginButton}
                    />

                    <View style={styles.demoInfo}>
                        <Text style={styles.demoTitle}>Credenciales de prueba:</Text>
                        <Text style={styles.demoText}>Email: driver@farmaprisa.com</Text>
                        <Text style={styles.demoText}>Contraseña: driver123</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logoIcon: {
        fontSize: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.textSecondary,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    loginButton: {
        marginTop: 8,
    },
    demoInfo: {
        marginTop: 32,
        padding: 16,
        backgroundColor: Colors.light.surface,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.light.info,
    },
    demoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
    },
    demoText: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
});
