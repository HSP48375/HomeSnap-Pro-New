
import React, { useState } from 'react';
import { Search, Filter, Check, X, MoreHorizontal, Eye, MessageSquare, Edit, Clock, CalendarDays } from 'lucide-react';

type Order = {
  id: string;
  client: string;
  address: string;
  submitDate: string;
  dueDate: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  photoCount: number;
  price: string;
  assignedTo: string | null;
};

// Mock data
const mockOrders: Order[] = Array.from({ length: 20 }, (_, i) => ({
  id: `#${10000 + i}`,
  client: ['John Smith', 'Emma Wilson', 'Michael Johnson', 'Sarah Brown', 'David Lee'][Math.floor(Math.random() * 5)],
  address: ['123 Main St, Anytown, USA', '456 Oak Ave, Somewhere, USA', '789 Pine Blvd, Nowhere, USA', '101 Maple Dr, Elsewhere, USA'][Math.floor(Math.random() * 4)],
  submitDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  dueDate: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  status: ['pending', 'processing', 'completed', 'rejected'][Math.floor(Math.random() * 4)] as any,
  photoCount: Math.floor(Math.random() * 20) + 5,
  price: `$${(Math.floor(Math.random() * 100) + 50) * 5}`,
  assignedTo: Math.random() > 0.3 ? ['Sarah J.', 'Michael C.', 'Emily R.', 'David K.'][Math.floor(Math.random() * 4)] : null,
}));

const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === null || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <button className="bg-primary hover:bg-primary/90 text-black font-medium px-4 py-2 rounded-lg transition-colors">
          New Order
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder="Search by order ID, client, or address..."
            className="w-full bg-black/30 border border-white/10 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <button className="flex items-center space-x-2 bg-black/30 border border-white/10 rounded-lg px-4 py-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            {/* Filter dropdown would go here */}
          </div>
          
          <div className="flex bg-black/30 border border-white/10 rounded-lg overflow-hidden">
            <button 
              className={`px-3 py-2 ${statusFilter === null ? 'bg-white/10' : ''}`}
              onClick={() => setStatusFilter(null)}
            >
              All
            </button>
            <button 
              className={`px-3 py-2 ${statusFilter === 'pending' ? 'bg-white/10' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`px-3 py-2 ${statusFilter === 'processing' ? 'bg-white/10' : ''}`}
              onClick={() => setStatusFilter('processing')}
            >
              Processing
            </button>
            <button 
              className={`px-3 py-2 ${statusFilter === 'completed' ? 'bg-white/10' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      
      {/* Orders table */}
      <div className="bg-black/30 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-white/70 border-b border-white/10">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Submitted</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Photos</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Assigned To</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr 
                  key={order.id} 
                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.client}</td>
                  <td className="px-6 py-4">{order.submitDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.photoCount}</td>
                  <td className="px-6 py-4">{order.price}</td>
                  <td className="px-6 py-4">
                    {order.assignedTo || <span className="text-white/30">Unassigned</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                      <button className="p-1 rounded-full hover:bg-white/10">
                        <Eye className="w-4 h-4" />
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
      
      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0A0A14] border border-white/10 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-xl font-semibold">Order Details {selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-full hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <h4 className="text-sm text-white/50 mb-1">Client</h4>
                  <p className="font-medium">{selectedOrder.client}</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4 col-span-2">
                  <h4 className="text-sm text-white/50 mb-1">Property Address</h4>
                  <p className="font-medium">{selectedOrder.address}</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <h4 className="text-sm text-white/50 mb-1">Submitted</h4>
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2 text-white/70" />
                    <p className="font-medium">{selectedOrder.submitDate}</p>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <h4 className="text-sm text-white/50 mb-1">Due Date</h4>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-white/70" />
                    <p className="font-medium">{selectedOrder.dueDate}</p>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <h4 className="text-sm text-white/50 mb-1">Status</h4>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    selectedOrder.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    selectedOrder.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                    selectedOrder.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {/* Photo gallery */}
              <div>
                <h3 className="text-lg font-medium mb-3">Photos ({selectedOrder.photoCount})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from({ length: selectedOrder.photoCount }, (_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-black/40 border border-white/10 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        <span>Photo {i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Editor assignment */}
              <div>
                <h3 className="text-lg font-medium mb-3">Editor Assignment</h3>
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  {selectedOrder.assignedTo ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                          <span className="text-sm font-bold">{selectedOrder.assignedTo[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium">{selectedOrder.assignedTo}</p>
                          <p className="text-sm text-white/50">Assigned on {selectedOrder.submitDate}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                        Reassign
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-white/50">No editor assigned</p>
                      <button className="px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-black transition-colors">
                        Assign Editor
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Internal notes */}
              <div>
                <h3 className="text-lg font-medium mb-3">Internal Notes</h3>
                <div className="bg-black/30 border border-white/10 rounded-lg p-4 space-y-4">
                  <div className="flex space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs font-bold">A</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">Admin</p>
                        <span className="text-xs text-white/50">2 days ago</span>
                      </div>
                      <p className="mt-1">Client requested extra attention to exterior shots. Make sure to enhance the lawn area.</p>
                    </div>
                  </div>
                  
                  {/* Add note form */}
                  <div className="pt-3 border-t border-white/10">
                    <textarea
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                      placeholder="Add a note..."
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-black font-medium transition-colors">
                        Add Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 p-4 flex justify-between">
              <button className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <div className="space-x-2">
                <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                  <X className="w-4 h-4 inline mr-1" />
                  Reject
                </button>
                <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                  <Check className="w-4 h-4 inline mr-1" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
