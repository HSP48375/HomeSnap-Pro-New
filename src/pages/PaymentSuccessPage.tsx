import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useOrderStore } from '../stores/orderStore';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearOrder } = useOrderStore();
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // In a real app, you would verify the payment with your backend
    // For this demo, we'll just assume it's successful if we have a session ID
    
    if (sessionId) {
      // Clear the current order
      clearOrder();
      
      // Show success message
      toast.success('Payment successful! Your order has been placed.');
      
      // Redirect to dashboard after a short delay
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      // If no session ID, redirect to dashboard
      navigate('/dashboard');
    }
  }, [sessionId, clearOrder, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="card max-w-md mx-auto text-center p-8">
        <div className="h-20 w-20 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-neon-green" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-white/70 mb-6">
          Thank you for your order. Your payment has been processed successfully and your photos are now in our editing queue.
        </p>
        {sessionId && (
          <p className="text-white/50 text-sm mb-6">
            Payment Reference: {sessionId.substring(0, 8)}...
          </p>
        )}
        <p className="text-white/70 mb-8">
          You will be redirected to your dashboard in a few seconds...
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary w-full"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;