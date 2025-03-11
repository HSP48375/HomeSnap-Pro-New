import { create } from 'zustand';
import { uploadPhoto, supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export interface UploadFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  path?: string;
  error?: string;
}

interface UploadState {
  files: UploadFile[];
  uploading: boolean;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  uploadFiles: () => Promise<{ success: boolean; error?: string }>;
  updateFileProgress: (id: string, progress: number) => void;
  updateFileStatus: (id: string, status: UploadFile['status'], error?: string) => void;
  updateFilePath: (id: string, path: string) => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  files: [],
  uploading: false,
  
  addFiles: (newFiles) => {
    const { files } = get();
    
    // Create UploadFile objects from File objects
    const uploadFiles = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending' as const,
    }));
    
    set({ files: [...files, ...uploadFiles] });
  },
  
  removeFile: (id) => {
    const { files } = get();
    const fileToRemove = files.find(file => file.id === id);
    
    if (fileToRemove) {
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    set({ files: files.filter(file => file.id !== id) });
  },
  
  clearFiles: () => {
    const { files } = get();
    
    // Revoke all object URLs
    files.forEach(file => {
      URL.revokeObjectURL(file.preview);
    });
    
    set({ files: [] });
  },
  
  updateFileProgress: (id, progress) => {
    const { files } = get();
    
    set({
      files: files.map(file => 
        file.id === id ? { ...file, progress } : file
      ),
    });
  },
  
  updateFileStatus: (id, status, error) => {
    const { files } = get();
    
    set({
      files: files.map(file => 
        file.id === id ? { ...file, status, error } : file
      ),
    });
  },
  
  updateFilePath: (id, path) => {
    const { files } = get();
    
    set({
      files: files.map(file => 
        file.id === id ? { ...file, path } : file
      ),
    });
  },
  
  uploadFiles: async () => {
    const { files } = get();
    const user = useAuthStore.getState().user;
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    if (files.length === 0) {
      return { success: false, error: 'No files to upload' };
    }
    
    set({ uploading: true });
    
    try {
      // Create a new order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'processing',
          photo_count: files.length,
          total_price: 0, // Will be updated after checkout
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Upload each file
      for (const file of files) {
        try {
          get().updateFileStatus(file.id, 'uploading');
          
          // Simulate progress updates
          const progressInterval = setInterval(() => {
            const currentProgress = get().files.find(f => f.id === file.id)?.progress || 0;
            if (currentProgress < 90) {
              get().updateFileProgress(file.id, currentProgress + 10);
            } else {
              clearInterval(progressInterval);
            }
          }, 300);
          
          // Upload the file
          const { path, error } = await uploadPhoto(file.file, user.id);
          
          clearInterval(progressInterval);
          
          if (error) {
            get().updateFileStatus(file.id, 'error', error.message);
            continue;
          }
          
          // Store the file path
          get().updateFilePath(file.id, path);
          get().updateFileProgress(file.id, 100);
          get().updateFileStatus(file.id, 'success');
          
          // Create a photo record in the database
          await supabase.from('photos').insert({
            order_id: order.id,
            storage_path: path,
            original_filename: file.name,
            status: 'processing',
          });
          
        } catch (error: any) {
          get().updateFileStatus(file.id, 'error', error.message);
        }
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      set({ uploading: false });
    }
  },
}));