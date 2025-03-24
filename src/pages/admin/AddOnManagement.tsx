
import React, { useState } from 'react';
import { Edit, Trash, PlusCircle, Search, Upload, DollarSign, ToggleLeft, ToggleRight, BarChart2, Eye } from 'react-feather';

const AddOnManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddOn, setSelectedAddOn] = useState<number | null>(1);
  
  // Sample data for add-on services
  const addOnServices = [
    {
      id: 1,
      name: 'Virtual Staging',
      description: 'Transform empty rooms into beautifully furnished spaces that help potential buyers visualize the full potential of the property.',
      price: 25,
      isActive: true,
      usageCount: 1245,
      revenue: 31125,
      conversionRate: 68,
      beforeImage: '/assets/VirtualStaging_Before.JPEG',
      afterImage: '/assets/VirtualStaging_After.JPEG'
    },
    {
      id: 2,
      name: 'Twilight Conversion',
      description: 'Turn daytime exterior photos into stunning twilight scenes that create a warm, inviting ambiance for property listings.',
      price: 15,
      isActive: true,
      usageCount: 876,
      revenue: 13140,
      conversionRate: 52,
      beforeImage: '/assets/Twilight_Before.JPG',
      afterImage: '/assets/Twilight_After.JPG'
    },
    {
      id: 3,
      name: 'Decluttering',
      description: 'Remove unwanted items and reduce clutter from photos to present a clean, spacious impression of the property.',
      price: 10,
      isActive: true,
      usageCount: 1567,
      revenue: 15670,
      conversionRate: 75,
      beforeImage: '/assets/Decluttering_Before.JPEG',
      afterImage: '/assets/Decluttering_After.JPEG'
    },
    {
      id: 4,
      name: 'HDR Enhancement',
      description: 'Professional HDR processing to balance lighting and enhance colors for dramatic, high-impact property photos.',
      price: 8,
      isActive: true,
      usageCount: 2134,
      revenue: 17072,
      conversionRate: 82,
      beforeImage: '/assets/Editing_Before.JPEG',
      afterImage: '/assets/Editing_After.JPEG'
    },
    {
      id: 5,
      name: 'Floor Plan Creation',
      description: 'Create detailed 2D floor plans from property measurements or photos to help buyers understand the layout.',
      price: 35,
      isActive: false,
      usageCount: 432,
      revenue: 15120,
      conversionRate: 45,
      beforeImage: '/assets/camera-icon.svg',
      afterImage: '/assets/camera-icon.svg'
    },
  ];
  
  // State for editor
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editIsActive, setEditIsActive] = useState(true);
  
  // Find selected add-on
  const selectedService = addOnServices.find(service => service.id === selectedAddOn);
  
  const handleEdit = () => {
    if (selectedService) {
      setEditName(selectedService.name);
      setEditDescription(selectedService.description);
      setEditPrice(selectedService.price);
      setEditIsActive(selectedService.isActive);
      setEditMode(true);
    }
  };
  
  const handleSave = () => {
    // In a real app, this would update the service data
    setEditMode(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Add-On Service Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services..."
              className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90">
            <PlusCircle size={16} />
            <span>New Service</span>
          </button>
        </div>
      </div>
      
      {/* Add-On Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Service List */}
        <div className="col-span-1 bg-black/20 rounded-lg p-4 border border-white/10 max-h-[800px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <div className="space-y-3">
            {addOnServices.map((service) => (
              <div 
                key={service.id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAddOn === service.id ? 'bg-white/10 border border-cyan-400/50' : 'bg-black/30 border border-white/5 hover:border-white/20'
                }`}
                onClick={() => setSelectedAddOn(service.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{service.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    service.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-white/70">
                  <span>${service.price}</span>
                  <span>{service.usageCount} uses</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Service Details */}
        <div className="col-span-3 bg-black/20 rounded-lg p-6 border border-white/10">
          {selectedService && !editMode ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">{selectedService.name}</h3>
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                      selectedService.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {selectedService.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-white/70">${selectedService.price} per photo</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    className="p-2 bg-white/5 rounded-lg hover:bg-white/10"
                    onClick={handleEdit}
                  >
                    <Edit size={18} className="text-white/70" />
                  </button>
                  <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10">
                    <Trash size={18} className="text-white/70" />
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white/70 mb-2">Description</h4>
                <p className="bg-black/30 p-3 rounded-lg border border-white/5">
                  {selectedService.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black/30 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-cyan-400">{selectedService.usageCount}</div>
                  <div className="text-sm text-white/70">Total Uses</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-purple-400">${selectedService.revenue.toLocaleString()}</div>
                  <div className="text-sm text-white/70">Total Revenue</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-pink-400">{selectedService.conversionRate}%</div>
                  <div className="text-sm text-white/70">Conversion Rate</div>
                </div>
              </div>
              
              <h4 className="text-lg font-medium mb-4">Before & After Examples</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/40 relative">
                    <img 
                      src={selectedService.beforeImage} 
                      alt={`${selectedService.name} Before`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Before</div>
                  </div>
                </div>
                <div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/40 relative">
                    <img 
                      src={selectedService.afterImage} 
                      alt={`${selectedService.name} After`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">After</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">Usage Analytics</h4>
                <select className="px-3 py-1 bg-black/30 border border-white/10 rounded-lg text-sm">
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              
              {/* Placeholder for analytics chart */}
              <div className="bg-black/30 rounded-lg p-4 border border-white/5 h-64 mb-6 flex items-center justify-center">
                <div className="text-center text-white/50">
                  <BarChart2 size={48} className="mx-auto mb-2" />
                  <p>Usage analytics visualization would appear here</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center space-x-2">
                  <Eye size={16} />
                  <span>View Order History</span>
                </button>
                <div>
                  <button 
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                      selectedService.isActive ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300' : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
                    }`}
                  >
                    {selectedService.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    <span>{selectedService.isActive ? 'Deactivate Service' : 'Activate Service'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : editMode && selectedService ? (
            <div>
              <h3 className="text-xl font-bold mb-6">Edit Service</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Service Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Price ($)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                  />
                </div>
                
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="text-cyan-500" 
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                    />
                    <span>Service Active</span>
                  </label>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-white/70 mb-2">Update Example Images</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                        <Upload size={24} className="mx-auto mb-2 text-white/50" />
                        <p className="text-sm text-white/70">Upload Before Image</p>
                        <button className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm">Browse</button>
                      </div>
                    </div>
                    <div>
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                        <Upload size={24} className="mx-auto mb-2 text-white/50" />
                        <p className="text-sm text-white/70">Upload After Image</p>
                        <button className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm">Browse</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6">
                  <button 
                    className="px-4 py-2 bg-transparent border border-white/20 rounded-lg hover:bg-white/5"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-white/50">
              <DollarSign size={48} />
              <p className="mt-4">Select a service to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddOnManagement;
