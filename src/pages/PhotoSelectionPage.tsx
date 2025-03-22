
import React, { useState } from 'react';
import { ArrowLeft, Upload, Camera, Info, Plus, Trash2, Home, DoorOpen, Kitchen, Bath, BedDouble, Tree, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roomCategories = [
  { id: 'exterior', name: 'Exterior', icon: Home },
  { id: 'livingRoom', name: 'Living Room', icon: DoorOpen },
  { id: 'kitchen', name: 'Kitchen', icon: Kitchen },
  { id: 'bathroom', name: 'Bathroom', icon: Bath },
  { id: 'bedroom', name: 'Bedroom', icon: BedDouble },
  { id: 'backyard', name: 'Backyard', icon: Tree },
  { id: 'other', name: 'Other', icon: Sun },
];

// Sample photos
const samplePhotos = [
  { id: 1, url: '/assets/sample1.jpg', category: 'exterior' },
  { id: 2, url: '/assets/sample2.jpg', category: 'livingRoom' },
  { id: 3, url: '/assets/sample3.jpg', category: 'kitchen' },
  { id: 4, url: '/assets/sample4.jpg', category: null },
  { id: 5, url: '/assets/sample5.jpg', category: null },
  { id: 6, url: '/assets/sample6.jpg', category: null },
];

const PhotoSelectionPage = () => {
  const [photos, setPhotos] = useState(samplePhotos);
  const [selectedPhotos, setSelectedPhotos] = useState(
    samplePhotos.reduce((acc, photo) => ({...acc, [photo.id]: true}), {})
  );
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();
  
  const photoCount = Object.values(selectedPhotos).filter(Boolean).length;
  const totalCost = photoCount * 1.5; // $1.50 per photo
  
  const handleTogglePhoto = (id) => {
    setSelectedPhotos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleSetCategory = (photoId, category) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId ? {...photo, category} : photo
    ));
  };
  
  const filteredPhotos = activeCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === activeCategory);
  
  const handleContinue = () => {
    // In a real app, you would save the selected photos
    const selected = photos.filter(photo => selectedPhotos[photo.id]);
    navigate('/photo-addons');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/new-listing')}
        className="flex items-center text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Property Details
      </button>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold mb-2">Select & Categorize Photos</h1>
          <p className="text-gray-400 mb-6">Choose which photos to edit and categorize them by room</p>
          
          {/* Photo Tip */}
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 mb-6 flex">
            <div className="text-blue-400 mr-3 mt-1">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-blue-400">Pro Tip</h3>
              <p className="text-sm text-blue-300/80">
                Selecting photos from multiple angles of each room helps create a complete view of the property.
                Wide-angle shots are best for showing the full space.
              </p>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
            <button
              className={`whitespace-nowrap px-4 py-2 rounded-full ${
                activeCategory === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-dark-lighter hover:bg-dark-light'
              }`}
              onClick={() => setActiveCategory('all')}
            >
              All Photos
            </button>
            {roomCategories.map(category => (
              <button
                key={category.id}
                className={`whitespace-nowrap px-4 py-2 rounded-full flex items-center ${
                  activeCategory === category.id 
                    ? 'bg-primary text-white' 
                    : 'bg-dark-lighter hover:bg-dark-light'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPhotos.map(photo => (
              <div 
                key={photo.id} 
                className={`group relative rounded-lg overflow-hidden ${
                  selectedPhotos[photo.id] ? 'ring-2 ring-primary' : 'opacity-70'
                }`}
              >
                <img 
                  src={photo.url || '/assets/placeholder-image.jpg'} 
                  alt={`Property photo ${photo.id}`}
                  className="w-full aspect-[4/3] object-cover"
                />
                
                {/* Selection checkbox */}
                <div className="absolute top-2 right-2">
                  <button
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedPhotos[photo.id] 
                        ? 'bg-primary text-white' 
                        : 'bg-black/50 text-white/70'
                    }`}
                    onClick={() => handleTogglePhoto(photo.id)}
                  >
                    {selectedPhotos[photo.id] && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Category label */}
                {photo.category && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {roomCategories.find(c => c.id === photo.category)?.name}
                  </div>
                )}
                
                {/* Category dropdown */}
                {selectedPhotos[photo.id] && (
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <button className="bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </button>
                      
                      {/* Dropdown content would go here in a real implementation */}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Upload more photos button */}
            <div className="border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center p-6 hover:border-primary cursor-pointer">
              <div className="bg-dark-light w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-center text-gray-400">Upload More Photos</p>
            </div>
          </div>
        </div>
        
        {/* Order Summary Sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-dark-lighter rounded-xl p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Selected Photos</span>
                <span className="font-medium">{photoCount}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Cost per Photo</span>
                <span className="font-medium">$1.50</span>
              </div>
              
              <div className="pt-4 border-t border-gray-700 flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">${totalCost.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg mb-4"
              onClick={handleContinue}
              disabled={photoCount === 0}
            >
              Continue to Add-ons
            </button>
            
            <p className="text-sm text-gray-400 text-center">
              You'll have a chance to review your order before checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoSelectionPage;
