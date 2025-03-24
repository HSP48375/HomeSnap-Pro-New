
import React, { useState } from 'react';
import { Cube, Users, CheckCircle, MessageSquare, Edit, RotateCw, Search, ArrowUpDown, Ruler } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const FloorplanManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'review' | 'assignments' | 'feedback'>('review');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const floorplans = [
    { 
      id: 'FP-12345', 
      address: '123 Main St, Austin, TX', 
      clientName: 'John Doe',
      submittedDate: '2023-09-15', 
      status: 'pending_review',
      specialist: null,
      sqFt: 2150,
      scanQuality: 'high'
    },
    { 
      id: 'FP-12346', 
      address: '456 Oak Ave, Dallas, TX', 
      clientName: 'Sarah Williams',
      submittedDate: '2023-09-14', 
      status: 'in_progress',
      specialist: 'Michael Chen',
      sqFt: 1850,
      scanQuality: 'medium'
    },
    { 
      id: 'FP-12347', 
      address: '789 Pine Blvd, Houston, TX', 
      clientName: 'Robert Johnson',
      submittedDate: '2023-09-13', 
      status: 'needs_revision',
      specialist: 'Jessica Wong',
      sqFt: 3200,
      scanQuality: 'low'
    },
    { 
      id: 'FP-12348', 
      address: '321 Elm St, San Antonio, TX', 
      clientName: 'Emily Davis',
      submittedDate: '2023-09-12', 
      status: 'completed',
      specialist: 'David Martinez',
      sqFt: 1750,
      scanQuality: 'high'
    },
    { 
      id: 'FP-12349', 
      address: '654 Maple Dr, Fort Worth, TX', 
      clientName: 'Michael Wilson',
      submittedDate: '2023-09-11', 
      status: 'approved',
      specialist: 'Lisa Johnson',
      sqFt: 2450,
      scanQuality: 'medium'
    },
  ];

  const specialists = [
    { id: 1, name: 'Michael Chen', available: true, expertise: 'Commercial', completedJobs: 145 },
    { id: 2, name: 'Jessica Wong', available: true, expertise: 'Residential', completedJobs: 287 },
    { id: 3, name: 'David Martinez', available: false, expertise: 'Mixed Use', completedJobs: 203 },
    { id: 4, name: 'Lisa Johnson', available: true, expertise: 'Luxury', completedJobs: 178 },
    { id: 5, name: 'Alex Thompson', available: true, expertise: 'Multi-Family', completedJobs: 98 },
  ];
  
  const filteredFloorplans = filterStatus === 'all' 
    ? floorplans 
    : floorplans.filter(f => f.status === filterStatus);

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending_review': return { label: 'Pending Review', color: 'bg-yellow-500/20 text-yellow-400' };
      case 'in_progress': return { label: 'In Progress', color: 'bg-blue-500/20 text-blue-400' };
      case 'needs_revision': return { label: 'Needs Revision', color: 'bg-orange-500/20 text-orange-400' };
      case 'completed': return { label: 'Completed', color: 'bg-green-500/20 text-green-400' };
      case 'approved': return { label: 'Approved', color: 'bg-purple-500/20 text-purple-400' };
      default: return { label: status, color: 'bg-white/10 text-white' };
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Floorplan Manager</h2>
          <div className="flex space-x-2 bg-black/20 rounded-lg p-1">
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'review' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('review')}
            >
              LiDAR Scan Review
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'assignments' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              Specialist Assignments
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'feedback' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              Client Feedback
            </button>
          </div>
        </div>

        {activeTab === 'review' && (
          <div className="bg-black/20 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">LiDAR Scan Review</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input 
                    type="text" 
                    className="bg-black/30 border border-white/10 rounded-md pl-9 pr-3 py-1 text-sm"
                    placeholder="Search floorplans..."
                  />
                </div>
                <select 
                  className="bg-black/30 border border-white/10 rounded-md px-3 py-1 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="in_progress">In Progress</option>
                  <option value="needs_revision">Needs Revision</option>
                  <option value="completed">Completed</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 font-medium">ID</th>
                    <th className="text-left py-3 font-medium">Property</th>
                    <th className="text-left py-3 font-medium">Client</th>
                    <th className="text-left py-3 font-medium">Sq. Ft.</th>
                    <th className="text-left py-3 font-medium">Submitted</th>
                    <th className="text-left py-3 font-medium">Specialist</th>
                    <th className="text-left py-3 font-medium">Status</th>
                    <th className="text-left py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFloorplans.map((floorplan) => (
                    <tr key={floorplan.id} className="border-b border-white/5">
                      <td className="py-3">{floorplan.id}</td>
                      <td className="py-3">{floorplan.address}</td>
                      <td className="py-3">{floorplan.clientName}</td>
                      <td className="py-3">{floorplan.sqFt}</td>
                      <td className="py-3">{floorplan.submittedDate}</td>
                      <td className="py-3">
                        {floorplan.specialist ? (
                          floorplan.specialist
                        ) : (
                          <span className="text-sm text-white/50">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusLabel(floorplan.status).color}`}>
                          {getStatusLabel(floorplan.status).label}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button className="p-1 bg-black/30 rounded-md" title="View Scan">
                            <Cube className="w-4 h-4" />
                          </button>
                          <button className="p-1 bg-black/30 rounded-md" title="Assign Specialist">
                            <Users className="w-4 h-4" />
                          </button>
                          {floorplan.status === 'completed' && (
                            <button className="p-1 bg-black/30 rounded-md" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {floorplan.status === 'in_progress' && (
                            <button className="p-1 bg-black/30 rounded-md" title="Request Revision">
                              <RotateCw className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-1 bg-black/30 rounded-md" title="Adjust Measurements">
                            <Ruler className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Scan Preview Modal */}
            <div className="hidden fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-black/90 border border-white/10 rounded-lg w-3/4 h-3/4 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">LiDAR Scan Preview - FP-12345</h3>
                  <button className="p-1 bg-white/10 rounded-full">×</button>
                </div>
                <div className="h-5/6 bg-black/50 border border-white/10 rounded-lg flex items-center justify-center">
                  <Cube className="w-32 h-32 text-white/20" />
                  <p className="absolute text-white/50">3D Floorplan Preview</p>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <button className="px-4 py-2 bg-white/10 text-white rounded-md">Adjust Measurements</button>
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md">
                    Approve Scan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 bg-black/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Available Specialists</h3>
              
              <div className="space-y-4">
                {specialists.map((specialist) => (
                  <div 
                    key={specialist.id} 
                    className={`p-4 border ${specialist.available ? 'border-white/10' : 'border-white/5 opacity-60'} rounded-lg`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{specialist.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${specialist.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {specialist.available ? 'Available' : 'Busy'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                      <p>Expertise: {specialist.expertise}</p>
                      <p>Completed Jobs: {specialist.completedJobs}</p>
                    </div>
                    {specialist.available && (
                      <button className="mt-3 w-full px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-sm">
                        Assign Job
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-span-2 bg-black/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Assignment Management</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 font-medium">ID</th>
                      <th className="text-left py-3 font-medium">Property</th>
                      <th className="text-left py-3 font-medium">
                        <div className="flex items-center">
                          Sq. Ft. <ArrowUpDown className="ml-1 w-3 h-3" />
                        </div>
                      </th>
                      <th className="text-left py-3 font-medium">Scan Quality</th>
                      <th className="text-left py-3 font-medium">Current Specialist</th>
                      <th className="text-left py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {floorplans.map((floorplan) => (
                      <tr key={floorplan.id} className="border-b border-white/5">
                        <td className="py-3">{floorplan.id}</td>
                        <td className="py-3">{floorplan.address}</td>
                        <td className="py-3">{floorplan.sqFt}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            floorplan.scanQuality === 'high' ? 'bg-green-500/20 text-green-400' :
                            floorplan.scanQuality === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {floorplan.scanQuality.charAt(0).toUpperCase() + floorplan.scanQuality.slice(1)}
                          </span>
                        </td>
                        <td className="py-3">
                          {floorplan.specialist ? (
                            <div className="flex items-center space-x-1">
                              <span>{floorplan.specialist}</span>
                              <button className="p-1 text-white/50 hover:text-white/80">
                                <Edit className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <select className="bg-black/30 border border-white/10 rounded-md px-2 py-1 text-sm">
                              <option value="">Select specialist</option>
                              {specialists.filter(s => s.available).map(specialist => (
                                <option key={specialist.id} value={specialist.id}>{specialist.name}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="py-3">
                          {!floorplan.specialist && (
                            <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md text-sm">
                              Assign
                            </button>
                          )}
                          {floorplan.specialist && floorplan.status !== 'approved' && (
                            <button className="px-3 py-1 bg-white/10 text-white rounded-md text-sm">
                              Reassign
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="bg-black/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Client Feedback Management</h3>
            
            <div className="space-y-6">
              <div className="p-4 border border-white/10 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">FP-12347 - 789 Pine Blvd, Houston, TX</h4>
                    <p className="text-sm text-white/70">Client: Robert Johnson • Submitted: 2023-09-13</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-orange-500/20 text-orange-400">
                    Needs Revision
                  </span>
                </div>
                
                <div className="mt-4 p-3 bg-black/40 rounded-lg">
                  <p className="text-sm italic text-white/80">"The measurements in the living room seem off by about 2 feet. Also, the kitchen island is missing from the plan. Please fix these issues and resubmit."</p>
                  <p className="text-xs text-white/50 mt-1">Received: 2023-09-16 10:32 AM</p>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Forward to Specialist</label>
                    <select className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-sm">
                      <option value="">Select specialist</option>
                      {specialists.map(specialist => (
                        <option key={specialist.id} value={specialist.id}>{specialist.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-sm">
                      <option value="high">High</option>
                      <option value="medium" selected>Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Response to Client</label>
                    <textarea 
                      className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-sm"
                      rows={3}
                      placeholder="Enter response to client..."
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="px-3 py-1 bg-white/10 text-white rounded-md text-sm">
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    Send Response
                  </button>
                  <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md text-sm">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Mark Resolved
                  </button>
                </div>
              </div>
              
              <div className="p-4 border border-white/10 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">FP-12345 - 123 Main St, Austin, TX</h4>
                    <p className="text-sm text-white/70">Client: John Doe • Submitted: 2023-09-15</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
                    Pending Review
                  </span>
                </div>
                
                <div className="mt-4 p-3 bg-black/40 rounded-lg">
                  <p className="text-sm italic text-white/80">"Can we add labels to each room in the floorplan? Also, is it possible to include measurements for the windows and doors?"</p>
                  <p className="text-xs text-white/50 mt-1">Received: 2023-09-16 09:15 AM</p>
                </div>
                
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="px-3 py-1 bg-white/10 text-white rounded-md text-sm">
                    Respond
                  </button>
                  <button className="px-3 py-1 bg-white/10 text-white rounded-md text-sm">
                    Assign Specialist
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FloorplanManager;
