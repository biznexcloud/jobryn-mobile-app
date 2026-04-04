import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Button } from '../../components/ui';
import {
  X,
  Image as ImageIcon,
  Smile,
  Type,
  Palette,
  ChevronLeft,
  Music,
  Sticker,
  Check,
} from 'lucide-react-native';
import { SocialService } from '../../services/api/social';
import { useAuthStore } from '../../store/authStore';
import { moderateScale } from '../../utils/responsive';

const { width, height } = Dimensions.get('window');
const FB_BLUE = '#1877F2';
const BG_GRADIENTS = [
  ['#FF4B2B', '#FF416C'],
  ['#1877F2', '#00C6FF'],
  ['#8E2DE2', '#4A00E0'],
  ['#1D976C', '#93F9B9'],
  ['#f7971e', '#ffd200'],
  ['#000000', '#434343'],
];

const FONTS = [
  { name: 'Classic', style: { fontWeight: '400' as any } },
  { name: 'Modern', style: { fontWeight: '800' as any } },
  { name: 'Fancy', style: { fontStyle: 'italic' as any } },
];

export default function CreateStoryScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  
  // States: 'select' | 'text' | 'media'
  const [mode, setMode] = useState<'select' | 'text' | 'media'>('select');
  const [image, setImage] = useState<string | null>(null);
  const [typedText, setTypedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [fontIndex, setFontIndex] = useState(0);

  const reset = () => {
    setMode('select');
    setImage(null);
    setTypedText('');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setMode('media');
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      await SocialService.uploadStory({ 
        uri: image || undefined, 
        text: typedText,
        bg: mode === 'text' ? BG_GRADIENTS[bgIndex] : undefined,
        user 
      });
      Alert.alert('Success', 'Story shared!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Error', 'Failed to share story.');
    } finally {
      setLoading(false);
    }
  };

  const renderSelector = () => (
    <Box flex={1} bg="white" p={16}>
      <HStack items="center" mb={24} pt={insets.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <ChevronLeft size={28} color="#1C1E21" />
        </TouchableOpacity>
        <Text fontSize={20} fontWeight="800" color="#1C1E21" ml={16}>Create Story</Text>
      </HStack>

      <HStack space="md" h={moderateScale(180)}>
        <TouchableOpacity 
          style={[styles.modeCard, { backgroundColor: '#F0F2F5' }]}
          onPress={() => setMode('text')}
        >
          <VStack items="center">
            <View style={[styles.iconCircle, { backgroundColor: '#E4E6EB' }]}>
               <Type size={30} color="#1C1E21" />
            </View>
            <Text fontSize={16} fontWeight="700" color="#1C1E21" mt={12}>Text</Text>
          </VStack>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.modeCard, { backgroundColor: '#E7F3FF' }]}
          onPress={pickImage}
        >
          <VStack items="center">
            <View style={[styles.iconCircle, { backgroundColor: '#D1E8FF' }]}>
               <ImageIcon size={30} color={FB_BLUE} />
            </View>
            <Text fontSize={16} fontWeight="700" color={FB_BLUE} mt={12}>Music / Photo</Text>
          </VStack>
        </TouchableOpacity>
      </HStack>

      <Text fontSize={15} fontWeight="700" color="#65676B" mt={24} mb={16}>Choose from library</Text>
      <View style={styles.placeholderGrid}>
         {[1,2,3,4,5,6].map(i => (
           <TouchableOpacity key={i} onPress={pickImage} style={styles.gridItem}>
              <View style={{ flex: 1, backgroundColor: '#F0F2F5', borderRadius: 8 }} />
           </TouchableOpacity>
         ))}
      </View>
    </Box>
  );

  const renderEditor = () => (
    <Box flex={1} bg={mode === 'text' ? BG_GRADIENTS[bgIndex][0] : 'black'}>
      <StatusBar barStyle="light-content" />
      
      {mode === 'media' && image && (
        <Image source={{ uri: image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      )}

      {/* Editor UI */}
      <Box flex={1} pt={insets.top + 10} px={16}>
        <HStack justify="space-between" items="center">
           <TouchableOpacity onPress={reset} style={styles.editorActionBtn}>
              <X size={24} color="white" />
           </TouchableOpacity>
           
           <VStack space="md">
              <TouchableOpacity style={styles.editorToolBtn}>
                 <Sticker size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editorToolBtn} onPress={() => mode === 'text' && setBgIndex((bgIndex + 1) % BG_GRADIENTS.length)}>
                 <Palette size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editorToolBtn}>
                 <Music size={22} color="white" />
              </TouchableOpacity>
           </VStack>
        </HStack>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <TextInput
            multiline
            autoFocus
            placeholder={mode === 'text' ? 'Start typing...' : 'Add some detail...'}
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={typedText}
            onChangeText={setTypedText}
            style={[
              styles.editorInput, 
              FONTS[fontIndex].style,
              { fontSize: typedText.length > 40 ? 24 : 32 }
            ]}
          />
        </KeyboardAvoidingView>

        {/* Font Selector if text mode */}
        {mode === 'text' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 60 }}>
            <HStack space="sm" pb={10}>
               {FONTS.map((f, i) => (
                 <TouchableOpacity 
                   key={f.name} 
                   onPress={() => setFontIndex(i)}
                   style={[styles.fontChip, fontIndex === i && styles.activeFontChip]}
                 >
                    <Text fontSize={14} fontWeight="700" color={fontIndex === i ? FB_BLUE : 'white'}>{f.name}</Text>
                 </TouchableOpacity>
               ))}
            </HStack>
          </ScrollView>
        )}

        <Box pb={insets.bottom + 20}>
           <HStack justify="space-between" items="center">
              <HStack items="center">
                 <Avatar source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150' }} size="md" />
                 <VStack ml={10}>
                    <Text fontSize={13} fontWeight="800" color="white">Your Story</Text>
                    <Text fontSize={11} color="rgba(255,255,255,0.7)">Public</Text>
                 </VStack>
              </HStack>
              <Button 
                label={loading ? 'Sharing...' : 'Share to Story'}
                onPress={handleUpload}
                style={{ backgroundColor: FB_BLUE, borderRadius: 24, paddingHorizontal: 20, height: 44 }}
                textStyle={{ fontWeight: '800' }}
              />
           </HStack>
        </Box>
      </Box>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      {mode === 'select' ? renderSelector() : renderEditor()}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  modeCard: { flex: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  placeholderGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: { width: (width - 42) / 3, height: 160 },
  editorActionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  editorToolBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  editorInput: { color: 'white', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  fontChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  activeFontChip: { backgroundColor: 'white', borderColor: 'white' },
});
