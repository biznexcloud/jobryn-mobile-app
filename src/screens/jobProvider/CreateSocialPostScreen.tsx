import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  Dimensions,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import {
  X,
  ChevronLeft,
  Image as ImageIcon,
  Globe,
  Smile,
  MapPin,
  Users,
  Video,
  ChevronDown,
} from 'lucide-react-native';
import { SocialService } from '../../services/api/social';
import { useAuthStore } from '../../store/authStore';
import { moderateScale } from '../../utils/responsive';

const FB_BLUE = '#1877F2';
const BG_COLORS = [
  '#FFFFFF', 
  '#FF4B2B',
  '#1877F2',
  '#8E2DE2',
  '#1D976C',
  '#000000',
];

export default function ProviderCreateSocialPostScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setBgIndex(0);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !image) {
      Alert.alert('Empty Post', 'Share a company update or insight.');
      return;
    }
    setLoading(true);
    try {
      await SocialService.createPost({ 
        content, 
        image, 
        backgroundColor: bgIndex > 0 ? BG_COLORS[bgIndex] : undefined 
      });
      Alert.alert('Published', 'Company update shared!', [{ text: 'Great', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Error', 'Failed to publish post.');
    } finally {
      setLoading(false);
    }
  };

  const ToolOption = ({ icon: Icon, label, color, onPress }: any) => (
    <TouchableOpacity style={styles.toolRow} onPress={onPress}>
       <Icon size={22} color={color} />
       <Text fontSize={16} color="#1C1E21" ml={12}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      
      <Box pt={insets.top + 10} pb={12} bg="white" borderBottom={1} borderColor="#E5E7EB">
         <HStack items="center" justify="space-between" px={16}>
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                  <ChevronLeft size={26} color="#1C1E21" />
               </TouchableOpacity>
               <Text fontSize={18} fontWeight="700" color="#1C1E21" ml={16}>Corporate Update</Text>
            </HStack>
            <Button 
               label={loading ? '...' : 'Publish'} 
               onPress={handlePost}
               disabled={loading || (!content.trim() && !image)}
               style={{ 
                  backgroundColor: (!content.trim() && !image) ? '#F0F2F5' : FB_BLUE, 
                  paddingHorizontal: 16, 
                  height: 36, 
                  borderRadius: 6 
               }}
               textStyle={{ color: (!content.trim() && !image) ? '#8E9194' : 'white', fontWeight: '800' }}
            />
         </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
         <Box p={16}>
            <HStack items="center" mb={16}>
               <Avatar source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150' }} size="lg" />
               <VStack ml={12}>
                  <Text fontSize={16} fontWeight="800" color="#1C1E21">{user?.name || 'Recruiter'}</Text>
                  <HStack space="sm" mt={4}>
                     <TouchableOpacity style={styles.audienceSelector}>
                        <Globe size={11} color="#65676B" />
                        <Text fontSize={11} fontWeight="800" color="#65676B" ml={4}>Public</Text>
                        <ChevronDown size={11} color="#65676B" style={{ marginLeft: 3 }} />
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.audienceSelector}>
                        <Users size={11} color="#65676B" />
                        <Text fontSize={11} fontWeight="800" color="#65676B" ml={4}>Talent Hub</Text>
                        <ChevronDown size={11} color="#65676B" style={{ marginLeft: 3 }} />
                     </TouchableOpacity>
                  </HStack>
               </VStack>
            </HStack>

            <Box 
              bg={bgIndex > 0 ? BG_COLORS[bgIndex] : 'transparent'} 
              rounded={12} 
              p={bgIndex > 0 ? 30 : 0}
              minHeight={bgIndex > 0 ? 300 : 150}
              items={bgIndex > 0 ? 'center' : 'stretch'}
              justify={bgIndex > 0 ? 'center' : 'flex-start'}
            >
               <TextInput 
                  multiline
                  placeholder="Share a workplace update..."
                  placeholderTextColor="#8E9194"
                  value={content}
                  onChangeText={setContent}
                  style={[
                    styles.postInput,
                    bgIndex > 0 && { color: 'white', textAlign: 'center', fontWeight: '800', width: '100%', fontSize: 24 }
                  ]}
               />
            </Box>

            {image && (
               <Box mt={16} position="relative">
                  <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
                  <TouchableOpacity onPress={() => setImage(undefined)} style={styles.removeImg}>
                     <X size={18} color="white" />
                  </TouchableOpacity>
               </Box>
            )}
         </Box>

         {!image && (
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bgScroll}>
              <HStack space="md" px={16} py={10}>
                 {BG_COLORS.map((bg, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      onPress={() => setBgIndex(idx)}
                      style={[
                        styles.bgChip, 
                        { backgroundColor: bg === '#FFFFFF' ? '#F0F2F5' : bg },
                        bgIndex === idx && styles.activeBgChip
                      ]}
                    >
                       {idx === 0 && <X size={14} color="#65676B" />}
                    </TouchableOpacity>
                 ))}
              </HStack>
           </ScrollView>
         )}

         <Box borderTop={1} borderColor="#E5E7EB" bg="white" style={{ marginTop: 20 }}>
            <Text fontSize={14} fontWeight="700" color="#1C1E21" p={16}>Add to your post</Text>
            <Divider color="#F0F2F5" />
            <VStack>
               <ToolOption icon={ImageIcon} label="Company Photo/video" color="#45BD62" onPress={pickImage} />
               <ToolOption icon={Users} label="Tag team members" color="#1877F2" />
               <ToolOption icon={Smile} label="Workplace feeling" color="#F7B928" />
               <ToolOption icon={MapPin} label="Office location" color="#F5533D" />
            </VStack>
         </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  audienceSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  postInput: { fontSize: 18, color: '#1C1E21', minHeight: 100, padding: 0, textAlignVertical: 'top' },
  previewImage: { width: '100%', height: 260, borderRadius: 12 },
  removeImg: { position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  toolRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  bgScroll: { maxHeight: 60, marginBottom: 20 },
  bgChip: { width: 36, height: 36, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  activeBgChip: { borderWidth: 3, borderColor: '#1877F2' },
});
