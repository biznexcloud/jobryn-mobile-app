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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
            bio: profile.bio || '',
            website: profile.website || '',
          });
        }
      } catch (e) {
        setFormData({ ...formData, full_name: user?.name || '' });
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await ProfileService.updateSeekerProfile(1, formData);
      Alert.alert('Profile Updated', 'Your professional identity has been successfully synchronized.', [
        { text: 'Great', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
         <VStack items="center" mb={24}>
            <Box>
               <Avatar source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150' }} size={100} />
               <TouchableOpacity style={styles.photoBtn}>
                  <Camera size={20} color="white" />
               </TouchableOpacity>
            </Box>
            <Text fontSize={14} color={BLUE} fontWeight="700" mt={12}>Change profile photo</Text>
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 20 },
  photoBtn: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'white' },
  input: { flex: 1, fontSize: 16, color: '#111827', marginLeft: 12, padding: 0 },
});
