import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider } from '../../components/ui';
import {
  X,
  ChevronLeft,
  Image as ImageIcon,
  Globe,
  Smile,
  MapPin,
  Users,
  ChevronDown,
} from 'lucide-react-native';
import { SocialService } from '../../services/api/social';
import { useAuthStore } from '../../store/authStore';
import Toast from 'react-native-toast-message';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

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
      mediaTypes: ['images'],
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
      Alert.alert('Required', 'Please share a post update.');
      return;
    }
    setLoading(true);
    try {
      await SocialService.createPost({ 
        content: content.trim() || ' ',  // Backend requires non-blank content
        image,
        visibility: 'public',
      });
      Toast.show({ type: 'success', text1: 'Post published' });
      navigation.goBack();
    } catch (e: any) {
      const errorMessage = e?.message || JSON.stringify(e?.response?.data);
      Alert.alert('Post Failed', `Could not publish your post.\n\n${errorMessage}`);
      setLoading(false);
    }
  };

  const ToolOption = ({ icon: Icon, label, color, onPress }: any) => (
    <TouchableOpacity style={styles.toolRow} onPress={onPress}>
       <Box w={36} h={36} rounded={18} bg={FB_GRAY} items="center" justify="center">
          <Icon size={18} color={color} />
       </Box>
       <Text fontSize={15} fontWeight="600" color="#111827" ml={12}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box px={16} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
         <HStack items="center" justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                  <ChevronLeft size={22} color="black" strokeWidth={2.5} />
               </TouchableOpacity>
               <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Create Post</Text>
            </HStack>
            <TouchableOpacity 
               disabled={loading || (!content.trim() && !image)}
               onPress={handlePost}
               style={[styles.postBtn, (!content.trim() && !image) && { opacity: 0.5 }]}
            >
               <Text fontSize={14} fontWeight="700" color="white">{loading ? "..." : "Post"}</Text>
            </TouchableOpacity>
         </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
         <Box p={16}>
            <HStack items="center" mb={16}>
               <Avatar source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150' }} size="md" />
               <VStack ml={12}>
                  <Text fontSize={15} fontWeight="700" color="#111827">{user?.name || 'Recruiter'}</Text>
                  <HStack space="xs" mt={2}>
                     <TouchableOpacity style={styles.selector}>
                        <Box items="center" flexDirection="row">
                           <Globe size={11} color={GRAY_TEXT} />
                           <Text fontSize={10} fontWeight="700" color={GRAY_TEXT} ml={4}>Public</Text>
                        </Box>
                        <ChevronDown size={11} color={GRAY_TEXT} style={{ marginLeft: 2 }} />
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.selector}>
                        <Box items="center" flexDirection="row">
                           <Users size={11} color={GRAY_TEXT} />
                           <Text fontSize={10} fontWeight="700" color={GRAY_TEXT} ml={4}>Candidates</Text>
                        </Box>
                        <ChevronDown size={11} color={GRAY_TEXT} style={{ marginLeft: 2 }} />
                     </TouchableOpacity>
                  </HStack>
               </VStack>
            </HStack>

            <Box 
              bg={bgIndex > 0 ? BG_COLORS[bgIndex] : 'transparent'} 
              rounded={16} 
              p={bgIndex > 0 ? 30 : 0}
              minHeight={bgIndex > 0 ? 250 : 120}
              items={bgIndex > 0 ? 'center' : 'stretch'}
              justify={bgIndex > 0 ? 'center' : 'flex-start'}
            >
               <TextInput 
                  multiline
                  placeholder="What's happening at the company?"
                  placeholderTextColor="#9CA3AF"
                  value={content}
                  onChangeText={setContent}
                  style={[
                    styles.input,
                    bgIndex > 0 && { color: 'white', textAlign: 'center', fontWeight: '800', width: '100%', fontSize: 22 }
                  ]}
               />
            </Box>

            {image && (
               <Box mt={16} position="relative" rounded={16} overflow="hidden">
                  <Image source={{ uri: image }} style={styles.preview} resizeMode="cover" />
                  <TouchableOpacity onPress={() => setImage(undefined)} style={styles.removeBtn}>
                     <X size={16} color="white" />
                  </TouchableOpacity>
               </Box>
            )}
         </Box>

         {!image && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 60, marginBottom: 12 }}>
               <HStack space="sm" px={16} items="center">
                  {BG_COLORS.map((bg, idx) => (
                     <TouchableOpacity 
                       key={idx} 
                       onPress={() => setBgIndex(idx)}
                       style={[
                         styles.bgChip, 
                         { backgroundColor: bg === '#FFFFFF' ? '#F0F2F5' : bg },
                         bgIndex === idx && { borderWidth: 2, borderColor: FB_BLUE }
                       ]}
                     >
                        {idx === 0 && <X size={14} color={GRAY_TEXT} />}
                     </TouchableOpacity>
                  ))}
               </HStack>
            </ScrollView>
         )}

         <Box borderTop={1} borderColor="#F0F2F5" mt={12}>
            <VStack mt={12}>
               <ToolOption icon={ImageIcon} label="Photo / Video" color="#10B981" onPress={pickImage} />
               <ToolOption icon={Users} label="Tag team members" color={FB_BLUE} />
               <ToolOption icon={Smile} label="Feeling / Activity" color="#F59E0B" />
               <ToolOption icon={MapPin} label="Check in" color="#EF4444" />
            </VStack>
         </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  postBtn: { backgroundColor: FB_BLUE, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 18 },
  selector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  input: { fontSize: 18, color: '#111827', minHeight: 100, padding: 0, textAlignVertical: 'top' },
  preview: { width: '100%', height: 260 },
  removeBtn: { position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  toolRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  bgChip: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F0F2F5' },
});
