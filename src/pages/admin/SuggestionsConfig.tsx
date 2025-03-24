
import React, { useState } from 'react';
import { Settings, Save, BarChart, MessageSquare, Check, X } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const SuggestionsConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'editor' | 'metrics'>('settings');
  
  const suggestionTypes = [
    { 
      id: 'upsell_addons', 
      name: 'Upsell Add-ons', 
      description: 'Suggest premium features based on uploaded images',
      enabled: true,
      triggerType: 'image_quality',
      triggerThreshold: 75,
      conversionRate: 32
    },
    { 
      id: 'editing_tips', 
      name: 'Editing Tips', 
      description: 'Provide editing suggestions for specific property types',
      enabled: true,
      triggerType: 'property_type',
      triggerThreshold: 0,
      conversionRate: 45
    },
    { 
      id: 'package_upgrade', 
      name: 'Package Upgrade', 
      description: 'Suggest upgrading to a higher package based on usage',
      enabled: false,
      triggerType: 'order_count',
      triggerThreshold: 3,
      conversionRate: 18
    },
    { 
      id: 'floorplan_rec', 
      name: 'Floorplan Recommendations', 
      description: 'Suggest adding floorplans for complete property presentation',
      enabled: true,
      triggerType: 'order_type',
      triggerThreshold: 0,
      conversionRate: 28
    },
    { 
      id: 'first_time', 
      name: 'First-Time User Tips', 
      description: 'Onboarding suggestions for new users',
      enabled: true,
      triggerType: 'new_user',
      triggerThreshold: 0,
      conversionRate: 62
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Smart Suggestions Configuration</h2>
          <div className="flex space-x-2 bg-black/20 rounded-lg p-1">
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'settings' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'editor' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              Text Editor
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'metrics' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('metrics')}
            >
              Metrics
            </button>
          </div>
        </div>

        {activeTab === 'settings' && (
          <div className="bg-black/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Suggestion Trigger Conditions</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 font-medium">Suggestion Type</th>
                    <th className="text-left py-3 font-medium">Description</th>
                    <th className="text-left py-3 font-medium">Trigger Type</th>
                    <th className="text-left py-3 font-medium">Threshold</th>
                    <th className="text-left py-3 font-medium">Enabled</th>
                    <th className="text-left py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestionTypes.map((suggestion) => (
                    <tr key={suggestion.id} className="border-b border-white/5">
                      <td className="py-3">{suggestion.name}</td>
                      <td className="py-3 text-sm text-white/70">{suggestion.description}</td>
                      <td className="py-3">
                        <select className="bg-black/30 border border-white/10 rounded-md px-2 py-1 text-sm">
                          <option value="image_quality">Image Quality</option>
                          <option value="property_type">Property Type</option>
                          <option value="order_count">Order Count</option>
                          <option value="order_type">Order Type</option>
                          <option value="new_user">New User</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <input 
                          type="number" 
                          className="w-20 bg-black/30 border border-white/10 rounded-md px-2 py-1 text-sm"
                          value={suggestion.triggerThreshold}
                        />
                      </td>
                      <td className="py-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={suggestion.enabled} />
                          <div className="w-11 h-6 bg-black/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/90 after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500/80"></div>
                        </label>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button className="p-1 bg-black/30 rounded-md" title="Edit Settings">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button className="p-1 bg-black/30 rounded-md" title="Edit Text">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-600 hover:to-blue-600 transition-colors">
                <Save className="w-4 h-4 inline mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="bg-black/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Suggestion Text Editor</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Suggestion Type</label>
                <select className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2">
                  {suggestionTypes.map((suggestion) => (
                    <option key={suggestion.id} value={suggestion.id}>{suggestion.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                  defaultValue="Enhance Your Photos with Professional Editing"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea 
                  className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 font-mono"
                  rows={10}
                  defaultValue={`We noticed your property photos have great potential! 

Our professional editing service can enhance these images with:
- Color correction and white balance
- Sky replacement and enhancement
- Virtual twilight effects
- Object removal and decluttering

Would you like to add professional editing to your order for just $49?`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Button Text</label>
                <input 
                  type="text" 
                  className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                  defaultValue="Add Professional Editing"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="emojis" className="rounded bg-black/30 border-white/30" />
                <label htmlFor="emojis" className="text-sm">Allow emojis in suggestions</label>
              </div>
              
              <div className="border border-white/10 rounded-lg p-4 mt-4">
                <h4 className="text-md font-medium mb-4">Preview</h4>
                <div className="bg-black/40 rounded-lg p-4 max-w-md mx-auto">
                  <h5 className="text-lg font-medium">Enhance Your Photos with Professional Editing</h5>
                  <p className="text-sm mt-2 text-white/80 whitespace-pre-line">We noticed your property photos have great potential! 

Our professional editing service can enhance these images with:
- Color correction and white balance
- Sky replacement and enhancement
- Virtual twilight effects
- Object removal and decluttering

Would you like to add professional editing to your order for just $49?</p>
                  <div className="mt-4 flex space-x-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md text-sm">
                      Add Professional Editing
                    </button>
                    <button className="px-4 py-2 bg-black/20 text-white/70 rounded-md text-sm">
                      No Thanks
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-600 hover:to-blue-600 transition-colors">
                  <Save className="w-4 h-4 inline mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="bg-black/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Suggestion Conversion Metrics</h3>
              <div className="h-64 flex items-center justify-center">
                <BarChart className="w-full h-full text-white/50" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Top Performing Suggestions</h3>
                <ul className="space-y-3">
                  {[...suggestionTypes].sort((a, b) => b.conversionRate - a.conversionRate).map((suggestion) => (
                    <li key={suggestion.id} className="flex justify-between items-center">
                      <span>{suggestion.name}</span>
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs">{suggestion.conversionRate}% conversion</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-black/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Recent Interactions</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">User accepted <span className="font-medium">Floorplan Recommendations</span></p>
                      <p className="text-xs text-white/60">2 minutes ago • Order #45678</p>
                    </div>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">User declined <span className="font-medium">Package Upgrade</span></p>
                      <p className="text-xs text-white/60">15 minutes ago • Order #45677</p>
                    </div>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">User accepted <span className="font-medium">Editing Tips</span></p>
                      <p className="text-xs text-white/60">45 minutes ago • Order #45674</p>
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

export default SuggestionsConfig;
