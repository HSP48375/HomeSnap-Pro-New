
import { supabase } from './supabaseClient';

export type OnboardingProgress = {
  userId: string;
  completedTour: boolean;
  completedSteps: string[];
  lastStepSeen: string;
};

export const getUserOnboardingProgress = async (userId: string): Promise<OnboardingProgress | null> => {
  try {
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      userId: data.user_id,
      completedTour: data.completed_tour,
      completedSteps: data.completed_steps || [],
      lastStepSeen: data.last_step_seen
    };
  } catch (error) {
    console.error('Error getting onboarding progress:', error);
    return null;
  }
};

export const updateUserOnboardingProgress = async (progress: Partial<OnboardingProgress>): Promise<void> => {
  try {
    const { userId, ...updateData } = progress;
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const { error } = await supabase
      .from('user_onboarding')
      .upsert({
        user_id: userId,
        completed_tour: updateData.completedTour,
        completed_steps: updateData.completedSteps,
        last_step_seen: updateData.lastStepSeen,
        updated_at: new Date()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating onboarding progress:', error);
    throw error;
  }
};

export const resetUserOnboardingProgress = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_onboarding')
      .update({
        completed_tour: false,
        completed_steps: [],
        last_step_seen: null,
        updated_at: new Date()
      })
      .eq('user_id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error resetting onboarding progress:', error);
    throw error;
  }
};
