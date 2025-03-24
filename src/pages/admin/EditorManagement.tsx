
import React, { useState } from 'react';
import { User, Shield, DollarSign, BarChart2, MessageCircle, PlusCircle, Search, Edit, Trash, ArrowRight, Mail, Phone } from 'react-feather';

const EditorManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editors' | 'onboarding' | 'performance' | 'communications'>('editors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEditor, setSelectedEditor] = useState<number | null>(null);
  
  // Demo data for editors
  const editors = [
    { 
      id: 1, 
      name: 'Jane Smith', 
      email: 'jane.smith@example.com',
      phone: '+1 (555) 123-4567',
      specialty: 'Real Estate Photography',
      rating: 4.8,
      status: 'Active',
      assignedJobs: 12,
      completedJobs: 245,
      hourlyRate: 25,
      location: 'New York, NY',
      timezoneOffset: -5,
      permissions: ['photo_edit', 'virtual_staging'],
      joinDate: '2023-05-15',
      lastActive: '2025-03-23'
    },
    { 
      id: 2, 
      name: 'Michael Johnson', 
      email: 'michael.j@example.com',
      phone: '+1 (555) 987-6543',
      specialty: 'Virtual Staging',
      rating: 4.9,
      status: 'Active',
      assignedJobs: 8,
      completedJobs: 189,
      hourlyRate: 30,
      location: 'Los Angeles, CA',
      timezoneOffset: -8,
      permissions: ['photo_edit', 'virtual_staging', 'floor_plans'],
      joinDate: '2023-08-10',
      lastActive: '2025-03-22'
    },
    { 
      id: 3, 
      name: 'Emily Davis', 
      email: 'emily.davis@example.com',
      phone: '+1 (555) 456-7890',
      specialty: 'Twilight Conversion',
      rating: 4.7,
      status: 'On Leave',
      assignedJobs: 0,
      completedJobs: 156,
      hourlyRate: 28,
      location: 'Chicago, IL',
      timezoneOffset: -6,
      permissions: ['photo_edit', 'twilight'],
      joinDate: '2024-01-12',
      lastActive: '2025-03-10'
    },
    { 
      id: 4, 
      name: 'David Wilson', 
      email: 'david.w@example.com',
      phone: '+1 (555) 234-5678',
      specialty: 'Floor Plans',
      rating: 4.5,
      status: 'Active',
      assignedJobs: 5,
      completedJobs: 78,
      hourlyRate: 32,
      location: 'Miami, FL',
      timezoneOffset: -5,
      permissions: ['floor_plans', 'virtual_staging'],
      joinDate: '2024-02-01',
      lastActive: '2025-03-23'
    },
  ];
  
  // Mock performance data
  const performanceData = {
    completionTimes: [22, 18, 24, 20, 19, 21, 17, 23],
    qualityScores: [4.8, 4.7, 4.9, 4.8, 4.9, 4.7, 4.8, 4.9],
    clientSatisfaction: [95, 92, 98, 94, 97, 96, 93, 99],
    revisionRates: [0.12, 0.08, 0.05, 0.11, 0.06, 0.09, 0.07, 0.04],
    weeksLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8']
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Editor Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search editors..."
              className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90">
            <PlusCircle size={16} />
            <span>Add Editor</span>
          </button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-white/10">
        <button
          className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'editors' ? 'text-white border-b-2 border-cyan-400' : 'text-white/70'}`}
          onClick={() => setActiveTab('editors')}
        >
          <User size={16} />
          <span>Editors</span>
        </button>
        <button
          className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'onboarding' ? 'text-white border-b-2 border-cyan-400' : 'text-white/70'}`}
          onClick={() => setActiveTab('onboarding')}
        >
          <Shield size={16} />
          <span>Onboarding</span>
        </button>
        <button
          className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'performance' ? 'text-white border-b-2 border-cyan-400' : 'text-white/70'}`}
          onClick={() => setActiveTab('performance')}
        >
          <BarChart2 size={16} />
          <span>Performance</span>
        </button>
        <button
          className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'communications' ? 'text-white border-b-2 border-cyan-400' : 'text-white/70'}`}
          onClick={() => setActiveTab('communications')}
        >
          <MessageCircle size={16} />
          <span>Communications</span>
        </button>
      </div>
      
      {/* Editors Tab */}
      {activeTab === 'editors' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 bg-black/20 rounded-lg p-4 border border-white/10 h-[600px] overflow-y-auto">
            <div className="space-y-3">
              {editors.map((editor) => (
                <div 
                  key={editor.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedEditor === editor.id ? 'bg-white/10 border border-cyan-400/50' : 'bg-black/30 border border-white/5 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedEditor(editor.id)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {editor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{editor.name}</div>
                      <div className="text-sm text-white/70">{editor.specialty}</div>
                    </div>
                    <div className="ml-auto">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        editor.status === 'Active' ? 'bg-green-500/20 text-green-300' : 
                        editor.status === 'On Leave' ? 'bg-yellow-500/20 text-yellow-300' : 
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {editor.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-white/70">
                    <div>
                      <div className="font-medium">Assigned</div>
                      <div>{editor.assignedJobs}</div>
                    </div>
                    <div>
                      <div className="font-medium">Completed</div>
                      <div>{editor.completedJobs}</div>
                    </div>
                    <div>
                      <div className="font-medium">Rating</div>
                      <div className="flex items-center">
                        {editor.rating}
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="col-span-2 bg-black/20 rounded-lg p-6 border border-white/10">
            {selectedEditor ? (
              <div>
                {/* Selected editor details */}
                {editors.filter(e => e.id === selectedEditor).map(editor => (
                  <div key={editor.id}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                          {editor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-bold">{editor.name}</h3>
                          <p className="text-white/70">{editor.specialty}</p>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              editor.status === 'Active' ? 'bg-green-500/20 text-green-300' : 
                              editor.status === 'On Leave' ? 'bg-yellow-500/20 text-yellow-300' : 
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {editor.status}
                            </span>
                            <span className="text-white/50 text-sm ml-2">
                              Member since {editor.joinDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10">
                          <Edit size={18} className="text-white/70" />
                        </button>
                        <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10">
                          <Trash size={18} className="text-white/70" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                        <h4 className="text-sm font-medium text-white/70 mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Mail size={16} className="text-white/50 mr-2" />
                            <span>{editor.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone size={16} className="text-white/50 mr-2" />
                            <span>{editor.phone}</span>
                          </div>
                          <div className="flex items-start">
                            <User size={16} className="text-white/50 mr-2 mt-1" />
                            <div>
                              <div>{editor.location}</div>
                              <div className="text-sm text-white/50">
                                GMT{editor.timezoneOffset >= 0 ? '+' : ''}{editor.timezoneOffset}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                        <h4 className="text-sm font-medium text-white/70 mb-3">Payment Information</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Hourly Rate:</span>
                            <span className="font-medium">${editor.hourlyRate}.00/hr</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Payment Method:</span>
                            <span className="font-medium">Direct Deposit</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Last Payment:</span>
                            <span className="font-medium">Mar 15, 2025</span>
                          </div>
                          <button className="w-full mt-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm">
                            View Payment History
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-black/30 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-cyan-400">{editor.completedJobs}</div>
                        <div className="text-sm text-white/70">Total Jobs Completed</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-purple-400">{editor.rating}</div>
                        <div className="text-sm text-white/70">Average Rating</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4 border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-pink-400">{editor.assignedJobs}</div>
                        <div className="text-sm text-white/70">Assigned Jobs</div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-3">Permissions</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              className="text-cyan-500" 
                              checked={editor.permissions.includes('photo_edit')}
                              readOnly
                            />
                            <span>Photo Editing</span>
                          </label>
                        </div>
                        <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              className="text-cyan-500" 
                              checked={editor.permissions.includes('virtual_staging')}
                              readOnly
                            />
                            <span>Virtual Staging</span>
                          </label>
                        </div>
                        <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              className="text-cyan-500" 
                              checked={editor.permissions.includes('twilight')}
                              readOnly
                            />
                            <span>Twilight Conversion</span>
                          </label>
                        </div>
                        <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              className="text-cyan-500" 
                              checked={editor.permissions.includes('floor_plans')}
                              readOnly
                            />
                            <span>Floor Plans</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium mb-3">Current Assignments</h4>
                      <div className="bg-black/30 rounded-lg border border-white/5 overflow-hidden">
                        <table className="min-w-full divide-y divide-white/10">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Order ID</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Property</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Assigned</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Due Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">ORD-2458</td>
                              <td className="px-4 py-3 whitespace-nowrap">123 Main St, New York</td>
                              <td className="px-4 py-3 whitespace-nowrap">Mar 22, 2025</td>
                              <td className="px-4 py-3 whitespace-nowrap">Mar 24, 2025</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300">In Progress</span>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">ORD-2461</td>
                              <td className="px-4 py-3 whitespace-nowrap">456 Park Ave, New York</td>
                              <td className="px-4 py-3 whitespace-nowrap">Mar 23, 2025</td>
                              <td className="px-4 py-3 whitespace-nowrap">Mar 25, 2025</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300">In Progress</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-white/50">
                <User size={48} />
                <p className="mt-4">Select an editor to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Onboarding Tab */}
      {activeTab === 'onboarding' && (
        <div className="bg-black/20 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-6">Editor Onboarding</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Onboarding form */}
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    placeholder="Enter editor's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    placeholder="City, State"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Timezone</label>
                  <select
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                  >
                    <option value="">Select timezone...</option>
                    <option value="est">Eastern Time (GMT-5)</option>
                    <option value="cst">Central Time (GMT-6)</option>
                    <option value="mst">Mountain Time (GMT-7)</option>
                    <option value="pst">Pacific Time (GMT-8)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Specialties</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-cyan-500" />
                      <span className="text-sm">Photo Editing</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-cyan-500" />
                      <span className="text-sm">Virtual Staging</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-cyan-500" />
                      <span className="text-sm">Twilight Conversion</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-cyan-500" />
                      <span className="text-sm">Floor Plans</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    placeholder="Enter hourly rate"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Portfolio Link (Optional)</label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    placeholder="https://"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Additional Notes</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    placeholder="Any additional information..."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90">
                  Create Editor Account
                </button>
              </div>
            </div>
            
            {/* Onboarding process */}
            <div>
              <h4 className="text-lg font-medium mb-4">Onboarding Process</h4>
              <div className="space-y-6">
                <div className="relative pl-8 pb-8 border-l border-white/10">
                  <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-cyan-400"></div>
                  <div className="mb-1 font-medium">1. Create Account</div>
                  <p className="text-sm text-white/70">Fill out the form with editor's basic information and create their account.</p>
                </div>
                
                <div className="relative pl-8 pb-8 border-l border-white/10">
                  <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-white/20"></div>
                  <div className="mb-1 font-medium">2. Send Invitation</div>
                  <p className="text-sm text-white/70">Invite the editor to complete their profile and set up payment information.</p>
                </div>
                
                <div className="relative pl-8 pb-8 border-l border-white/10">
                  <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-white/20"></div>
                  <div className="mb-1 font-medium">3. Skills Assessment</div>
                  <p className="text-sm text-white/70">Assign test projects to evaluate skills and determine specialties.</p>
                </div>
                
                <div className="relative pl-8 pb-8 border-l border-white/10">
                  <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-white/20"></div>
                  <div className="mb-1 font-medium">4. Training</div>
                  <p className="text-sm text-white/70">Provide platform training and guidelines to ensure quality standards.</p>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-white/20"></div>
                  <div className="mb-1 font-medium">5. First Assignment</div>
                  <p className="text-sm text-white/70">Assign first job with close monitoring and feedback.</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-black/30 rounded-lg border border-white/10">
                <h4 className="font-medium mb-2">Automated Emails</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="text-cyan-500" checked />
                    <span className="text-sm">Welcome Email</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="text-cyan-500" checked />
                    <span className="text-sm">Training Materials</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="text-cyan-500" checked />
                    <span className="text-sm">Platform Access Instructions</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="text-cyan-500" />
                    <span className="text-sm">Introductory Meeting Invitation</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="bg-black/20 rounded-lg p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Performance Metrics</h3>
            <div className="flex space-x-2">
              <select className="px-3 py-1 bg-black/30 border border-white/10 rounded-lg text-sm">
                <option value="all">All Editors</option>
                {editors.map(editor => (
                  <option key={editor.id} value={editor.id}>{editor.name}</option>
                ))}
              </select>
              <select className="px-3 py-1 bg-black/30 border border-white/10 rounded-lg text-sm">
                <option value="8weeks">Last 8 Weeks</option>
                <option value="4weeks">Last 4 Weeks</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Charts would go here - placeholders for now */}
            <div className="bg-black/30 rounded-lg p-4 border border-white/5 h-64">
              <h4 className="text-sm font-medium text-white/70 mb-3">Average Completion Time (hours)</h4>
              <div className="flex items-end h-40 mt-4">
                {performanceData.completionTimes.map((time, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full px-1">
                      <div 
                        className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-sm" 
                        style={{ height: `${(time / 30) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-2">{performanceData.weeksLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4 border border-white/5 h-64">
              <h4 className="text-sm font-medium text-white/70 mb-3">Quality Score (out of 5)</h4>
              <div className="flex items-end h-40 mt-4">
                {performanceData.qualityScores.map((score, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full px-1">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-sm" 
                        style={{ height: `${(score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-2">{performanceData.weeksLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-lg p-4 border border-white/5 h-64">
              <h4 className="text-sm font-medium text-white/70 mb-3">Client Satisfaction (%)</h4>
              <div className="flex items-end h-40 mt-4">
                {performanceData.clientSatisfaction.map((score, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full px-1">
                      <div 
                        className="w-full bg-gradient-to-t from-cyan-400 to-blue-500 rounded-t-sm" 
                        style={{ height: `${score}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-2">{performanceData.weeksLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4 border border-white/5 h-64">
              <h4 className="text-sm font-medium text-white/70 mb-3">Revision Rate (%)</h4>
              <div className="flex items-end h-40 mt-4">
                {performanceData.revisionRates.map((rate, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full px-1">
                      <div 
                        className="w-full bg-gradient-to-t from-yellow-500 to-red-500 rounded-t-sm" 
                        style={{ height: `${rate * 500}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-2">{performanceData.weeksLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-lg font-medium mb-4">Top Performing Editors</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Editor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Jobs Completed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Avg. Completion Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Quality Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Client Satisfaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Revision Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {editors.map((editor) => (
                    <tr key={editor.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {editor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="ml-2">{editor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{editor.completedJobs}</td>
                      <td className="px-6 py-4 whitespace-nowrap">19.2 hrs</td>
                      <td className="px-6 py-4 whitespace-nowrap">{editor.rating} / 5</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-white/10 rounded-full h-2.5 mr-2">
                            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span>85%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">7.5%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Communications Tab */}
      {activeTab === 'communications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 bg-black/20 rounded-lg p-4 border border-white/10 h-[600px] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Editors</h3>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search editors..."
                className="pl-10 pr-4 py-2 w-full bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
            </div>
            <div className="space-y-2">
              {editors.map((editor) => (
                <div 
                  key={editor.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedEditor === editor.id ? 'bg-white/10 border border-cyan-400/50' : 'bg-black/30 border border-white/5 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedEditor(editor.id)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {editor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{editor.name}</div>
                      <div className="text-xs text-white/70">Last active: {editor.lastActive}</div>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-3 h-3 rounded-full ${
                        editor.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                      }`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="col-span-2 bg-black/20 rounded-lg p-4 border border-white/10 flex flex-col h-[600px]">
            {selectedEditor ? (
              <>
                <div className="flex items-center px-4 py-3 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {editors.find(e => e.id === selectedEditor)?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{editors.find(e => e.id === selectedEditor)?.name}</div>
                    <div className="text-xs text-white/70">
                      {editors.find(e => e.id === selectedEditor)?.status === 'Active' ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  <div className="ml-auto flex space-x-2">
                    <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10">
                      <Phone size={16} className="text-white/70" />
                    </button>
                    <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10">
                      <Mail size={16} className="text-white/70" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">Good morning! I wanted to check if you have capacity to take on a new job today?</p>
                      <span className="text-xs text-white/50 mt-1 block">9:15 AM</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-cyan-500/20 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">Hi! Yes, I should be able to handle one more today. What type of job is it?</p>
                      <span className="text-xs text-white/50 mt-1 block">9:18 AM</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">It's a standard photo edit for a 3-bedroom condo. About 15 photos total. The client needs it by tomorrow morning if possible.</p>
                      <span className="text-xs text-white/50 mt-1 block">9:20 AM</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-cyan-500/20 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">That sounds doable. I can get started on it right away and should have it completed by this evening.</p>
                      <span className="text-xs text-white/50 mt-1 block">9:22 AM</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">Perfect! I'll assign it to you now. The order ID is ORD-2458. Please let me know if you have any questions.</p>
                      <span className="text-xs text-white/50 mt-1 block">9:25 AM</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/10 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-grow px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    />
                    <button className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/50">
                <MessageCircle size={48} />
                <p className="mt-4">Select an editor to start a conversation</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorManagement;
