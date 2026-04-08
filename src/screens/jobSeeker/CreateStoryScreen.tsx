import React, { useState, useRef } from 'react';
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
  Modal,
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
  Settings,
  Scissors,
  Wand2,
  Lock,
  Globe,
  Users,
  Layout,
  Instagram,
  Clapperboard,
  Camera,
  AtSign,
  Link2,
  Sparkles,
} from 'lucide-react-native';
import { SocialService } from '../../services/api/social';
import { useAuthStore } from '../../store/authStore';
import { moderateScale, verticalScale } from '../../utils/responsive';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  Layout as AnimatedLayout 
} from 'react-native-reanimated';
import { DraggableElement } from '../../components/story/DraggableElement';

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

const STORY_MODES = [
  { id: 'text', title: 'Text', icon: Type, color: '#E4E6EB', iconColor: '#1C1E21' },
  { id: 'music', title: 'Music', icon: Music, color: '#E7F3FF', iconColor: FB_BLUE },
  { id: 'green_screen', title: 'Green Screen', icon: Layout, color: '#F0F2F5', iconColor: '#45BD62' },
  { id: 'boomerang', title: 'Boomerang', icon: Clapperboard, color: '#F0F2F5', iconColor: '#F3425F' },
  { id: 'selfie', title: 'Selfie', icon: Camera, color: '#F0F2F5', iconColor: '#F7B928' },
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
  const [activeStoryType, setActiveStoryType] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [typedText, setTypedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [fontIndex, setFontIndex] = useState(0);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'lock'>('public');
  const [textBgStyle, setTextBgStyle] = useState<'none' | 'semi' | 'solid'>('none');
  const [showStickers, setShowStickers] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [isInstagramOn, setIsInstagramOn] = useState(true);
  
  // Movable Element States
  const [isTyping, setIsTyping] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [storyElements, setStoryElements] = useState<any[]>([]);

  const reset = () => {
    setMode('select');
    setImage(null);
    setTypedText('');
    setTextBgStyle('none');
    setStoryElements([]);
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

  const addStoryElement = (element: any) => {
    setStoryElements([...storyElements, {
      id: Math.random().toString(),
      x: 0,
      y: 0,
      ...element
    }]);
  };

  const handleAddText = () => {
    if (typedText.trim()) {
      addStoryElement({
        type: 'text',
        content: typedText,
        bgStyle: textBgStyle,
        fontIndex,
      });
      setTypedText('');
      setIsTyping(false);
    }
  };

  const handleUpload = async () => {
    if (!image && !typedText.trim()) {
      Alert.alert('Empty Story', 'Add something to your story.');
      return;
    }
    setLoading(true);
    try {
      await SocialService.uploadStory({ 
        images: image || 'https://via.placeholder.com/1080x1920?text=' + encodeURIComponent(typedText || 'Story'), 
        caption: typedText || undefined,
        visibility: privacy,
        is_active: true
      });
      Alert.alert('Success', 'Story shared!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Error', 'Failed to share story.');
    } finally {
      setLoading(false);
    }
  };

  const renderSelector = () => (
    <Animated.View 
      entering={FadeIn}
      exiting={FadeOut}
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
    >
      <Box px={16} pt={insets.top + 8} pb={16}>
        <HStack items="center" justify="space-between">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
             <X size={24} color="#1C1E21" />
          </TouchableOpacity>
          <Text fontSize={20} fontWeight="800" color="#1C1E21">Create Story</Text>
          <TouchableOpacity style={styles.closeBtn}>
             <Settings size={22} color="#1C1E21" />
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Horizontal Mode Selection */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        >
          {STORY_MODES.map((sm) => (
            <TouchableOpacity 
              key={sm.id}
              style={[styles.modeCard, { backgroundColor: sm.color }]}
              onPress={() => {
                setActiveStoryType(sm.id);
                if (sm.id === 'text') setMode('text');
                else pickImage();
              }}
            >
              <View style={[styles.iconCircle, { backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 }]}>
                 <sm.icon size={26} color={sm.iconColor} />
              </View>
              <Text fontSize={13} fontWeight="700" color="#1C1E21" mt={10}>{sm.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Gallery Grid Section */}
        <Box px={16}>
          <HStack justify="space-between" items="center" mb={16}>
            <Text fontSize={17} fontWeight="800" color="#1C1E21">Choose from library</Text>
          </HStack>
          
          <View style={styles.galleryGrid}>
             {[1,2,3,4,5,6,7,8,9].map(i => (
               <TouchableOpacity key={i} onPress={pickImage} style={styles.galleryItem}>
                  <Image 
                    source={{ uri: `https://picsum.photos/400/800?random=${i}` }} 
                    style={styles.galleryImg} 
                  />
                  <View style={styles.galleryOverlay}>
                     <ImageIcon size={18} color="white" />
                  </View>
               </TouchableOpacity>
             ))}
          </View>
        </Box>
      </ScrollView>
    </Animated.View>
  );

  const renderStickerPicker = () => (
    <Modal visible={showStickers} animationType="slide" transparent>
       <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={styles.stickerModal}>
             <HStack p={16} items="center" justify="space-between">
                <Text fontSize={18} fontWeight="800">Add Sticker</Text>
                <TouchableOpacity onPress={() => setShowStickers(false)}>
                   <X size={24} color="black" />
                </TouchableOpacity>
             </HStack>
             <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                   {['😊','🔥','🚀','💎','💯','🙌','✨','🌈','💼','🎉','❤️','👍','🍕','🏝️','🎸','🎮'].map((s, i) => (
                     <TouchableOpacity 
                       key={i} 
                       style={styles.stickerItem} 
                       onPress={() => {
                         addStoryElement({ type: 'sticker', content: s });
                         setShowStickers(false);
                       }}
                     >
                        <Text fontSize={40}>{s}</Text>
                     </TouchableOpacity>
                   ))}
                </View>
             </ScrollView>
          </View>
       </View>
    </Modal>
  );

  const renderTagModal = () => (
    <Modal visible={showTagModal} animationType="slide" transparent>
       <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={styles.stickerModal}>
             <HStack p={16} items="center" justify="space-between" borderBottom={1} borderColor="#E5E7EB">
                <Text fontSize={18} fontWeight="800">Tag people</Text>
                <TouchableOpacity onPress={() => setShowTagModal(false)}>
                   <X size={24} color="black" />
                </TouchableOpacity>
             </HStack>
             <Box p={16}>
                <View style={styles.searchBar}>
                   <AtSign size={18} color="#65676B" />
                   <TextInput placeholder="Search friends" style={{ flex: 1, marginLeft: 10, height: 40 }} />
                </View>
                <Button 
                   label="Tag @JobrynUser" 
                   mt={20} 
                   style={{ backgroundColor: FB_BLUE }} 
                   onPress={() => {
                      addStoryElement({ type: 'tag', content: 'JobrynUser' });
                      setShowTagModal(false);
                   }} 
                />
             </Box>
          </View>
       </View>
    </Modal>
  );

  const renderMusicModal = () => (
    <Modal visible={showMusicModal} animationType="slide" transparent>
       <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={styles.stickerModal}>
             <HStack p={16} items="center" justify="space-between" borderBottom={1} borderColor="#E5E7EB">
                <Text fontSize={18} fontWeight="800">Add Music</Text>
                <TouchableOpacity onPress={() => setShowMusicModal(false)}>
                   <X size={24} color="black" />
                </TouchableOpacity>
             </HStack>
             <ScrollView contentContainerStyle={{ padding: 16 }}>
                {[
                  { title: 'Level Up', artist: 'Focus Flow' },
                  { title: 'Daily Hustle', artist: 'Career Beat' },
                  { title: 'Success Vibes', artist: 'Market Anthem' },
                ].map((s, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' }}
                    onPress={() => {
                       addStoryElement({ type: 'music', data: s });
                       setShowMusicModal(false);
                    }}
                  >
                     <Text fontSize={16} fontWeight="700">{s.title}</Text>
                     <Text fontSize={13} color="#65676B">{s.artist}</Text>
                  </TouchableOpacity>
                ))}
             </ScrollView>
          </View>
       </View>
    </Modal>
  );

  const renderLinkModal = () => (
    <Modal visible={showLinkModal} animationType="slide" transparent>
       <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={styles.stickerModal}>
             <HStack p={16} items="center" justify="space-between" borderBottom={1} borderColor="#E5E7EB">
                <Text fontSize={18} fontWeight="800">Add Link</Text>
                <TouchableOpacity onPress={() => setShowLinkModal(false)}>
                   <X size={24} color="black" />
                </TouchableOpacity>
             </HStack>
             <Box p={16}>
                <Text fontSize={14} color="#65676B" mb={10}>Enter the URL you want to link to:</Text>
                <View style={styles.searchBar}>
                   <Link2 size={18} color="#65676B" />
                   <TextInput placeholder="https://example.com" style={{ flex: 1, marginLeft: 10, height: 40 }} />
                </View>
                <Button 
                   label="Add Link" 
                   mt={20} 
                   style={{ backgroundColor: FB_BLUE }} 
                   onPress={() => {
                      addStoryElement({ type: 'link', content: 'Visit Website' });
                      setShowLinkModal(false);
                   }} 
                />
             </Box>
          </View>
       </View>
    </Modal>
  );

  const renderEditor = () => (
    <Animated.View 
      entering={FadeIn}
      style={[styles.editorContainer, { backgroundColor: mode === 'text' ? BG_GRADIENTS[bgIndex][0] : 'black' }]}
    >
      <StatusBar barStyle="light-content" translucent />
      {renderStickerPicker()}
      {renderTagModal()}
      {renderLinkModal()}
      {renderMusicModal()}
      
      {mode === 'media' && image && (
        <Image source={{ uri: image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      )}

      {/* Effects Overlay */}
      {activeEffect === 'warm' && <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,150,0,0.15)' }]} pointerEvents="none" />}
      {activeEffect === 'cool' && <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,150,255,0.15)' }]} pointerEvents="none" />}
      {activeEffect === 'vintage' && <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(100,50,0,0.2)' }]} pointerEvents="none" />}

      {/* Movable Element Overlays */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {storyElements.map((st) => (
          <DraggableElement 
            key={st.id}
            type={st.type}
            content={st.content}
            data={st.data}
            bgStyle={st.bgStyle}
            fontStyle={st.fontIndex !== undefined ? FONTS[st.fontIndex].style : undefined}
            onDragEnd={(x, y) => {
               const updated = storyElements.map(t => t.id === st.id ? { ...t, x, y } : t);
               setStoryElements(updated);
            }}
          />
        ))}
      </View>

      {/* Editor UI Layer */}
      <Box flex={1} pt={insets.top + 10} px={16} pointerEvents="box-none">
        {/* Header Actions */}
        <HStack justify="space-between" items="center">
           <TouchableOpacity onPress={reset} style={styles.editorActionBtn}>
              <X size={24} color="white" />
           </TouchableOpacity>
           
           {!isTyping && (
             <VStack space="md" style={styles.editorToolbar}>
                <TouchableOpacity style={styles.toolItem} onPress={() => setShowStickers(true)}>
                   <Text fontSize={13} fontWeight="800" color="white" mr={10} style={styles.toolLabel}>Stickers</Text>
                   <Sticker size={26} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.toolItem} onPress={() => setIsTyping(true)}>
                   <Text fontSize={13} fontWeight="800" color="white" mr={10} style={styles.toolLabel}>Text</Text>
                   <Type size={26} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolItem} onPress={() => setShowMusicModal(true)}>
                   <Text fontSize={13} fontWeight="800" color="white" mr={10} style={styles.toolLabel}>Music</Text>
                   <Music size={26} color="white" />
                </TouchableOpacity>

                <TouchableOpacity 
                   style={styles.toolItem} 
                   onPress={() => {
                      const effects = [null, 'warm', 'cool', 'vintage'];
                      const currentIdx = effects.indexOf(activeEffect);
                      setActiveEffect(effects[(currentIdx + 1) % effects.length] as any);
                   }}
                >
                   <Text fontSize={13} fontWeight="800" color="white" mr={10} style={styles.toolLabel}>Effects</Text>
                   <Sparkles size={26} color={activeEffect ? FB_BLUE : 'white'} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolItem} onPress={() => setShowTagModal(true)}>
                   <Text fontSize={13} fontWeight="800" color="white" mr={10} style={styles.toolLabel}>Tag people</Text>
                   <AtSign size={26} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolItem} onPress={() => setShowLinkModal(true)}>
                   <Text fontSize={13} fontWeight="800" color="white" mr={10} style={styles.toolLabel}>Link</Text>
                   <Link2 size={26} color="white" />
                </TouchableOpacity>
             </VStack>
           )}
        </HStack>

        {/* Modal Text Input Flow */}
        <Modal visible={isTyping} transparent animationType="fade">
           <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.typingOverlay}>
              <Box flex={1} px={20} pt={insets.top + 10}>
                 <HStack justify="space-between" items="center">
                    <TouchableOpacity 
                       onPress={() => setTextBgStyle(textBgStyle === 'none' ? 'semi' : textBgStyle === 'semi' ? 'solid' : 'none')}
                       style={styles.typingActionBtn}
                    >
                       <Type size={22} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddText}>
                       <Text fontSize={18} fontWeight="800" color="white">Done</Text>
                    </TouchableOpacity>
                 </HStack>
                 
                 <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TextInput
                      multiline
                      autoFocus
                      placeholder="Start typing..."
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={typedText}
                      onChangeText={setTypedText}
                      style={[
                        styles.editorInput, 
                        FONTS[fontIndex].style,
                        { 
                          fontSize: 32,
                          color: textBgStyle === 'solid' ? 'black' : 'white',
                          backgroundColor: textBgStyle === 'solid' ? 'white' : textBgStyle === 'semi' ? 'rgba(0,0,0,0.5)' : 'transparent',
                          padding: 10,
                          borderRadius: 8,
                        }
                      ]}
                    />
                 </View>

                 <Box mb={40}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                       <HStack space="md">
                          {FONTS.map((f, i) => (
                            <TouchableOpacity 
                              key={f.name} 
                              onPress={() => setFontIndex(i)}
                              style={[styles.fontChip, fontIndex === i && styles.activeFontChip]}
                            >
                               <Text fontSize={14} fontWeight="800" color={fontIndex === i ? FB_BLUE : 'white'}>{f.name}</Text>
                            </TouchableOpacity>
                          ))}
                       </HStack>
                    </ScrollView>
                 </Box>
              </Box>
           </KeyboardAvoidingView>
        </Modal>

        {/* Bottom Bar: Settings & Share */}
        {!isTyping && (
          <Box pb={insets.bottom + 20} position="absolute" bottom={0} width="100%" px={16}>
             <HStack justify="space-between" items="center">
                <HStack space="md" items="center">
                   <TouchableOpacity style={styles.settingsBtn}>
                      <Settings size={22} color="black" />
                   </TouchableOpacity>

                   <TouchableOpacity 
                      style={styles.instagramToggle}
                      onPress={() => setIsInstagramOn(!isInstagramOn)}
                   >
                      <Instagram size={14} color="white" />
                      <Text fontSize={12} fontWeight="700" color="white" ml={6}>{isInstagramOn ? 'On' : 'Off'}</Text>
                   </TouchableOpacity>
                </HStack>

                <TouchableOpacity style={styles.wideShareBtn} onPress={handleUpload} disabled={loading}>
                   <Text fontSize={16} fontWeight="800" color="white">Share</Text>
                   <View style={styles.miniIconsOverlay}>
                      <View style={styles.miniFBCircle}>
                         <Text fontSize={6} color="white" fontWeight="900">f</Text>
                      </View>
                      <Instagram size={8} color="white" />
                   </View>
                </TouchableOpacity>
             </HStack>
          </Box>
        )}
      </Box>
    </Animated.View>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      {mode === 'select' ? renderSelector() : renderEditor()}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  modeCard: { width: moderateScale(100), height: verticalScale(140), borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  galleryItem: { width: (width - 44) / 3, height: 180, borderRadius: 12, overflow: 'hidden' },
  galleryImg: { width: '100%', height: '100%' },
  galleryOverlay: { position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  
  editorContainer: { flex: 1 },
  editorActionBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  editorToolbar: { position: 'absolute', right: 0, top: 0, paddingRight: 0, alignItems: 'flex-end' },
  toolItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingRight: 8 },
  toolLabel: { textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  
  typingOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' },
  typingActionBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  editorInput: { color: 'white', textAlign: 'center' },
  
  settingsBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  instagramToggle: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  wideShareBtn: { backgroundColor: FB_BLUE, paddingHorizontal: 40, paddingVertical: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  miniIconsOverlay: { position: 'absolute', bottom: 4, right: 6, flexDirection: 'row', alignItems: 'center' },
  miniFBCircle: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginRight: 2 },
  
  stickerModal: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: height * 0.7 },
  stickerItem: { width: (width - 64) / 4, height: 80, alignItems: 'center', justifyContent: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', borderRadius: 8, paddingHorizontal: 12 },
  fontChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  activeFontChip: { backgroundColor: 'white', borderColor: 'white' },
});

