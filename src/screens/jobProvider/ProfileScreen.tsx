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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Settings,
  Camera,
  Pencil,
  Plus,
  MapPin,
  Users,
  Briefcase,
  Link,
  Globe,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { JobService } from '../../services/api/jobs';
import { ProfileService } from '../../services/api/profile';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';
const { width } = Dimensions.get('window');


import { useFocusEffect } from '@react-navigation/native';

export default function ProviderProfileScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800');
  const [logoImage, setLogoImage] = useState<string | null>(null);

  const pickImage = async (type: 'logo' | 'cover') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your photos to upload.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'logo' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'logo') setLogoImage(result.assets[0].uri);
      else setCoverImage(result.assets[0].uri);
    }
  };

  const fetchData = async () => {
    try {
      const [profiles, jobs] = await Promise.all([
        ProfileService.getRecruiterProfiles(),
        JobService.getRecruiterJobs()
      ]);
      setProfile(profiles?.results?.[0] || { company_name: user?.name || 'My Company', industry: 'Company', location: 'Global' });
      setActiveJobs(jobs?.results || []);
    } catch (e) {
      console.warn('Profile fetch failed', e);
      setProfile({ company_name: user?.name, industry: 'Company', bio: 'Expert recruiters' });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <Box flex={1} bg="white" justify="center" items="center">
        <ActivityIndicator size="small" color={FB_BLUE} />
      </Box>
    );
  }

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />
      
      {/* Sticky Header */}
      <Box pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
         <HStack px={16} justify="space-between" items="center">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
                  <ChevronLeft size={22} color="black" strokeWidth={2.5} />
               </TouchableOpacity>
               <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Company Profile</Text>
            </HStack>
            <TouchableOpacity style={styles.headerIcon} onPress={() => navigation?.navigate('ProviderSettings')}>
               <Settings size={20} color="black" />
            </TouchableOpacity>
         </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Banner Section */}
        <Box height={160} bg="#E5E7EB">
           <Image source={{ uri: coverImage }} style={StyleSheet.absoluteFill} />
           <TouchableOpacity 
              onPress={() => pickImage('cover')} 
              style={styles.coverCameraBtn}
           >
              <Camera size={18} color="black" />
           </TouchableOpacity>
        </Box>

        {/* Identity Section */}
        <Box bg="white" px={16} pb={20}>
           <Box mt={-50}>
              <Box p={3} bg="white" rounded={60} shadow={1}>
                 <Avatar 
                    source={{ uri: logoImage || user?.profile_picture || 'https://i.pravatar.cc/150' }} 
                    size="xl" 
                 />
                 <TouchableOpacity 
                    onPress={() => pickImage('logo')} 
                    style={styles.logoCameraBtn}
                 >
                    <Camera size={14} color="black" />
                 </TouchableOpacity>
              </Box>
           </Box>

           <VStack mt={16}>
              <Text fontSize={22} fontWeight="700" color="#111827">{profile?.company_name || user?.name || 'Recruiter'}</Text>
              <Text fontSize={15} color={GRAY_TEXT} mt={2}>{profile?.industry || 'Professional'} • {profile?.location || 'Kathmandu, Nepal'}</Text>
              <Text fontSize={13} color={GRAY_TEXT} mt={4}>{profile?.company_size || '1–10'} employees • 0 followers</Text>
           </VStack>

           <HStack mt={20} space="sm">
              <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('PostJob')}>
                 <Text fontSize={14} fontWeight="700" color="white">Post a Job</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation?.navigate('EditProfile')}>
                 <Text fontSize={14} fontWeight="700" color="#111827">Edit Profile</Text>
              </TouchableOpacity>
           </HStack>
        </Box>

        {/* About Section */}
        <Box bg="white" mt={8} p={16}>
           <HStack justify="space-between" items="center" mb={12}>
              <Text fontSize={17} fontWeight="700" color="#111827">About</Text>
              <TouchableOpacity><Pencil size={18} color={GRAY_TEXT} /></TouchableOpacity>
           </HStack>
           <Text fontSize={15} color="#4B5563" lineHeight={22}>
              {profile?.description || profile?.bio || profile?.about || 'No company bio provided yet. Add a few sentences to attract candidates.'}
           </Text>
        </Box>

        {/* Company Details */}
        <Box bg="white" mt={8} p={16}>
           <Text fontSize={17} fontWeight="700" color="#111827" mb={16}>Details</Text>
           <VStack space="md">
               <HStack items="center" space="md">
                  <Globe size={18} color="#9BA3AF" />
                  <Text fontSize={14} color={FB_BLUE} fontWeight="700">{profile?.website || 'nexus.com'}</Text>
               </HStack>
               <HStack items="center" space="md">
                  <Users size={18} color="#9BA3AF" />
                  <Text fontSize={14} color="#111827">{profile?.company_size || '1–10'} employees</Text>
               </HStack>
               <HStack items="center" space="md">
                  <MapPin size={18} color="#9BA3AF" />
                  <Text fontSize={14} color="#111827">{profile?.location || 'Kathmandu, NP'}</Text>
               </HStack>
           </VStack>
        </Box>

        {/* Media Gallery */}
        {(profile?.gallery_images && profile.gallery_images.length > 0) && (
          <Box bg="white" mt={8} p={16}>
             <HStack justify="space-between" items="center" mb={16}>
                <VStack>
                   <Text fontSize={17} fontWeight="700" color="#111827">Gallery</Text>
                   <Text fontSize={12} color={GRAY_TEXT} mt={2}>Life at {profile?.company_name || 'the company'}</Text>
                </VStack>
                <TouchableOpacity><Text fontSize={14} fontWeight="700" color={FB_BLUE}>See all</Text></TouchableOpacity>
             </HStack>
             <HStack flexWrap="wrap" space="xs">
                {profile.gallery_images.map((uri: string, i: number) => (
                   <TouchableOpacity key={i} style={styles.mediaBox}>
                      <Image source={{ uri }} style={styles.galleryImage} />
                   </TouchableOpacity>
                ))}
             </HStack>
          </Box>
        )}

        {/* Active Jobs */}
        <Box bg="white" mt={8} p={16}>
           <HStack justify="space-between" items="center" mb={16}>
              <Text fontSize={17} fontWeight="700" color="#111827">Active Jobs</Text>
              {activeJobs.length > 0 && <TouchableOpacity onPress={() => navigation.navigate('JobPostings')}><Text fontSize={14} fontWeight="700" color={FB_BLUE}>See all</Text></TouchableOpacity>}
           </HStack>
           {activeJobs.length > 0 ? activeJobs.map((job, idx) => (
              <TouchableOpacity key={idx} style={styles.jobItem} onPress={() => navigation.navigate('JobPostings')}>
                 <HStack items="center" space="md">
                    <Box w={40} h={40} bg="#F3F4F6" rounded={8} items="center" justify="center">
                       <Briefcase size={20} color="#6B7280" />
                    </Box>
                    <VStack flex={1}>
                       <Text fontSize={15} fontWeight="700" color="#111827">{job.title}</Text>
                       <Text fontSize={13} color={GRAY_TEXT}>{job.location || 'Remote'} • {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}</Text>
                    </VStack>
                 </HStack>
              </TouchableOpacity>
           )) : (
              <Box p={20} items="center">
                 <Text fontSize={14} color={GRAY_TEXT}>No active jobs posted yet.</Text>
                 <TouchableOpacity onPress={() => navigation.navigate('PostJob')} style={{ marginTop: 12 }}>
                    <Text fontSize={14} fontWeight="700" color={FB_BLUE}>Post a Job</Text>
                 </TouchableOpacity>
              </Box>
           )}
        </Box>

        <Box py={40} items="center">
           <Text fontSize={12} color="#D1D5DB" fontWeight="700">JOBRYN RECRUITER</Text>
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { flex: 1, height: 38, backgroundColor: FB_BLUE, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  secondaryBtn: { flex: 1, height: 38, backgroundColor: '#F0F2F5', borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  coverCameraBtn: { position: 'absolute', right: 12, bottom: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  logoCameraBtn: { position: 'absolute', right: -4, bottom: 4, width: 30, height: 30, borderRadius: 15, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white' },
  mediaBox: { width: (width - 48) / 3, height: (width - 48) / 3, marginBottom: 8, borderRadius: 8, overflow: 'hidden' },
  galleryImage: { width: '100%', height: '100%' },
  jobItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
});





