
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
