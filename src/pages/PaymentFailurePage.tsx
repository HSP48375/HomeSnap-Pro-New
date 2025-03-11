import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const PaymentFailurePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="card max-w-md mx-auto text-center p-8">
        <div className="h-20 w-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
        <p className="text-white/70 mb-6">
          We couldn't process your payment. Please check your payment details and try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary flex-1"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline flex-1"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;