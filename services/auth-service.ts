import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/delivery-types';

const TOKEN_KEY = '@farmaprisa_auth_token';
const USER_KEY = '@farmaprisa_user';

// Mock users for development
const MOCK_USERS = [
    {
        id: '1',
        email: 'driver@farmaprisa.com',
        password: 'driver123',
        name: 'Juan Pérez',
        role: 'driver' as const,
        phone: '+1 809-555-0101',
    },
    {
        id: '2',
        email: 'admin@farmaprisa.com',
        password: 'admin123',
        name: 'María García',
        role: 'admin' as const,
        phone: '+1 809-555-0102',
    },
];

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

class AuthService {
    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock authentication
        const user = MOCK_USERS.find(
            u => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        // Check if user is a driver
        if (user.role !== 'driver') {
            throw new Error('Solo los conductores pueden acceder a esta aplicación');
        }

        const { password, ...userWithoutPassword } = user;
        const token = `mock_token_${user.id}_${Date.now()}`;

        // Store token and user
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));

        return {
            token,
            user: userWithoutPassword,
        };
    }

    /**
     * Logout and clear stored data
     */
    async logout(): Promise<void> {
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    }

    /**
     * Get stored authentication token
     */
    async getToken(): Promise<string | null> {
        return await AsyncStorage.getItem(TOKEN_KEY);
    }

    /**
     * Get stored user data
     */
    async getUser(): Promise<User | null> {
        const userJson = await AsyncStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        return !!token;
    }

    /**
     * Validate user role
     */
    async validateRole(requiredRole: string): Promise<boolean> {
        const user = await this.getUser();
        return user?.role === requiredRole;
    }
}

export default new AuthService();
