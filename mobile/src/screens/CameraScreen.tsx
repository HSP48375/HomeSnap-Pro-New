
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Switch,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sensors from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const CameraScreen = () => {
  // Camera permissions and references
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  
  // Camera settings
  const [isWideAngle, setIsWideAngle] = useState(true); // Wide angle ON by default
  const [isBurstMode, setIsBurstMode] = useState(true); // Burst mode ON by default
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [exposureValue, setExposureValue] = useState(0);
  
  // Device sensors for level indicators
  const [orientation, setOrientation] = useState({ x: 0, y: 0, z: 0 });
  const [isLevelHorizontal, setIsLevelHorizontal] = useState(false);
  const [isLevelVertical, setIsLevelVertical] = useState(false);
  
  // Photo processing
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  
  // First-time user tooltips
  const [showWideAngleTooltip, setShowWideAngleTooltip] = useState(false);
  const [showBurstModeTooltip, setShowBurstModeTooltip] = useState(false);
  
  // Camera settings modal
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  // Get camera permissions and check for first-time user
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted' && mediaLibraryStatus.status === 'granted');
      
      // Check if first time user for tooltips
      const hasSeenWideAngleTooltip = await AsyncStorage.getItem('hasSeenWideAngleTooltip');
      const hasSeenBurstModeTooltip = await AsyncStorage.getItem('hasSeenBurstModeTooltip');
      
      if (!hasSeenWideAngleTooltip) {
        setShowWideAngleTooltip(true);
        AsyncStorage.setItem('hasSeenWideAngleTooltip', 'true');
      }
      
      if (!hasSeenBurstModeTooltip) {
        setShowBurstModeTooltip(true);
        AsyncStorage.setItem('hasSeenBurstModeTooltip', 'true');
      }
    })();
  }, []);
  
  // Setup device orientation sensors
  useEffect(() => {
    const subscription = Sensors.Accelerometer.addListener(accelerometerData => {
      setOrientation(accelerometerData);
      
      // Calculate if phone is level
      const tolerance = 0.1;
      setIsLevelHorizontal(Math.abs(accelerometerData.y) < tolerance);
      setIsLevelVertical(Math.abs(accelerometerData.x) < tolerance);
    });
    
    return () => subscription.remove();
  }, []);
  
  // Take photos (regular or burst mode)
  const takePicture = async () => {
    if (cameraRef.current && !processingPhoto) {
      setProcessingPhoto(true);
      
      try {
        // If burst mode is enabled, take 3 pictures with different exposures
        if (isBurstMode) {
          const exposureSettings = [-1, 0, 1]; // Under, normal, over exposed
          const photoPromises = [];
          
          // Take 3 photos with different exposure values
          for (const exposure of exposureSettings) {
            if (cameraRef.current) {
              // Set temporary exposure for this photo
              await cameraRef.current.setExposureOffset(exposureValue + exposure);
              
              // Wait a moment for exposure to take effect
              await new Promise(resolve => setTimeout(resolve, 200));
              
              // Take the photo
              const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                base64: false,
                skipProcessing: false,
                exif: true,
              });
              
              photoPromises.push(photo);
            }
          }
          
          // Reset exposure to user setting
          if (cameraRef.current) {
            await cameraRef.current.setExposureOffset(exposureValue);
          }
          
          // Process all photos
          const photos = await Promise.all(photoPromises);
          
          // Save photos to media library
          for (const photo of photos) {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
            // Add to upload queue
            setUploadQueue(prevQueue => [...prevQueue, photo.uri]);
          }
          
          Alert.alert("Burst Mode", "Captured 3 exposure-bracketed photos");
        } 
        // Regular photo mode
        else {
          const photo = await cameraRef.current.takePictureAsync({
            quality: 1,
            base64: false,
            skipProcessing: false,
            exif: true,
          });
          
          // Save to media library
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          
          // Add to upload queue
          setUploadQueue(prevQueue => [...prevQueue, photo.uri]);
          
          Alert.alert("Photo Captured", "Photo saved to gallery");
        }
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to capture photo");
      } finally {
        setProcessingPhoto(false);
      }
    }
  };
  
  // Toggle camera settings
  const toggleWideAngle = () => {
    setIsWideAngle(!isWideAngle);
  };
  
  const toggleBurstMode = () => {
    setIsBurstMode(!isBurstMode);
  };
  
  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };
  
  const toggleGrid = () => {
    setIsGridVisible(!isGridVisible);
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };
  
  const adjustExposure = (value) => {
    setExposureValue(Math.max(-1, Math.min(1, exposureValue + value)));
  };
  
  // UI for tooltips
  const renderWideAngleTooltip = () => {
    if (!showWideAngleTooltip) return null;
    
    return (
      <Modal
        transparent={true}
        visible={showWideAngleTooltip}
        animationType="fade"
      >
        <View style={styles.tooltipContainer}>
          <View style={styles.tooltip}>
            <Text style={styles.tooltipTitle}>Wide-Angle Mode</Text>
            <Text style={styles.tooltipText}>
              All professional real estate photographers use wide-angle lenses to capture more of the space.
              This feature is enabled by default for the best real estate photos.
            </Text>
            <TouchableOpacity 
              style={styles.tooltipButton}
              onPress={() => setShowWideAngleTooltip(false)}
            >
              <Text style={styles.tooltipButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
  const renderBurstModeTooltip = () => {
    if (!showBurstModeTooltip) return null;
    
    return (
      <Modal
        transparent={true}
        visible={showBurstModeTooltip}
        animationType="fade"
      >
        <View style={styles.tooltipContainer}>
          <View style={styles.tooltip}>
            <Text style={styles.tooltipTitle}>Burst Mode (AEB)</Text>
            <Text style={styles.tooltipText}>
              Burst Mode captures 3 photos with different exposures (under, correct, and over-exposed).
              This gives you perfect detail in both bright and dark areas of a property.
            </Text>
            <TouchableOpacity 
              style={styles.tooltipButton}
              onPress={() => setShowBurstModeTooltip(false)}
            >
              <Text style={styles.tooltipButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
  // Settings modal
  const renderSettingsModal = () => {
    return (
      <Modal
        transparent={true}
        visible={settingsModalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.settingsModal}>
            <Text style={styles.settingsTitle}>Camera Settings</Text>
            
            <ScrollView>
              {/* Wide Angle Mode */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Wide-Angle Mode</Text>
                  <Text style={styles.settingDescription}>
                    Use device wide-angle lens (recommended)
                  </Text>
                </View>
                <Switch
                  value={isWideAngle}
                  onValueChange={toggleWideAngle}
                  trackColor={{ false: "#767577", true: "#00EEFF" }}
                  thumbColor={isWideAngle ? "#FFFFFF" : "#f4f3f4"}
                />
              </View>
              
              {/* Burst Mode / AEB */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Burst Mode (AEB)</Text>
                  <Text style={styles.settingDescription}>
                    Capture 3 exposures per photo
                  </Text>
                </View>
                <Switch
                  value={isBurstMode}
                  onValueChange={toggleBurstMode}
                  trackColor={{ false: "#767577", true: "#00EEFF" }}
                  thumbColor={isBurstMode ? "#FFFFFF" : "#f4f3f4"}
                />
              </View>
              
              {/* Grid Overlay */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Grid Overlay</Text>
                  <Text style={styles.settingDescription}>
                    Show rule of thirds guidelines
                  </Text>
                </View>
                <Switch
                  value={isGridVisible}
                  onValueChange={toggleGrid}
                  trackColor={{ false: "#767577", true: "#00EEFF" }}
                  thumbColor={isGridVisible ? "#FFFFFF" : "#f4f3f4"}
                />
              </View>
              
              {/* Camera Sound */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Camera Sound</Text>
                  <Text style={styles.settingDescription}>
                    Play sound when taking photos
                  </Text>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={toggleSound}
                  trackColor={{ false: "#767577", true: "#00EEFF" }}
                  thumbColor={soundEnabled ? "#FFFFFF" : "#f4f3f4"}
                />
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSettingsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
  // Grid overlay component
  const renderGrid = () => {
    if (!isGridVisible) return null;
    
    return (
      <View style={styles.gridContainer}>
        {/* Horizontal lines */}
        <View style={[styles.gridLine, styles.horizontalLine, { top: height / 3 }]} />
        <View style={[styles.gridLine, styles.horizontalLine, { top: (height / 3) * 2 }]} />
        
        {/* Vertical lines */}
        <View style={[styles.gridLine, styles.verticalLine, { left: width / 3 }]} />
        <View style={[styles.gridLine, styles.verticalLine, { left: (width / 3) * 2 }]} />
      </View>
    );
  };
  
  // Level indicators
  const renderLevelIndicators = () => {
    return (
      <View style={styles.levelContainer}>
        {/* Horizontal level */}
        <View style={styles.levelIndicator}>
          <View style={[
            styles.levelBar,
            { backgroundColor: isLevelHorizontal ? '#00EEFF' : 'white' }
          ]}>
            <View style={[
              styles.levelBubble,
              { 
                left: `${50 + (orientation.y * 50)}%`,
                backgroundColor: isLevelHorizontal ? '#00EEFF' : 'white'
              }
            ]} />
          </View>
        </View>
        
        {/* Vertical level */}
        <View style={styles.verticalLevelIndicator}>
          <View style={[
            styles.verticalLevelBar,
            { backgroundColor: isLevelVertical ? '#00EEFF' : 'white' }
          ]}>
            <View style={[
              styles.levelBubble,
              { 
                top: `${50 + (orientation.x * 50)}%`,
                backgroundColor: isLevelVertical ? '#00EEFF' : 'white'
              }
            ]} />
          </View>
        </View>
      </View>
    );
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text style={styles.text}>Requesting camera permissions...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text style={styles.text}>No access to camera. Please enable camera permissions.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Camera View */}
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
        ratio="16:9"
        zoom={isWideAngle ? 0.5 : 1} // Simulate wide-angle with zoom out
      >
        {/* Camera UI Overlay */}
        <View style={styles.cameraControls}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setSettingsModalVisible(true)}
            >
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.cameraInfo}>
              {isWideAngle && (
                <View style={styles.cameraFeatureTag}>
                  <Text style={styles.featureTagText}>WIDE</Text>
                </View>
              )}
              
              {isBurstMode && (
                <View style={styles.cameraFeatureTag}>
                  <Text style={styles.featureTagText}>AEB</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={toggleFlash}
            >
              <Ionicons 
                name={flashMode === Camera.Constants.FlashMode.off ? "flash-off" : "flash"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
          
          {/* Grid Overlay */}
          {renderGrid()}
          
          {/* Level Indicators */}
          {renderLevelIndicators()}
          
          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setCameraType(
                cameraType === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              )}
            >
              <Ionicons name="camera-reverse-outline" size={28} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.captureButton, processingPhoto && styles.captureButtonDisabled]}
              onPress={takePicture}
              disabled={processingPhoto}
            >
              {processingPhoto ? (
                <View style={styles.processingIndicator} />
              ) : null}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => console.log('View gallery')}
            >
              <Ionicons name="images-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Exposure Controls */}
          <View style={styles.exposureControls}>
            <TouchableOpacity onPress={() => adjustExposure(-0.1)}>
              <Ionicons name="remove-circle-outline" size={28} color="white" />
            </TouchableOpacity>
            
            <View style={styles.exposureIndicator}>
              <Text style={styles.exposureText}>{exposureValue.toFixed(1)}</Text>
            </View>
            
            <TouchableOpacity onPress={() => adjustExposure(0.1)}>
              <Ionicons name="add-circle-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
      
      {/* Tooltips */}
      {renderWideAngleTooltip()}
      {renderBurstModeTooltip()}
      
      {/* Settings Modal */}
      {renderSettingsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
  },
  cameraInfo: {
    flexDirection: 'row',
  },
  cameraFeatureTag: {
    backgroundColor: 'rgba(0, 238, 255, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  featureTagText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#00EEFF',
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: 'rgba(0, 238, 255, 0.5)',
  },
  processingIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'white',
    borderTopColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  horizontalLine: {
    left: 0,
    right: 0,
    height: 1,
  },
  verticalLine: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  levelContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 70,
  },
  levelIndicator: {
    height: 30,
    justifyContent: 'center',
    marginBottom: 10,
  },
  levelBar: {
    height: 6,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
    position: 'relative',
  },
  verticalLevelIndicator: {
    position: 'absolute',
    left: 10,
    top: 40,
    bottom: 40,
    width: 30,
    justifyContent: 'center',
  },
  verticalLevelBar: {
    width: 6,
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
    position: 'relative',
  },
  levelBubble: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  exposureControls: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -50 }],
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  exposureIndicator: {
    paddingVertical: 8,
  },
  exposureText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tooltipContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  tooltip: {
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#00EEFF',
  },
  tooltipTitle: {
    color: '#00EEFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tooltipText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  tooltipButton: {
    backgroundColor: '#00EEFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tooltipButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  settingsModal: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  settingsTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settingDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#00EEFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CameraScreen;
