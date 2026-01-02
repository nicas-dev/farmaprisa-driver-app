export enum DeliveryStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    address: string;
    location: Location;
}

export interface DeliveryItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Delivery {
    id: string;
    orderId: string;
    customer: Customer;
    items: DeliveryItem[];
    status: DeliveryStatus;
    totalAmount: number;
    createdAt: string;
    estimatedDeliveryTime?: string;
    distance?: number; // in kilometers
    notes?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'driver' | 'admin' | 'customer';
    phone?: string;
}
