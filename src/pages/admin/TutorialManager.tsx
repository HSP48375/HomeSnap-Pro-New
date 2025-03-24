
import React, { useState } from 'react';
import { Upload, Trash2, Eye, EyeOff, Edit, BarChart, Tag, Filter } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const TutorialManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tutorials' | 'upload' | 'analytics'>('tutorials');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const tutorials = [
    { id: 1, title: 'Getting Started with HomeSnap Pro', category: 'Basics', duration: '5:32', views: 1243, visible: true },
    { id: 2, title: 'Advanced Photo Composition', category: 'Photography', duration: '12:15', views: 876, visible: true },
    { id: 3, title: 'Editing Tips for Real Estate Photos', category: 'Editing', duration: '8:45', views: 967, visible: true },
    { id: 4, title: 'Creating Floor Plans', category: 'Floor Plans', duration: '15:20', views: 532, visible: false },
    { id: 5, title: 'Lighting Techniques', category: 'Photography', duration: '10:05', views: 789, visible: true },
  ];

  const categories = ['Basics', 'Photography', 'Editing', 'Floor Plans', 'Business', 'Marketing'];
  
  const filteredTutorials = filterCategory === 'all' 
    ? tutorials 
    : tutorials.filter(t => t.category === filterCategory);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tutorial Manager</h2>
          <div className="flex space-x-2 bg-black/20 rounded-lg p-1">
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'tutorials' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('tutorials')}
            >
              Tutorials
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'upload' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTab === 'analytics' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>
        </div>

        {activeTab === 'tutorials' && (
          <div className="bg-black/20 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Tutorial Library</h3>
              <div className="flex space-x-2">
                <select 
                  className="bg-black/30 border border-white/10 rounded-md px-3 py-1 text-sm"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 font-medium">Title</th>
                    <th className="text-left py-3 font-medium">Category</th>
                    <th className="text-left py-3 font-medium">Duration</th>
                    <th className="text-left py-3 font-medium">Views</th>
                    <th className="text-left py-3 font-medium">Visibility</th>
                    <th className="text-left py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTutorials.map((tutorial) => (
                    <tr key={tutorial.id} className="border-b border-white/5">
                      <td className="py-3">{tutorial.title}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                          {tutorial.category}
                        </span>
                      </td>
                      <td className="py-3">{tutorial.duration}</td>
                      <td className="py-3">{tutorial.views}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tutorial.visible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tutorial.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button className="p-1 bg-black/30 rounded-md" title="Preview">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 bg-black/30 rounded-md" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 bg-black/30 rounded-md" title="Toggle Visibility">
                            {tutorial.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

        {activeTab === 'upload' && (
          <div className="bg-black/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Upload New Tutorial</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                  placeholder="Enter tutorial title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2">
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
                  placeholder="Enter tutorial description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Video File</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-10 text-center">
                  <Upload className="mx-auto h-12 w-12 text-white/50" />
                  <p className="mt-2 text-sm text-white/70">Drag and drop a video file here, or click to browse</p>
                  <p className="mt-1 text-xs text-white/50">MP4, MOV, or WEBM (max 500MB)</p>
                  <button className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors">
                    Select File
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Thumbnail Image</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-white/50" />
                  <p className="mt-1 text-xs text-white/50">JPEG, PNG (16:9 ratio recommended)</p>
                  <button className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-sm">
                    Select Thumbnail
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="visibility" className="rounded bg-black/30 border-white/30" />
                <label htmlFor="visibility" className="text-sm">Make tutorial visible immediately</label>
              </div>
              
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-600 hover:to-blue-600 transition-colors">
                  Upload Tutorial
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-black/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Tutorial View Analytics</h3>
              <div className="h-64 flex items-center justify-center">
                <BarChart className="w-full h-full text-white/50" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Most Viewed Tutorials</h3>
                <ul className="space-y-3">
                  {[...tutorials].sort((a, b) => b.views - a.views).slice(0, 5).map((tutorial) => (
                    <li key={tutorial.id} className="flex justify-between items-center">
                      <span className="truncate">{tutorial.title}</span>
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs">{tutorial.views} views</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-black/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Category Distribution</h3>
                <div className="h-48 flex items-center justify-center">
                  <BarChart className="w-full h-full text-white/50" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TutorialManager;
