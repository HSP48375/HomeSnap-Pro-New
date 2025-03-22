import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';
import { CreditCard, CheckCircle, ArrowLeft, Tag } from 'lucide-react';
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

  const handlePaymentSuccess = async (paymentId: string) => {
    setPaymentId(paymentId);
    setPaymentSuccess(true);
    
    try {
      setLoading(true);
      
      // In a real app, you would verify the payment on your server
      // before finalizing the order
      
      const { success, error } = await submitOrder();
      
      if (success) {
        toast.success('Order placed successfully!');
        navigate('/dashboard');
      } else {
        throw new Error(error || 'Failed to place order');
      }
    } catch (error: any) {
      console.error('Error processing order:', error);
      toast.error('Order processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
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
import React, { useState } from 'react';
import { ArrowLeft, Check, X, CreditCard, Tag, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const navigate = useNavigate();
  
  // Sample order details
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

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/photo-addons')}
        className="flex items-center text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Add-ons
      </button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-400 mb-8">Review your order and complete your purchase</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div>
            <div className="bg-dark-lighter rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              
              <div className="space-y-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Photo Editing (×{orderDetails.photoEditing.count})</span>
                  <span className="font-medium">${orderDetails.photoEditing.total.toFixed(2)}</span>
                </div>
                
                {orderDetails.virtualStaging.count > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Virtual Staging (×{orderDetails.virtualStaging.count})</span>
                    <span className="font-medium">${orderDetails.virtualStaging.total.toFixed(2)}</span>
                  </div>
                )}
                
                {orderDetails.twilightConversion.count > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Twilight Conversion (×{orderDetails.twilightConversion.count})</span>
                    <span className="font-medium">${orderDetails.twilightConversion.total.toFixed(2)}</span>
                  </div>
                )}
                
                {orderDetails.aiDescription.count > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">AI Listing Description</span>
                    <span className="font-medium">${orderDetails.aiDescription.total.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-700 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {promoApplied && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount (WELCOME10)</span>
                    <span>-${orderDetails.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Expected Delivery */}
            <div className="bg-dark-lighter rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Expected Delivery</h2>
              
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Standard Delivery</h3>
                  <p className="text-sm text-gray-400">
                    You'll receive your edited photos within 24 hours
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Estimated Completion</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment */}
          <div>
            <div className="bg-dark-lighter rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                <label className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-primary">
                  <input 
                    type="radio" 
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === 'creditCard'}
                    onChange={() => setPaymentMethod('creditCard')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border ${paymentMethod === 'creditCard' ? 'border-primary' : 'border-gray-500'} mr-3 flex items-center justify-center`}>
                    {paymentMethod === 'creditCard' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                  </div>
                  <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Credit or Debit Card</span>
                </label>
                
                {paymentMethod === 'creditCard' && (
                  <div className="bg-dark-light p-4 rounded-lg space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 bg-dark rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm">Expiration Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-dark rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm">CVC</label>
                        <input 
                          type="text" 
                          placeholder="123"
                          className="w-full px-4 py-3 bg-dark rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm">Name on Card</label>
                      <input 
                        type="text" 
                        placeholder="John Smith"
                        className="w-full px-4 py-3 bg-dark rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary bg-dark border-gray-700 mr-2" />
                      <span className="text-sm text-gray-400">Save this card for future purchases</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            {/* Promo Code */}
            <div className="bg-dark-lighter rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Promo Code</h2>
              
              <div className="flex">
                <div className="relative flex-grow">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="w-full pl-10 pr-4 py-3 bg-dark-light rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                  />
                </div>
                <button
                  className={`px-4 rounded-r-lg ${
                    promoApplied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode}
                >
                  {promoApplied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
              
              {promoApplied && (
                <div className="flex items-center mt-3 text-green-500 text-sm">
                  <Check className="w-4 h-4 mr-1" />
                  <span>Promo code applied successfully!</span>
                </div>
              )}
            </div>
            
            {/* Complete Order */}
            <button
              className={`w-full py-4 rounded-xl font-semibold ${
                isProcessing 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/90 text-white'
              }`}
              onClick={handleSubmitOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                <span>Complete Order</span>
              )}
            </button>
            
            <p className="text-sm text-gray-400 text-center mt-4">
              By completing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
