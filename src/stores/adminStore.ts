import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { createOrderFolder, shareOrderFolderWithEditor } from '../lib/googleDrive';
import { toast } from 'react-hot-toast';

export interface Editor {
  id: string;
  email: string;
  name: string;
  active: boolean;
  current_assignments: number;
  total_completed: number;
}

export interface AdminOrder {
  id: string;
  tracking_number: string;
  user_id: string;
  user_email?: string;
  status: 'pending' | 'processing' | 'review' | 'revision' | 'completed' | 'failed';
  payment_status: 'pending' | 'processing' | 'succeeded' | 'failed';
  total_price: number;
  photo_count: number;
  services: {
    standardEditing: boolean;
    virtualStaging: boolean;
    twilightConversion: boolean;
    decluttering: boolean;
  };
  notes?: string;
  created_at: string;
  updated_at: string;
  editor_id?: string;
  editor_name?: string;
  estimated_completion_time?: string;
  drive_folders?: {
    main_folder_url: string;
    pending_folder_url: string;
    completed_folder_url: string;
  };
}

interface AdminState {
  orders: AdminOrder[];
  editors: Editor[];
  loading: boolean;
  error: string | null;
  
  fetchOrders: () => Promise<void>;
  fetchEditors: () => Promise<void>;
  assignOrderToEditor: (orderId: string, editorId: string) => Promise<boolean>;
  approveCompletedOrder: (orderId: string) => Promise<boolean>;
  requestRevision: (orderId: string, revisionNotes: string) => Promise<boolean>;
  autoAssignOrders: () => Promise<void>;
  createGoogleDriveFolders: (orderId: string) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  orders: [],
  editors: [],
  loading: false,
  error: null,
  
