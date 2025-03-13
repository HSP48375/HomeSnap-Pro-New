import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  path?: string;
}

interface OrderServices {
  standardEditing: boolean;
  virtualStaging: boolean;
  twilightConversion: boolean;
  decluttering: boolean;
}

interface OrderItem {
  id: string;
  photos: PhotoFile[];
  services: OrderServices;
  notes: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_status?: 'pending' | 'processing' | 'succeeded' | 'failed';
  payment_id?: string;
  payment_method?: string;
  payment_amount?: number;
  total_price: number;
  photo_count: number;
  services: OrderServices;
  notes?: string;
  created_at: string;
  updated_at: string;
  tracking_number?: string;
  estimated_completion_time?: string;
  photos?: {
    id: string;
    storage_path: string;
    original_filename: string;
    edited_storage_path?: string;
    status: string;
  }[];
}

interface OrderState {
  currentOrder: OrderItem | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
  
  // Current order actions
  setCurrentOrder: (order: OrderItem | null) => void;
  addPhotosToOrder: (photos: File[]) => void;
  removePhotoFromOrder: (photoId: string) => void;
  updateOrderServices: (services: Partial<OrderServices>) => void;
  updateOrderNotes: (notes: string) => void;
  calculatePrice: () => number;
  clearOrder: () => void;
  submitOrder: (paymentId?: string) => Promise<{ success: boolean; error?: string; orderId?: string }>;
  
  // Order history actions
  fetchOrders: () => Promise<void>;
  fetchOrderDetails: (orderId: string) => Promise<Order | null>;
  updateOrderPayment: (orderId: string, paymentId: string, amount: number) => Promise<boolean>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  currentOrder: null,
  orders: [],
  loading: false,
  error: null,
  
  setCurrentOrder: (order) => set({ currentOrder: order }),
  
  addPhotosToOrder: (photos) => {
    const { currentOrder } = get();
    
    const newPhotos = photos.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    
    if (!currentOrder) {
      set({
        currentOrder: {
          id: crypto.randomUUID(),
          photos: newPhotos,
          services: {
            standardEditing: true,
            virtualStaging: false,
            twilightConversion: false,
            decluttering: false,
          },
          notes: '',
        },
      });
    } else {
      set({
        currentOrder: {
          ...currentOrder,
          photos: [...currentOrder.photos, ...newPhotos],
        },
      });
    }
  },
  
  removePhotoFromOrder: (photoId) => {
    const { currentOrder } = get();
    if (!currentOrder) return;
    
    const photoToRemove = currentOrder.photos.find(photo => photo.id === photoId);
    if (photoToRemove?.preview) {
      URL.revokeObjectURL(photoToRemove.preview);
    }
    
    const updatedPhotos = currentOrder.photos.filter((photo) => photo.id !== photoId);
    
    // If no photos left, clear the order
    if (updatedPhotos.length === 0) {
      get().clearOrder();
      return;
    }
    
    set({
      currentOrder: {
        ...currentOrder,
        photos: updatedPhotos,
      },
    });
  },
  
  updateOrderServices: (services) => {
    const { currentOrder } = get();
    if (!currentOrder) return;
    
    set({
      currentOrder: {
        ...currentOrder,
        services: {
          ...currentOrder.services,
          ...services,
        },
      },
    });
  },
  
  updateOrderNotes: (notes) => {
    const { currentOrder } = get();
    if (!currentOrder) return;
    
    set({
      currentOrder: {
        ...currentOrder,
        notes,
      },
    });
  },
  
  calculatePrice: () => {
    const { currentOrder } = get();
    if (!currentOrder) return 0;
    
    // Base price per photo
    const basePrice = 1.50;
    
    // Additional services prices
    const virtualStagingPrice = 10.00;
    const twilightConversionPrice = 3.99;
    const declutteringPrice = 2.99;
    
    // Calculate total based on number of photos and selected services
    let total = currentOrder.photos.length * basePrice;
    
    // Add service costs if selected
    if (currentOrder.services.virtualStaging) {
      total += currentOrder.photos.length * virtualStagingPrice;
    }
    
    if (currentOrder.services.twilightConversion) {
      total += currentOrder.photos.length * twilightConversionPrice;
    }
    
    if (currentOrder.services.decluttering) {
      total += currentOrder.photos.length * declutteringPrice;
    }
    
    // Apply volume discount
    if (currentOrder.photos.length >= 20) {
      total *= 0.85; // 15% discount
    } else if (currentOrder.photos.length >= 10) {
      total *= 0.9; // 10% discount
    }
    
    return parseFloat(total.toFixed(2));
  },
  
  clearOrder: () => {
    const { currentOrder } = get();
    
    // Revoke object URLs to prevent memory leaks
    if (currentOrder) {
      currentOrder.photos.forEach((photo) => {
        if (photo.preview) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    }
    
    set({ currentOrder: null });
  },
  
  submitOrder: async (paymentId) => {
    const { currentOrder, calculatePrice } = get();
    if (!currentOrder) {
      return { success: false, error: 'No order to submit' };
    }
    
    set({ loading: true, error: null });
    
    try {
      // Calculate the final price
      const totalPrice = calculatePrice();
      
      // Create the order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_price: totalPrice,
          status: paymentId ? 'processing' : 'pending',
          payment_status: paymentId ? 'succeeded' : 'pending',
          payment_id: paymentId || null,
          payment_amount: paymentId ? totalPrice : null,
          services: currentOrder.services,
          notes: currentOrder.notes,
          photo_count: currentOrder.photos.length,
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Upload photos and create photo records
      for (const photo of currentOrder.photos) {
        // Upload the photo to storage
        const fileExt = photo.name.split('.').pop();
        const fileName = `${order.id}/${Date.now()}.${fileExt}`;
        const filePath = `photos/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('property-photos')
          .upload(filePath, photo.file, {
            cacheControl: '3600',
            upsert: false,
          });
        
        if (uploadError) {
          console.error('Error uploading photo:', uploadError);
          continue;
        }
        
        // Create a photo record
        await supabase.from('photos').insert({
          order_id: order.id,
          storage_path: filePath,
          original_filename: photo.name,
          status: 'processing',
        });
      }
      
      // Record payment in payment history if payment was made
      if (paymentId) {
        await supabase.from('payment_history').insert({
          order_id: order.id,
          payment_id: paymentId,
          payment_status: 'succeeded',
          payment_amount: totalPrice,
          notes: 'Payment completed during checkout',
        });
      }
      
      // Clear the current order after successful submission
      get().clearOrder();
      
      // Refresh the orders list
      await get().fetchOrders();
      
      return { success: true, orderId: order.id };
    } catch (error: any) {
      set({ error: error.message });
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },
  
  fetchOrders: async () => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ orders: data || [] });
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to fetch orders');
    } finally {
      set({ loading: false });
    }
  },
  
  fetchOrderDetails: async (orderId) => {
    set({ loading: true, error: null });
    
    try {
      // Fetch the order with its photos
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          photos (*)
        `)
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to fetch order details');
      return null;
    } finally {
      set({ loading: false });
    }
  },
  
  updateOrderPayment: async (orderId, paymentId, amount) => {
    set({ loading: true, error: null });
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'succeeded',
          payment_id: paymentId,
          payment_amount: amount,
          status: 'processing', // Update order status to processing once payment is successful
        })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Refresh orders after update
      await get().fetchOrders();
      
      return true;
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to update payment status');
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));