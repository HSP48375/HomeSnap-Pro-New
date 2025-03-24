
import { supabaseClient } from './supabaseClient';

// Types
export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  metadata?: any;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  photo_edits: number;
  photo_price: number;
  savings: string;
  twilight_conversions?: number | 'Unlimited';
  virtual_staging?: number;
  listing_descriptions?: number;
  floorplans?: number;
  turnaround: string;
  rollover?: number;
  team_members?: number | 'Unlimited';
  white_label?: boolean;
  vip_manager?: boolean;
  color: string;
  popular?: boolean;
}

export interface SubscriptionCredits {
  photoEdits: number;
  twilightConversions?: number | 'Unlimited';
  virtualStaging?: number;
  listingDescriptions?: number;
  floorplans?: number;
  teamMembers?: number | 'Unlimited';
  whiteLabel?: boolean;
  vipManager?: boolean;
}

// Get all available plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const { data, error } = await supabaseClient
    .from('subscription_plans')
    .select('*')
    .order('price');

  if (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }

  return data;
};

// Get specific plan details
export const getPlanDetails = async (planId: string): Promise<SubscriptionPlan> => {
  const { data, error } = await supabaseClient
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (error) {
    console.error('Error fetching plan details:', error);
    throw error;
  }

  return data;
};

// Subscribe to a plan
export const subscribeToplan = async (planId: string): Promise<Subscription> => {
  // In a real app, this would integrate with Stripe or another payment processor
  // For now, we'll simulate the subscription process
  
  const { data: plan, error: planError } = await supabaseClient
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single();
    
  if (planError) {
    console.error('Error fetching plan for subscription:', planError);
    throw planError;
  }
  
  // Get the user ID
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  
  if (userError || !user) {
    console.error('Error getting current user:', userError);
    throw userError || new Error('User not authenticated');
  }
  
  // Create subscription record
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  
  const subscriptionData = {
    user_id: user.id,
    plan_id: planId,
    status: 'active',
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
    cancel_at_period_end: false,
    created_at: now.toISOString(),
  };
  
  const { data: subscription, error: subError } = await supabaseClient
    .from('subscriptions')
    .upsert(subscriptionData)
    .select()
    .single();
    
  if (subError) {
    console.error('Error creating subscription:', subError);
    throw subError;
  }
  
  // Initialize subscription credits
  await initializeSubscriptionCredits(user.id, plan);
  
  return subscription;
};

// Initialize credits for a new subscription
const initializeSubscriptionCredits = async (userId: string, plan: SubscriptionPlan) => {
  const creditsData = {
    user_id: userId,
    photo_edits: plan.photo_edits,
    twilight_conversions: plan.twilight_conversions || null,
    virtual_staging: plan.virtual_staging || null,
    listing_descriptions: plan.listing_descriptions || null,
    floorplans: plan.floorplans || null,
    updated_at: new Date().toISOString(),
  };
  
  const { error } = await supabaseClient
    .from('subscription_credits')
    .upsert(creditsData);
    
  if (error) {
    console.error('Error initializing subscription credits:', error);
    throw error;
  }
};

