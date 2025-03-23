import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PhotoSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packages = [
    {
      id: 'basic',
      name: 'Basic Package',
      price: 99.99,
      photoCount: 15,
      features: [
        'Professional editing',
        'High-resolution images',
        'Next-day delivery',
        'Commercial license'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: 149.99,
      photoCount: 25,
      features: [
        'Professional editing',
        'High-resolution images',
        'Same-day delivery',
        'Commercial license',
        'Social media optimized images'
      ]
    },
    {
      id: 'luxury',
      name: 'Luxury Package',
      price: 199.99,
      photoCount: 35,
      features: [
        'Professional editing',
        'High-resolution images',
        'Same-day delivery',
        'Commercial license',
        'Social media optimized images',
        'Virtual staging (2 rooms)',
        'Aerial drone shots',
        'Twilight enhancement'
      ]
    }
  ];

  const handleContinue = () => {
    if (!selectedPackage) return;
    navigate('/photo-addons', { 
      state: { selectedPackage } 
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

      <h1 className="text-2xl font-bold mb-2">Select Photography Package</h1>
      <p className="text-gray-400 mb-6">Choose the photography package that suits your property best</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg)}
            className={`
              bg-gray-800 rounded-lg p-6 cursor-pointer transition
              ${selectedPackage?.id === pkg.id 
                ? 'ring-2 ring-primary' 
                : 'hover:bg-gray-700'}
            `}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">{pkg.name}</h2>
              {selectedPackage?.id === pkg.id && (
                <div className="bg-primary rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="text-2xl font-bold mb-4">${pkg.price}</div>
            <div className="text-gray-400 mb-4">{pkg.photoCount} professional photos</div>
            <ul className="space-y-2">
              {pkg.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleContinue}
          disabled={!selectedPackage}
          className={`
            px-6 py-3 rounded-lg text-white font-medium
            ${selectedPackage
              ? 'bg-gradient-to-r from-primary to-secondary cursor-pointer'
              : 'bg-gray-700 cursor-not-allowed'}
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PhotoSelectionPage;