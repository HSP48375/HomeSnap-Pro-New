
import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Mail, Package, DollarSign, Settings, UserPlus, Trash, Edit } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  orderCount: number;
  totalSpent: string;
  lastActive: string;
  customerType: 'standard' | 'premium' | 'enterprise';
};

// Mock data
const mockUsers: User[] = Array.from({ length: 20 }, (_, i) => ({
  id: `U${10000 + i}`,
  name: ['John Smith', 'Emma Wilson', 'Michael Johnson', 'Sarah Brown', 'David Lee', 'Jessica Taylor', 'Daniel Martinez', 'Amanda White', 'Robert Garcia', 'Jennifer Lopez'][Math.floor(Math.random() * 10)],
  email: `user${i}@example.com`,
  phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)] as any,
  joinDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 2) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  orderCount: Math.floor(Math.random() * 50),
  totalSpent: `$${Math.floor(Math.random() * 10000)}`,
  lastActive: ['Today', 'Yesterday', '2 days ago', '1 week ago', '2 weeks ago', '1 month ago'][Math.floor(Math.random() * 6)],
  customerType: ['standard', 'premium', 'enterprise'][Math.floor(Math.random() * 3)] as any,
}));

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === null || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button 
          className="bg-primary hover:bg-primary/90 text-black font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
          onClick={() => setShowAddUserModal(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="w-full bg-black/30 border border-white/10 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <div className="flex bg-black/30 border border-white/10 rounded-lg overflow-hidden">
            <button 
              className={`px-3 py-2 ${statusFilter === null ? 'bg-white/10' : ''}`}
              onClick={() => setStatusFilter(null)}
            >
              All
            </button>
            <button 
              className={`px-3 py-2 ${statusFilter === 'active' ? 'bg-white/10' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active
            </button>
            <button 
              className={`px-3 py-2 ${statusFilter === 'inactive' ? 'bg-white/10' : ''}`}
              onClick={() => setStatusFilter('inactive')}
            >
              Inactive
            </button>
            <button 
              className={`px-3 py-2 ${statusFilter === 'suspended' ? 'bg-white/10' : ''}`}
              onClick={() => setStatusFilter('suspended')}
            >
              Suspended
            </button>
          </div>
          
          <div className="relative">
            <button className="flex items-center space-x-2 bg-black/30 border border-white/10 rounded-lg px-4 py-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            {/* Filter dropdown would go here */}
          </div>
        </div>
      </div>
      
      {/* Users table */}
      <div className="bg-black/30 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-white/70 border-b border-white/10">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Customer Type</th>
                <th className="px-6 py-3 font-medium">Orders</th>
                <th className="px-6 py-3 font-medium">Total Spent</th>
                <th className="px-6 py-3 font-medium">Last Active</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr 
                  key={user.id} 
                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-white/50">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      user.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      user.customerType === 'enterprise' ? 'bg-purple-500/20 text-purple-400' :
                      user.customerType === 'premium' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.customerType.charAt(0).toUpperCase() + user.customerType.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.orderCount}</td>
                  <td className="px-6 py-4 font-medium">{user.totalSpent}</td>
                  <td className="px-6 py-4">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                      <button className="p-1 rounded-full hover:bg-white/10">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded-full hover:bg-white/10">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded-full hover:bg-white/10">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0A0A14] border border-white/10 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-xl font-semibold">User Profile</h3>
              <button onClick={() => setSelectedUser(null)} className="p-1 rounded-full hover:bg-white/10">
                <Trash className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* User profile sidebar */}
                <div className="md:w-1/3 space-y-4">
                  <div className="bg-black/30 border border-white/10 rounded-lg p-6 flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold">{selectedUser.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-medium">{selectedUser.name}</h3>
                    <p className="text-white/70">{selectedUser.email}</p>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        selectedUser.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        selectedUser.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="w-full border-t border-white/10 my-4 pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/50">ID</span>
                        <span>{selectedUser.id}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/50">Phone</span>
                        <span>{selectedUser.phone}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/50">Joined</span>
                        <span>{selectedUser.joinDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/50">Last Active</span>
                        <span>{selectedUser.lastActive}</span>
                      </div>
                    </div>
                    
                    <div className="flex w-full space-x-2 mt-2">
                      <button className="flex-1 flex justify-center items-center bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </button>
                      <button className="flex-1 flex justify-center items-center bg-primary hover:bg-primary/90 text-black py-2 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Account Settings</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Account Status</span>
                        <select className="bg-black/30 border border-white/10 rounded px-2 py-1">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Customer Type</span>
                        <select className="bg-black/30 border border-white/10 rounded px-2 py-1">
                          <option value="standard">Standard</option>
                          <option value="premium">Premium</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Custom Discount</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            className="w-16 bg-black/30 border border-white/10 rounded px-2 py-1"
                            defaultValue="0"
                          />
                          <span>%</span>
                        </div>
                      </div>
                      <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors mt-2">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* User details */}
                <div className="md:w-2/3 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4 flex flex-col items-center">
                      <Package className="w-8 h-8 text-blue-400 mb-2" />
                      <div className="text-2xl font-bold">{selectedUser.orderCount}</div>
                      <div className="text-sm text-white/50">Total Orders</div>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4 flex flex-col items-center">
                      <DollarSign className="w-8 h-8 text-green-400 mb-2" />
                      <div className="text-2xl font-bold">{selectedUser.totalSpent}</div>
                      <div className="text-sm text-white/50">Total Spent</div>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4 flex flex-col items-center">
                      <Settings className="w-8 h-8 text-purple-400 mb-2" />
                      <div className="text-2xl font-bold">{selectedUser.customerType.charAt(0).toUpperCase() + selectedUser.customerType.slice(1)}</div>
                      <div className="text-sm text-white/50">Customer Type</div>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Recent Orders</h4>
                    <div className="space-y-3">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div key={i} className="border border-white/10 rounded-lg p-3 hover:bg-white/5">
                          <div className="flex justify-between">
                            <div className="font-medium">Order #{10000 + i}</div>
                            <div className="text-sm text-white/70">{new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <div className="text-sm text-white/50">{Math.floor(Math.random() * 15) + 5} photos</div>
                            <div className="font-medium">${Math.floor(Math.random() * 500) + 100}</div>
                          </div>
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              ['bg-green-500/20 text-green-400', 'bg-blue-500/20 text-blue-400', 'bg-yellow-500/20 text-yellow-400'][Math.floor(Math.random() * 3)]
                            }`}>
                              {['Completed', 'Processing', 'Pending'][Math.floor(Math.random() * 3)]}
                            </span>
                          </div>
                        </div>
                      ))}
                      <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors mt-2">
                        View All Orders
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Notes & Communication</h4>
                    <div className="space-y-4">
                      <div className="border border-white/10 rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
                            <span className="text-xs font-bold">A</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <div className="font-medium">Admin</div>
                              <div className="text-xs text-white/50">2 days ago</div>
                            </div>
                            <p className="mt-1 text-sm">Customer requested information about premium packages. Sent details via email.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border border-white/10 rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex-shrink-0 flex items-center justify-center">
                            <span className="text-xs font-bold">S</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <div className="font-medium">Support</div>
                              <div className="text-xs text-white/50">1 week ago</div>
                            </div>
                            <p className="mt-1 text-sm">Helped resolve payment issue with Order #10023. Customer was very satisfied with the resolution.</p>
                          </div>
                        </div>
                      </div>
                      
                      <textarea
                        placeholder="Add a note..."
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                      ></textarea>
                      <div className="flex justify-end">
                        <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-black font-medium transition-colors">
                          Add Note
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add user modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0A0A14] border border-white/10 rounded-lg w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-xl font-semibold">Add New User</h3>
              <button onClick={() => setShowAddUserModal(false)} className="p-1 rounded-full hover:bg-white/10">
                <Trash className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Customer Type</label>
                  <select className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-white/70 mb-1">Address</label>
                <input 
                  type="text" 
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter address"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Confirm Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-white/70 mb-1">Initial Notes (Optional)</label>
                <textarea 
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                  placeholder="Add any initial notes about this user..."
                ></textarea>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="sendWelcomeEmail" className="rounded" />
                <label htmlFor="sendWelcomeEmail">Send welcome email with login instructions</label>
              </div>
            </div>
            
            <div className="border-t border-white/10 p-4 flex justify-end space-x-2">
              <button 
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => setShowAddUserModal(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-black transition-colors">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