  fetchOrders: async () => {
    set({ loading: true, error: null });
    
    try {
      // Fetch orders with user and editor information
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (email),
          editors:editor_id (name),
          order_drive_folders (main_folder_url, pending_folder_url, completed_folder_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match the AdminOrder interface
      const adminOrders = data.map((order: any) => ({
        ...order,
        user_email: order.profiles?.email,
        editor_name: order.editors?.name,
        drive_folders: order.order_drive_folders?.[0] || null
      }));
      
      set({ orders: adminOrders });
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to fetch orders');
    } finally {
      set({ loading: false });
    }
  },
  
  fetchEditors: async () => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('editors')
        .select('*')
        .eq('active', true)
        .order('current_assignments', { ascending: true });
      
      if (error) throw error;
      
      set({ editors: data || [] });
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to fetch editors');
    } finally {
      set({ loading: false });
    }
  },
  
  assignOrderToEditor: async (orderId: string, editorId: string) => {
    set({ loading: true, error: null });
    
    try {
      // Update the order with the editor ID
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          editor_id: editorId,
          status: 'processing'
        })
        .eq('id', orderId);
      
      if (orderError) throw orderError;
      
      // Increment the editor's current assignments
      const { error: editorError } = await supabase
        .from('editors')
        .update({
          current_assignments: supabase.rpc('increment', { x: 1 })
        })
        .eq('id', editorId);
      
      if (editorError) throw editorError;
      
      // Get the editor's email
      const { data: editorData, error: editorFetchError } = await supabase
        .from('editors')
        .select('email')
        .eq('id', editorId)
        .single();
      
      if (editorFetchError) throw editorFetchError;
      
      // Get the order's Google Drive folder
      const { data: folderData, error: folderError } = await supabase
        .from('order_drive_folders')
        .select('main_folder_id')
        .eq('order_id', orderId)
        .single();
      
      if (folderError && folderError.code !== 'PGRST116') throw folderError;
      
      // If the folder exists, share it with the editor
      if (folderData?.main_folder_id) {
        await shareOrderFolderWithEditor(folderData.main_folder_id, editorData.email);
      }
      
      // Add an entry to the order history
      await supabase
        .from('order_history')
        .insert({
          order_id: orderId,
          status: 'processing',
          notes: `Order assigned to editor ${editorData.email}`
        });
      
      // Refresh the orders
      await get().fetchOrders();
      await get().fetchEditors();
      
      return true;
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to assign order to editor');
      return false;
    } finally {
      set({ loading: false });
    }
  },
  
  approveCompletedOrder: async (orderId: string) => {
    set({ loading: true, error: null });
    
    try {
      // Update the order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'completed'
        })
        .eq('id', orderId);
      
      if (orderError) throw orderError;
      
      // Get the editor ID from the order
      const { data: orderData, error: orderFetchError } = await supabase
        .from('orders')
        .select('editor_id')
        .eq('id', orderId)
        .single();
      
      if (orderFetchError) throw orderFetchError;
      
      // Decrement the editor's current assignments and increment total completed
      if (orderData?.editor_id) {
        const { error: editorError } = await supabase
          .from('editors')
          .update({
            current_assignments: supabase.rpc('decrement', { x: 1 }),
            total_completed: supabase.rpc('increment', { x: 1 })
          })
          .eq('id', orderData.editor_id);
        
        if (editorError) throw editorError;
      }
      
      // Add an entry to the order history
      await supabase
        .from('order_history')
        .insert({
          order_id: orderId,
          status: 'completed',
          notes: 'Order approved by admin'
        });
      
      // Refresh the orders
      await get().fetchOrders();
      await get().fetchEditors();
      
      return true;
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to approve order');
      return false;
    } finally {
      set({ loading: false });
    }
  },
  
  requestRevision: async (orderId: string, revisionNotes: string) => {
    set({ loading: true, error: null });
    
    try {
      // Update the order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'revision'
        })
        .eq('id', orderId);
      
      if (orderError) throw orderError;
      
      // Add an entry to the order history
      await supabase
        .from('order_history')
        .insert({
          order_id: orderId,
          status: 'revision',
          notes: `Revision requested: ${revisionNotes}`
        });
      
      // Refresh the orders
      await get().fetchOrders();
      
      return true;
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to request revision');
      return false;
    } finally {
      set({ loading: false });
    }
  },
  
  autoAssignOrders: async () => {
    set({ loading: true, error: null });
    
    try {
      // Fetch unassigned orders that are paid
      const { data: unassignedOrders, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .is('editor_id', null)
        .eq('payment_status', 'succeeded')
        .eq('status', 'processing');
      
      if (ordersError) throw ordersError;
      
      if (!unassignedOrders || unassignedOrders.length === 0) {
        set({ loading: false });
        return;
      }
      
      // Fetch active editors
      const { data: editors, error: editorsError } = await supabase
        .from('editors')
        .select('id, current_assignments')
        .eq('active', true)
        .order('current_assignments', { ascending: true });
      
      if (editorsError) throw editorsError;
      
      if (!editors || editors.length === 0) {
        set({ error: 'No active editors available' });
        toast.error('No active editors available for auto-assignment');
        set({ loading: false });
        return;
      }
      
      // Assign orders to editors using round-robin
      for (const order of unassignedOrders) {
        // Get the editor with the least current assignments
        const editor = editors[0];
        
        // Assign the order to the editor
        await get().assignOrderToEditor(order.id, editor.id);
        
        // Update the editor's assignment count for the next iteration
        editor.current_assignments += 1;
        
        // Re-sort editors by current assignments
        editors.sort((a, b) => a.current_assignments - b.current_assignments);
      }
      
      toast.success(`Auto-assigned ${unassignedOrders.length} orders to editors`);
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to auto-assign orders');
    } finally {
      set({ loading: false });
    }
  },
  
  createGoogleDriveFolders: async (orderId: string) => {
    set({ loading: true, error: null });
    
    try {
      // Get the user ID for the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('user_id')
        .eq('id', orderId)
        .single();
      
      if (orderError) throw orderError;
      
      // Create the Google Drive folders
      const folderInfo = await createOrderFolder(orderId, orderData.user_id);
      
      // Refresh the orders
      await get().fetchOrders();
      
      return true;
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to create Google Drive folders');
      return false;
    } finally {
      set({ loading: false });
    }
  }
}));