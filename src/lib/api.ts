
// API functions for data fetching and management

interface Order {
  id: string;
  propertyAddress: string;
  date: string;
  status: string;
  price: number;
  services: string[];
  photos?: string[];
}

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: '1',
    propertyAddress: '123 Main St, Anytown, USA',
    date: '2025-03-15',
    status: 'completed',
    price: 149.99,
    services: ['Professional Photography', 'Virtual Staging'],
    photos: ['/assets/sample-property-1.jpg', '/assets/sample-property-2.jpg']
  },
  {
    id: '2',
    propertyAddress: '456 Oak Ave, Somewhere, USA',
    date: '2025-03-18',
    status: 'in-progress',
    price: 99.99,
    services: ['Professional Photography', 'Twilight Enhancement']
  },
  {
    id: '3',
    propertyAddress: '789 Pine Rd, Elsewhere, USA',
    date: '2025-03-20',
    status: 'scheduled',
    price: 199.99,
    services: ['Professional Photography', 'Aerial Drone Shots', 'Virtual Staging']
  }
];

// Get all orders for the current user
export const getOrders = async (): Promise<Order[]> => {
  // This would normally be a fetch call to your backend
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockOrders), 800);
  });
};

// Get a single order by ID
export const getOrderById = async (id: string): Promise<Order | undefined> => {
  // This would normally be a fetch call to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = mockOrders.find(order => order.id === id);
      resolve(order);
    }, 500);
  });
};

// Create a new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'status'>): Promise<Order> => {
  // This would normally be a POST request to your backend
  return new Promise((resolve) => {
    const newOrder: Order = {
      ...orderData,
      id: `${mockOrders.length + 1}`,
      status: 'scheduled'
    };
    
    setTimeout(() => resolve(newOrder), 1000);
  });
};

// Update order status
export const updateOrderStatus = async (id: string, status: string): Promise<Order | undefined> => {
  // This would normally be a PATCH request to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderIndex = mockOrders.findIndex(order => order.id === id);
      if (orderIndex === -1) {
        resolve(undefined);
        return;
      }
      
      const updatedOrder = {
        ...mockOrders[orderIndex],
        status
      };
      
      resolve(updatedOrder);
    }, 500);
  });
};
