
import React, { useState } from 'react';
import { Search, Filter, ArrowUp, ArrowDown, MoreHorizontal, Clock, AlignLeft, Image } from 'lucide-react';

type Editor = {
  id: string;
  name: string;
  avatar: string;
  currentLoad: number;
  maxCapacity: number;
  timezone: string;
  specialties: string[];
  performance: {
    avgTimePerPhoto: string;
    qualityScore: number;
    completedOrders: number;
  };
  availability: 'available' | 'limited' | 'unavailable';
};

type UnassignedOrder = {
  id: string;
  client: string;
  photoCount: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  specialRequests: boolean;
};

// Mock data
const mockEditors: Editor[] = [
  {
    id: 'E001',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    currentLoad: 8,
    maxCapacity: 15,
    timezone: 'GMT-5 (EST)',
    specialties: ['Real Estate', 'Twilight', 'Aerial'],
    performance: {
      avgTimePerPhoto: '12m',
      qualityScore: 4.8,
      completedOrders: 246
    },
    availability: 'available'
  },
  {
    id: 'E002',
    name: 'Michael Chen',
    avatar: 'MC',
    currentLoad: 12,
    maxCapacity: 15,
    timezone: 'GMT-8 (PST)',
    specialties: ['HDR', 'Virtual Staging', 'Commercial'],
    performance: {
      avgTimePerPhoto: '15m',
      qualityScore: 4.9,
      completedOrders: 189
    },
    availability: 'limited'
  },
  {
    id: 'E003',
    name: 'Emily Rodriguez',
    avatar: 'ER',
    currentLoad: 5,
    maxCapacity: 12,
    timezone: 'GMT-6 (CST)',
    specialties: ['Residential', 'Retouching', 'Interior'],
    performance: {
      avgTimePerPhoto: '10m',
      qualityScore: 4.7,
      completedOrders: 178
    },
    availability: 'available'
  },
  {
    id: 'E004',
    name: 'David Kim',
    avatar: 'DK',
    currentLoad: 15,
    maxCapacity: 15,
    timezone: 'GMT-5 (EST)',
    specialties: ['HDR', 'Exterior', 'Color Correction'],
    performance: {
      avgTimePerPhoto: '14m',
      qualityScore: 4.6,
      completedOrders: 210
    },
    availability: 'unavailable'
  },
  {
    id: 'E005',
    name: 'Lisa Thompson',
    avatar: 'LT',
    currentLoad: 9,
    maxCapacity: 18,
    timezone: 'GMT+1 (CET)',
    specialties: ['Luxury Properties', 'Sky Replacement', 'Twilight'],
    performance: {
      avgTimePerPhoto: '18m',
      qualityScore: 4.9,
      completedOrders: 156
    },
    availability: 'available'
  }
];

const mockUnassignedOrders: UnassignedOrder[] = [
  {
    id: '#10085',
    client: 'James Wilson',
    photoCount: 18,
    dueDate: '2025-04-05',
    priority: 'high',
    specialRequests: true
  },
  {
    id: '#10086',
    client: 'Anna Martinez',
    photoCount: 12,
    dueDate: '2025-04-06',
    priority: 'medium',
    specialRequests: false
  },
  {
    id: '#10087',
    client: 'Robert Johnson',
    photoCount: 24,
    dueDate: '2025-04-04',
    priority: 'high',
    specialRequests: true
  },
  {
    id: '#10088',
    client: 'Sophia Lee',
    photoCount: 8,
    dueDate: '2025-04-07',
    priority: 'low',
    specialRequests: false
  },
  {
    id: '#10089',
    client: 'Thomas Brown',
    photoCount: 15,
    dueDate: '2025-04-05',
    priority: 'medium',
    specialRequests: true
  }
];

