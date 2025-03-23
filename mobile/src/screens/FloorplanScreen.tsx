
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { colors, typography } from '../theme/AppTheme';

const FloorplanScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleStartScan = () => {
    setIsScanning(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowInstructions(false);
    
    // Simulate progress for demo purposes
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          handleScanComplete();
        }, 500);
      }
    }, 500);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    setScanProgress(0);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate('FloorplanEditor');
  };

  const handleCancelScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    setShowInstructions(true);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
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
      <Camera
        style={styles.camera}
        ref={ref => setCameraRef(ref)}
        type={Camera.Constants.Type.back}
      >
        <SafeAreaView style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Floorplan Scanner</Text>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowHelp(true)}
            >
              <Ionicons name="help-circle-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Scan UI */}
          <View style={styles.scanContainer}>
            {isScanning ? (
              <>
                {/* Scanning indicators */}
                <View style={styles.scanningBox}>
                  <View style={styles.scanCorner} />
                  <View style={styles.scanCorner} />
                  <View style={styles.scanCorner} />
                  <View style={styles.scanCorner} />
                </View>
                
                <View style={styles.progressContainer}>
                  <Text style={styles.scanningText}>Scanning in progress...</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${scanProgress}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{scanProgress}%</Text>
                  
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={handleCancelScan}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Instructions & start button */}
                {showInstructions && (
                  <View style={styles.instructionsContainer}>
                    <View style={styles.instructionCard}>
                      <Text style={styles.instructionTitle}>
                        How to scan your floorplan
                      </Text>
                      
                      <View style={styles.instructionStep}>
                        <View style={styles.instructionIcon}>
                          <Ionicons name="scan-outline" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.instructionText}>
                          Walk around the perimeter of each room while pointing the camera at the floor
                        </Text>
                      </View>
                      
                      <View style={styles.instructionStep}>
                        <View style={styles.instructionIcon}>
                          <Ionicons name="move-outline" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.instructionText}>
                          Move slowly and keep the phone at waist level for best results
                        </Text>
                      </View>
                      
                      <View style={styles.instructionStep}>
                        <View style={styles.instructionIcon}>
                          <Ionicons name="time-outline" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.instructionText}>
                          A complete scan typically takes 2-3 minutes for an average home
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.captureButton}
                  onPress={handleStartScan}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </SafeAreaView>
      </Camera>
      
      {/* Help Modal */}
      <Modal
        visible={showHelp}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Floorplan Scanning Help</Text>
              <TouchableOpacity onPress={() => setShowHelp(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.helpSectionTitle}>Tips for Better Results</Text>
              
              <View style={styles.helpItem}>
                <MaterialIcons name="lightbulb" size={20} color={colors.primary} />
                <Text style={styles.helpText}>
                  Ensure good lighting in all rooms for optimal scanning
                </Text>
              </View>
              
              <View style={styles.helpItem}>
                <MaterialIcons name="close" size={20} color={colors.primary} />
                <Text style={styles.helpText}>
                  Remove clutter from floors and ensure doors are fully open
                </Text>
              </View>
              
              <View style={styles.helpItem}>
                <MaterialIcons name="battery-alert" size={20} color={colors.primary} />
                <Text style={styles.helpText}>
                  Make sure your device has sufficient battery (at least 30%)
                </Text>
              </View>
              
              <View style={styles.helpItem}>
                <MaterialIcons name="slow-motion-video" size={20} color={colors.primary} />
                <Text style={styles.helpText}>
                  Move slowly and steadily for the most accurate measurements
                </Text>
              </View>
              
              <Text style={styles.helpSectionTitle}>Troubleshooting</Text>
              
              <View style={styles.helpItem}>
                <MaterialIcons name="error-outline" size={20} color={colors.primary} />
                <Text style={styles.helpText}>
                  If scanning fails, try restarting the app and ensure you have the latest version
                </Text>
              </View>
              
              <View style={styles.helpItem}>
                <MaterialIcons name="device-unknown" size={20} color={colors.primary} />
                <Text style={styles.helpText}>
                  This feature works best on devices with LiDAR sensor (iPhone 12 Pro and later)
                </Text>
              </View>
              
              <TouchableOpacity style={styles.helpButton}>
                <Text style={styles.helpButtonText}>View Full Tutorial</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  camera: {
    flex: 1
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    ...typography.heading4,
    color: 'white'
  },
  scanContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary
  },
  instructionsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  instructionCard: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400
  },
  instructionTitle: {
    ...typography.heading4,
    color: 'white',
    marginBottom: 16,
    textAlign: 'center'
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  instructionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  instructionText: {
    ...typography.body,
    color: 'white',
    flex: 1
  },
  scanningBox: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '20%',
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 8,
    opacity: 0.7
  },
  scanCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary,
    borderWidth: 3
  },
  progressContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center'
  },
  scanningText: {
    ...typography.body,
    color: 'white',
    marginBottom: 16
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary
  },
  progressText: {
    ...typography.heading3,
    color: 'white',
    marginTop: 8
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8
  },
  cancelButtonText: {
    ...typography.body,
    color: 'white'
  },
  errorText: {
    ...typography.body,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  buttonText: {
    ...typography.button,
    color: 'white'
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
    height: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: 16
  },
  modalTitle: {
    ...typography.heading4,
    color: 'white'
  },
  modalScroll: {
    padding: 16
  },
  helpSectionTitle: {
    ...typography.heading5,
    color: 'white',
    marginBottom: 12,
    marginTop: 20
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  helpText: {
    ...typography.body,
    color: 'white',
    marginLeft: 12,
    flex: 1
  },
  helpButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40
  },
  helpButtonText: {
    ...typography.button,
    color: 'white'
  }
});

export default FloorplanScreen;
