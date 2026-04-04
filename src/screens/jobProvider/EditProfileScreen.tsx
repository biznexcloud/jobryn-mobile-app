import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  XIcon as XIcon,
  ChevronRightIcon,
  CameraIcon,
  BriefcaseIcon,
  LinkIcon,
  LocationMarkerIcon,
  PencilIcon,
} from 'react-native-heroicons/outline';
import { useAuthStore } from '../../store/authStore';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import Toast from 'react-native-toast-message';

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

export default function ProviderEditProfileScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || 'Nexus Corp');
  const [industry, setIndustry] = useState('Technology');
  const [location, setLocation] = useState('London, United Kingdom');
  const [website, setWebsite] = useState('nexus.com');
  const [about, setAbout] = useState('');

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 1000));
      Toast.show({ type: 'success', text1: 'Profile updated' });
      navigation?.goBack();
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, value, onChangeText, placeholder, multiline = false }: any) => (
    <VStack mb={20}>
       <Text fontSize={14} fontWeight="700" color="#666666" mb={8}>{label}</Text>
       <Box bg={GRAY_BG} rounded={4} p={12} minH={multiline ? 100 : 48} justify="center">
          <TextInput 
             value={value}
             onChangeText={onChangeText}
             placeholder={placeholder}
             placeholderTextColor="#999999"
             multiline={multiline}
             style={styles.input}
          />
       </Box>
    </VStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="#FFFFFF">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <Box px={16} pt={insets.top + 12} py={12} bg="white" borderBottom={1} borderColor="#E0E0E0">
        <HStack items="center" justify="space-between">
          <HStack items="center">
             <TouchableOpacity onPress={() => navigation?.goBack()} style={{ marginRight: 16 }}>
                <XIcon size={24} color="#000000" strokeWidth={2} />
             </TouchableOpacity>
             <Text fontSize={18} fontWeight="700" color="#000000">Edit company profile</Text>
          </HStack>
          <TouchableOpacity disabled={loading} onPress={handleSave}>
             {loading ? <ActivityIndicator size="small" color={BLUE} /> : <Text fontSize={16} fontWeight="700" color={BLUE}>Save</Text>}
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Banner & Avatar */}
        <Box>
           <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' }}
              style={{ width: '100%', height: 100 }}
           />
           <Box position="absolute" bottom={-40} left={16}>
              <Box p={2} bg="white" rounded={8}>
                 <Box w={80} h={80} bg={GRAY_BG} rounded={4} items="center" justify="center">
                    <BriefcaseIcon size={40} color="#666666" />
                 </Box>
                 <TouchableOpacity style={{ position: 'absolute', right: -10, bottom: -10, width: 28, height: 28, borderRadius: 14, backgroundColor: 'white', borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' }}>
                    <CameraIcon size={16} color={BLUE} />
                 </TouchableOpacity>
              </Box>
           </Box>
        </Box>

        <VStack px={16} mt={50}>
           <InputField label="Company name *" value={name} onChangeText={setName} />
           <InputField label="Industry *" value={industry} onChangeText={setIndustry} placeholder="Ex: Technology" />
           <InputField label="Location *" value={location} onChangeText={setLocation} placeholder="Ex: London, United Kingdom" />
           <InputField label="Website" value={website} onChangeText={setWebsite} placeholder="Ex: nexus.com" />
           
           <Divider my={20} color="#F3F2EF" />
           
           <Text fontSize={18} fontWeight="700" color="#000000" mb={16}>About the Company</Text>
           <InputField label="Summary" value={about} onChangeText={setAbout} placeholder="Talk about your company mission and culture" multiline />
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  input: { fontSize: 16, color: '#000000', fontWeight: '500', padding: 0 }
});





