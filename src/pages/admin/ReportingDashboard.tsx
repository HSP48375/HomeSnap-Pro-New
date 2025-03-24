
import React, { useState } from 'react';
import { BarChart, LineChart, PieChart, Calendar, Download, FileText, Clock, Mail, Filter, Plus, RotateCw } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const ReportingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'generator' | 'scheduled'>('reports');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('monthly');
  
  const savedReports = [
    { id: 1, name: 'Monthly Revenue Report', type: 'Revenue', format: 'PDF', lastRun: '2023-09-01', scheduled: true },
    { id: 2, name: 'Customer Acquisition Metrics', type: 'Users', format: 'CSV', lastRun: '2023-09-05', scheduled: false },
    { id: 3, name: 'Photo Service Performance', type: 'Orders', format: 'PDF', lastRun: '2023-09-10', scheduled: true },
    { id: 4, name: 'Editor Productivity Stats', type: 'Staff', format: 'CSV', lastRun: '2023-09-12', scheduled: true },
    { id: 5, name: 'Regional Sales Breakdown', type: 'Revenue', format: 'PDF', lastRun: '2023-09-15', scheduled: false },
  ];

  const scheduledReports = savedReports.filter(report => report.scheduled);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Reporting Dashboard</h2>
          <div className="flex space-x-2 bg-black/20 rounded-lg p-1">
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'reports' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              Saved Reports
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'generator' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('generator')}
            >
              Report Generator
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'scheduled' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('scheduled')}
            >
              Scheduled Reports
            </button>
          </div>
        </div>

        {activeTab === 'reports' && (
          <div className="bg-black/20 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Saved Reports</h3>
              <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md text-sm flex items-center">
                <Plus className="w-4 h-4 mr-1" />
                New Report
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 font-medium">Report Name</th>
                    <th className="text-left py-3 font-medium">Type</th>
                    <th className="text-left py-3 font-medium">Format</th>
                    <th className="text-left py-3 font-medium">Last Generated</th>
                    <th className="text-left py-3 font-medium">Scheduled</th>
                    <th className="text-left py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedReports.map((report) => (
                    <tr key={report.id} className="border-b border-white/5">
                      <td className="py-3 font-medium">{report.name}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          report.type === 'Revenue' ? 'bg-green-500/20 text-green-400' :
                          report.type === 'Users' ? 'bg-blue-500/20 text-blue-400' :
                          report.type === 'Orders' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="py-3">{report.format}</td>
                      <td className="py-3">{report.lastRun}</td>
                      <td className="py-3">
                        {report.scheduled ? (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Yes</span>
                        ) : (
                          <span className="px-2 py-1 bg-white/10 text-white/70 rounded-full text-xs">No</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button className="p-1 bg-black/30 rounded-md" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 bg-black/30 rounded-md" title="Run Now">
                            <RotateCw className="w-4 h-4" />
                          </button>
                          <button className="p-1 bg-black/30 rounded-md" title="Edit">
                            <FileText className="w-4 h-4" />
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

        {activeTab === 'generator' && (
          <div className="bg-black/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Customizable Report Generator</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Report Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                    placeholder="Enter report name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Report Type</label>
                  <select className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2">
                    <option value="">Select report type</option>
                    <option value="revenue">Revenue</option>
                    <option value="users">User Activity</option>
                    <option value="orders">Order Analytics</option>
                    <option value="staff">Staff Performance</option>
                    <option value="custom">Custom Metrics</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Time Range</label>
                  <div className="flex space-x-2 bg-black/30 border border-white/10 rounded-md p-1">
                    <button 
                      className={`flex-1 px-3 py-1 rounded-md text-sm ${timeRange === 'daily' ? 'bg-white/10' : ''}`}
                      onClick={() => setTimeRange('daily')}
                    >
                      Daily
                    </button>
                    <button 
                      className={`flex-1 px-3 py-1 rounded-md text-sm ${timeRange === 'weekly' ? 'bg-white/10' : ''}`}
                      onClick={() => setTimeRange('weekly')}
                    >
                      Weekly
                    </button>
                    <button 
                      className={`flex-1 px-3 py-1 rounded-md text-sm ${timeRange === 'monthly' ? 'bg-white/10' : ''}`}
                      onClick={() => setTimeRange('monthly')}
                    >
                      Monthly
                    </button>
                    <button 
                      className={`flex-1 px-3 py-1 rounded-md text-sm ${timeRange === 'custom' ? 'bg-white/10' : ''}`}
                      onClick={() => setTimeRange('custom')}
                    >
                      Custom
                    </button>
                  </div>
                </div>
                
                {timeRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input 
                        type="date" 
                        className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1">Key Performance Indicators</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="kpi-revenue" checked className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="kpi-revenue" className="text-sm">Total Revenue</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="kpi-orders" checked className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="kpi-orders" className="text-sm">Order Count</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="kpi-avg" checked className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="kpi-avg" className="text-sm">Average Order Value</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="kpi-users" className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="kpi-users" className="text-sm">New Users</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="kpi-conversion" className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="kpi-conversion" className="text-sm">Conversion Rate</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data Visualizations</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="viz-bar" checked className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="viz-bar" className="text-sm flex items-center">
                        <BarChart className="w-4 h-4 mr-1" /> Bar Chart
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="viz-line" checked className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="viz-line" className="text-sm flex items-center">
                        <LineChart className="w-4 h-4 mr-1" /> Line Chart
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="viz-pie" className="rounded bg-black/30 border-white/30" />
                      <label htmlFor="viz-pie" className="text-sm flex items-center">
                        <PieChart className="w-4 h-4 mr-1" /> Pie Chart
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Filter By</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="filter-region" className="rounded bg-black/30 border-white/30 mr-2" />
                      <label htmlFor="filter-region" className="text-sm mr-2">Region:</label>
                      <select className="flex-1 bg-black/30 border border-white/10 rounded-md px-2 py-1 text-sm">
                        <option value="all">All Regions</option>
                        <option value="northeast">Northeast</option>
                        <option value="midwest">Midwest</option>
                        <option value="south">South</option>
                        <option value="west">West</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="filter-service" className="rounded bg-black/30 border-white/30 mr-2" />
                      <label htmlFor="filter-service" className="text-sm mr-2">Service:</label>
                      <select className="flex-1 bg-black/30 border border-white/10 rounded-md px-2 py-1 text-sm">
                        <option value="all">All Services</option>
                        <option value="photo">Photography</option>
                        <option value="floorplan">Floorplans</option>
                        <option value="editing">Photo Editing</option>
                        <option value="virtual">Virtual Staging</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Export Format</label>
                  <div className="flex space-x-2 bg-black/30 border border-white/10 rounded-md p-1">
                    <button className="flex-1 px-3 py-1 rounded-md text-sm bg-white/10">PDF</button>
                    <button className="flex-1 px-3 py-1 rounded-md text-sm">CSV</button>
                    <button className="flex-1 px-3 py-1 rounded-md text-sm">Excel</button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Schedule Report</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="schedule-report" className="rounded bg-black/30 border-white/30" />
                    <label htmlFor="schedule-report" className="text-sm">Schedule this report to run automatically</label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Frequency</label>
                    <select className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Delivery Method</label>
                    <select className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2">
                      <option value="email">Email</option>
                      <option value="dashboard">Dashboard Only</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-4 py-2 bg-black/30 border border-white/10 text-white rounded-md">
                <Download className="w-4 h-4 inline mr-1" />
                Save Report
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md">
                <RotateCw className="w-4 h-4 inline mr-1" />
                Generate Now
              </button>
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="bg-black/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-6">Scheduled Report Delivery</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 font-medium">Report Name</th>
                    <th className="text-left py-3 font-medium">Frequency</th>
                    <th className="text-left py-3 font-medium">Next Run</th>
                    <th className="text-left py-3 font-medium">Recipients</th>
                    <th className="text-left py-3 font-medium">Format</th>
                    <th className="text-left py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-3">Monthly Revenue Report</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs">Monthly</span>
                    </td>
                    <td className="py-3">2023-10-01</td>
                    <td className="py-3">admin@homesnappro.com</td>
                    <td className="py-3">PDF</td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 bg-black/30 rounded-md" title="Edit Schedule">
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button className="p-1 bg-black/30 rounded-md" title="Edit Recipients">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-1 bg-black/30 rounded-md" title="Run Now">
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">Photo Service Performance</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs">Weekly</span>
                    </td>
                    <td className="py-3">2023-09-25</td>
                    <td className="py-3">team@homesnappro.com</td>
                    <td className="py-3">PDF</td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 bg-black/30 rounded-md" title="Edit Schedule">
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button className="p-1 bg-black/30 rounded-md" title="Edit Recipients">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-1 bg-black/30 rounded-md" title="Run Now">
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">Editor Productivity Stats</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs">Daily</span>
                    </td>
                    <td className="py-3">2023-09-22</td>
                    <td className="py-3">editors@homesnappro.com</td>
                    <td className="py-3">CSV</td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 bg-black/30 rounded-md" title="Edit Schedule">
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button className="p-1 bg-black/30 rounded-md" title="Edit Recipients">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-1 bg-black/30 rounded-md" title="Run Now">
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-8">
              <h4 className="text-md font-medium mb-4">Add New Recipient</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Report</label>
                  <select className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2">
                    <option value="">Select report</option>
                    {scheduledReports.map(report => (
                      <option key={report.id} value={report.id}>{report.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="flex items-end">
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md">
                    Add Recipient
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

export default ReportingDashboard;
