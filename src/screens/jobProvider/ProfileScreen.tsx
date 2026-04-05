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
  ChevronLeftIcon,
  CogIcon,
  CameraIcon,
  PencilIcon,
  PlusIcon,
  LocationMarkerIcon,
  UsersIcon,
  BriefcaseIcon,
  LinkIcon,
  GlobeAltIcon,
} from 'react-native-heroicons/outline';
import { useAuthStore } from '../../store/authStore';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';
const { width } = Dimensions.get('window');

const DUMMY_MEDIA = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400',
];

export default function ProviderProfileScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800');
  const [logoImage, setLogoImage] = useState<string | null>(null);

  const pickImage = async (type: 'logo' | 'cover') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photos to upload.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'logo' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'logo') setLogoImage(result.assets[0].uri);
      else setCoverImage(result.assets[0].uri);
      Alert.alert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} updated (Simulated)`);
    }
  };

  const fetchData = async () => {
    try {
      // Mock or Real API
      await new Promise(r => setTimeout(r, 800));
      setActiveJobs([{ id: 1, title: 'Senior Software Engineer', location: 'London, UK', created_at: '2 days ago' }]);
    } catch (e) {
      console.warn('Provider profile fetch error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <Box flex={1} bg="white" justify="center" items="center">
        <ActivityIndicator size="large" color={BLUE} />
      </Box>
    );
  }

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="#FFFFFF">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, backgroundColor: GRAY_BG }}>
        
        {/* Banner Section */}
        <Box height={200} bg="#A0A0A0">
           <Image 
              source={{ uri: coverImage }}
              style={StyleSheet.absoluteFill}
           />
           <Box position="absolute" top={insets.top + 12} left={16}>
              <TouchableOpacity onPress={() => navigation?.goBack()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                 <ChevronLeftIcon size={24} color="white" strokeWidth={2} />
              </TouchableOpacity>
           </Box>
           
           {/* Cover Camera Button */}
           <TouchableOpacity 
              onPress={() => pickImage('cover')} 
              style={styles.coverCameraBtn}
           >
              <CameraIcon size={20} color="#1C1E21" />
           </TouchableOpacity>

           <Box position="absolute" bottom={-40} left={16}>
              <Box p={3} bg="white" rounded={8} shadow={2} style={{ position: 'relative' }}>
                 <Box w={80} h={80} bg={GRAY_BG} rounded={4} items="center" justify="center">
                    {logoImage ? (
                       <Image source={{ uri: logoImage }} style={{ width: 80, height: 80, borderRadius: 4 }} />
                    ) : (
                       <BriefcaseIcon size={40} color="#666666" />
                    )}
                 </Box>
                 {/* Logo Camera Button */}
                 <TouchableOpacity 
                    onPress={() => pickImage('logo')} 
                    style={styles.logoCameraBtn}
                 >
                    <CameraIcon size={16} color="#1C1E21" />
                 </TouchableOpacity>
              </Box>
           </Box>
        </Box>

        {/* Company Info Header */}
        <Box bg="white" px={16} pt={64} pb={20}>
           <HStack justify="space-between" items="flex-start">
              <VStack flex={1}>
                 <Text fontSize={24} fontWeight="700" color="#000000">Nexus Corp</Text>
                 <Text fontSize={16} color="#000000" mt={4} fontWeight="500">Technology • London, United Kingdom</Text>
                 <Text fontSize={14} color="#666666" mt={4}>500-1,000 employees • 12,402 followers</Text>
              </VStack>
              <TouchableOpacity onPress={() => navigation?.navigate('ProviderEditProfile')}>
                 <PencilIcon size={22} color="#666666" />
              </TouchableOpacity>
           </HStack>

           <HStack mt={20} space="md">
              <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('PostJob')}>
                 <PlusIcon size={20} color="white" strokeWidth={2} />
                 <Text fontSize={15} fontWeight="700" color="white" ml={8}>Post a job</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => {}}>
                 <Text fontSize={15} fontWeight="700" color={BLUE}>Edit Page</Text>
              </TouchableOpacity>
           </HStack>
        </Box>

        {/* About Section */}
        <Box bg="white" mt={8} p={16}>
           <HStack justify="space-between" items="center" mb={12}>
              <Text fontSize={18} fontWeight="700" color="#000000">About</Text>
              <TouchableOpacity><PencilIcon size={20} color="#666666" /></TouchableOpacity>
           </HStack>
           <Text fontSize={15} color="#1C1E21" lineHeight={22}>
              Nexus Corp is a leading technology company focused on building the next generation of digital infrastructure. We are committed to fostering an inclusive work environment.
           </Text>
        </Box>

        {/* Details Section */}
        <Box bg="white" mt={8} p={16}>
           <Text fontSize={18} fontWeight="700" color="#000000" mb={16}>Details</Text>
           <VStack space="md">
              <HStack items="center" space="md">
                 <GlobeAltIcon size={20} color="#666666" />
                 <Text fontSize={14} color={BLUE} fontWeight="700">nexus.com</Text>
              </HStack>
              <HStack items="center" space="md">
                 <UsersIcon size={20} color="#666666" />
                 <Text fontSize={14} color="#000000">500-1,000 employees</Text>
              </HStack>
              <HStack items="center" space="md">
                 <LocationMarkerIcon size={20} color="#666666" />
                 <Text fontSize={14} color="#000000">London, United Kingdom</Text>
              </HStack>
           </VStack>
        </Box>

        {/* Media Gallery Section (Facebook Style) */}
        <Box bg="white" mt={8} p={16}>
           <HStack justify="space-between" items="center" mb={16}>
              <VStack>
                 <Text fontSize={18} fontWeight="700" color="#000000">Media Gallery</Text>
                 <Text fontSize={12} color="#666666" mt={2}>Showcasing our culture and workplace</Text>
              </VStack>
              <TouchableOpacity><Text fontSize={14} fontWeight="700" color={BLUE}>See all</Text></TouchableOpacity>
           </HStack>
           <HStack flexWrap="wrap" space="xs" justify="space-between">
              {DUMMY_MEDIA.map((uri, i) => (
                 <TouchableOpacity key={i} style={styles.mediaBox}>
                    <Image source={{ uri }} style={styles.galleryImage} />
                 </TouchableOpacity>
              ))}
           </HStack>
        </Box>

        {/* Active Jobs Section */}
        <Box bg="white" mt={8} p={16}>
           <HStack justify="space-between" items="center" mb={16}>
              <Text fontSize={18} fontWeight="700" color="#000000">Active Jobs ({activeJobs.length})</Text>
              <TouchableOpacity onPress={() => navigation.navigate('JobPostings')}><Text fontSize={14} fontWeight="700" color={BLUE}>See all</Text></TouchableOpacity>
           </HStack>
           {activeJobs.map((job, idx) => (
              <TouchableOpacity key={idx} style={styles.jobCard}>
                 <HStack p={12} bg={GRAY_BG} rounded={8} items="center">
                    <Box w={40} h={40} bg="white" rounded={4} items="center" justify="center">
                       <BriefcaseIcon size={24} color="#666666" />
                    </Box>
                    <VStack ml={12} flex={1}>
                       <Text fontSize={15} fontWeight="700" color="#000000">{job.title}</Text>
                       <Text fontSize={12} color="#666666">{job.location} • {job.created_at}</Text>
                    </VStack>
                    <ChevronLeftIcon size={18} color="#999999" style={{ transform:[{rotate:'180deg'}] }} />
                 </HStack>
              </TouchableOpacity>
           ))}
        </Box>

        <Box py={32} items="center">
           <Text fontSize={12} color="#999999" fontWeight="700">JOBRYN RECRUITER</Text>
           <Text fontSize={11} color="#999999" mt={4}>Professional Page Management v1.1.0</Text>
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  primaryBtn: { height: 40, paddingHorizontal: 20, backgroundColor: BLUE, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  secondaryBtn: { height: 40, paddingHorizontal: 20, borderWidth: 1, borderColor: BLUE, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  jobCard: { marginBottom: 12 },
  coverCameraBtn: { 
    position: 'absolute', 
    right: 12, 
    bottom: 12, 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
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
  logoCameraBtn: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E4E6EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mediaBox: { width: (width - 48) / 3, height: (width - 48) / 3, marginBottom: 8 },
  galleryImage: { width: '100%', height: '100%', borderRadius: 8 },
});