const EditorAssignment: React.FC = () => {
  const [filterAvailability, setFilterAvailability] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('workload');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEditor, setSelectedEditor] = useState<Editor | null>(null);
  
  const filteredEditors = mockEditors.filter(editor => {
    const matchesSearch = editor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = filterAvailability === null || editor.availability === filterAvailability;
    return matchesSearch && matchesAvailability;
  });
  
  const sortedEditors = [...filteredEditors].sort((a, b) => {
    if (sortBy === 'workload') {
      return (a.currentLoad / a.maxCapacity) - (b.currentLoad / b.maxCapacity);
    } else if (sortBy === 'quality') {
      return b.performance.qualityScore - a.performance.qualityScore;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Editor Assignment</h2>
        <div className="flex space-x-2">
          <button className="bg-transparent hover:bg-white/5 border border-white/10 px-4 py-2 rounded-lg transition-colors">
            Auto-Assign Queue
          </button>
          <button className="bg-primary hover:bg-primary/90 text-black font-medium px-4 py-2 rounded-lg transition-colors">
            Add New Editor
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editors Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search editors..."
                className="w-full bg-black/30 border border-white/10 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <div className="flex bg-black/30 border border-white/10 rounded-lg overflow-hidden">
                <button 
                  className={`px-3 py-2 ${filterAvailability === null ? 'bg-white/10' : ''}`}
                  onClick={() => setFilterAvailability(null)}
                >
                  All
                </button>
                <button 
                  className={`px-3 py-2 ${filterAvailability === 'available' ? 'bg-white/10' : ''}`}
                  onClick={() => setFilterAvailability('available')}
                >
                  Available
                </button>
                <button 
                  className={`px-3 py-2 ${filterAvailability === 'limited' ? 'bg-white/10' : ''}`}
                  onClick={() => setFilterAvailability('limited')}
                >
                  Limited
                </button>
              </div>
              
              <div className="relative">
                <button className="flex items-center space-x-2 bg-black/30 border border-white/10 rounded-lg px-4 py-2">
                  <Filter className="w-4 h-4" />
                  <span>Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
                </button>
                {/* Sort dropdown would go here */}
              </div>
            </div>
          </div>
          
          {/* Editors grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedEditors.map(editor => (
              <div 
                key={editor.id}
                className={`bg-black/30 border border-white/10 rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${selectedEditor?.id === editor.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedEditor(editor)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">{editor.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{editor.name}</h3>
                      <div className="flex items-center text-sm text-white/50 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{editor.timezone}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {editor.specialties.map((specialty, idx) => (
                          <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    editor.availability === 'available' ? 'bg-green-500/20 text-green-400' :
                    editor.availability === 'limited' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {editor.availability}
                  </span>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white/70">Current Workload</span>
                    <span className="text-sm">{editor.currentLoad}/{editor.maxCapacity}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        (editor.currentLoad / editor.maxCapacity) > 0.8 ? 'bg-red-500' :
                        (editor.currentLoad / editor.maxCapacity) > 0.5 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(editor.currentLoad / editor.maxCapacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between text-sm">
                  <div>
                    <div className="text-white/50">Quality Score</div>
                    <div className="font-medium">{editor.performance.qualityScore}/5.0</div>
                  </div>
                  <div>
                    <div className="text-white/50">Avg Time/Photo</div>
                    <div className="font-medium">{editor.performance.avgTimePerPhoto}</div>
                  </div>
                  <div>
                    <div className="text-white/50">Completed</div>
                    <div className="font-medium">{editor.performance.completedOrders}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Unassigned Orders Column */}
        <div className="space-y-4">
          <div className="bg-black/30 border border-white/10 rounded-lg p-4">
            <h3 className="font-medium mb-3">Unassigned Orders</h3>
            
            <div className="space-y-3">
              {mockUnassignedOrders.map(order => (
                <div key={order.id} className="border border-white/10 rounded-lg p-3 hover:bg-white/5 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{order.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          order.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {order.priority}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mt-1">{order.client}</p>
                    </div>
                    <button className="text-xs bg-primary hover:bg-primary/90 text-black px-2 py-1 rounded">
                      Assign
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <div className="flex items-center space-x-1">
                      <Image className="w-4 h-4 text-white/50" />
                      <span>{order.photoCount} photos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-white/50" />
                      <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {order.specialRequests && (
                    <div className="mt-2 flex items-center text-xs text-white/70">
                      <AlignLeft className="w-3 h-3 mr-1 text-white/50" />
                      <span>Has special requests</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {selectedEditor && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <button className="w-full bg-primary hover:bg-primary/90 text-black font-medium py-2 rounded-lg transition-colors">
                  Assign Selected to {selectedEditor.name}
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-black/30 border border-white/10 rounded-lg p-4">
            <h3 className="font-medium mb-3">Auto-Assignment Settings</h3>
            
            <div className="space-y-3">
              <div>
                <label className="flex items-center justify-between text-sm mb-1">
                  <span>Workload Balancing</span>
                  <span className="text-primary">70%</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="70"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="flex items-center justify-between text-sm mb-1">
                  <span>Quality Priority</span>
                  <span className="text-primary">50%</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="50"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="flex items-center justify-between text-sm mb-1">
                  <span>Specialty Matching</span>
                  <span className="text-primary">80%</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="80"
                  className="w-full"
                />
              </div>
              
              <div className="mt-4">
                <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors">
                  Save Assignment Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorAssignment;
