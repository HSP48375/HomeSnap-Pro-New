
import React, { useState } from 'react';
import { Search, Filter, Check, X, ArrowLeft, ArrowRight, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

type QCItem = {
  id: string;
  editor: string;
  client: string;
  dateSubmitted: string;
  photoCount: number;
  orderType: 'standard' | 'premium' | 'luxury';
  status: 'pending_review' | 'approved' | 'rejected';
};

// Mock data
const mockQCItems: QCItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: `#${20000 + i}`,
  editor: ['Sarah J.', 'Michael C.', 'Emily R.', 'David K.', 'Lisa T.'][Math.floor(Math.random() * 5)],
  client: ['John Smith', 'Emma Wilson', 'Michael Johnson', 'Sarah Brown', 'David Lee'][Math.floor(Math.random() * 5)],
  dateSubmitted: new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  photoCount: Math.floor(Math.random() * 20) + 5,
  orderType: ['standard', 'premium', 'luxury'][Math.floor(Math.random() * 3)] as any,
  status: ['pending_review', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as any,
}));

const QualityControl: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<QCItem | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'before' | 'after'>('split');
  
  const filteredItems = mockQCItems.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.editor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === null || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quality Control</h2>
        <div className="flex space-x-2">
          <button className="bg-primary hover:bg-primary/90 text-black font-medium px-4 py-2 rounded-lg transition-colors">
            Batch Review
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder="Search by ID, client, or editor..."
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
              className={`px-3 py-2 ${statusFilter === 'pending_review' ? 'bg-white/10' : ''}`}
              onClick={() => setStatusFilter('pending_review')}
            >
              Pending
            </button>
            <button 
              className={`px-3 py-2 ${statusFilter === 'approved' ? 'bg-white/10' : ''}`}
              onClick={() => setStatusFilter('approved')}
            >
              Approved
            </button>
            <button 
              className={`px-3 py-2 ${statusFilter === 'rejected' ? 'bg-white/10' : ''}`}
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected
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
      
      {/* QC Items table */}
      <div className="bg-black/30 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-white/70 border-b border-white/10">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Editor</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Submitted</th>
                <th className="px-6 py-3 font-medium">Photos</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr 
                  key={item.id} 
                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <td className="px-6 py-4 font-medium">{item.id}</td>
                  <td className="px-6 py-4">{item.editor}</td>
                  <td className="px-6 py-4">{item.client}</td>
                  <td className="px-6 py-4">{item.dateSubmitted}</td>
                  <td className="px-6 py-4">{item.photoCount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      item.orderType === 'luxury' ? 'bg-purple-500/20 text-purple-400' :
                      item.orderType === 'premium' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.orderType.charAt(0).toUpperCase() + item.orderType.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      item.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {item.status === 'pending_review' ? 'Pending Review' : 
                        item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                      <button className="p-1 rounded-full hover:bg-white/10">
                        <Check className="w-4 h-4 text-green-400" />
                      </button>
                      <button className="p-1 rounded-full hover:bg-white/10">
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* QC review modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0A0A14] border border-white/10 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <div className="flex items-center space-x-4">
                <button onClick={() => setSelectedItem(null)} className="p-1 rounded-full hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-semibold">Quality Review: {selectedItem.id}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  selectedItem.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  selectedItem.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {selectedItem.status === 'pending_review' ? 'Pending Review' : 
                    selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 rounded-lg ${viewMode === 'split' ? 'bg-white/20' : 'bg-white/5'}`}
                  onClick={() => setViewMode('split')}
                >
                  Split View
                </button>
                <button 
                  className={`px-3 py-1 rounded-lg ${viewMode === 'before' ? 'bg-white/20' : 'bg-white/5'}`}
                  onClick={() => setViewMode('before')}
                >
                  Before
                </button>
                <button 
                  className={`px-3 py-1 rounded-lg ${viewMode === 'after' ? 'bg-white/20' : 'bg-white/5'}`}
                  onClick={() => setViewMode('after')}
                >
                  After
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
              {/* Main image area */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex-1 bg-black/40 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                  {viewMode === 'split' ? (
                    <div className="flex w-full h-full">
                      <div className="w-1/2 h-full flex items-center justify-center border-r border-white/20">
                        <div className="text-white/50">Before Image {currentPhotoIndex + 1}</div>
                      </div>
                      <div className="w-1/2 h-full flex items-center justify-center">
                        <div className="text-white/50">After Image {currentPhotoIndex + 1}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-white/50">
                      {viewMode === 'before' ? 'Before' : 'After'} Image {currentPhotoIndex + 1}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <button 
                    className="bg-black/30 border border-white/10 rounded-lg p-2 hover:bg-white/10 disabled:opacity-50"
                    disabled={currentPhotoIndex === 0}
                    onClick={() => setCurrentPhotoIndex(prev => Math.max(0, prev - 1))}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="text-sm">
                    Photo {currentPhotoIndex + 1} of {selectedItem.photoCount}
                  </div>
                  
                  <button 
                    className="bg-black/30 border border-white/10 rounded-lg p-2 hover:bg-white/10 disabled:opacity-50"
                    disabled={currentPhotoIndex === selectedItem.photoCount - 1}
                    onClick={() => setCurrentPhotoIndex(prev => Math.min(selectedItem.photoCount - 1, prev + 1))}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex justify-between mt-6">
                  <div>
                    <h4 className="text-sm text-white/50 mb-1">Order Info</h4>
                    <p>Client: <span className="font-medium">{selectedItem.client}</span></p>
                    <p>Editor: <span className="font-medium">{selectedItem.editor}</span></p>
                    <p>Type: <span className="font-medium">{selectedItem.orderType}</span></p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="bg-black/30 border border-white/10 rounded-full p-2 hover:bg-white/10">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button className="bg-black/30 border border-white/10 rounded-full p-2 hover:bg-white/10">
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <button className="bg-black/30 border border-white/10 rounded-full p-2 hover:bg-white/10">
                      <ThumbsDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 p-4 flex flex-col">
                <h3 className="font-medium mb-3">Photo Thumbnails</h3>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: selectedItem.photoCount }, (_, i) => (
                    <div 
                      key={i} 
                      className={`aspect-square bg-black/40 border rounded-lg overflow-hidden cursor-pointer ${
                        currentPhotoIndex === i ? 'border-primary' : 'border-white/10'
                      }`}
                      onClick={() => setCurrentPhotoIndex(i)}
                    >
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Quality Assessment</h3>
                  
                  <div className="space-y-3">
                    {['Composition', 'Color Balance', 'Exposure', 'Detail', 'Overall'].map((criterion, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{criterion}</span>
                          <span className="text-primary">4/5</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${80}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Rejection Reason</h3>
                    <textarea
                      placeholder="Provide feedback if rejecting..."
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 p-4 flex justify-between">
              <button 
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => setSelectedItem(null)}
              >
                Cancel
              </button>
              <div className="space-x-2">
                <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                  <X className="w-4 h-4 inline mr-1" />
                  Reject
                </button>
                <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-black transition-colors">
                  <Check className="w-4 h-4 inline mr-1 text-black" />
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

export default QualityControl;
