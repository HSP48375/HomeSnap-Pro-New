
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Download, Share2, Edit2, Trash2, Image, Check, Copy, MessageSquare, Home } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// Sample property data
const sampleProperty = {
  id: 1,
  address: '1234 Oceanview Dr, Miami, FL',
  nickname: 'Beach House Listing',
  status: 'Complete',
  price: '$875,000',
  bedrooms: 3,
  bathrooms: 2.5,
  squareFeet: 2100,
  description: 'This stunning beachfront property offers panoramic ocean views and luxurious finishes throughout. Perfect for entertaining with an open floor plan and chef\'s kitchen. The primary suite features a spa-like bathroom and private balcony overlooking the water.',
  photos: [
    { id: 1, url: '/assets/sample1.jpg', category: 'Exterior', edited: true },
    { id: 2, url: '/assets/sample2.jpg', category: 'Living Room', edited: true },
    { id: 3, url: '/assets/sample3.jpg', category: 'Kitchen', edited: true },
    { id: 4, url: '/assets/sample4.jpg', category: 'Master Bedroom', edited: true },
    { id: 5, url: '/assets/sample5.jpg', category: 'Bathroom', edited: true },
    { id: 6, url: '/assets/sample6.jpg', category: 'Backyard', edited: true },
  ],
  dateCreated: '2025-03-15T14:30:00',
  dateCompleted: '2025-03-16T10:45:00'
};

const PropertyDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedPhoto, setSelectedPhoto] = useState(sampleProperty.photos[0]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-500/20 text-blue-500';
      case 'Complete':
        return 'bg-green-500/20 text-green-500';
      case 'Processing':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  const handleDownload = () => {
    // In a real app, this would download the selected photo
    console.log('Downloading photo:', selectedPhoto.id);
  };
  
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };
  
  const handleCopyLink = () => {
    // In a real app, this would copy a link to the clipboard
    console.log('Copying link for photo:', selectedPhoto.id);
    setShowShareOptions(false);
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
      
      <div className="bg-dark-lighter rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">{sampleProperty.nickname}</h1>
            <p className="text-gray-400 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {sampleProperty.address}
            </p>
          </div>
          
          <div className={`px-4 py-1 rounded-full text-sm ${getStatusClass(sampleProperty.status)} mt-4 md:mt-0`}>
            {sampleProperty.status}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark rounded-lg p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Price</div>
              <div className="font-semibold">{sampleProperty.price}</div>
            </div>
          </div>
          
          <div className="bg-dark rounded-lg p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M3 22V8L12 2L21 8V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 22V16C15 15.4696 14.7893 14.9609 14.4142 14.5858C14.0391 14.2107 13.5304 14 13 14H11C10.4696 14 9.96086 14.2107 9.58579 14.5858C9.21071 14.9609 9 15.4696 9 16V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-400">Bed/Bath</div>
              <div className="font-semibold">{sampleProperty.bedrooms} bd / {sampleProperty.bathrooms} ba</div>
            </div>
          </div>
          
          <div className="bg-dark rounded-lg p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                <path d="M9 21L9 9" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-400">Square Feet</div>
              <div className="font-semibold">{sampleProperty.squareFeet.toLocaleString()} sqft</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'photos' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
          onClick={() => setActiveTab('photos')}
        >
          Photos
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      </div>
      
      {activeTab === 'photos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Photo Display */}
          <div className="lg:col-span-2">
            <div className="bg-dark-lighter rounded-xl overflow-hidden">
              <div className="relative h-96">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.category}
                  className="w-full h-full object-cover"
                />
                
                {/* Editing Badge */}
                {selectedPhoto.edited && (
                  <div className="absolute top-4 left-4 bg-green-600/80 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Professionally Edited
                  </div>
                )}
                
                {/* Actions */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    className="w-10 h-10 rounded-full bg-black/70 flex items-center justify-center hover:bg-primary transition-colors"
                    onClick={handleDownload}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  
                  <div className="relative">
                    <button
                      className="w-10 h-10 rounded-full bg-black/70 flex items-center justify-center hover:bg-primary transition-colors"
                      onClick={handleShare}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    
                    {showShareOptions && (
                      <div className="absolute right-0 bottom-12 bg-dark-light rounded-lg shadow-lg p-2 w-48">
                        <button
                          className="flex items-center w-full px-3 py-2 hover:bg-dark rounded-lg"
                          onClick={handleCopyLink}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          <span>Copy Link</span>
                        </button>
                        <button
                          className="flex items-center w-full px-3 py-2 hover:bg-dark rounded-lg"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          <span>Share to MLS</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg">{selectedPhoto.category || 'Untitled'}</h3>
              </div>
            </div>
          </div>
          
          {/* Thumbnails */}
          <div>
            <div className="bg-dark-lighter rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">All Photos</h3>
                <span className="text-gray-400 text-sm">{sampleProperty.photos.length} photos</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {sampleProperty.photos.map(photo => (
                  <div 
                    key={photo.id}
                    className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedPhoto.id === photo.id ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.category}
                      className="w-full aspect-square object-cover"
                    />
                    {photo.category && (
                      <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded truncate">
                        {photo.category}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex flex-col space-y-3">
                <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download All Photos
                </button>
                
                <button className="w-full bg-dark hover:bg-dark-light text-white py-2 rounded-lg flex items-center justify-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'description' && (
        <div className="bg-dark-lighter rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Property Description</h2>
            <button className="text-primary hover:text-primary/80">
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-300 leading-relaxed mb-6">{sampleProperty.description}</p>
          
          <div className="flex flex-wrap gap-3">
            <button className="bg-dark hover:bg-dark-light text-white px-4 py-2 rounded-lg flex items-center">
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </button>
            
            <button className="bg-dark hover:bg-dark-light text-white px-4 py-2 rounded-lg flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download as Text
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'details' && (
        <div className="bg-dark-lighter rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Property Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm">Property ID</h3>
                  <p className="font-medium">{sampleProperty.id}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Address</h3>
                  <p className="font-medium">{sampleProperty.address}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Price</h3>
                  <p className="font-medium">{sampleProperty.price}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Bedrooms</h3>
                  <p className="font-medium">{sampleProperty.bedrooms}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Bathrooms</h3>
                  <p className="font-medium">{sampleProperty.bathrooms}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm">Square Feet</h3>
                  <p className="font-medium">{sampleProperty.squareFeet}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Status</h3>
                  <p className={`font-medium ${getStatusClass(sampleProperty.status)}`}>{sampleProperty.status}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Date Created</h3>
                  <p className="font-medium">{new Date(sampleProperty.dateCreated).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Date Completed</h3>
                  <p className="font-medium">{new Date(sampleProperty.dateCompleted).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Total Photos</h3>
                  <p className="font-medium">{sampleProperty.photos.length}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 mt-6">
            <button className="bg-red-600/20 text-red-400 hover:bg-red-600/30 px-4 py-2 rounded-lg flex items-center">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Property
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
