import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';
import { useOnboardingTour } from '../hooks/useOnboardingTour';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

const ProfileScreen = ({ navigation }) => {
  const { user, signOut } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    inApp: true,
    email: true,
    orderUpdates: true,
    paymentUpdates: true,
    marketing: false,
  });

  const { resetTour } = useOnboardingTour();

  const handleResetTour = () => {
    resetTour();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setFullName(data.full_name || '');
        setEmail(user.email || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load profile',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword || !currentPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all password fields',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'New passwords do not match',
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password updated successfully',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update password',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              navigation.replace('Login');
            } catch (error) {
              console.error('Error signing out:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to sign out',
              });
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Icon name="loader" size={32} color={colors.text} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="user" size={40} color={colors.text} />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon name="camera" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={email}
              editable={false}
            />
            <Text style={styles.helperText}>
              Email address cannot be changed
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleUpdateProfile}
            disabled={saving}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Change Password */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Enter current password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm new password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleUpdatePassword}
            disabled={saving}
          >
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          <View style={styles.preferenceItem}>
            <View>
              <Text style={styles.preferenceTitle}>In-App Notifications</Text>
              <Text style={styles.preferenceDescription}>
                Receive notifications within the app
              </Text>
            </View>
            <Switch
              value={notificationPreferences.inApp}
              onValueChange={(value) =>
                setNotificationPreferences((prev) => ({ ...prev, inApp: value }))
              }
              trackColor={{ false: colors.darkLight, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View>
              <Text style={styles.preferenceTitle}>Email Notifications</Text>
              <Text style={styles.preferenceDescription}>
                Receive notifications via email
              </Text>
            </View>
            <Switch
              value={notificationPreferences.email}
              onValueChange={(value) =>
                setNotificationPreferences((prev) => ({ ...prev, email: value }))
              }
              trackColor={{ false: colors.darkLight, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View>
              <Text style={styles.preferenceTitle}>Order Updates</Text>
              <Text style={styles.preferenceDescription}>
                Updates about your order status
              </Text>
            </View>
            <Switch
              value={notificationPreferences.orderUpdates}
              onValueChange={(value) =>
                setNotificationPreferences((prev) => ({
                  ...prev,
                  orderUpdates: value,
                }))
              }
              trackColor={{ false: colors.darkLight, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View>
              <Text style={styles.preferenceTitle}>Payment Updates</Text>
              <Text style={styles.preferenceDescription}>
                Updates about payments and billing
              </Text>
            </View>
            <Switch
              value={notificationPreferences.paymentUpdates}
              onValueChange={(value) =>
                setNotificationPreferences((prev) => ({
                  ...prev,
                  paymentUpdates: value,
                }))
              }
              trackColor={{ false: colors.darkLight, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View>
              <Text style={styles.preferenceTitle}>Marketing</Text>
              <Text style={styles.preferenceDescription}>
                Receive promotional offers and updates
              </Text>
            </View>
            <Switch
              value={notificationPreferences.marketing}
              onValueChange={(value) =>
                setNotificationPreferences((prev) => ({
                  ...prev,
                  marketing: value,
                }))
              }
              trackColor={{ false: colors.darkLight, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Icon name="bell" size={22} color="#00EEFF" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Notifications</Text>
            <Icon name="chevron-right" size={22} color="#888" style={{marginLeft: 'auto'}} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleResetTour}>
            <Icon name="help-circle" size={22} color="#00EEFF" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Restart App Tour</Text>
            <Icon name="chevron-right" size={22} color="#888" style={{marginLeft: 'auto'}} />
          </TouchableOpacity>
        </View>


        {/* Sign Out Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Icon name="log-out" size={20} color={colors.text} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    marginTop: 12,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.darkLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.8,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.darkLight,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  helperText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.5,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.darkLight,
    borderRadius: 12,
    padding: 16,
  },
  signOutText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
});

export default ProfileScreen;