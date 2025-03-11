import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for authentication
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  
  if (!error && data.user) {
    // Create a profile record for the new user
    await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      avatar_url: null,
    });
  }
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Storage functions
export const uploadPhoto = async (file: File, userId: string): Promise<{ path: string; error: any }> => {
  // Create a unique file path using userId and timestamp
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const filePath = `photos/${fileName}`;
  
  // Upload the file to Supabase Storage
  const { error } = await supabase.storage
    .from('property-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    return { path: '', error };
  }
  
  return { path: filePath, error: null };
};

// Test function to verify connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error };
  }
};

// Get public URL for a file
export const getPhotoUrl = (path: string): string => {
  const { data } = supabase.storage
    .from('property-photos')
    .getPublicUrl(path);
  
  return data.publicUrl;
};

// Delete a file from storage
export const deletePhoto = async (path: string): Promise<{ error: any }> => {
  const { error } = await supabase.storage
    .from('property-photos')
    .remove([path]);
  
  return { error };
};