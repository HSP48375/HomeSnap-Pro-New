import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export interface FloorplanPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  is3D: boolean;
  isHighRes: boolean;
  isPriority: boolean;
  turnaroundTime: string;
}

interface FloorplanBranding {
  logo?: File;
  logoUrl?: string;
  companyName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  customDisclaimer?: string;
}

interface FloorplanOrder {
  id?: string;
  userId?: string;
  videoBlob?: Blob;
  videoUrl?: string;
  packageId: string;
  measurementUnit: 'metric' | 'imperial';
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  branding?: FloorplanBranding;
  totalPrice: number;
  createdAt?: string;
  estimatedCompletionTime?: string;
}

interface FloorplanState {
  packages: FloorplanPackage[];
  currentOrder: FloorplanOrder | null;
  videoRecording: Blob | null;
  videoPreviewUrl: string | null;
  scanProgress: number;
  isRecording: boolean;
  isProcessing: boolean;
  aiGuidance: string;
  error: string | null;
  
  // Actions
  setVideoRecording: (blob: Blob | null) => void;
  setIsRecording: (isRecording: boolean) => void;
  setScanProgress: (progress: number) => void;
  setAIGuidance: (guidance: string) => void;
  selectPackage: (packageId: string) => void;
  setMeasurementUnit: (unit: 'metric' | 'imperial') => void;
  setBranding: (branding: FloorplanBranding) => void;
  calculatePrice: () => number;
  submitOrder: () => Promise<{ success: boolean; orderId?: string; error?: string }>;
  clearOrder: () => void;
  
  // Admin actions
  fetchFloorplanOrders: () => Promise<void>;
  approveFloorplan: (orderId: string) => Promise<boolean>;
  requestFloorplanRevision: (orderId: string, notes: string) => Promise<boolean>;
}

