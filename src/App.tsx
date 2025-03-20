import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './stores/authStore';
import { useEffect, useState } from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';
import TutorialsPage from './pages/TutorialsPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import FloorplanPage from './pages/FloorplanPage';
import FloorplanOrdersPage from './pages/FloorplanOrdersPage';
import TestNotificationPage from './pages/TestNotificationPage';

// Components
import LoadingScreen from './components/ui/LoadingScreen';
import AuthGuard from './components/ui/AuthGuard';

function App() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  // Debug component
  const DebugMarker = () => (
    <View style={{ 
      position: 'absolute', 
      top: 50, 
      right: 20, 
      backgroundColor: 'red', 
      padding: 10,
      zIndex: 9999 
    }}>
      <Text style={{color: 'white'}}>Debug Marker</Text>
    </View>
  );

  useEffect(() => {
    // Check for active session on load
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
      }
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="tutorials" element={<TutorialsPage />} />
      </Route>

      {/* Auth routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route 
          path="login" 
          element={
            <AuthGuard requireAuth={false}>
              <LoginPage />
            </AuthGuard>
          } 
        />
        <Route 
          path="register" 
          element={
            <AuthGuard requireAuth={false}>
              <RegisterPage />
            </AuthGuard>
          } 
        />
      </Route>

      {/* Protected routes */}
      <Route path="/" element={<AuthGuard requireAuth={true}><MainLayout /></AuthGuard>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/notifications" element={<NotificationSettingsPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="payment-failure" element={<PaymentFailurePage />} />
        <Route path="floorplan" element={<FloorplanPage />} />
        <Route path="floorplans" element={<FloorplanOrdersPage />} />
        <Route path="test-notifications" element={<TestNotificationPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AuthGuard requireAuth={true}><MainLayout isAdmin /></AuthGuard>}>
        <Route index element={<AdminDashboardPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;