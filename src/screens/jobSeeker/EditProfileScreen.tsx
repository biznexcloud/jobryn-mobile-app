import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  User,
  Briefcase,
  MapPin,
  Globe,
  Camera,
  X,
  ChevronLeft,
} from 'lucide-react-native';
import { ProfileService } from '../../services/api/profile';
import { useAuthStore } from '../../store/authStore';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';

const InputField = ({ label, icon: Icon, value, onChangeText, multiline, ...props }: any) => (
  <VStack mb={20}>
     <Text fontSize={14} fontWeight="700" color="#666666" mb={8}>{label}</Text>
     <Box bg="white" rounded={12} px={12} py={12} border={1} borderColor="#E5E7EB">
        <HStack items={multiline ? 'flex-start' : 'center'}>
           <Icon size={20} color="#65676B" style={{ marginTop: multiline ? 4 : 0 }} />
           <TextInput 
              value={value} 
              onChangeText={onChangeText}
              multiline={multiline}
              style={[styles.input, { height: multiline ? 100 : 22 }]}
              placeholderTextColor="#9CA3AF"
              {...props}
           />
        </HStack>
     </Box>
  </VStack>
);

export default function EditProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    job_title: '',
    location: '',
    bio: '',
    website: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(user?.profile_picture || null);
  const [hasNewImage, setHasNewImage] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resp = await ProfileService.getSeekerProfiles();
        const profile = resp?.results?.[0];
        if (profile) {
          setFormData({
            full_name: profile.full_name || '',
            job_title: profile.job_title || '',
            location: profile.location || '',
            bio: profile.description || profile.about || profile.bio || '',
            website: profile.website || '',
          });
          useAuthStore.getState().setSeekerId(profile.id);
        }
      } catch (e) {
        setFormData({ ...formData, full_name: user?.name || '' });
      }
    };
    fetchProfile();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photos to upload.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setHasNewImage(true);
    }
  };

  const handleSave = async () => {
    const seekerId = useAuthStore.getState().seekerId;
    setLoading(true);
    try {
      // 1. Update Account (Full Name and Profile Picture)
      const accountData = new FormData();
      accountData.append('name', formData.full_name);
      
      if (hasNewImage && profileImage) {
        const filename = profileImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;
        accountData.append('profile_picture', {
          uri: profileImage,
          name: filename,
          type,
        } as any);
      }

      await ProfileService.updateAccountProfile(accountData);

      // 2. Update or Create Seeker Profile (Professional details)
      const seekerPayload = {
        job_title: formData.job_title,
        location: formData.location,
        bio: formData.bio,
        description: formData.bio,
        about: formData.bio,
        website: formData.website,
      };

      if (!seekerId) {
        const resp = await ProfileService.createSeekerProfile({
          ...seekerPayload,
          headline: formData.job_title || 'Professional',
        });
        useAuthStore.getState().setSeekerId(resp.id);
      } else {
        await ProfileService.updateSeekerProfile(seekerId, seekerPayload);
      }

      // 3. Refresh Global State
      const updatedUser = await ProfileService.getAccountProfile();
      useAuthStore.getState().setUser(updatedUser);

      Alert.alert('Profile Updated', 'Your professional identity has been successfully synchronized.', [
        { text: 'Great', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      console.error('Update failed:', e);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
         <HStack items="center" justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                  <X size={24} color="#000000" />
               </TouchableOpacity>
               <Text fontSize={18} fontWeight="700" color="#000000" ml={12}>Edit Profile</Text>
            </HStack>
            <TouchableOpacity onPress={handleSave}>
               <Text fontSize={16} fontWeight="700" color={BLUE}>Save</Text>
            </TouchableOpacity>
         </HStack>
      </Box>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <VStack items="center" mb={24}>
               <Box>
                  <Avatar source={{ uri: profileImage || 'https://i.pravatar.cc/150' }} size={100} />
                  <TouchableOpacity onPress={pickImage} style={styles.photoBtn}>
                     <Camera size={20} color="white" />
                  </TouchableOpacity>
               </Box>
               <TouchableOpacity onPress={pickImage}>
                  <Text fontSize={14} color={BLUE} fontWeight="700" mt={12}>Change profile photo</Text>
               </TouchableOpacity>
            </VStack>

           <VStack mb={24}>
              <InputField 
                 label="Full Name" 
                 icon={User} 
                 value={formData.full_name}
                 onChangeText={(text: string) => setFormData({ ...formData, full_name: text })}
              />
              <InputField 
                 label="Headline" 
                 icon={Briefcase} 
                 placeholder="e.g. Senior Software Engineer"
                 value={formData.job_title}
                 onChangeText={(text: string) => setFormData({ ...formData, job_title: text })}
              />
              <InputField 
                 label="Location" 
                 icon={MapPin} 
                 placeholder="e.g. London, UK"
                 value={formData.location}
                 onChangeText={(text: string) => setFormData({ ...formData, location: text })}
              />
              <InputField 
                 label="Bio / Summary" 
                 icon={Globe} 
                 placeholder="Tell the professional world about yourself..."
                 multiline
                 value={formData.bio}
                 onChangeText={(text: string) => setFormData({ ...formData, bio: text })}
              />
           </VStack>

           <Button 
              label="Save Professional Identity" 
              loading={loading} 
              onPress={handleSave} 
              bg={BLUE}
              style={{ height: 52, borderRadius: 26 }} 
           />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 20 },
  photoBtn: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'white' },
  input: { flex: 1, fontSize: 16, color: '#111827', marginLeft: 12, padding: 0 },
});
