
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ZoomIn, ZoomOut, Edit, Save, Download, Share, 
  Square, Tag, Palette, Home, Layers, ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

const roomTypes = [
  { id: 'living', name: 'Living Room', color: '#4D7CFF' },
  { id: 'kitchen', name: 'Kitchen', color: '#FF6B6B' },
  { id: 'bedroom', name: 'Bedroom', color: '#65D6AD' },
  { id: 'bathroom', name: 'Bathroom', color: '#9D65EA' },
  { id: 'dining', name: 'Dining Room', color: '#FFC107' },
  { id: 'office', name: 'Office', color: '#607D8B' },
  { id: 'hallway', name: 'Hallway', color: '#795548' },
  { id: 'closet', name: 'Closet', color: '#9E9E9E' },
  { id: 'laundry', name: 'Laundry', color: '#8D6E63' },
  { id: 'garage', name: 'Garage', color: '#546E7A' },
  { id: 'other', name: 'Other', color: '#78909C' }
];

const FloorplanDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const [floorplan, setFloorplan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedType, setSelectedType] = useState(roomTypes[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [totalArea, setTotalArea] = useState(0);

  useEffect(() => {
    fetchFloorplan();
  }, [id]);

  useEffect(() => {
    // Calculate total area
    const area = rooms.reduce((total, room) => {
      return total + (room.width * room.length);
    }, 0);
    setTotalArea(area);
  }, [rooms]);

  const fetchFloorplan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('floorplans')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        toast.error('Floorplan not found');
        navigate('/floorplans');
        return;
      }
      
      setFloorplan(data);
      
      // Fetch room data if available
      const { data: roomsData, error: roomsError } = await supabase
        .from('floorplan_rooms')
        .select('*')
        .eq('floorplan_id', id);
        
      if (roomsError) throw roomsError;
      
      if (roomsData && roomsData.length > 0) {
        setRooms(roomsData);
      }
    } catch (error) {
      console.error('Error fetching floorplan:', error);
      toast.error('Failed to load floorplan details');
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleAddRoom = () => {
    // Add a new room in the center of the viewport
    const containerWidth = containerRef.current?.offsetWidth || 500;
    const containerHeight = containerRef.current?.offsetHeight || 400;
    
    const newRoom = {
      id: Date.now().toString(),
      floorplan_id: id,
      name: 'New Room',
      type: selectedType.id,
      color: selectedType.color,
      x: containerWidth / 2 - 75,
      y: containerHeight / 2 - 75,
      width: 150,
      length: 150,
      is_temp: true
    };
    
    setRooms([...rooms, newRoom]);
    setSelectedRoom(newRoom.id);
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setSelectedType(roomTypes.find(t => t.id === room.type) || roomTypes[0]);
    }
  };

  const handleRoomDragStart = (e, room) => {
    setIsDragging(true);
    setSelectedRoom(room.id);
    
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    setDragStart({
      x: clientX - room.x,
      y: clientY - room.y
    });
  };

  const handleRoomDrag = (e) => {
    if (!isDragging || !selectedRoom) return;
    
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    const updatedRooms = rooms.map(room => {
      if (room.id === selectedRoom) {
        return {
          ...room,
          x: clientX - dragStart.x,
          y: clientY - dragStart.y
        };
      }
      return room;
    });
    
    setRooms(updatedRooms);
  };

  const handleRoomDragEnd = () => {
    setIsDragging(false);
  };

  const handleRoomUpdate = (id, updates) => {
    setRooms(rooms.map(room => {
      if (room.id === id) {
        return { ...room, ...updates };
      }
      return room;
    }));
  };

  const handleSave = async () => {
    try {
      toast.loading('Saving floorplan...');
      
      // Filter out temporary rooms
      const permanentRooms = rooms.filter(room => !room.is_temp);
      const tempRooms = rooms.filter(room => room.is_temp);
      
      // Insert new rooms
      if (tempRooms.length > 0) {
        const { error } = await supabase
          .from('floorplan_rooms')
          .insert(tempRooms.map(room => ({
            floorplan_id: id,
            name: room.name,
            type: room.type,
            color: room.color,
            x: room.x,
            y: room.y,
            width: room.width,
            length: room.length
          })));
        
        if (error) throw error;
      }
      
      // Update existing rooms
      for (const room of permanentRooms) {
        const { error } = await supabase
          .from('floorplan_rooms')
          .update({
            name: room.name,
            type: room.type,
            color: room.color,
            x: room.x,
            y: room.y,
            width: room.width,
            length: room.length
          })
          .eq('id', room.id);
        
        if (error) throw error;
      }
      
      toast.dismiss();
      toast.success('Floorplan saved successfully');
      fetchFloorplan();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving floorplan:', error);
      toast.dismiss();
      toast.error('Failed to save floorplan');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading floorplan details...</p>
        </div>
      </div>
    );
  }

  if (!floorplan) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Floorplan Not Found</h2>
        <p className="text-gray-400 mb-6">The floorplan you're looking for doesn't exist or you don't have permission to view it.</p>
        <button 
          onClick={() => navigate('/floorplans')}
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Back to Floorplans
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/floorplans')}
            className="mr-4 p-2 rounded-full hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">{floorplan.name}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                className="flex items-center px-3 py-1.5 bg-green-500 rounded hover:bg-green-600"
              >
                <Save className="w-4 h-4 mr-1.5" />
                Save
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center px-3 py-1.5 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center px-3 py-1.5 bg-blue-500 rounded hover:bg-blue-600"
              >
                <Edit className="w-4 h-4 mr-1.5" />
                Edit
              </button>
              <button className="p-2 rounded hover:bg-gray-700">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 rounded hover:bg-gray-700">
                <Share className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Floorplan Viewer */}
        <div className="flex-1 relative bg-gray-800 border-r border-gray-700" ref={containerRef}>
          <div 
            className="relative h-full w-full overflow-auto"
            onMouseMove={isDragging ? handleRoomDrag : null}
            onMouseUp={isDragging ? handleRoomDragEnd : null}
            onMouseLeave={isDragging ? handleRoomDragEnd : null}
            onTouchMove={isDragging ? handleRoomDrag : null}
            onTouchEnd={isDragging ? handleRoomDragEnd : null}
          >
            <div className="transform-origin-center" style={{ transform: `scale(${zoom})` }}>
              {floorplan.file_url && (
                <img 
                  src={floorplan.file_url} 
                  alt={floorplan.name} 
                  className="max-w-full"
                  ref={imageRef}
                />
              )}
              
              {/* Room overlays */}
              {rooms.map(room => (
                <div
                  key={room.id}
                  className={`absolute border-2 flex items-center justify-center cursor-move ${selectedRoom === room.id ? 'ring-2 ring-white' : ''}`}
                  style={{
                    left: `${room.x}px`,
                    top: `${room.y}px`,
                    width: `${room.width}px`,
                    height: `${room.length}px`,
                    backgroundColor: `${room.color}40`,
                    borderColor: room.color
                  }}
                  onClick={() => handleRoomSelect(room.id)}
                  onMouseDown={(e) => isEditing && handleRoomDragStart(e, room)}
                  onTouchStart={(e) => isEditing && handleRoomDragStart(e, room)}
                >
                  <div className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded whitespace-nowrap">
                    {room.name}
                    <div className="text-xs">
                      {room.width} x {room.length} sq ft
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-80 rounded p-2 flex flex-col">
              <button 
                onClick={handleZoomIn}
                className="p-2 text-white hover:bg-gray-700 rounded"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button 
                onClick={handleZoomOut}
                className="p-2 text-white hover:bg-gray-700 rounded"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>
            
            {/* Total area */}
            <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 rounded p-2">
              <div className="text-sm font-medium">Total Area</div>
              <div className="text-xl font-bold">{totalArea.toFixed(1)} sq ft</div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        {isEditing && (
          <div className="w-full md:w-80 bg-gray-800 overflow-y-auto p-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Room Tools</h3>
              <button
                onClick={handleAddRoom}
                className="w-full px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" /> Add New Room
              </button>
            </div>
            
            {selectedRoom && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Room Properties</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={rooms.find(r => r.id === selectedRoom)?.name || ''}
                      onChange={(e) => handleRoomUpdate(selectedRoom, { name: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Room Type</label>
                    <select
                      value={rooms.find(r => r.id === selectedRoom)?.type || ''}
                      onChange={(e) => {
                        const type = e.target.value;
                        const roomType = roomTypes.find(rt => rt.id === type);
                        handleRoomUpdate(selectedRoom, { 
                          type,
                          color: roomType?.color
                        });
                        setSelectedType(roomType);
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      {roomTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Width (ft)</label>
                      <input
                        type="number"
                        value={rooms.find(r => r.id === selectedRoom)?.width || 0}
                        onChange={(e) => handleRoomUpdate(selectedRoom, { width: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Length (ft)</label>
                      <input
                        type="number"
                        value={rooms.find(r => r.id === selectedRoom)?.length || 0}
                        onChange={(e) => handleRoomUpdate(selectedRoom, { length: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Room Color</label>
                    <div className="grid grid-cols-6 gap-2">
                      {roomTypes.map(type => (
                        <button
                          key={type.id}
                          className={`w-6 h-6 rounded-full border ${rooms.find(r => r.id === selectedRoom)?.color === type.color ? 'ring-2 ring-white' : 'border-gray-600'}`}
                          style={{ backgroundColor: type.color }}
                          onClick={() => handleRoomUpdate(selectedRoom, { color: type.color })}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    className="w-full px-4 py-2 bg-red-500 rounded hover:bg-red-600 mt-4"
                    onClick={() => {
                      setRooms(rooms.filter(r => r.id !== selectedRoom));
                      setSelectedRoom(null);
                    }}
                  >
                    Delete Room
                  </button>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-medium mb-3">Room List</h3>
              
              {rooms.length > 0 ? (
                <div className="space-y-2">
                  {rooms.map(room => (
                    <div
                      key={room.id}
                      className={`p-2 rounded flex items-center cursor-pointer ${selectedRoom === room.id ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                      onClick={() => handleRoomSelect(room.id)}
                    >
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: room.color }}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{room.name}</div>
                        <div className="text-xs text-gray-400">
                          {room.width} × {room.length} sq ft
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No rooms added yet</p>
                  <p className="text-sm">Click "Add New Room" to get started</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorplanDetailsPage;