export const useFloorplanStore = create<FloorplanState>((set, get) => ({
  packages: [
    {
      id: 'standard',
      name: 'Standard Floorplan',
      description: 'Basic 2D Floor Plan with room dimensions and total square footage calculation.',
      price: 50,
      features: [
        'Basic 2D Floor Plan',
        'Room Dimensions',
        'Total Square Footage Calculation',
        'HomeSnap Pro Watermark',
        'JPG Format (Digital Use)',
        '12-16 Hour Turnaround'
      ],
      is3D: false,
      isHighRes: false,
      isPriority: false,
      turnaroundTime: '12-16 hours'
    },
    {
      id: 'pro',
      name: 'Pro Floorplan',
      description: 'Enhanced 2D & 3D Floor Plans with custom branding and high-resolution output.',
      price: 85,
      features: [
        'Enhanced 2D Floor Plan with Furniture',
        '3D Floor Plan (Fully Furnished)',
        'Custom Branding',
        'High-Resolution PNG Format',
        'Best for Print Marketing',
        '12-16 Hour Turnaround'
      ],
      is3D: true,
      isHighRes: true,
      isPriority: false,
      turnaroundTime: '12-16 hours'
    },
    {
      id: 'priority',
      name: 'Priority Processing',
      description: 'Add-on for faster delivery of your floorplan.',
      price: 25,
      features: [
        'Faster Delivery: 6-8 Hours',
        'For urgent needs',
        'Available with any package'
      ],
      is3D: false,
      isHighRes: false,
      isPriority: true,
      turnaroundTime: '6-8 hours'
    }
  ],
  currentOrder: null,
  videoRecording: null,
  videoPreviewUrl: null,
  scanProgress: 0,
  isRecording: false,
  isProcessing: false,
  aiGuidance: 'Ready to start scanning. Press the record button to begin.',
  error: null,
  
  setVideoRecording: (blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      set({ 
        videoRecording: blob, 
        videoPreviewUrl: url,
        scanProgress: 100,
        aiGuidance: 'Scan complete! You can now review your video or proceed to select a package.'
      });
    } else {
      set({ 
        videoRecording: null, 
        videoPreviewUrl: null,
        scanProgress: 0,
        aiGuidance: 'Ready to start scanning. Press the record button to begin.'
      });
    }
  },
  
  setIsRecording: (isRecording) => {
    set({ isRecording });
    
    if (isRecording) {
      set({ 
        aiGuidance: 'Start walking slowly through the property. Keep your phone at chest height.',
        scanProgress: 5
      });
      
      // Simulate AI guidance during recording
      const guidanceMessages = [
        { message: 'Good start! Keep the camera steady as you move.', progress: 15 },
        { message: 'Slow down a bit for better accuracy.', progress: 25 },
        { message: 'Make sure to capture the full room before moving to the next area.', progress: 35 },
        { message: 'Try to maintain a consistent distance from walls.', progress: 45 },
        { message: 'You\'re doing great! Continue through doorways slowly.', progress: 55 },
        { message: 'Remember to scan corners completely.', progress: 65 },
        { message: 'Keep your phone level for best results.', progress: 75 },
        { message: 'Almost there! Make sure you\'ve captured all rooms.', progress: 85 },
        { message: 'Excellent! Finishing up the scan.', progress: 95 }
      ];
      
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < guidanceMessages.length && get().isRecording) {
          const { message, progress } = guidanceMessages[currentIndex];
          set({ aiGuidance: message, scanProgress: progress });
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 5000); // Update guidance every 5 seconds
    }
  },
  
  setScanProgress: (progress) => {
    set({ scanProgress: progress });
  },
  
  setAIGuidance: (guidance) => {
    set({ aiGuidance: guidance });
  },
  
  selectPackage: (packageId) => {
    const selectedPackage = get().packages.find(pkg => pkg.id === packageId);
    
    if (!selectedPackage) {
      set({ error: 'Invalid package selected' });
      return;
    }
    
    // If it's the priority add-on, add it to the current order
    if (packageId === 'priority') {
      const currentOrder = get().currentOrder;
      if (!currentOrder) {
        set({ 
          currentOrder: {
            packageId: 'standard', // Default to standard if no package selected
            measurementUnit: 'imperial', // Default to imperial
            totalPrice: get().packages.find(pkg => pkg.id === 'standard')!.price + selectedPackage.price,
            branding: {}
          }
        });
      } else {
        set({
          currentOrder: {
            ...currentOrder,
            totalPrice: get().calculatePrice() + selectedPackage.price
          }
        });
      }
      return;
    }
    
    // Otherwise, set the base package
    set({
      currentOrder: {
        packageId,
        measurementUnit: 'imperial', // Default to imperial
        totalPrice: selectedPackage.price,
        branding: {}
      }
    });
  },
  
  setMeasurementUnit: (unit) => {
    const currentOrder = get().currentOrder;
    if (!currentOrder) return;
    
    set({
      currentOrder: {
        ...currentOrder,
        measurementUnit: unit
      }
    });
  },
  
  setBranding: (branding) => {
    const currentOrder = get().currentOrder;
    if (!currentOrder) return;
    
    // If there's a logo file, create a URL for preview
    let logoUrl = branding.logoUrl;
    if (branding.logo && !logoUrl) {
      logoUrl = URL.createObjectURL(branding.logo);
    }
    
    set({
      currentOrder: {
        ...currentOrder,
        branding: {
          ...branding,
          logoUrl
        }
      }
    });
  },
  
  calculatePrice: () => {
    const { currentOrder, packages } = get();
    if (!currentOrder) return 0;
    
    const basePackage = packages.find(pkg => pkg.id === currentOrder.packageId);
    if (!basePackage) return 0;
    
    let totalPrice = basePackage.price;
    
    // Check if priority processing is added
    const hasPriority = currentOrder.packageId.includes('priority');
    if (hasPriority) {
      const priorityPackage = packages.find(pkg => pkg.id === 'priority');
      if (priorityPackage) {
        totalPrice += priorityPackage.price;
      }
    }
    
    return totalPrice;
  },
  
  submitOrder: async () => {
    const { currentOrder, videoRecording } = get();
    
    if (!currentOrder) {
      return { success: false, error: 'No order to submit' };
    }
    
    if (!videoRecording) {
      return { success: false, error: 'No video recording to submit' };
    }
    
    set({ isProcessing: true });
    
    try {
      // 1. Create the order record
      const { data: order, error: orderError } = await supabase
        .from('floorplan_orders')
        .insert({
          package_id: currentOrder.packageId,
          measurement_unit: currentOrder.measurementUnit,
          status: 'pending',
          total_price: get().calculatePrice(),
          has_priority: currentOrder.packageId.includes('priority') || false,
          branding: currentOrder.branding ? {
            company_name: currentOrder.branding.companyName || '',
            primary_color: currentOrder.branding.primaryColor || '',
            secondary_color: currentOrder.branding.secondaryColor || '',
            custom_disclaimer: currentOrder.branding.customDisclaimer || ''
          } : null
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // 2. Upload the video recording
      const videoFileName = `floorplan_${order.id}_${Date.now()}.webm`;
      const videoPath = `floorplan-videos/${videoFileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('property-videos')
        .upload(videoPath, videoRecording, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'video/webm'
        });
      
      if (uploadError) throw uploadError;
      
      // 3. Update the order with the video path
      const { error: updateError } = await supabase
        .from('floorplan_orders')
        .update({
          video_path: videoPath
        })
        .eq('id', order.id);
      
      if (updateError) throw updateError;
      
      // 4. Upload logo if provided
      if (currentOrder.branding?.logo) {
        const logoExt = currentOrder.branding.logo.name.split('.').pop();
        const logoFileName = `logo_${order.id}_${Date.now()}.${logoExt}`;
        const logoPath = `floorplan-logos/${logoFileName}`;
        
        const { error: logoUploadError } = await supabase.storage
          .from('property-assets')
          .upload(logoPath, currentOrder.branding.logo, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (logoUploadError) throw logoUploadError;
        
        // Update the order with the logo path
        await supabase
          .from('floorplan_orders')
          .update({
            logo_path: logoPath
          })
          .eq('id', order.id);
      }
      
      // Clear the current order after successful submission
      get().clearOrder();
      
      return { success: true, orderId: order.id };
    } catch (error: any) {
      console.error('Error submitting floorplan order:', error);
      return { success: false, error: error.message };
    } finally {
      set({ isProcessing: false });
    }
  },
  
  clearOrder: () => {
    const { videoPreviewUrl } = get();
    
    // Revoke object URLs to prevent memory leaks
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    
    set({
      currentOrder: null,
      videoRecording: null,
      videoPreviewUrl: null,
      scanProgress: 0,
      isRecording: false,
      aiGuidance: 'Ready to start scanning. Press the record button to begin.',
      error: null
    });
  },
  
  // Admin actions
  fetchFloorplanOrders: async () => {
    set({ isProcessing: true });
    
    try {
      const { data, error } = await supabase
        .from('floorplan_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Would update a list of orders in the store in a real implementation
      
    } catch (error: any) {
      console.error('Error fetching floorplan orders:', error);
      set({ error: error.message });
    } finally {
      set({ isProcessing: false });
    }
  },
  
  approveFloorplan: async (orderId) => {
    set({ isProcessing: true });
    
    try {
      const { error } = await supabase
        .from('floorplan_orders')
        .update({
          status: 'completed'
        })
        .eq('id', orderId);
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error('Error approving floorplan:', error);
      set({ error: error.message });
      return false;
    } finally {
      set({ isProcessing: false });
    }
  },
  
  requestFloorplanRevision: async (orderId, notes) => {
    set({ isProcessing: true });
    
    try {
      const { error } = await supabase
        .from('floorplan_orders')
        .update({
          status: 'revision',
          revision_notes: notes
        })
        .eq('id', orderId);
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error('Error requesting floorplan revision:', error);
      set({ error: error.message });
      return false;
    } finally {
      set({ isProcessing: false });
    }
  }
}));