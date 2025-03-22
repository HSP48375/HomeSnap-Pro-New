import React from 'react';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import OrderHistory from '../components/ui/OrderHistory';

const OrdersPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text">My Orders</h1>
          <p className="text-white/70 mt-2">
            View and manage all your photo editing orders.
          </p>
        </div>
        <Link to="/upload" className="btn btn-primary hidden md:flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload Photos
        </Link>
      </div>

      <OrderHistory />
      
      <div className="md:hidden">
        <Link to="/upload" className="btn btn-primary w-full flex items-center justify-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload Photos
        </Link>
      </div>
    </div>
  );
};

export default OrdersPage;
import React, { useState } from 'react';
import { PlusCircle, Search, Filter, MapPin, Calendar, Clock, ArrowUpDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample property data
const sampleProperties = [
  {
    id: 1,
    address: '1234 Oceanview Dr, Miami, FL',
    nickname: 'Beach House Listing',
    status: 'Active',
    photos: 24,
    lastUpdated: '2025-03-19T14:30:00',
    thumbnail: '/assets/property-1.jpg'
  },
  {
    id: 2,
    address: '567 Mountain View Rd, Denver, CO',
    nickname: 'Mountain Retreat',
    status: 'Complete',
    photos: 18,
    lastUpdated: '2025-03-15T10:15:00',
    thumbnail: '/assets/property-2.jpg'
  },
  {
    id: 3,
    address: '890 Sunset Blvd, Los Angeles, CA',
    nickname: 'LA Luxury Condo',
    status: 'Processing',
    photos: 32,
    lastUpdated: '2025-03-18T09:45:00',
    thumbnail: '/assets/property-3.jpg'
  }
];

const OrdersPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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

  const filteredProperties = sampleProperties.filter(property => 
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) || 
    property.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Property Listings</h1>
        <button 
          onClick={() => navigate('/new-listing')}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center shadow-lg transition-all"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          <span>New Property</span>
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-dark-lighter rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by address or nickname"
            className="w-full pl-10 pr-4 py-3 bg-dark-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-dark-light rounded-lg flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            <span>Filter</span>
          </button>
          <button className="px-4 py-2 bg-dark-light rounded-lg flex items-center">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <span>Sort</span>
          </button>
          <div className="flex rounded-lg overflow-hidden">
            <button 
              className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-dark-light'}`}
              onClick={() => setViewMode('grid')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button 
              className={`px-4 py-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-dark-light'}`}
              onClick={() => setViewMode('list')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Properties grid/list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <div 
              key={property.id} 
              className="bg-dark-lighter rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
              onClick={() => navigate(`/property/${property.id}`)}
            >
              <div className="h-40 bg-dark-light relative">
                {property.thumbnail ? (
                  <img 
                    src={property.thumbnail} 
                    alt={property.nickname} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <MapPin size={40} />
                  </div>
                )}
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full ${getStatusClass(property.status)}`}>
                  {property.status}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{property.nickname}</h3>
                <p className="text-gray-400 text-sm flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.address}
                </p>
                <div className="flex justify-between mt-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(property.lastUpdated).toLocaleDateString()}
                  </span>
                  <span>{property.photos} photos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-dark-lighter rounded-xl overflow-hidden">
          {filteredProperties.map((property, index) => (
            <div 
              key={property.id} 
              className={`flex items-center p-4 cursor-pointer hover:bg-dark-light transition-all ${
                index !== filteredProperties.length - 1 ? 'border-b border-gray-700' : ''
              }`}
              onClick={() => navigate(`/property/${property.id}`)}
            >
              <div className="w-12 h-12 bg-dark-light rounded-lg overflow-hidden mr-4">
                {property.thumbnail ? (
                  <img 
                    src={property.thumbnail} 
                    alt={property.nickname} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <MapPin size={20} />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{property.nickname}</h3>
                <p className="text-gray-400 text-sm">{property.address}</p>
              </div>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full mr-4 text-sm ${getStatusClass(property.status)}`}>
                  {property.status}
                </span>
                <span className="text-gray-400 whitespace-nowrap mr-4">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {new Date(property.lastUpdated).toLocaleDateString()}
                </span>
                <button className="text-gray-400 hover:text-white">
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
