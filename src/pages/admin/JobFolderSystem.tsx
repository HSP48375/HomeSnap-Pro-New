
import React, { useState } from 'react';
import { Folder, File, Upload, Download, Eye, MessageSquare, Clock, Search, PlusCircle, ChevronRight, ChevronDown, MoreHorizontal, Tag } from 'react-feather';

const JobFolderSystem: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>('ORD-2458');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'ORD-2458': true,
    'ORD-2445': false,
    'ORD-2432': false,
    'ORD-2425': false,
  });
  
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number>(1);
  
  const toggleFolder = (folderId: string) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderId]: !expandedFolders[folderId]
    });
  };
  
  // Mock job data
  const jobs = [
    {
      id: 'ORD-2458',
      address: '123 Main St, New York',
      date: '2025-03-22',
      status: 'In Progress',
      client: 'John Smith',
      editor: 'Jane Smith',
      folders: [
        {
          name: 'Original Photos',
          type: 'folder',
          files: [
            { name: 'front_exterior.jpg', type: 'image', versions: 1, size: '4.2 MB', uploadDate: '2025-03-22' },
            { name: 'kitchen.jpg', type: 'image', versions: 1, size: '3.8 MB', uploadDate: '2025-03-22' },
            { name: 'living_room.jpg', type: 'image', versions: 1, size: '5.1 MB', uploadDate: '2025-03-22' },
            { name: 'master_bedroom.jpg', type: 'image', versions: 1, size: '4.7 MB', uploadDate: '2025-03-22' },
            { name: 'bathroom.jpg', type: 'image', versions: 1, size: '3.2 MB', uploadDate: '2025-03-22' }
          ]
        },
        {
          name: 'Edited Photos',
          type: 'folder',
          files: [
            { name: 'front_exterior_edited.jpg', type: 'image', versions: 2, size: '3.9 MB', uploadDate: '2025-03-23' },
            { name: 'kitchen_edited.jpg', type: 'image', versions: 3, size: '3.5 MB', uploadDate: '2025-03-23' },
            { name: 'living_room_edited.jpg', type: 'image', versions: 2, size: '4.8 MB', uploadDate: '2025-03-23' }
          ]
        },
        {
          name: 'Virtual Staging',
          type: 'folder',
          files: [
            { name: 'living_room_staged.jpg', type: 'image', versions: 1, size: '5.3 MB', uploadDate: '2025-03-23' }
          ]
        },
        {
          name: 'Notes',
          type: 'folder',
          files: [
            { name: 'client_instructions.txt', type: 'text', versions: 1, size: '1.2 KB', uploadDate: '2025-03-22' },
            { name: 'editor_notes.txt', type: 'text', versions: 1, size: '0.8 KB', uploadDate: '2025-03-23' }
          ]
        }
      ]
    },
    {
      id: 'ORD-2445',
      address: '456 Park Ave, Chicago',
      date: '2025-03-20',
      status: 'Complete',
      client: 'Sarah Johnson',
      editor: 'Michael Johnson',
      folders: [
        {
          name: 'Original Photos',
          type: 'folder',
          files: []
        },
        {
          name: 'Edited Photos',
          type: 'folder',
          files: []
        }
      ]
    },
    {
      id: 'ORD-2432',
      address: '789 Oak St, Miami',
      date: '2025-03-18',
      status: 'Complete',
      client: 'Robert Davis',
      editor: 'Emily Davis',
      folders: [
        {
          name: 'Original Photos',
          type: 'folder',
          files: []
        },
        {
          name: 'Edited Photos',
          type: 'folder',
          files: []
        }
      ]
    },
    {
      id: 'ORD-2425',
      address: '321 Elm St, Los Angeles',
      date: '2025-03-16',
      status: 'Complete',
      client: 'Jennifer Wilson',
      editor: 'David Wilson',
      folders: [
        {
          name: 'Original Photos',
          type: 'folder',
          files: []
        },
        {
          name: 'Edited Photos',
          type: 'folder',
          files: []
        }
      ]
    }
  ];
  
  // Find selected job
  const selectedJob = jobs.find(job => job.id === selectedFolder);
  
  // Mock comments
  const comments = [
    { id: 1, user: 'John Smith', text: 'Please brighten the kitchen a bit more.', timestamp: '2025-03-22 10:32 AM' },
    { id: 2, user: 'Jane Smith', text: 'I've increased the brightness and adjusted the white balance.', timestamp: '2025-03-22 11:45 AM' },
    { id: 3, user: 'John Smith', text: 'Looks good! Can you also remove the garden hose visible in the exterior shot?', timestamp: '2025-03-22 1:15 PM' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Folder System</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search files and folders..."
              className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90">
            <Upload size={16} />
            <span>Upload</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folder Tree */}
        <div className="col-span-1 bg-black/20 rounded-lg p-4 border border-white/10 h-[700px] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Jobs</h3>
            <div className="flex space-x-1">
              <button className="p-1.5 bg-black/30 hover:bg-black/50 rounded-md">
                <PlusCircle size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
            {jobs.map((job) => (
              <div key={job.id}>
                <div 
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    selectedFolder === job.id ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  onClick={() => {
                    setSelectedFolder(job.id);
                    toggleFolder(job.id);
                  }}
                >
                  <button 
                    className="mr-1 text-white/70 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolder(job.id);
                    }}
                  >
                    {expandedFolders[job.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <Folder 
                    size={16} 
                    className={`mr-2 ${selectedFolder === job.id ? 'text-cyan-400' : 'text-white/70'}`} 
                  />
                  <span className="flex-grow truncate">{job.id}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    job.status === 'Complete' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {job.status}
                  </span>
                </div>
                
                {expandedFolders[job.id] && (
                  <div className="ml-6 mt-1 space-y-1">
                    {job.folders.map((folder, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-white/5`}
                      >
                        <Folder size={16} className="mr-2 text-white/70" />
                        <span>{folder.name}</span>
                        <span className="ml-2 text-xs text-white/50">({folder.files.length})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Content View */}
        <div className="col-span-3 grid grid-rows-2 gap-6 h-[700px]">
          {/* File Browser */}
          <div className="row-span-1 bg-black/20 rounded-lg p-4 border border-white/10 overflow-hidden flex flex-col">
            {selectedJob ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedJob.id}: {selectedJob.address}</h3>
                    <div className="flex items-center text-sm text-white/70">
                      <Clock size={14} className="mr-1" />
                      <span>{selectedJob.date}</span>
                      <span className="mx-2">•</span>
                      <span>Client: {selectedJob.client}</span>
                      <span className="mx-2">•</span>
                      <span>Editor: {selectedJob.editor}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-sm flex items-center">
                      <Eye size={14} className="mr-1.5" />
                      <span>View Order</span>
                    </button>
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-sm flex items-center">
                      <Download size={14} className="mr-1.5" />
                      <span>Download All</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Size</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Versions</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Date Added</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {/* Flatten all files from all folders for this example */}
                      {selectedJob.folders.flatMap(folder => 
                        folder.files.map((file, idx) => (
                          <tr 
                            key={`${folder.name}-${idx}`}
                            className={`hover:bg-white/5 cursor-pointer ${selectedFile === `${folder.name}-${file.name}` ? 'bg-white/10' : ''}`}
                            onClick={() => setSelectedFile(`${folder.name}-${file.name}`)}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <File size={16} className="mr-2 text-white/70" />
                                <span>{file.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap capitalize">
                              {file.type}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {file.size}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {file.versions}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {file.uploadDate}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button className="p-1 hover:bg-white/10 rounded-md">
                                  <Eye size={16} className="text-white/70" />
                                </button>
                                <button className="p-1 hover:bg-white/10 rounded-md">
                                  <Download size={16} className="text-white/70" />
                                </button>
                                <button className="p-1 hover:bg-white/10 rounded-md">
                                  <MoreHorizontal size={16} className="text-white/70" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/50">
                <Folder size={48} />
                <p className="mt-4">Select a job to view files</p>
              </div>
            )}
          </div>
          
          {/* File Preview and Comments */}
          <div className="row-span-1 grid grid-cols-2 gap-6">
            {/* File Preview */}
            <div className="col-span-1 bg-black/20 rounded-lg p-4 border border-white/10 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Preview</h3>
                {selectedFile && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span>Version:</span>
                    <select 
                      className="bg-black/30 border border-white/10 rounded-md px-2 py-1"
                      value={selectedVersion}
                      onChange={(e) => setSelectedVersion(Number(e.target.value))}
                    >
                      <option value="1">v1 (Latest)</option>
                      <option value="2">v2</option>
                      <option value="3">v3</option>
                    </select>
                  </div>
                )}
              </div>
              
              {selectedFile ? (
                <div className="flex-grow flex flex-col items-center justify-center bg-black/40 rounded-lg p-4">
                  {/* Placeholder for image preview */}
                  <div className="w-full h-full flex items-center justify-center">
                    <img 
                      src="/assets/Editing_After.JPEG" 
                      alt="Preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-white/50">
                  <Eye size={32} />
                  <p className="mt-2">Select a file to preview</p>
                </div>
              )}
            </div>
            
            {/* Comments */}
            <div className="col-span-1 bg-black/20 rounded-lg p-4 border border-white/10 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Comments & Notes</h3>
                <div className="flex space-x-1">
                  <button className="p-1.5 bg-black/30 hover:bg-black/50 rounded-md">
                    <Tag size={14} />
                  </button>
                </div>
              </div>
              
              <div className="flex-grow overflow-y-auto space-y-4 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-black/30 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{comment.user}</span>
                      <span className="text-xs text-white/50">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-auto">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-grow px-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                  />
                  <button className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90">
                    <MessageSquare size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFolderSystem;
