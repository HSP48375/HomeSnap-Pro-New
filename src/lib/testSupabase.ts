console.log("🚀 testSupabaseIntegration function loaded!");

import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

export const testSupabaseIntegration = async () => {
  const results = {
    auth: false,
    database: false,
    storage: false,
    notifications: false,
    stripe: false,
  };

  try {
    // 1. Test Authentication
    console.log('Testing authentication...');
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    const testName = 'Test User';

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testName,
        },
      },
    });

    if (signUpError) throw signUpError;
    if (signUpData.user) {
      results.auth = true;
      console.log('✓ Authentication working');
    }

    // 2. Test Database
    console.log('Testing database...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signUpData.user!.id)
      .single();

    if (profileError) throw profileError;
    if (profile) {
      results.database = true;
      console.log('✓ Database working');
    }

    // 3. Test Storage
    console.log('Testing storage...');
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    const { error: uploadError } = await supabase.storage
      .from('property-photos')
      .upload(`test/${Date.now()}.txt`, testFile);

    if (!uploadError) {
      results.storage = true;
      console.log('✓ Storage working');
    }

    // 4. Test Notifications
    console.log('Testing notifications...');
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: signUpData.user!.id,
        type: 'test',
        title: 'Test Notification',
        message: 'Testing notification system',
        status: 'unread',
      });

    if (!notificationError) {
      results.notifications = true;
      console.log('✓ Notifications working');
    }

    // 5. Test Stripe Integration
    console.log('Testing Stripe integration...');
    if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      results.stripe = true;
      console.log('✓ Stripe configured');
    }

    // Clean up test data
    await supabase.auth.signOut();

    // Return results
    const allPassed = Object.values(results).every(result => result === true);
    if (allPassed) {
      toast.success('All integration tests passed!');
    } else {
      const failed = Object.entries(results)
        .filter(([, passed]) => !passed)
        .map(([name]) => name)
        .join(', ');
      toast.error(`Some tests failed: ${failed}`);
    }

    return results;

  } catch (error) {
    console.error('Integration test error:', error);
    toast.error('Integration test failed');
    return results;
  }
};