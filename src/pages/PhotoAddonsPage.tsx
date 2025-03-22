
import React, { useState } from 'react';
import { ArrowLeft, Check, Info, Sparkles, MoonStar, Paintbrush, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const addonServices = [
  {
    id: 'virtualStaging',
    name: 'Virtual Staging',
    icon: Sparkles,
    description: 'Add virtual furniture to empty rooms to help buyers visualize the space',
    price: 25,
    priceLabel: '$25 per room',
    beforeImage: '/assets/VirtualStaging_Before.JPEG',
    afterImage: '/assets/VirtualStaging_After.JPEG',
    stat: 'Staged homes sell for 17% more on average'
  },
  {
    id: 'twilight',
    name: 'Twilight Conversion',
    icon: MoonStar,
    description: 'Transform daytime exterior shots into stunning twilight photos',
    price: 15,
    priceLabel: '$15 per photo',
    beforeImage: '/assets/Twilight_Before.JPG',
    afterImage: '/assets/Twilight_After.JPG',
    stat: '78% higher engagement rate for twilight photos'
  },
  {
    id: 'decluttering',
    name: 'Digital Decluttering',
    icon: Scissors,
    description: 'Remove unwanted items and clutter from your listing photos',
    price: 10,
    priceLabel: '$10 per photo',
    beforeImage: '/assets/Decluttering_Before.JPEG',
    afterImage: '/assets/Decluttering_After.JPEG',
    stat: 'Clean, decluttered photos increase viewing requests by 29%'
  },
  {
    id: 'landscaping',
    name: 'Landscape Enhancement',
    icon: Paintbrush,
    description: 'Improve curb appeal with enhanced grass, plants, and sky',
    price: 20,
    priceLabel: '$20 per photo',
    beforeImage: '/assets/Editing_Before.JPEG',
    afterImage: '/assets/Editing_After.JPEG',
    stat: 'Enhanced landscaping can increase perceived property value by 7%'
  }
];

const PhotoAddonsPage = () => {
  const [selectedAddons, setSelectedAddons] = useState({});
  const [showAIDescription, setShowAIDescription] = useState(false);
  const [descriptionStyle, setDescriptionStyle] = useState('luxury');
  
  const navigate = useNavigate();
  
  // Base cost from the previous page (in a real app, this would be passed in or stored in state)
  const basePhotoCost = 22.50; // 15 photos at $1.50 each
  
  // Calculate addons cost
  const addonCost = Object.entries(selectedAddons)
    .reduce((total, [id, count]) => {
      const addon = addonServices.find(addon => addon.id === id);
      return total + (addon ? addon.price * count : 0);
    }, 0);
  
  // AI description cost
  const descriptionCost = showAIDescription ? 15 : 0;
  
  // Total cost
  const totalCost = basePhotoCost + addonCost + descriptionCost;
  
  const handleAddonChange = (id, change) => {
    setSelectedAddons(prev => {
      const current = prev[id] || 0;
      const newValue = Math.max(0, current + change);
      
      if (newValue === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [id]: newValue
      };
    });
  };
  
  const handleContinue = () => {
    // In a real app, you would save the selected addons
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/photo-selection')}
        className="flex items-center text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Photo Selection
      </button>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold mb-2">Professional Add-on Services</h1>
          <p className="text-gray-400 mb-8">Enhance your listing with these professional services</p>
          
          {/* Virtual Staging and other Addons */}
          <div className="space-y-8 mb-12">
            {addonServices.map(addon => (
              <div key={addon.id} className="bg-dark-lighter rounded-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Before/After Images */}
                  <div className="relative">
                    <div className="grid grid-cols-2 h-full">
                      <div className="relative">
                        <img 
                          src={addon.beforeImage} 
                          alt={`Before ${addon.name}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Before
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src={addon.afterImage} 
                          alt={`After ${addon.name}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-primary/70 text-white text-xs px-2 py-1 rounded">
                          After
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Details */}
                  <div className="p-6 flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <addon.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">{addon.name}</h2>
                    </div>
                    
                    <p className="text-gray-400 mb-4">{addon.description}</p>
                    
                    <div className="bg-dark-light rounded-lg p-3 mb-6">
                      <div className="flex items-center">
                        <Info className="w-4 h-4 text-primary mr-2" />
                        <span className="text-primary text-sm">{addon.stat}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold">{addon.priceLabel}</span>
                        <div className="flex items-center space-x-3">
                          <button
                            className="w-8 h-8 rounded-full bg-dark-light flex items-center justify-center"
                            onClick={() => handleAddonChange(addon.id, -1)}
                            disabled={!selectedAddons[addon.id]}
                          >
                            <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </button>
                          
                          <span className="w-6 text-center">{selectedAddons[addon.id] || 0}</span>
                          
                          <button
                            className="w-8 h-8 rounded-full bg-dark-light flex items-center justify-center"
                            onClick={() => handleAddonChange(addon.id, 1)}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 1V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path d="M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* AI Listing Description */}
          <div className="bg-dark-lighter rounded-xl p-6 mb-12">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Listing Description</h2>
                <p className="text-sm text-gray-400">Generate a professional property description for MLS</p>
              </div>
              <div className="ml-auto">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showAIDescription}
                    onChange={() => setShowAIDescription(!showAIDescription)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  <span className="ml-3">${descriptionCost}</span>
                </label>
              </div>
            </div>
            
            {showAIDescription && (
              <>
                <div className="bg-dark-light rounded-lg p-4 mb-4">
                  <p className="text-gray-400 mb-3">
                    Our AI will generate an engaging, MLS-ready description based on your property details and photos.
                  </p>
                  <div className="flex items-center">
                    <Info className="w-4 h-4 text-primary mr-2" />
                    <span className="text-primary text-sm">Listings with quality descriptions sell 32% faster</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-2">Description Style</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Luxury', 'Modern', 'Family-Friendly', 'Investment'].map((style) => (
                      <button
                        key={style}
                        type="button"
                        className={`py-2 px-3 rounded-lg border ${
                          descriptionStyle === style.toLowerCase() 
                            ? 'border-primary bg-primary/20 text-white' 
                            : 'border-gray-700 bg-dark-light hover:border-gray-500'
                        }`}
                        onClick={() => setDescriptionStyle(style.toLowerCase())}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Order Summary Sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-dark-lighter rounded-xl p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Basic Photo Editing</span>
                <span className="font-medium">${basePhotoCost.toFixed(2)}</span>
              </div>
              
              {Object.entries(selectedAddons).map(([id, count]) => {
                const addon = addonServices.find(a => a.id === id);
                if (!addon) return null;
                
                return (
                  <div key={id} className="flex justify-between">
                    <span className="text-gray-400">{addon.name} (x{count})</span>
                    <span className="font-medium">${(addon.price * count).toFixed(2)}</span>
                  </div>
                );
              })}
              
              {showAIDescription && (
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Listing Description</span>
                  <span className="font-medium">${descriptionCost.toFixed(2)}</span>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-700 flex justify-between">
                <span>Total</span>
                <span className="font-bold">${totalCost.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg mb-4 flex items-center justify-center"
              onClick={handleContinue}
            >
              <Check className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </button>
            
            <p className="text-sm text-gray-400 text-center">
              You'll have a chance to review your order before finalizing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoAddonsPage;
