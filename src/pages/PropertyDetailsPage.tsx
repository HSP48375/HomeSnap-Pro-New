import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../lib/api';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!id) return;
        const data = await getOrderById(id);
        if (data) {
          setProperty(data);
        }
      } catch (error) {
        console.error("Failed to fetch property details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl mb-2">Property not found</h2>
        <button 
          onClick={() => navigate('/orders')}
          className="mt-4 bg-gray-700 px-4 py-2 rounded-md text-white font-medium"
        >
          Return to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/orders')}
        className="flex items-center mb-6 text-gray-400 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Orders
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{property.propertyAddress}</h1>
        <div className="flex items-center mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
            ${property.status === 'completed' ? 'bg-green-900 text-green-300' : 
              property.status === 'in-progress' ? 'bg-blue-900 text-blue-300' : 
              'bg-yellow-900 text-yellow-300'}`}
          >
            {property.status.replace('-', ' ')}
          </span>
          <span className="ml-4 text-gray-400">Order #{property.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Order Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Date</span>
              <span>{new Date(property.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total</span>
              <span className="font-bold">${property.price.toFixed(2)}</span>
            </div>
            <div className="pt-2">
              <h3 className="text-gray-400 mb-2">Services</h3>
              <div className="flex flex-wrap gap-2">
                {property.services.map((service, idx) => (
                  <span key={idx} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Photos</h2>
          {property.photos && property.photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {property.photos.map((photo, idx) => (
                <div key={idx} className="aspect-video bg-gray-700 rounded-md overflow-hidden">
                  <img 
                    src={photo} 
                    alt={`Property ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/placeholder-image.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              {property.status === 'completed' ? 
                "No photos available" : 
                "Photos will be available when the order is completed"}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => navigate(`/order/${property.id}/edit`)}
          className="bg-gray-700 px-6 py-3 rounded-lg text-white font-medium mr-4"
        >
          Edit Order
        </button>
        <button 
          className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-lg text-white font-medium"
        >
          Download Photos
        </button>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;