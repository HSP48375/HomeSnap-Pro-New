
import React, { useState } from 'react';
import { Copy, Trash2, Calendar, BarChart, PieChart, Filter, RefreshCw, Plus, Check, X } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const DiscountManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coupons' | 'create' | 'analytics'>('coupons');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setGeneratedCode(result);
  };
  
  const coupons = [
    { 
      id: 1, 
      code: 'SUMMER25', 
      type: 'percentage', 
      value: 25, 
      usageLimit: 100, 
      usedCount: 42, 
      expiryDate: '2023-09-30', 
      status: 'active',
      services: ['Photo Editing', 'Virtual Staging']
    },
    { 
      id: 2, 
      code: 'FALL50OFF', 
      type: 'fixed', 
      value: 50, 
      usageLimit: 50, 
      usedCount: 23, 
      expiryDate: '2023-10-15', 
      status: 'active',
      services: ['All Services']
    },
    { 
      id: 3, 
      code: 'WELCOME10', 
      type: 'percentage', 
      value: 10, 
      usageLimit: 0, 
      usedCount: 156, 
      expiryDate: null, 
      status: 'active',
      services: ['All Services']
    },
    { 
      id: 4, 
      code: 'FLASH75', 
      type: 'percentage', 
      value: 75, 
      usageLimit: 20, 
      usedCount: 20, 
      expiryDate: '2023-09-01', 
      status: 'expired',
      services: ['Floorplans']
    },
    { 
      id: 5, 
      code: 'NEWYEAR30', 
      type: 'percentage', 
      value: 30, 
      usageLimit: 200, 
      usedCount: 0, 
      expiryDate: '2024-01-31', 
      status: 'scheduled',
      services: ['Photo Editing', 'Virtual Staging', 'Floorplans']
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Discount & Coupon Manager</h2>
          <div className="flex space-x-2 bg-black/20 rounded-lg p-1">
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'coupons' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              Active Coupons
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'create' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              Create New
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'analytics' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>
        </div>

        {activeTab === 'coupons' && (
          <div className="bg-black/20 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Coupon Codes</h3>
              <div className="flex space-x-2">
                <select className="bg-black/30 border border-white/10 rounded-md px-3 py-1 text-sm">
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                <button className="p-1 bg-black/30 rounded-md">
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button 
                  className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md text-sm flex items-center"
                  onClick={() => setActiveTab('create')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Coupon
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 font-medium">Code</th>
                    <th className="text-left py-3 font-medium">Type</th>
                    <th className="text-left py-3 font-medium">Value</th>
                    <th className="text-left py-3 font-medium">Usage</th>
                    <th className="text-left py-3 font-medium">Expiry Date</th>
                    <th className="text-left py-3 font-medium">Status</th>
                    <th className="text-left py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-white/5">
                      <td className="py-3">
                        <div className="flex items-center space-x-1">
                          <span className="font-mono">{coupon.code}</span>
                          <button className="text-white/50 hover:text-white" title="Copy code">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3">{coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}</td>
                      <td className="py-3">{coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}</td>
                      <td className="py-3">
                        {coupon.usageLimit > 0 ? (
                          <span>
                            {coupon.usedCount}/{coupon.usageLimit}
                            <div className="w-24 h-1 bg-black/50 rounded-full mt-1">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
                                style={{ width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%` }}
                              ></div>
                            </div>
                          </span>
                        ) : (
                          <span>{coupon.usedCount} (Unlimited)</span>
                        )}
                      </td>
                      <td className="py-3">{coupon.expiryDate || 'Never'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          coupon.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          coupon.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button className="p-1 bg-black/30 rounded-md" title="Edit">
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button className="p-1 bg-black/30 rounded-md" title="View Analytics">
                            <BarChart className="w-4 h-4" />
                          </button>
                          <button className="p-1 bg-red-500/20 text-red-400 rounded-md" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-black/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Create New Coupon</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Coupon Code</label>
                  <div className="flex">
                    <input 
                      type="text" 
                      className="flex-1 bg-black/30 border border-white/10 rounded-l-md px-3 py-2 font-mono"
                      placeholder="Enter code or generate one"
                      value={generatedCode || ''}
                      onChange={(e) => setGeneratedCode(e.target.value)}
                    />
                    <button 
                      className="px-3 py-2 bg-black/40 border border-white/10 border-l-0 rounded-r-md"
                      onClick={generateRandomCode}
                    >
                      Generate
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Type</label>
                  <div className="flex space-x-0 bg-black/30 border border-white/10 rounded-md p-1">
                    <button 
                      className={`flex-1 px-3 py-2 rounded-md ${discountType === 'percentage' ? 'bg-white/10' : ''}`}
                      onClick={() => setDiscountType('percentage')}
                    >
                      Percentage (%)
                    </button>
                    <button 
                      className={`flex-1 px-3 py-2 rounded-md ${discountType === 'fixed' ? 'bg-white/10' : ''}`}
                      onClick={() => setDiscountType('fixed')}
                    >
                      Fixed Amount ($)
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full bg-black/30 border border-white/10 rounded-md pl-8 pr-3 py-2"
                      placeholder={discountType === 'percentage' ? "Enter percentage" : "Enter amount"}
                      min="1"
                      max={discountType === 'percentage' ? "100" : undefined}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                      {discountType === 'percentage' ? '%' : '$'}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Usage Limit</label>
                  <input 
                    type="number" 
                    className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                    placeholder="Leave empty for unlimited usage"
                    min="0"
                  />
                  <p className="mt-1 text-xs text-white/50">Set to 0 for unlimited usage</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Expiration</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input 
                        type="date" 
                        className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <input 
                        type="time" 
                        className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                        value="23:59"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-white/50">Leave empty if the code never expires</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Applicable Services</label>
                  <div className="space-y-2 p-3 bg-black/30 border border-white/10 rounded-md">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="all-services" checked className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="all-services" className="text-sm font-medium">All Services</label>
                    </div>
                    <div className="border-t border-white/10 my-2"></div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="photo-editing" className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="photo-editing" className="text-sm">Photo Editing</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="virtual-staging" className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="virtual-staging" className="text-sm">Virtual Staging</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="floorplans" className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="floorplans" className="text-sm">Floorplans</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="twilight" className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="twilight" className="text-sm">Twilight Conversion</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum Order Amount</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full bg-black/30 border border-white/10 rounded-md pl-8 pr-3 py-2"
                      placeholder="Enter minimum amount (optional)"
                      min="0"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                      $
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-white/50">Leave empty if there's no minimum</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Eligibility</label>
                  <select className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2">
                    <option value="all">All Customers</option>
                    <option value="new">New Customers Only</option>
                    <option value="existing">Existing Customers Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description (Internal)</label>
                  <textarea 
                    className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                    placeholder="Add notes about this coupon"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-4 py-2 bg-black/30 border border-white/10 text-white rounded-md">
                Save Draft
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md">
                Create Coupon
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-black/20 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Coupon Usage Analytics</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-white/10 rounded-md text-sm">Last 30 Days</button>
                  <button className="px-3 py-1 bg-white/10 rounded-md text-sm">Last 90 Days</button>
                  <button className="px-3 py-1 bg-white/10 rounded-md text-sm">Year to Date</button>
                  <button className="p-1 bg-black/30 rounded-md">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center">
                <BarChart className="w-full h-full text-white/50" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Top Performing Coupons</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 font-medium">Code</th>
                        <th className="text-left py-2 font-medium">Used</th>
                        <th className="text-left py-2 font-medium">Revenue</th>
                        <th className="text-left py-2 font-medium">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-2 font-mono">SUMMER25</td>
                        <td className="py-2">42</td>
                        <td className="py-2">$4,234.50</td>
                        <td className="py-2">68%</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2 font-mono">WELCOME10</td>
                        <td className="py-2">156</td>
                        <td className="py-2">$12,480.75</td>
                        <td className="py-2">52%</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2 font-mono">FALL50OFF</td>
                        <td className="py-2">23</td>
                        <td className="py-2">$3,680.00</td>
                        <td className="py-2">45%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-black/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Discount Distribution</h3>
                <div className="h-48 flex items-center justify-center">
                  <PieChart className="w-full h-full text-white/50" />
                </div>
              </div>
              
              <div className="bg-black/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Recent Coupon Usage</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">User applied <span className="font-mono font-medium">SUMMER25</span></p>
                      <p className="text-xs text-white/60">2 hours ago • Order #45678 • Saved $49.75</p>
                    </div>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">User attempted invalid code <span className="font-mono font-medium">SPRING30</span></p>
                      <p className="text-xs text-white/60">5 hours ago • Checkout session</p>
                    </div>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">User applied <span className="font-mono font-medium">WELCOME10</span></p>
                      <p className="text-xs text-white/60">12 hours ago • Order #45675 • Saved $19.90</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-black/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Service Discount Impact</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <span>Photo Editing</span>
                    <div className="flex items-center">
                      <div className="w-24 h-1 bg-black/50 rounded-full mr-2">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-3/4"></div>
                      </div>
                      <span className="text-sm">75%</span>
                    </div>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Virtual Staging</span>
                    <div className="flex items-center">
                      <div className="w-24 h-1 bg-black/50 rounded-full mr-2">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-1/2"></div>
                      </div>
                      <span className="text-sm">50%</span>
                    </div>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Floorplans</span>
                    <div className="flex items-center">
                      <div className="w-24 h-1 bg-black/50 rounded-full mr-2">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-1/4"></div>
                      </div>
                      <span className="text-sm">25%</span>
                    </div>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Twilight Conversion</span>
                    <div className="flex items-center">
                      <div className="w-24 h-1 bg-black/50 rounded-full mr-2">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-1/5"></div>
                      </div>
                      <span className="text-sm">20%</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DiscountManager;
