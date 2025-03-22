import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, X, CreditCard, Tag, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import StripeWrapper from '../components/ui/StripeWrapper';
import PaymentForm from '../components/ui/PaymentForm';

const CheckoutPage: React.FC = () => {
  const { currentOrder, calculatePrice, submitOrder } = useOrderStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Redirect if no order in progress
    if (!currentOrder || currentOrder.photos.length === 0) {
      toast.error('No active order found');
      navigate('/upload');
    }
  }, [currentOrder, navigate]);

  const handleApplyDiscount = () => {
    if (!discountCode) {
      toast.error('Please enter a discount code');
      return;
    }

    // This is just a mock implementation
    // In a real app, you would validate the code against a database
    if (discountCode.toUpperCase() === 'WELCOME10') {
      setDiscountApplied(true);
      setDiscountAmount(calculatePrice() * 0.1); // 10% discount
      toast.success('Discount applied: 10% off');
    } else {
      toast.error('Invalid discount code');
    }
  };

  // Sample order details from the second CheckoutPage component
  const orderDetails = {
    photoEditing: {
      count: 15,
      pricePerItem: 1.5,
      total: 22.5
    },
    virtualStaging: {
      count: 2,
      pricePerItem: 25,
      total: 50
    },
    twilightConversion: {
      count: 1,
      pricePerItem: 15,
      total: 15
    },
    aiDescription: {
      count: 1,
      pricePerItem: 15,
      total: 15
    },
    discount: promoApplied ? 10 : 0
  };

  const subtotal = Object.values(orderDetails)
    .filter(item => typeof item === 'object')
    .reduce((sum, item) => sum + item.total, 0);

  const total = subtotal - orderDetails.discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true);
    }
  };

  const handleSubmitOrder = () => {
    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      navigate('/orders');
    }, 2000);
  };

  if (!currentOrder) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-white/70">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const totalPrice = calculatePrice();
  const finalPrice = discountApplied ? totalPrice - discountAmount : totalPrice;

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/upload')} 
          className="mr-4 p-2 rounded-full bg-dark-light hover:bg-primary/20 text-white/70 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text">Checkout</h1>
          <p className="text-white/70 mt-2">
            Complete your order to start the editing process.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-white/70">Photos</span>
                <span>{currentOrder.photos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Standard Editing</span>
                <span>${(8.99 * currentOrder.photos.length).toFixed(2)}</span>
              </div>
              {currentOrder.services.virtualStaging && (
                <div className="flex justify-between">
                  <span className="text-white/70">Virtual Staging</span>
                  <span>${(15.99 * currentOrder.photos.length).toFixed(2)}</span>
                </div>
              )}
              {currentOrder.services.twilightConversion && (
                <div className="flex justify-between">
                  <span className="text-white/70">Twilight Conversion</span>
                  <span>${(10.99 * currentOrder.photos.length).toFixed(2)}</span>
                </div>
              )}
              {currentOrder.services.decluttering && (
                <div className="flex justify-between">
                  <span className="text-white/70">Decluttering</span>
                  <span>${(12.99 * currentOrder.photos.length).toFixed(2)}</span>
                </div>
              )}
              {currentOrder.photos.length >= 10 && (
                <div className="flex justify-between text-neon-green">
                  <span>Volume Discount</span>
                  <span>
                    {currentOrder.photos.length >= 20 ? '15% OFF' : '10% OFF'}
                  </span>
                </div>
              )}
              {discountApplied && (
                <div className="flex justify-between text-neon-purple">
                  <span>Promo Code Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            {/* Discount Code */}
            <div className="mb-4">
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="input pl-10 w-full"
                    disabled={discountApplied}
                  />
                </div>
                <button
                  onClick={handleApplyDiscount}
                  disabled={discountApplied}
                  className={`btn ${discountApplied ? 'btn-outline cursor-not-allowed' : 'btn-primary'}`}
                >
                  {discountApplied ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Applied
                    </span>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${finalPrice.toFixed(2)}</span>
              </div>
              <div className="text-white/50 text-sm text-right">
                Delivery within 12-16 hours
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
            
            {paymentSuccess ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-neon-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
                <p className="text-white/70 mb-6">
                  Your payment has been processed successfully. Your order is now being prepared.
                </p>
                <p className="text-white/50 text-sm mb-4">
                  Payment ID: {paymentId}
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-primary"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <StripeWrapper>
                <PaymentForm 
                  amount={finalPrice} 
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </StripeWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;