// Get current active subscription
export const getCurrentSubscription = async (): Promise<any> => {
  // Get the user ID
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  
  if (userError || !user) {
    console.error('Error getting current user:', userError);
    throw userError || new Error('User not authenticated');
  }
  
  // Get active subscription
  const { data: subscription, error: subError } = await supabaseClient
    .from('subscriptions')
    .select(`
      *,
      subscription_plans:plan_id (*)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();
    
  if (subError && subError.code !== 'PGRST116') { // PGRST116 is "row not found" - not an error in this case
    console.error('Error fetching subscription:', subError);
    throw subError;
  }
  
  if (!subscription) {
    return null;
  }
  
  // Format the subscription data for the UI
  const plan = subscription.subscription_plans;
  const nextBillingDate = new Date(subscription.current_period_end);
  
  // Sample payment history - in a real app, you'd fetch this from your payment processor
  const paymentHistory = [
    {
      date: new Date(subscription.current_period_start).toLocaleDateString(),
      description: `${plan.name} subscription`,
      amount: plan.price
    }
  ];
  
  return {
    id: subscription.id,
    name: plan.name,
    price: plan.price,
    nextBillingDate: nextBillingDate.toLocaleDateString(),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    teamMembers: plan.team_members,
    paymentHistory
  };
};

// Get remaining credits
export const getRemainingCredits = async (): Promise<SubscriptionCredits> => {
  // Get the user ID
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  
  if (userError || !user) {
    console.error('Error getting current user:', userError);
    throw userError || new Error('User not authenticated');
  }
  
  // Get current credits
  const { data: credits, error: creditsError } = await supabaseClient
    .from('subscription_credits')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (creditsError && creditsError.code !== 'PGRST116') {
    console.error('Error fetching credits:', creditsError);
    throw creditsError;
  }
  
  if (!credits) {
    return {
      photoEdits: 0
    };
  }
  
  // Get active subscription to check for unlimited features
  const { data: subscription, error: subError } = await supabaseClient
    .from('subscriptions')
    .select(`
      *,
      subscription_plans:plan_id (*)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();
    
  if (subError && subError.code !== 'PGRST116') {
    console.error('Error fetching subscription for credits:', subError);
    throw subError;
  }
  
  // Format credits for the UI
  return {
    photoEdits: credits.photo_edits || 0,
    twilightConversions: subscription?.subscription_plans.twilight_conversions === 'Unlimited' 
      ? 'Unlimited' 
      : credits.twilight_conversions || 0,
    virtualStaging: credits.virtual_staging || 0,
    listingDescriptions: credits.listing_descriptions || 0,
    floorplans: credits.floorplans || 0,
  };
};

// Cancel subscription
export const cancelSubscription = async (): Promise<void> => {
  // Get the user ID
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  
  if (userError || !user) {
    console.error('Error getting current user:', userError);
    throw userError || new Error('User not authenticated');
  }
  
  // Get active subscription
  const { data: subscription, error: subError } = await supabaseClient
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();
    
  if (subError) {
    console.error('Error fetching subscription for cancellation:', subError);
    throw subError;
  }
  
  if (!subscription) {
    throw new Error('No active subscription found');
  }
  
  // Update subscription to cancel at period end
  const { error: updateError } = await supabaseClient
    .from('subscriptions')
    .update({
      cancel_at_period_end: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscription.id);
    
  if (updateError) {
    console.error('Error cancelling subscription:', updateError);
    throw updateError;
  }
};

// Use credits for a service
export const useCredits = async (
  serviceType: 'photo_edits' | 'twilight_conversions' | 'virtual_staging' | 'listing_descriptions' | 'floorplans',
  amount: number = 1
): Promise<boolean> => {
  // Get the user ID
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  
  if (userError || !user) {
    console.error('Error getting current user:', userError);
    throw userError || new Error('User not authenticated');
  }
  
  // Get current credits
  const { data: credits, error: creditsError } = await supabaseClient
    .from('subscription_credits')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (creditsError) {
    console.error('Error fetching credits for usage:', creditsError);
    throw creditsError;
  }
  
  if (!credits) {
    return false; // No subscription credits available
  }
  
  // Check if unlimited for this service type (specific to twilight conversions in enterprise plan)
  if (serviceType === 'twilight_conversions') {
    // Get active subscription to check for unlimited features
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select(`
        *,
        subscription_plans:plan_id (twilight_conversions)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
      
    if (!subError && subscription?.subscription_plans?.twilight_conversions === 'Unlimited') {
      return true; // Unlimited credits, no need to deduct
    }
  }
  
  // Check if enough credits are available
  if (!credits[serviceType] || credits[serviceType] < amount) {
    return false; // Not enough credits
  }
  
  // Deduct credits
  const updatedCredits = {
    ...credits,
    [serviceType]: credits[serviceType] - amount,
    updated_at: new Date().toISOString()
  };
  
  const { error: updateError } = await supabaseClient
    .from('subscription_credits')
    .update(updatedCredits)
    .eq('user_id', user.id);
    
  if (updateError) {
    console.error('Error updating credits after usage:', updateError);
    throw updateError;
  }
  
  return true;
};

// Check if user has active subscription
export const hasActiveSubscription = async (): Promise<boolean> => {
  // Get the user ID
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  
  if (userError || !user) {
    return false; // Not authenticated
  }
  
  // Check for active subscription
  const { data, error: subError } = await supabaseClient
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();
    
  if (subError && subError.code !== 'PGRST116') {
    console.error('Error checking subscription status:', subError);
    return false;
  }
  
  return !!data;
};

// Get team members for team plans
export const getTeamMembers = async (): Promise<any[]> => {
  // Get the user ID
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  
  if (userError || !user) {
    throw userError || new Error('User not authenticated');
  }
  
  // Check for active subscription with team members
  const { data: subscription, error: subError } = await supabaseClient
    .from('subscriptions')
    .select(`
      *,
      subscription_plans:plan_id (team_members)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();
    
  if (subError && subError.code !== 'PGRST116') {
    console.error('Error fetching subscription for team members:', subError);
    throw subError;
  }
  
  if (!subscription || !subscription.subscription_plans.team_members) {
    return []; // No team plan
  }
  
  // Get team members
  const { data: teamMembers, error: teamError } = await supabaseClient
    .from('team_members')
    .select(`
      *,
      profiles:member_id (full_name, avatar_url)
    `)
    .eq('team_id', subscription.id);
    
  if (teamError) {
    console.error('Error fetching team members:', teamError);
    throw teamError;
  }
  
  return teamMembers.map(member => ({
    id: member.member_id,
    email: member.email,
    name: member.profiles?.full_name || 'Invited User',
    avatar: member.profiles?.avatar_url || null,
    status: member.profiles ? 'active' : 'pending',
    role: member.role,
  }));
};
