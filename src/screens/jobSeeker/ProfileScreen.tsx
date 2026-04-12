import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
  Platform,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button
} from '../../components/ui';
import {
  ChevronLeft,
  Settings,
  Camera,
  Pencil,
  Plus,
  MapPin,
  GraduationCap,
  Briefcase,
  Link,
  Image as ImageIcon,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { ProfileService } from '../../services/api/profile';
import { PortfolioService } from '../../services/api/portfolio';
import { moderateScale } from '../../utils/responsive';

const { width } = Dimensions.get('window');



const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

import { useFocusEffect } from '@react-navigation/native';

export default function JobSeekerProfileScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { user: authUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // ── Sync states with API response ──
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop');
  const [profileImage, setProfileImage] = useState(authUser?.profile_picture || `https://i.pravatar.cc/150?u=${authUser?.email}`);

  const fetchProfile = async () => {
    try {
      const [seekerProfiles, edu, exp, proj] = await Promise.all([
        ProfileService.getSeekerProfiles().catch(() => ({ results: [] })),
        PortfolioService.getEducation().catch(() => ({ results: [] })),
        PortfolioService.getExperience().catch(() => ({ results: [] })),
        PortfolioService.getProjects().catch(() => ({ results: [] })),
      ]);
      
      const firstProfile = seekerProfiles?.results?.[0];
      
      if (firstProfile) {
         setProfile(firstProfile);
         // ANCHOR: Sync photos with the real backend data
         if (firstProfile.profile_picture) setProfileImage(firstProfile.profile_picture);
         if (firstProfile.cover_photo) setCoverImage(firstProfile.cover_photo);
         
         // ANCHOR: Save seekerId globally for all portfolio sub-screens
         useAuthStore.getState().setSeekerId(firstProfile.id);

         // ── GLOBAL SYNC: Propagate identity to Sidebar/Dashboard ──
         const currentUser = useAuthStore.getState().user;
         useAuthStore.getState().setUser({
            ...currentUser,
            name: firstProfile.full_name || firstProfile.user_detail?.name || currentUser?.name,
            profile_picture: firstProfile.profile_picture || currentUser?.profile_picture,
            job_title: firstProfile.job_title || firstProfile.headline || 'Professional'
         });
      } else {
         setProfile({ 
            full_name: authUser?.name || 'Professional', 
            headline: 'Expert', 
            about: 'Passionate professional looking for new challenges.' 
         });
      }
      
      setEducation(edu?.results || []);
      setExperience(exp?.results || []);
      setProjects(proj?.results || []);
    } catch (e) {
      console.warn('Profile fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  // ── Real-Time Sync: Refresh every time screen is focused ──
  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

  const pickImage = async (type: 'profile' | 'cover') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photos to upload.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'profile' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (type === 'profile') setProfileImage(uri);
      else setCoverImage(uri);

      // ── Real Sync ──
      handlePhotoUpload(uri, type);
    }
  };

  const handlePhotoUpload = async (uri: string, type: 'profile' | 'cover') => {
    if (!uri) return;
    setUploading(true);

    try {
      const formData = new FormData();
      const filename = uri.split('/').pop();
      const photoType = filename?.split('.').pop() || 'jpg';
      
      formData.append(type === 'profile' ? 'profile_picture' : 'cover_photo', {
        uri,
        name: filename || `photo.${photoType}`,
        type: `image/${photoType === 'jpg' || photoType === 'jpeg' ? 'jpeg' : photoType}`,
      } as any);

      if (type === 'profile') {
        await ProfileService.updateAccountProfile(formData);
        // Refresh auth state to sync with globally used avatar
        const updatedUser = await ProfileService.getAccountProfile();
        
        // ANCHOR: Force cache refresh for Image components
        if (updatedUser.profile_picture) {
           updatedUser.profile_picture = `${updatedUser.profile_picture}?t=${Date.now()}`;
        }
        
        useAuthStore.getState().setUser(updatedUser);
      } else {
        if (profile?.id) {
          await ProfileService.updateSeekerProfile(profile.id, formData);
        }
      }

      // ── CRITICAL SYNC: Re-fetch entire profile to update UI ──
      await fetchProfile();
      
      Alert.alert('Success', `${type === 'profile' ? 'Profile picture' : 'Cover photo'} updated successfully.`);
    } catch (e) {
      console.warn('Photo upload failed:', e);
      Alert.alert('Upload Failed', 'There was a technical issue uploading your photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
     <ScreenWrapper backgroundColor="#FFFFFF" items="center" justify="center">
        <ActivityIndicator color={BLUE} />
     </ScreenWrapper>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Banner and Avatar */}
        <Box height={200} bg="#A0A0A0">
           <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => navigation.navigate('PhotoViewer', { initialPhoto: coverImage, gallery: [coverImage] })} 
              style={StyleSheet.absoluteFill}
           >
              <Image source={{ uri: coverImage }} style={StyleSheet.absoluteFill} />
           </TouchableOpacity>
           <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: insets.top + 10 }]}>
              <ChevronLeft size={24} color="white" strokeWidth={2.5} />
           </TouchableOpacity>
           
           <TouchableOpacity 
              onPress={() => pickImage('cover')} 
              style={styles.coverCameraBtn}
           >
              <Camera size={18} color="#1C1E21" />
           </TouchableOpacity>
        </Box>

        <Box bg="white" px={16} pb={20}>
           <Box style={styles.avatarContainer}>
              <TouchableOpacity 
                 activeOpacity={0.9} 
                 onPress={() => navigation.navigate('PhotoViewer', { initialPhoto: profileImage, gallery: [profileImage] })}
              >
                 <Avatar source={{ uri: profileImage }} size="xl" style={styles.mainAvatar} />
              </TouchableOpacity>
              <TouchableOpacity 
                 onPress={() => pickImage('profile')} 
                 style={styles.profileCameraBtn}
              >
                 <Camera size={16} color="#1C1E21" />
              </TouchableOpacity>
           </Box>
           
           <HStack justify="flex-end" mt={10}>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsBtn}>
                 <Settings size={24} color="#666666" />
              </TouchableOpacity>
           </HStack>

           <VStack mt={20}>
              <Text fontSize={22} fontWeight="700" color="#000000">{profile?.full_name || authUser?.name || 'Professional'}</Text>
              <Text fontSize={16} color="#000000" mt={4}>{profile?.job_title || profile?.headline || 'Expert'}</Text>
              <HStack mt={10} items="center" flexWrap="wrap">
                 <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                    <HStack items="center">
                       <MapPin size={16} color="#666666" />
                        <Text fontSize={14} color="#666666" ml={4}>
                           {profile?.city || profile?.location || 'Kathmandu'}
                           {profile?.state ? `, ${profile.state}` : ''}
                           {profile?.country ? `, ${profile.country}` : ''}
                        </Text>
                       <Box ml={4}><Pencil size={12} color={BLUE} /></Box>
                    </HStack>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={() => navigation.navigate('ConnectionsList')}>
                    <Text fontSize={14} color={BLUE} fontWeight="700" ml={16}>500+ connections</Text>
                 </TouchableOpacity>
              </HStack>
           </VStack>

           <HStack mt={20} space="sm">
              <Button label="Open to" onPress={() => navigation.navigate('OpenToSelection')} style={{ flex: 1, backgroundColor: BLUE }} />
              <Button label="Add segment" variant="outline" onPress={() => navigation.navigate('AddProfileSegment')} style={{ flex: 1, borderColor: BLUE }} textStyle={{ color: BLUE }} />
              <TouchableOpacity onPress={() => navigation.navigate('ProfileManagement')} style={styles.moreBtn}><Text fontSize={18} fontWeight="700" color="#666666">...</Text></TouchableOpacity>
           </HStack>
        </Box>

        <Box bg="white" mt={8} p={16}>
           <HStack justify="space-between" items="center" mb={12}>
              <Text fontSize={18} fontWeight="700" color="#000000">About</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EditBio')}><Pencil size={20} color="#0A66C2" /></TouchableOpacity>
           </HStack>
            <Text fontSize={14} color="#000000" lineHeight={20}>
               {profile?.description || profile?.about || profile?.bio || 'Professional summary describing your career objectives and expertise. Add details to attract recruiters.'}
            </Text>
        </Box>

        {/* Experience Section */}
        <Box bg="white" mt={8} p={16}>
           <HStack justify="space-between" items="center" mb={16}>
              <Text fontSize={18} fontWeight="700" color="#000000">Experience</Text>
              <HStack space="md">
                 <TouchableOpacity onPress={() => navigation.navigate('AddExperience')}><Plus size={24} color="#666666" /></TouchableOpacity>
                 <TouchableOpacity onPress={() => navigation.navigate('ExperienceManagement')}><Pencil size={20} color={BLUE} /></TouchableOpacity>
              </HStack>
           </HStack>
           {experience.length > 0 ? experience.map((exp: any, idx: number) => (
              <VStack key={idx} mb={16}>
                 <HStack items="flex-start">
                    <Box w={48} h={48} bg="#F3F2EF" rounded={4} items="center" justify="center">
                       <Briefcase size={24} color="#666666" />
                    </Box>
                     <VStack ml={12} flex={1}>
                        <HStack items="center" justify="space-between" flex={1}>
                           <Text fontSize={16} fontWeight="700" color="#000000">{exp.title || exp.position}</Text>
                           {exp.employment_type && (
                              <Box bg="#E7F3FF" px={8} py={2} rounded={4}>
                                 <Text fontSize={10} fontWeight="700" color={BLUE}>{exp.employment_type.replace('_', ' ').toUpperCase()}</Text>
                              </Box>
                           )}
                        </HStack>
                        <Text fontSize={14} color="#000000">{exp.company_name}</Text>
                        <Text fontSize={13} color="#666666" mt={2}>{exp.start_date} - {exp.is_current || exp.current ? 'Present' : exp.end_date}</Text>
                     </VStack>
                 </HStack>
                 {idx < experience.length - 1 && <Divider color="#E0E0E0" mt={12} />}
              </VStack>
           )) : (
              <Text color="#666666">No experience listed.</Text>
           )}
        </Box>

        {/* Education Section */}
        <Box bg="white" mt={8} p={16}>
           <HStack justify="space-between" items="center" mb={16}>
              <Text fontSize={18} fontWeight="700" color="#000000">Education</Text>
               <HStack space="md">
                  <TouchableOpacity onPress={() => navigation.navigate('AddEducation')}><Plus size={24} color="#666666" /></TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('EducationManagement')}><Pencil size={20} color={BLUE} /></TouchableOpacity>
               </HStack>
           </HStack>
           {education.length > 0 ? education.map((edu: any, idx: number) => (
              <VStack key={idx} mb={16}>
                 <HStack items="flex-start">
                    <Box w={48} h={48} bg="#F3F2EF" rounded={4} items="center" justify="center">
                       <GraduationCap size={24} color="#666666" />
                    </Box>
                     <VStack ml={12} flex={1}>
                        <Text fontSize={16} fontWeight="700" color="#000000">{edu.school}</Text>
                        <Text fontSize={14} color="#000000">{edu.degree}, {edu.field_of_study || edu.field}</Text>
                        <Text fontSize={13} color="#666666" mt={2}>{edu.start_date} - {edu.end_date}</Text>
                     </VStack>
                 </HStack>
                 {idx < education.length - 1 && <Divider color="#E0E0E0" mt={12} />}
              </VStack>
           )) : (
              <Text color="#666666">No education listed.</Text>
           )}
        </Box>

        {/* Projects Section */}
        <Box bg="white" mt={8} p={16}>
           <HStack justify="space-between" items="center" mb={16}>
              <Text fontSize={18} fontWeight="700" color="#000000">Projects</Text>
               <HStack space="md">
                  <TouchableOpacity onPress={() => navigation.navigate('AddProject')}><Plus size={24} color="#666666" /></TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('ProjectManagement')}><Pencil size={20} color={BLUE} /></TouchableOpacity>
               </HStack>
           </HStack>
           {projects.length > 0 ? projects.map((proj: any, idx: number) => (
              <VStack key={idx} mb={16}>
                 <HStack items="flex-start">
                    <Box w={48} h={48} bg="#F3F2EF" rounded={4} items="center" justify="center">
                       <ImageIcon size={24} color="#666666" />
                    </Box>
                     <VStack ml={12} flex={1}>
                        <Text fontSize={16} fontWeight="700" color="#000000">{proj.name}</Text>
                        <Text fontSize={13} color="#666666" mt={2}>
                           {(proj.start_date || proj.end_date) ? `${proj.start_date || 'N/A'} - ${proj.end_date || 'Present'}` : 'Dec 2023'}
                        </Text>
                        <Text fontSize={14} color="#000000" mt={4} numberOfLines={2}>{proj.description}</Text>
                        {proj.url && <Text fontSize={13} color={BLUE} mt={4}>{proj.url}</Text>}
                     </VStack>
                 </HStack>
                 {idx < projects.length - 1 && <Divider color="#E0E0E0" mt={12} />}
              </VStack>
           )) : (
              <Text color="#666666">No projects listed.</Text>
           )}
        </Box>

        {/* Photos Section (At Last, Facebook Style) */}
        <Box bg="white" mt={8} mb={10} p={16}>
           <HStack justify="space-between" items="center" mb={16}>
              <VStack>
                 <Text fontSize={18} fontWeight="700" color="#000000">Photos</Text>
                 <Text fontSize={12} color="#666666" mt={2}>248 total photos</Text>
              </VStack>
              <TouchableOpacity onPress={() => navigation.navigate('PhotoViewer')}><Text fontSize={14} fontWeight="700" color={BLUE}>See all</Text></TouchableOpacity>
           </HStack>
            <HStack flexWrap="wrap" space="xs" justify="space-between" mt={12}>
               <Box w="100%" p={20} items="center">
                  <ImageIcon size={32} color="#D1D5DB" />
                  <Text mt={8} fontSize={13} color="#666666">No media uploaded yet.</Text>
               </Box>
            </HStack>
        </Box>

        <Modal visible={uploading} transparent animationType="fade">
           <Box flex={1} bg="rgba(0,0,0,0.5)" items="center" justify="center">
              <VStack bg="white" p={30} rounded={20} items="center">
                 <ActivityIndicator size="large" color={BLUE} />
                 <Text mt={16} fontWeight="600" color="#1C1E21">Uploading Photo...</Text>
                 <Text mt={4} fontSize={12} color="#65676B">Connecting to professional server</Text>
              </VStack>
           </Box>
        </Modal>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  coverCameraBtn: { 
    position: 'absolute', 
    right: 12, 
    bottom: 12, 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  avatarContainer: { 
    width: 120, 
    height: 120, 
    position: 'absolute', 
    top: -80, 
    left: 16 
  },
  mainAvatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    borderWidth: 4, 
    borderColor: 'white' 
  },
  profileCameraBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E4E6EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  settingsBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  moreBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#666666', alignItems: 'center', justifyContent: 'center' },
  photoBox: { width: (width - 48) / 3, height: (width - 48) / 3, marginBottom: 8 },
  galleryImage: { width: '100%', height: '100%', borderRadius: 8 },
});
