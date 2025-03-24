import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder } from '../lib/api';
import SmartSuggestions from '../components/SmartSuggestions'; // Added import

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPackage, selectedAddons, total, selectedImages, propertyType } = location.state || {}; // Added selectedImages and propertyType
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    scheduledDate: '',
    notes: ''
  });
  const [showSubscriptionPromo, setShowSubscriptionPromo] = useState(true);
  const [promoCode, setPromoCode] = useState(''); // Added for promo code handling


  // If no package was selected, redirect back
  if (!selectedPackage) {
    navigate('/photo-selection');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddService = (service) => {
    // Placeholder:  This needs to be implemented to actually add the service
    console.log("Adding service:", service);
  };

  const handleApplyPromo = (code) => {
    // Placeholder: This needs to be implemented to apply the promo code
    console.log("Applying promo code:", code);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine all selected services
      const services = [selectedPackage.name, ...(selectedAddons || []).map(addon => addon.name)];

      // Create new order
      const order = await createOrder({
        propertyAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        date: formData.scheduledDate,
        price: total,
        services,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        notes: formData.notes,
        promoCode // Include promo code in order creation
      });

      // Navigate to confirmation/success page (we can add this later)
      navigate('/orders', { state: { orderSuccess: true, orderId: order.id } });
    } catch (error) {
      console.error("Error creating order:", error);
      // Handle error (could add error state and display message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Contact Information</h2>
              {/* ... Contact Information form fields ... */}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Property Information</h2>
              {/* ... Property Information form fields ... */}
            </div>

            {/* Subscription Promo */}
            {showSubscriptionPromo && (
              <div className="my-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-500/30">
                {/* ... Subscription Promo content ... */}
              </div>
            )}

            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className={`
                  px-6 py-3 rounded-lg text-white font-medium
                  ${loading
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-secondary'}
                `}
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="bg-gray-800 rounded-lg p-6 sticky top-6" id="checkout-area">
            {/* ... Order Summary ... */}
          </div>
        </div>
      </div>
      {selectedImages && selectedImages.length > 0 && ( // Added conditional rendering
        <div className="suggestions-container mt-8"> {/* Added container and styling */}
          <SmartSuggestions 
            imageUrls={selectedImages.map(img => img.url)}
            propertyType={propertyType}
            onSuggestionSelected={(suggestion) => {
              if (suggestion.ctaAction === 'add_service') {
                handleAddService(suggestion.ctaPayload.service);
              } else if (suggestion.ctaAction === 'apply_discount' && suggestion.discountCode) {
                setPromoCode(suggestion.discountCode);
                handleApplyPromo(suggestion.discountCode);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;