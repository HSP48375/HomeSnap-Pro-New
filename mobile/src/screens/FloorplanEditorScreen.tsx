
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  Modal
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Svg, Rect, Text as SvgText } from 'react-native-svg';
import { colors, typography } from '../theme/AppTheme';

// Mock floorplan data
const MOCK_FLOORPLAN = {
  id: 'fp-001',
  name: 'My Home Floorplan',
  createdAt: new Date().toISOString(),
  image: require('../../assets/sample-floorplan.png'), // Make sure to add a sample image
  rooms: [
    { id: 'r1', name: 'Living Room', type: 'living', x: 100, y: 120, width: 200, height: 150, color: '#4D7CFF' },
    { id: 'r2', name: 'Kitchen', type: 'kitchen', x: 300, y: 120, width: 150, height: 150, color: '#FF6B6B' },
    { id: 'r3', name: 'Bedroom', type: 'bedroom', x: 100, y: 270, width: 150, height: 180, color: '#65D6AD' },
    { id: 'r4', name: 'Bathroom', type: 'bathroom', x: 250, y: 270, width: 100, height: 100, color: '#9D65EA' },
  ]
};

// Room type options
const ROOM_TYPES = [
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

const FloorplanEditorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [floorplan, setFloorplan] = useState(MOCK_FLOORPLAN);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // Load floorplan data from route.params if available
    if (route.params?.floorplanId) {
      // In a real app, you would fetch the data from API here
    }
  }, [route.params]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setRoomName(room.name);
    setRoomType(ROOM_TYPES.find(type => type.id === room.type));
  };

  const handleRoomNameChange = (text) => {
    setRoomName(text);
  };

  const handleRoomTypeChange = (type) => {
    setRoomType(type);
    setShowTypeModal(false);
  };

  const handleUpdateRoom = () => {
    if (!selectedRoom) return;

    const updatedRooms = floorplan.rooms.map(room => {
      if (room.id === selectedRoom.id) {
        return {
          ...room,
          name: roomName,
          type: roomType.id,
          color: roomType.color
        };
      }
      return room;
    });

    setFloorplan({
      ...floorplan,
      rooms: updatedRooms
    });
    
    setIsEditing(false);
  };

  const handleAddRoom = () => {
    const newRoom = {
      id: `r${floorplan.rooms.length + 1}`,
      name: 'New Room',
      type: 'other',
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      color: '#78909C'
    };

    setFloorplan({
      ...floorplan,
      rooms: [...floorplan.rooms, newRoom]
    });

    handleRoomSelect(newRoom);
    setIsEditing(true);
  };

  const handleDeleteRoom = () => {
    if (!selectedRoom) return;

    Alert.alert(
      'Delete Room',
      `Are you sure you want to delete "${selectedRoom.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedRooms = floorplan.rooms.filter(room => room.id !== selectedRoom.id);
            setFloorplan({
              ...floorplan,
              rooms: updatedRooms
            });
            setSelectedRoom(null);
            setIsEditing(false);
          }
        }
      ]
    );
  };

  const handleSave = () => {
    // In a real app, you would save to API here
    Alert.alert(
      'Success',
      'Floorplan saved successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{floorplan.name}</Text>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowShareModal(true)}
        >
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Main content */}
      <View style={styles.content}>
        {/* Floorplan view */}
        <View style={styles.floorplanContainer}>
          <ScrollView 
            contentContainerStyle={[
              styles.floorplanContent,
              { transform: [{ scale: zoom }] }
            ]}
          >
            {/* For demo purposes, using a view with Svg overlay for rooms */}
            <View style={styles.floorplanImageContainer}>
              <Image
                source={floorplan.image}
                style={styles.floorplanImage}
                resizeMode="contain"
              />
              
              <Svg style={styles.roomOverlay}>
                {floorplan.rooms.map(room => (
                  <React.Fragment key={room.id}>
                    <Rect
                      x={room.x}
                      y={room.y}
                      width={room.width}
                      height={room.height}
                      fill={`${room.color}80`}
                      stroke={room.color}
                      strokeWidth={selectedRoom?.id === room.id ? 3 : 1}
                      onPress={() => handleRoomSelect(room)}
                    />
                    <SvgText
                      x={room.x + room.width / 2}
                      y={room.y + room.height / 2}
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {room.name}
                    </SvgText>
                  </React.Fragment>
                ))}
              </Svg>
            </View>
          </ScrollView>
          
          {/* Zoom controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity 
              style={styles.zoomButton}
              onPress={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
            >
              <Ionicons name="remove" size={24} color="white" />
            </TouchableOpacity>
            
            <Slider
              style={styles.zoomSlider}
              minimumValue={0.5}
              maximumValue={2}
              step={0.1}
              value={zoom}
              onValueChange={setZoom}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor={colors.primary}
            />
            
            <TouchableOpacity 
              style={styles.zoomButton}
              onPress={() => setZoom(prev => Math.min(prev + 0.1, 2))}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Room editor */}
        <View style={styles.editorContainer}>
          {selectedRoom ? (
            <>
              <View style={styles.editorHeader}>
                <View style={styles.roomIndicator}>
                  <View 
                    style={[
                      styles.roomColor, 
                      { backgroundColor: selectedRoom.color }
                    ]} 
                  />
                  <Text style={styles.roomTitle}>
                    {isEditing ? 'Editing Room' : selectedRoom.name}
                  </Text>
                </View>
                
                {isEditing ? (
                  <View style={styles.editorActions}>
                    <TouchableOpacity 
                      style={[styles.editorButton, styles.saveButton]}
                      onPress={handleUpdateRoom}
                    >
                      <Text style={styles.editorButtonText}>Save</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.editorButton}
                      onPress={() => setIsEditing(false)}
                    >
                      <Text style={styles.editorButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.editorActions}>
                    <TouchableOpacity 
                      style={styles.editorButton}
                      onPress={() => setIsEditing(true)}
                    >
                      <Ionicons name="pencil" size={18} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.editorButton, styles.deleteButton]}
                      onPress={handleDeleteRoom}
                    >
                      <Ionicons name="trash" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              
              {isEditing ? (
                <View style={styles.editForm}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Room Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={roomName}
                      onChangeText={handleRoomNameChange}
                      placeholder="Enter room name"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Room Type</Text>
                    <TouchableOpacity 
                      style={styles.typeSelector}
                      onPress={() => setShowTypeModal(true)}
                    >
                      <View 
                        style={[
                          styles.typeColor,
                          { backgroundColor: roomType?.color || selectedRoom.color }
                        ]}
                      />
                      <Text style={styles.typeText}>
                        {roomType?.name || ROOM_TYPES.find(t => t.id === selectedRoom.type)?.name}
                      </Text>
                      <Ionicons name="chevron-down" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Dimensions</Text>
                    <View style={styles.dimensionsContainer}>
                      <View style={styles.dimensionInput}>
                        <Text style={styles.dimensionLabel}>Width</Text>
                        <TextInput
                          style={styles.dimensionValue}
                          value={`${selectedRoom.width}`}
                          keyboardType="numeric"
                          // In a real app, you would handle dimension changes here
                        />
                        <Text style={styles.dimensionUnit}>ft</Text>
                      </View>
                      
                      <View style={styles.dimensionInput}>
                        <Text style={styles.dimensionLabel}>Length</Text>
                        <TextInput
                          style={styles.dimensionValue}
                          value={`${selectedRoom.height}`}
                          keyboardType="numeric"
                          // In a real app, you would handle dimension changes here
                        />
                        <Text style={styles.dimensionUnit}>ft</Text>
                      </View>
                      
                      <View style={styles.dimensionInput}>
                        <Text style={styles.dimensionLabel}>Area</Text>
                        <Text style={styles.dimensionArea}>
                          {selectedRoom.width * selectedRoom.height} ft²
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.roomDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type:</Text>
                    <Text style={styles.detailValue}>
                      {ROOM_TYPES.find(t => t.id === selectedRoom.type)?.name}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Dimensions:</Text>
                    <Text style={styles.detailValue}>
                      {selectedRoom.width}' × {selectedRoom.height}'
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Area:</Text>
                    <Text style={styles.detailValue}>
                      {selectedRoom.width * selectedRoom.height} ft²
                    </Text>
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={styles.noSelectionContainer}>
              <Text style={styles.noSelectionText}>Select a room to edit or add a new one</Text>
              <TouchableOpacity 
                style={styles.addRoomButton}
                onPress={handleAddRoom}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addRoomText}>Add New Room</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      
      {/* Bottom toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity 
          style={styles.toolbarButton}
          onPress={handleAddRoom}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.toolbarButtonText}>Add Room</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toolbarButton, styles.saveToolbarButton]}
          onPress={handleSave}
        >
          <Ionicons name="save-outline" size={24} color="white" />
          <Text style={styles.toolbarButtonText}>Save Floorplan</Text>
        </TouchableOpacity>
      </View>
      
      {/* Room Type Selection Modal */}
      <Modal
        visible={showTypeModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Room Type</Text>
              <TouchableOpacity onPress={() => setShowTypeModal(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.typeList}>
              {ROOM_TYPES.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.typeItem}
                  onPress={() => handleRoomTypeChange(type)}
                >
                  <View 
                    style={[
                      styles.typeItemColor,
                      { backgroundColor: type.color }
                    ]}
                  />
                  <Text style={styles.typeItemText}>{type.name}</Text>
                  {roomType?.id === type.id && (
                    <Ionicons name="checkmark" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Floorplan</Text>
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.shareOptions}>
              <TouchableOpacity style={styles.shareOption}>
                <View style={[styles.shareIcon, { backgroundColor: '#3b5998' }]}>
                  <Ionicons name="mail" size={24} color="white" />
                </View>
                <Text style={styles.shareText}>Email</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.shareOption}>
                <View style={[styles.shareIcon, { backgroundColor: '#25D366' }]}>
                  <Ionicons name="logo-whatsapp" size={24} color="white" />
                </View>
                <Text style={styles.shareText}>WhatsApp</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.shareOption}>
                <View style={[styles.shareIcon, { backgroundColor: '#0078FF' }]}>
                  <Ionicons name="text" size={24} color="white" />
                </View>
                <Text style={styles.shareText}>Message</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.shareOption}>
                <View style={[styles.shareIcon, { backgroundColor: '#FF9500' }]}>
                  <Ionicons name="download" size={24} color="white" />
                </View>
                <Text style={styles.shareText}>Save PDF</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.exportOptions}>
              <Text style={styles.exportTitle}>Export Options</Text>
              
              <TouchableOpacity style={styles.exportOption}>
                <Ionicons name="document-text-outline" size={20} color="white" />
                <Text style={styles.exportText}>Export as PDF</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.exportOption}>
                <Ionicons name="image-outline" size={20} color="white" />
                <Text style={styles.exportText}>Export as Image</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.exportOption}>
                <Ionicons name="cube-outline" size={20} color="white" />
                <Text style={styles.exportText}>Export 3D Model</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    ...typography.heading4,
    color: 'white'
  },
  content: {
    flex: 1
  },
  floorplanContainer: {
    flex: 1,
    backgroundColor: colors.backgroundLight
  },
  floorplanContent: {
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  floorplanImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1.3
  },
  floorplanImage: {
    width: '100%',
    height: '100%'
  },
  roomOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  zoomControls: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    padding: 8
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  zoomSlider: {
    flex: 1,
    marginHorizontal: 8
  },
  editorContainer: {
    backgroundColor: colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    height: 200
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  roomIndicator: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  roomColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8
  },
  roomTitle: {
    ...typography.heading5,
    color: 'white'
  },
  editorActions: {
    flexDirection: 'row'
  },
  editorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  saveButton: {
    backgroundColor: colors.primary,
    width: 'auto',
    paddingHorizontal: 16
  },
  deleteButton: {
    backgroundColor: colors.error
  },
  editorButtonText: {
    ...typography.button,
    color: 'white'
  },
  roomDetails: {
    flex: 1
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  detailLabel: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
    width: 100
  },
  detailValue: {
    ...typography.body,
    color: 'white',
    flex: 1
  },
  editForm: {
    flex: 1
  },
  formField: {
    marginBottom: 12
  },
  formLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4
  },
  textInput: {
    ...typography.body,
    color: 'white',
    backgroundColor: colors.backgroundDark,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  typeColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8
  },
  typeText: {
    ...typography.body,
    color: 'white',
    flex: 1
  },
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dimensionInput: {
    flex: 1,
    marginRight: 8
  },
  dimensionLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4
  },
  dimensionValue: {
    ...typography.body,
    color: 'white',
    backgroundColor: colors.backgroundDark,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center'
  },
  dimensionUnit: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 2
  },
  dimensionArea: {
    ...typography.body,
    color: 'white',
    backgroundColor: colors.backgroundDark,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center'
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noSelectionText: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16
  },
  addRoomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  addRoomText: {
    ...typography.button,
    color: 'white',
    marginLeft: 4
  },
  toolbar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.backgroundLight
  },
  toolbarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundDark,
    padding: 12,
    borderRadius: 8,
    marginRight: 8
  },
  saveToolbarButton: {
    backgroundColor: colors.primary,
    marginRight: 0
  },
  toolbarButtonText: {
    ...typography.button,
    color: 'white',
    marginLeft: 8
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: colors.backgroundLight,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  modalTitle: {
    ...typography.heading4,
    color: 'white'
  },
  typeList: {
    padding: 16
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  typeItemColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12
  },
  typeItemText: {
    ...typography.body,
    color: 'white',
    flex: 1
  },
  shareOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between'
  },
  shareOption: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16
  },
  shareIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  shareText: {
    ...typography.body,
    color: 'white'
  },
  exportOptions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  exportTitle: {
    ...typography.heading5,
    color: 'white',
    marginBottom: 16
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  exportText: {
    ...typography.body,
    color: 'white',
    marginLeft: 12
  }
});

export default FloorplanEditorScreen;
