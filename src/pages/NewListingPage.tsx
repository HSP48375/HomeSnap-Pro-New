
import React, { useState, useEffect } from 'react';
import { MapPin, Home, Camera, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewListingPage = () => {
  const [address, setAddress] = useState('');
  const [nickname, setNickname] = useState('');
  const [propertyType, setPropertyType] = useState('residential');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [useLocation, setUseLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (useLocation) {
      // In a real app, you would use the browser's geolocation API
      // and then use a reverse geocoding service to get the address
      setIsLoading(true);
      setTimeout(() => {
        setAddress('123 Current Location St, Your City, ST');
        setIsLoading(false);
        setUseLocation(false);
      }, 1500);
    }
  }, [useLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would save this data to your backend
    console.log({
      address,
      nickname,
      propertyType,
      bedrooms,
      bathrooms,
      squareFeet
    });
    
    // Navigate to the next step (photo upload)
    navigate('/photo-selection');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/orders')}
        className="flex items-center text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Properties
      </button>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Add New Property</h1>
        <p className="text-gray-400 mb-8">Enter the details of your new listing below</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-dark-lighter rounded-xl p-6 space-y-6">
            <div className="space-y-2">
              <label className="block font-medium">Property Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Enter the property address"
                  className="w-full pl-10 pr-4 py-3 bg-dark-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                className="mt-2 text-primary flex items-center text-sm"
                onClick={() => setUseLocation(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    Getting your location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-1" />
                    Use My Current Location
                  </>
                )}
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="block font-medium">Property Nickname (Optional)</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="e.g., Beach House, Downtown Condo"
                  className="w-full pl-10 pr-4 py-3 bg-dark-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-400">
                Add a nickname to easily identify this property in your dashboard
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="block font-medium">Property Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['Residential', 'Commercial', 'Vacant Land'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`py-3 px-4 rounded-lg border ${
                      propertyType === type.toLowerCase() 
                        ? 'border-primary bg-primary/20 text-white' 
                        : 'border-gray-700 bg-dark-light hover:border-gray-500'
                    }`}
                    onClick={() => setPropertyType(type.toLowerCase())}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block font-medium">Bedrooms</label>
                <input 
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-3 bg-dark-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block font-medium">Bathrooms</label>
                <input 
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="0"
                  className="w-full px-4 py-3 bg-dark-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block font-medium">Square Feet</label>
                <input 
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-3 bg-dark-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={squareFeet}
                  onChange={(e) => setSquareFeet(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              className="px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-500"
              onClick={() => navigate('/orders')}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center"
              disabled={!address}
            >
              <Camera className="w-5 h-5 mr-2" />
              Continue to Photos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewListingPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewListingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Orders
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-2">Create New Order</h1>
      <p className="text-gray-400 mb-6">Begin your professional photography order</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Why Professional Photography?</h2>
          <ul className="space-y-3">
            <li className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Properties with professional photos sell up to <strong>32% faster</strong></span>
            </li>
            <li className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Professional photos can increase the perceived value by up to <strong>20%</strong></span>
            </li>
            <li className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>First impressions matter - <strong>85% of buyers</strong> say photos are the most important factor when viewing homes online</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Our Process</h2>
          <ol className="space-y-4">
            <li className="flex">
              <div className="bg-primary text-black h-6 w-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">1</div>
              <div>
                <h3 className="font-medium">Select your package</h3>
                <p className="text-sm text-gray-400">Choose from our Basic, Premium, or Luxury packages</p>
              </div>
            </li>
            <li className="flex">
              <div className="bg-primary text-black h-6 w-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">2</div>
              <div>
                <h3 className="font-medium">Schedule your photoshoot</h3>
                <p className="text-sm text-gray-400">Choose a convenient date and time</p>
              </div>
            </li>
            <li className="flex">
              <div className="bg-primary text-black h-6 w-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">3</div>
              <div>
                <h3 className="font-medium">Prepare your property</h3>
                <p className="text-sm text-gray-400">We'll provide a preparation checklist</p>
              </div>
            </li>
            <li className="flex">
              <div className="bg-primary text-black h-6 w-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">4</div>
              <div>
                <h3 className="font-medium">Review and download photos</h3>
                <p className="text-sm text-gray-400">Get your professionally edited photos</p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => navigate('/photo-selection')}
          className="bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-lg text-white font-medium text-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default NewListingPage;
