import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Camera,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';
import { ProfileService } from '../../services/api/profile';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import Toast from 'react-native-toast-message';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

export default function ProviderEditProfileScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [about, setAbout] = useState('');
  const [logoImage, setLogoImage] = useState<string | null>(user?.profile_picture || null);
  const [hasNewLogo, setHasNewLogo] = useState(false);
  const [profileId, setProfileId] = useState<string | number | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resp = await ProfileService.getRecruiterProfiles();
        const profile = resp?.results?.[0];
        if (profile) {
          setProfileId(profile.id);
          setName(profile.user_detail?.name || user?.name || '');
          setIndustry(profile.headline || '');
          setAbout(profile.about || '');
        }
      } catch (e) {
        setName(user?.name || '');
      }
    };
    fetchProfile();
  }, []);

  const pickImage = async (type: 'logo' | 'banner') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your photos to upload.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLogoImage(result.assets[0].uri);
      setHasNewLogo(true);
    }
  };

  const handleSave = async () => {
    if (!profileId) {
      Toast.show({ type: 'error', text1: 'Profile not loaded' });
      return;
    }
    setLoading(true);
    try {
      // 1. Update Account (Name and Profile Picture)
      const accountData = new FormData();
      accountData.append('name', name);
      
      if (hasNewLogo && logoImage) {
        const filename = logoImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;
        accountData.append('profile_picture', { uri: logoImage, name: filename, type } as any);
      }

      await ProfileService.updateAccountProfile(accountData);

      // 2. Update Recruiter Profile
      const profileData = new FormData();
      profileData.append('headline', industry); // Maps to headline in API
      profileData.append('about', about);

      await ProfileService.updateRecruiterProfile(profileId, profileData);

      // 3. Refresh Global State
      const updatedUser = await ProfileService.getAccountProfile();
      useAuthStore.getState().setUser(updatedUser);

      Toast.show({ type: 'success', text1: 'Profile updated' });
      navigation?.goBack();
    } catch (e) {
      console.error(e);
      Toast.show({ type: 'error', text1: 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, value, onChangeText, placeholder, multiline = false }: any) => (
    <VStack mb={20}>
       <Text fontSize={13} fontWeight="700" color={GRAY_TEXT} mb={8} ml={4}>{label.toUpperCase()}</Text>
       <Box bg={FB_GRAY} rounded={12} px={14} py={12} minH={multiline ? 120 : 50}>
          <TextInput 
             value={value}
             onChangeText={onChangeText}
             placeholder={placeholder}
             placeholderTextColor="#9CA3AF"
             multiline={multiline}
             style={styles.input}
             textAlignVertical={multiline ? 'top' : 'center'}
          />
       </Box>
    </VStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box px={16} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center" justify="space-between">
          <HStack items="center">
             <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
                <X size={22} color="black" strokeWidth={2.5} />
             </TouchableOpacity>
             <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Edit Profile</Text>
          </HStack>
          <TouchableOpacity disabled={loading} onPress={handleSave}>
             {loading ? <ActivityIndicator size="small" color={FB_BLUE} /> : <Text fontSize={15} fontWeight="700" color={FB_BLUE}>Save</Text>}
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Avatar Preview */}
        <Box items="center" mt={32}>
           <Box p={3} bg="white" rounded={60} shadow={1} style={{ position: 'relative' }}>
              <Avatar 
                 source={{ uri: logoImage || user?.profile_picture || 'https://i.pravatar.cc/150' }} 
                 size="xl" 
              />
              <TouchableOpacity style={styles.avatarCam} onPress={() => pickImage('logo')}>
                 <Camera size={16} color="black" />
              </TouchableOpacity>
           </Box>
        </Box>

        <VStack px={16} mt={40}>
           <InputField label="Company Name" value={name} onChangeText={setName} />
           <InputField label="Headline/Industry" value={industry} onChangeText={setIndustry} placeholder="e.g. Technology" />
           
           <Divider my={10} color="#F3F4F6" />
           
           <InputField label="About" value={about} onChangeText={setAbout} placeholder="Share your company mission..." multiline />
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  input: { fontSize: 15, color: '#111827', fontWeight: '500', padding: 0 },
  avatarCam: { position: 'absolute', right: 0, bottom: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white' },
});





