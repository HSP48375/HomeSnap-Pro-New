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
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// AUTH FUNCTIONS
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// ORDER FUNCTIONS
export const getOrders = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getOrderById = async (orderId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
};

export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateOrder = async (orderId, updates) => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// PROPERTY FUNCTIONS
export const getProperties = async (userId) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getPropertyById = async (propertyId) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (error) throw error;
  return data;
};

export const createProperty = async (propertyData) => {
  const { data, error } = await supabase
    .from('properties')
    .insert(propertyData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProperty = async (propertyId, updates) => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', propertyId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// FLOORPLAN FUNCTIONS
export const getFloorplans = async (userId) => {
  const { data, error } = await supabase
    .from('floorplans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getFloorplanById = async (floorplanId) => {
  const { data, error } = await supabase
    .from('floorplans')
    .select('*, floorplan_rooms(*)')
    .eq('id', floorplanId)
    .single();

  if (error) throw error;
  return data;
};

export const createFloorplan = async (floorplanData) => {
  const { data, error } = await supabase
    .from('floorplans')
    .insert(floorplanData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateFloorplan = async (floorplanId, updates) => {
  const { data, error } = await supabase
    .from('floorplans')
    .update(updates)
    .eq('id', floorplanId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const saveFloorplanRoom = async (roomData) => {
  const { data, error } = await supabase
    .from('floorplan_rooms')
    .insert(roomData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateFloorplanRoom = async (roomId, updates) => {
  const { data, error } = await supabase
    .from('floorplan_rooms')
    .update(updates)
    .eq('id', roomId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteFloorplanRoom = async (roomId) => {
  const { error } = await supabase
    .from('floorplan_rooms')
    .delete()
    .eq('id', roomId);

  if (error) throw error;
  return true;
};

// Calculate floorplan pricing based on selected options
export const calculateFloorplanPrice = (options) => {
  let basePrice = 50; // Standard 2D floorplan

  if (options.is3D) {
    basePrice += 35; // Add 3D visualization
  }

  if (options.isHighRes) {
    basePrice += 15; // Add high-resolution output
  }

  if (options.isPriority) {
    basePrice += 25; // Add priority processing
  }

  if (options.customBranding) {
    basePrice += 10; // Add custom branding
  }

  return basePrice;
};

// Upload floorplan media to storage
export const uploadFloorplanMedia = async (userId, file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `floorplans/${fileName}`;

  const { error } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return {
    filePath,
    publicUrl: data.publicUrl
  };
};

// Create a floorplan order
export const createFloorplanOrder = async (orderData) => {
  // First create the floorplan
  const floorplan = await createFloorplan({
    user_id: orderData.userId,
    name: orderData.propertyName || 'New Floorplan',
    status: 'pending',
    file_url: orderData.fileUrl,
    file_path: orderData.filePath
  });

  // Then create the order
  const order = await createOrder({
    user_id: orderData.userId,
    type: 'floorplan',
    status: 'pending',
    amount: orderData.amount,
    metadata: {
      floorplanId: floorplan.id,
      options: orderData.options
    }
  });

  return {
    floorplan,
    order
  };
};

// Add offline sync API methods
const BASE_URL = 'YOUR_API_BASE_URL'; // Replace with your actual base URL
const getToken = () => {
  // Implement token retrieval logic here.  This is a placeholder.
  return 'YOUR_AUTH_TOKEN';
};

const api = {
  // Add other API endpoints as needed

  // Offline sync endpoints
  uploadPhoto: async (formData) => {
    const response = await fetch(`${BASE_URL}/api/photos/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error uploading photo: ${response.statusText}`);
    }

    return response.json();
  },

  uploadFloorplan: async (floorplanData) => {
    const response = await fetch(`${BASE_URL}/api/floorplans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(floorplanData),
    });

    if (!response.ok) {
      throw new Error(`Error uploading floorplan: ${response.statusText}`);
    }

    return response.json();
  },

  // Placeholder for other offline sync functions:  These are crucial and MUST be implemented.
  syncOrders: async () => { /* Implementation for syncing orders */ return [] },
  syncFloorplans: async () => { /* Implementation for syncing floorplans */ return [] },
  getQueuedItems: async () => { /* Implementation for retrieving queued items */ return [] },
  removeFromQueue: async (itemId) => { /* Implementation for removing item from queue */ return true },
  checkNetworkStatus: async () => { /*Implementation for checking network status*/ return true }


};

export { api };