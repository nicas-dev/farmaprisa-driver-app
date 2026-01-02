import { Delivery, DeliveryStatus } from '../types/delivery-types';

// Mock deliveries data
const MOCK_DELIVERIES: Delivery[] = [
    {
        id: '1',
        orderId: 'ORD-2026-001',
        customer: {
            id: 'c1',
            name: 'Ana Martínez',
            phone: '+1 809-555-1001',
            address: 'Calle El Conde #123, Zona Colonial, Santo Domingo',
            location: {
                latitude: 18.4764,
                longitude: -69.8933,
            },
        },
        items: [
            { id: 'i1', name: 'Paracetamol 500mg', quantity: 2, price: 150 },
            { id: 'i2', name: 'Ibuprofeno 400mg', quantity: 1, price: 200 },
        ],
        status: DeliveryStatus.PENDING,
        totalAmount: 500,
        createdAt: '2026-01-01T14:30:00Z',
        estimatedDeliveryTime: '2026-01-01T16:00:00Z',
        distance: 3.2,
        notes: 'Tocar el timbre dos veces',
    },
    {
        id: '2',
        orderId: 'ORD-2026-002',
        customer: {
            id: 'c2',
            name: 'Carlos Rodríguez',
            phone: '+1 809-555-1002',
            address: 'Av. Winston Churchill #456, Piantini, Santo Domingo',
            location: {
                latitude: 18.4721,
                longitude: -69.9406,
            },
        },
        items: [
            { id: 'i3', name: 'Amoxicilina 500mg', quantity: 1, price: 450 },
            { id: 'i4', name: 'Vitamina C 1000mg', quantity: 3, price: 300 },
        ],
        status: DeliveryStatus.PENDING,
        totalAmount: 750,
        createdAt: '2026-01-01T15:00:00Z',
        estimatedDeliveryTime: '2026-01-01T16:30:00Z',
        distance: 5.8,
    },
    {
        id: '3',
        orderId: 'ORD-2026-003',
        customer: {
            id: 'c3',
            name: 'Laura Fernández',
            phone: '+1 809-555-1003',
            address: 'Calle Proyecto #789, Naco, Santo Domingo',
            location: {
                latitude: 18.4801,
                longitude: -69.9291,
            },
        },
        items: [
            { id: 'i5', name: 'Omeprazol 20mg', quantity: 2, price: 350 },
            { id: 'i6', name: 'Loratadina 10mg', quantity: 1, price: 180 },
        ],
        status: DeliveryStatus.PENDING,
        totalAmount: 530,
        createdAt: '2026-01-01T15:15:00Z',
        estimatedDeliveryTime: '2026-01-01T17:00:00Z',
        distance: 2.5,
    },
    {
        id: '4',
        orderId: 'ORD-2026-004',
        customer: {
            id: 'c4',
            name: 'Roberto Sánchez',
            phone: '+1 809-555-1004',
            address: 'Av. Máximo Gómez #321, Gazcue, Santo Domingo',
            location: {
                latitude: 18.4689,
                longitude: -69.9089,
            },
        },
        items: [
            { id: 'i7', name: 'Metformina 850mg', quantity: 2, price: 400 },
            { id: 'i8', name: 'Atorvastatina 20mg', quantity: 1, price: 550 },
        ],
        status: DeliveryStatus.PENDING,
        totalAmount: 950,
        createdAt: '2026-01-01T15:45:00Z',
        estimatedDeliveryTime: '2026-01-01T17:30:00Z',
        distance: 4.1,
    },
];

class DeliveryService {
    /**
     * Get all deliveries for the current driver
     */
    async getDeliveries(status?: DeliveryStatus): Promise<Delivery[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        let deliveries = [...MOCK_DELIVERIES];

        // Filter by status if provided
        if (status) {
            deliveries = deliveries.filter(d => d.status === status);
        }

        // Sort by created date (newest first)
        deliveries.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return deliveries;
    }

    /**
     * Get a single delivery by ID
     */
    async getDeliveryById(id: string): Promise<Delivery | null> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_DELIVERIES.find(d => d.id === id) || null;
    }

    /**
     * Update delivery status
     */
    async updateDeliveryStatus(
        id: string,
        status: DeliveryStatus
    ): Promise<Delivery> {
        await new Promise(resolve => setTimeout(resolve, 600));

        const delivery = MOCK_DELIVERIES.find(d => d.id === id);
        if (!delivery) {
            throw new Error('Entrega no encontrada');
        }

        delivery.status = status;
        return delivery;
    }

    /**
     * Get pending deliveries count
     */
    async getPendingCount(): Promise<number> {
        const deliveries = await this.getDeliveries(DeliveryStatus.PENDING);
        return deliveries.length;
    }
}

export default new DeliveryService();
