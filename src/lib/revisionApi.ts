
import { supabase } from './supabase';

/**
 * Create a new revision request
 */
export async function createRevisionRequest(revisionData) {
  try {
    const { data, error } = await supabase
      .from('revision_requests')
      .insert(revisionData)
      .select()
      .single();
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating revision request:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all revision requests for the current user
 */
export async function getRevisionRequests() {
  try {
    const { data, error } = await supabase
      .from('revision_requests')
      .select(`
        *,
        original_order:original_order_id(
          id,
          tracking_number,
          created_at
        )
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching revision requests:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get a single revision request by ID
 */
export async function getRevisionRequestById(id) {
  try {
    const { data, error } = await supabase
      .from('revision_requests')
      .select(`
        *,
        original_order:original_order_id(
          id,
          tracking_number,
          created_at,
          photo_count,
          services
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching revision request:', error);
    return { success: false, error: error.message };
  }
}
