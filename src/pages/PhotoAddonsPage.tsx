import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PhotoAddonsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPackage } = location.state || {};
  const [selectedAddons, setSelectedAddons] = useState([]);

  // If no package was selected, redirect back
  if (!selectedPackage) {
    navigate('/photo-selection');
    return null;
  }

  const addons = [
    {
      id: 'aerial',
      name: 'Aerial Drone Shots',
      price: 75,
      description: 'Stunning aerial views of the property and surrounding area'
    },
    {
      id: 'twilight',
      name: 'Twilight Enhancement',
      price: 50,
      description: 'Transform daytime photos into beautiful twilight scenes'
    },
    {
      id: 'virtual-staging',
      name: 'Virtual Staging',
      price: 100,
      description: 'Digitally stage empty rooms with furniture and decor'
    },
    {
      id: 'floor-plan',
      name: '2D Floor Plan',
      price: 60,
      description: 'Professional 2D floor plan of the property'
    },
    {
      id: 'walkthrough',
      name: 'Virtual Walkthrough',
      price: 150,
      description: '3D virtual walkthrough of the entire property'
    }
  ];

  const toggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const calculateTotal = () => {
    const addonsTotal = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);

    return selectedPackage.price + addonsTotal;
  };

  const handleContinue = () => {
    const selectedAddonDetails = selectedAddons.map(id => {
      const addon = addons.find(a => a.id === id);
      return {
        id: addon.id,
        name: addon.name,
        price: addon.price
      };
    });

    navigate('/checkout', {
      state: {
        selectedPackage,
        selectedAddons: selectedAddonDetails,
        total: calculateTotal()
      }
    });
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

      <h1 className="text-2xl font-bold mb-2">Add Extra Services</h1>
      <p className="text-gray-400 mb-6">Enhance your {selectedPackage.name} with additional services</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {addons.map((addon) => (
          <div 
            key={addon.id}
            onClick={() => toggleAddon(addon.id)}
            className={`
              bg-gray-800 rounded-lg p-4 cursor-pointer flex items-center
              ${selectedAddons.includes(addon.id) 
                ? 'ring-2 ring-primary' 
                : 'hover:bg-gray-700'}
            `}
          >
            <div className={`
              h-5 w-5 rounded-md border-2 mr-3 flex items-center justify-center
              ${selectedAddons.includes(addon.id) 
                ? 'bg-primary border-primary' 
                : 'border-gray-500'}
            `}>
              {selectedAddons.includes(addon.id) && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium">{addon.name}</h3>
                <span className="font-bold">${addon.price}</span>
              </div>
              <p className="text-sm text-gray-400">{addon.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>{selectedPackage.name}</span>
            <span>${selectedPackage.price.toFixed(2)}</span>
          </div>

          {selectedAddons.map((addonId) => {
            const addon = addons.find(a => a.id === addonId);
            return (
              <div key={addonId} className="flex justify-between">
                <span>{addon.name}</span>
                <span>${addon.price.toFixed(2)}</span>
              </div>
            );
          })}

          <div className="pt-3 border-t border-gray-700">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleContinue}
          className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-lg text-white font-medium"
        >
          Continue to Checkout
        </button>
      </div>
    </div>
  );
};

export default PhotoAddonsPage;