
import React, { useState } from 'react';
import { Clock, Bell, Send, File, List, Search, Calendar, Edit, PlusCircle, Archive } from 'react-feather';

const NotificationManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'scheduled' | 'history' | 'manual'>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  
  // Template editor state
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [templateType, setTemplateType] = useState('email');
  
  // Schedule state
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleRecipients, setScheduleRecipients] = useState('all');
  
  // Demo templates
  const notificationTemplates = [
    { id: 1, title: 'Order Confirmation', type: 'email', content: 'Thank you for your order! Your photos will be processed within 24 hours.' },
    { id: 2, title: 'Order Complete', type: 'push', content: 'Good news! Your photos are ready to view.' },
    { id: 3, title: 'Editor Assignment', type: 'system', content: 'You have been assigned a new order to edit.' },
    { id: 4, title: 'Payment Reminder', type: 'email', content: 'This is a friendly reminder that payment is due for your recent order.' },
    { id: 5, title: 'Weekly Promo', type: 'push', content: 'Special this week: 20% off all virtual staging!' },
  ];
  
  // Demo scheduled notifications
  const scheduledNotifications = [
    { id: 1, template: 'Weekly Promo', date: '2025-04-01', time: '09:00', recipients: 'All Users', status: 'Pending' },
    { id: 2, template: 'Editor Assignment', date: '2025-03-25', time: '15:30', recipients: 'Editors', status: 'Pending' },
    { id: 3, template: 'Payment Reminder', date: '2025-03-24', time: '10:00', recipients: 'User #1245', status: 'Pending' },
  ];
  
  // Demo notification history
  const notificationHistory = [
    { id: 1, template: 'Order Complete', sentDate: '2025-03-20', time: '14:22', recipients: 'User #1242', status: 'Delivered' },
    { id: 2, template: 'Order Confirmation', sentDate: '2025-03-19', time: '09:45', recipients: 'User #1238', status: 'Delivered' },
    { id: 3, template: 'Editor Assignment', sentDate: '2025-03-18', time: '11:13', recipients: 'Editor #12', status: 'Delivered' },
    { id: 4, template: 'Weekly Promo', sentDate: '2025-03-15', time: '08:00', recipients: 'All Users', status: 'Delivered' },
    { id: 5, template: 'Payment Reminder', sentDate: '2025-03-10', time: '10:00', recipients: 'User #1198', status: 'Failed' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notification Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notifications..."
              className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-white/10">
        <button
          className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'templates' ? 'text-white border-b-2 border-cyan-400' : 'text-white/70'}`}
          onClick={() => setActiveTab('templates')}
        >
          <File size={16} />
          <span>Templates</span>
        </button>
        <button
          className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'scheduled' ? 'text-white border-b-2 border-cyan-400' : 'text-white/70'}`}
          onClick={() => setActiveTab('scheduled')}
        >
          <Clock size={16} />
          <span>Scheduled</span>
        </button>
        <button
          className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'manual' ? 'text-white border-b-2 border-cyan-400' : 'text-white/70'}`}
          onClick={() => setActiveTab('manual')}
        >
          <Send size={16} />
          <span>Send Manual</span>
        </button>
        <button
          className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'history' ? 'text-white border-b-2 border-cyan-400' : 'text-white/70'}`}
          onClick={() => setActiveTab('history')}
        >
          <Archive size={16} />
          <span>History</span>
        </button>
      </div>
      
      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 bg-black/20 rounded-lg p-4 border border-white/10 h-[600px] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Notification Templates</h3>
              <button className="flex items-center space-x-1 text-sm text-cyan-400 hover:text-white">
                <PlusCircle size={16} />
                <span>New</span>
              </button>
            </div>
            <div className="space-y-2">
              {notificationTemplates.map((template) => (
                <div 
                  key={template.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id ? 'bg-white/10 border border-cyan-400/50' : 'bg-black/30 border border-white/5 hover:border-white/20'
                  }`}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setTemplateTitle(template.title);
                    setTemplateContent(template.content);
                    setTemplateType(template.type);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{template.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      template.type === 'email' ? 'bg-blue-500/20 text-blue-300' : 
                      template.type === 'push' ? 'bg-purple-500/20 text-purple-300' : 
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {template.type}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mt-2 truncate">{template.content}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="col-span-2 bg-black/20 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Template Editor</h3>
            
            {selectedTemplate ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Template Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    value={templateTitle}
                    onChange={(e) => setTemplateTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Notification Type</label>
                  <select
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                  >
                    <option value="email">Email</option>
                    <option value="push">Push Notification</option>
                    <option value="system">System Message</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Message Content</label>
                  <textarea
                    rows={8}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="pt-4">
                  <label className="block text-sm font-medium text-white/70 mb-2">Available Variables</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-md cursor-pointer hover:bg-white/20">
                      {'{user_name}'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-md cursor-pointer hover:bg-white/20">
                      {'{order_id}'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-md cursor-pointer hover:bg-white/20">
                      {'{property_address}'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-md cursor-pointer hover:bg-white/20">
                      {'{completed_date}'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-md cursor-pointer hover:bg-white/20">
                      {'{editor_name}'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button className="px-4 py-2 bg-transparent border border-white/20 rounded-lg hover:bg-white/5">
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90">
                    Save Template
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-white/50">
                <File size={48} />
                <p className="mt-4">Select a template to edit</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Scheduled Tab */}
      {activeTab === 'scheduled' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 bg-black/20 rounded-lg p-4 border border-white/10 h-[600px] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Scheduled Notifications</h3>
              <button className="flex items-center space-x-1 text-sm text-cyan-400 hover:text-white">
                <PlusCircle size={16} />
                <span>Schedule New</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {scheduledNotifications.map((notification) => (
                <div key={notification.id} className="p-3 rounded-lg bg-black/30 border border-white/5 hover:border-white/20 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{notification.template}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
                      {notification.status}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-white/70">
                    <Calendar size={14} className="mr-2" />
                    {notification.date} at {notification.time}
                  </div>
                  <div className="text-sm text-white/70 mt-1">
                    To: {notification.recipients}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="col-span-2 bg-black/20 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Schedule Notification</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Select Template</label>
                <select
                  className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                >
                  <option value="">Select a template...</option>
                  {notificationTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Recipients</label>
                <select
                  className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                  value={scheduleRecipients}
                  onChange={(e) => setScheduleRecipients(e.target.value)}
                >
                  <option value="all">All Users</option>
                  <option value="editors">All Editors</option>
                  <option value="active_users">Active Users</option>
                  <option value="inactive_users">Inactive Users (30 days)</option>
                  <option value="custom">Custom User List</option>
                </select>
              </div>
              
              {scheduleRecipients === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Custom Recipients</label>
                  <textarea
                    rows={4}
                    placeholder="Enter user IDs or emails, one per line"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                  ></textarea>
                </div>
              )}
              
              <div className="pt-4">
                <label className="block text-sm font-medium text-white/70 mb-2">Repeat Schedule</label>
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="repeat" className="text-cyan-500" />
                    <span className="text-sm">One-time</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="repeat" className="text-cyan-500" />
                    <span className="text-sm">Daily</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="repeat" className="text-cyan-500" />
                    <span className="text-sm">Weekly</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="repeat" className="text-cyan-500" />
                    <span className="text-sm">Monthly</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button className="px-4 py-2 bg-transparent border border-white/20 rounded-lg hover:bg-white/5">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90">
                  Schedule Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Manual Send Tab */}
      {activeTab === 'manual' && (
        <div className="bg-black/20 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Send Manual Notification</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Notification Type</label>
              <select className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30">
                <option value="email">Email</option>
                <option value="push">Push Notification</option>
                <option value="system">System Message</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Recipients</label>
              <select className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30">
                <option value="">Select recipients...</option>
                <option value="all_users">All Users</option>
                <option value="all_editors">All Editors</option>
                <option value="active_users">Active Users (Last 7 days)</option>
                <option value="specific_user">Specific User</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Use Template</label>
              <select className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30">
                <option value="">No template (custom message)</option>
                {notificationTemplates.map(template => (
                  <option key={template.id} value={template.id}>{template.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                placeholder="Enter notification subject..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                placeholder="Enter your message..."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button className="px-4 py-2 bg-transparent border border-white/20 rounded-lg hover:bg-white/5">
                Save as Draft
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90">
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-black/20 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Notification History</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Date Sent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Recipients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {notificationHistory.map((notification) => (
                  <tr key={notification.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{notification.template}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{notification.sentDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{notification.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{notification.recipients}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notification.status === 'Delivered' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {notification.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-cyan-400 hover:text-white">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-white/70">
              Showing 5 of 24 notifications
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-black/30 border border-white/10 rounded-md hover:bg-white/5">
                Previous
              </button>
              <button className="px-3 py-1 bg-white/10 border border-white/10 rounded-md">
                1
              </button>
              <button className="px-3 py-1 bg-black/30 border border-white/10 rounded-md hover:bg-white/5">
                2
              </button>
              <button className="px-3 py-1 bg-black/30 border border-white/10 rounded-md hover:bg-white/5">
                3
              </button>
              <button className="px-3 py-1 bg-black/30 border border-white/10 rounded-md hover:bg-white/5">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManager;
