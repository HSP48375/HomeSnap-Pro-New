import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Switch,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Camera } from 'expo-camera';
import { Accelerometer } from 'expo-sensors';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [autoFocus, setAutoFocus] = useState(Camera.Constants.AutoFocus.on);
  const [whiteBalance, setWhiteBalance] = useState(Camera.Constants.WhiteBalance.auto);
  const [burstMode, setBurstMode] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [playSound, setPlaySound] = useState(true);
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [photoQueue, setPhotoQueue] = useState<string[]>([]);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);

  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation();

  // Request camera and media library permissions
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');

      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert('Permission required', 
          'Camera and media library access are required to use this feature');
      }
    })();

    // Start accelerometer for level indicators
    _subscribe();

    return () => {
      _unsubscribe();
    };
  }, []);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setAccelerometerData(accelerometerData);
      })
    );
    Accelerometer.setUpdateInterval(100); // Update every 100ms
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // Helper to determine if device is level
  const isDeviceLevel = () => {
    const tolerance = 0.1;
    return (
      Math.abs(accelerometerData.x) < tolerance && 
      Math.abs(accelerometerData.y) < tolerance
    );
  };

  // Take a photo
  const takePicture = async () => {
    if (cameraRef.current && !processingPhoto) {
      setProcessingPhoto(true);

      try {
        if (burstMode) {
          // For burst mode, take 3 photos with different exposures
          const exposures = [-1, 0, 1]; // Underexposed, normal, overexposed
          const burstPromises = exposures.map(async (exposure) => {
            const photo = await cameraRef.current?.takePictureAsync({
              quality: 1,
              base64: false,
              exif: true,
              skipProcessing: false,
            });

            if (photo) {
              // Apply exposure adjustment
              const manipResult = await ImageManipulator.manipulateAsync(
                photo.uri,
                [{ brightness: exposure * 0.5 }],
                { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
              );

              await saveToGallery(manipResult.uri);
              return manipResult.uri;
            }
            return null;
          });

          const results = await Promise.all(burstPromises);
          const validResults = results.filter(result => result !== null) as string[];
          if (validResults.length > 0) {
            addToUploadQueue(validResults);
          }
        } else {
          // Normal single photo mode
          const photo = await cameraRef.current?.takePictureAsync({
            quality: 1,
            base64: false,
            exif: true,
            skipProcessing: false,
          });

          if (photo) {
            await saveToGallery(photo.uri);
            addToUploadQueue([photo.uri]);
          }
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture photo');
      } finally {
        setProcessingPhoto(false);
      }
    }
  };

  // Save photo to device gallery
  const saveToGallery = async (uri: string) => {
    try {
      await MediaLibrary.saveToLibraryAsync(uri);
    } catch (error) {
      console.error('Error saving to gallery:', error);
    }
  };

  // Add photos to upload queue for when online
  const addToUploadQueue = (uris: string[]) => {
    setPhotoQueue(prev => [...prev, ...uris]);

    // In a real app, you'd have a service to check connectivity
    // and upload when online
    console.log('Added to upload queue:', uris);
  };

  // Toggle camera type (front/back)
  const toggleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  // Toggle flash mode
  const toggleFlash = () => {
    setFlash(
      flash === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  // Toggle focus mode
  const toggleFocus = () => {
    setAutoFocus(
      autoFocus === Camera.Constants.AutoFocus.on
        ? Camera.Constants.AutoFocus.off
        : Camera.Constants.AutoFocus.on
    );
  };

  // Toggle grid overlay
  const toggleGrid = () => {
    setGridVisible(prev => !prev);
  };

  // Adjust zoom level
  const handleZoomChange = (value: number) => {
    setZoom(Math.max(0, Math.min(1, value)));
  };

  //Function to get wide angle ratio -  replace with your actual logic
  const getWideAngleRatio = () => {
    // Example: Simulate a 1.5x wide-angle effect
    return 1.5;
  };

  // Render the level indicators
  const renderLevelIndicators = () => {
    const isLevel = isDeviceLevel();
    const levelX = Math.abs(accelerometerData.x) < 0.1;
    const levelY = Math.abs(accelerometerData.y) < 0.1;

    return (
      <View style={styles.levelContainer}>
        <View style={[
          styles.levelIndicator, 
          styles.horizontalLevel,
          levelX ? styles.levelAligned : null
        ]} />
        <View style={[
          styles.levelIndicator,
          styles.verticalLevel,
          levelY ? styles.levelAligned : null
        ]} />
      </View>
    );
  };

  // Render the grid overlay (rule of thirds)
  const renderGrid = () => {
    if (!gridVisible) return null;

    return (
      <View style={styles.gridContainer}>
        {/* Horizontal lines */}
        <View style={[styles.gridLine, styles.horizontalLine, { top: '33%' }]} />
        <View style={[styles.gridLine, styles.horizontalLine, { top: '66%' }]} />

        {/* Vertical lines */}
        <View style={[styles.gridLine, styles.verticalLine, { left: '33%' }]} />
        <View style={[styles.gridLine, styles.verticalLine, { left: '66%' }]} />
      </View>
    );
  };

  if (hasPermission === null) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#00EEFF" /></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera or media library</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        flashMode={flash}
        zoom={zoom * getWideAngleRatio()} // Apply wide-angle effect
        autoFocus={autoFocus}
        whiteBalance={whiteBalance}
      >
        {renderGrid()}
        {renderLevelIndicators()}

        {/* Camera controls top toolbar */}
        <View style={styles.topControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.cameraOptionsContainer}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={toggleFlash}
            >
              <Ionicons 
                name={flash === Camera.Constants.FlashMode.on ? "flash" : "flash-off"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlButton}
              onPress={toggleGrid}
            >
              <MaterialIcons 
                name="grid-on" 
                size={24} 
                color={gridVisible ? "#00EEFF" : "white"} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlButton}
              onPress={toggleFocus}
            >
              <MaterialIcons 
                name={autoFocus === Camera.Constants.AutoFocus.on ? "center-focus-strong" : "center-focus-weak"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom camera controls */}
        <View style={styles.bottomControls}>
          <View style={styles.settingsContainer}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>AEB (Burst)</Text>
              <Switch
                value={burstMode}
                onValueChange={setBurstMode}
                trackColor={{ false: '#767577', true: '#00EEFF' }}
                thumbColor={burstMode ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Sound</Text>
              <Switch
                value={playSound}
                onValueChange={setPlaySound}
                trackColor={{ false: '#767577', true: '#00EEFF' }}
                thumbColor={playSound ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Zoom</Text>
              <View style={styles.zoomButtons}>
                <TouchableOpacity 
                  style={styles.zoomButton}
                  onPress={() => handleZoomChange(zoom - 0.1)}
                >
                  <Text style={styles.zoomButtonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.zoomValue}>{(zoom * 100).toFixed(0)}%</Text>

                <TouchableOpacity 
                  style={styles.zoomButton}
                  onPress={() => handleZoomChange(zoom + 0.1)}
                >
                  <Text style={styles.zoomButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={() => navigation.navigate('Gallery' as never)}
            >
              <Ionicons name="images" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.captureButton,
                processingPhoto ? styles.captureButtonDisabled : null
              ]}
              onPress={takePicture}
              disabled={processingPhoto}
            >
              {processingPhoto ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraType}
            >
              <Ionicons name="camera-reverse" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  cameraOptionsContainer: {
    flexDirection: 'row',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'white',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  captureButtonDisabled: {
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingLabel: {
    color: 'white',
    fontSize: 16,
  },
  zoomButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  zoomValue: {
    color: 'white',
    width: 50,
    textAlign: 'center',
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
    backgroundColor: 'rgba(255,255,255,0.4)',
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
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    marginLeft: -100,
    marginTop: -100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelIndicator: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    position: 'absolute',
  },
  horizontalLevel: {
    width: 100,
    height: 2,
  },
  verticalLevel: {
    width: 2,
    height: 100,
  },
  levelAligned: {
    backgroundColor: '#00EEFF',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
  button: {
    backgroundColor: '#00EEFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraScreen;