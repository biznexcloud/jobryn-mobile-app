import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Image as RNImage,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  MoreVertical,
  Send,
  Plus,
  Image as ImageIcon,
  Smile,
  ChevronRight,
  User,
  Search,
  Camera,
  Mic,
  ThumbsUp,
  Phone,
  Video,
  Palette,
  Ban,
  Briefcase,
  GraduationCap,
  MapPin,
  Link,
  Info,
  BellOff,
  Trash,
} from 'lucide-react-native';
import { MessageService } from '../../services/api/messages';
import { useAuthStore } from '../../store/authStore';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, BottomSheet, Divider } from '../../components/ui';
import { Roles } from '../../constants/Roles';

const FB_BLUE = '#1877F2';

const { height: SCREEN_HEIGHT, width } = Dimensions.get('window');



export default function ChatDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { id, name, avatar } = route.params || {};
  const { user, userRole } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [chatColor, setChatColor] = useState(FB_BLUE);
  const [quickReaction, setQuickReaction] = useState('👍');
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isProvider = userRole === Roles.JOB_PROVIDER || user?.role === 'job_provider' || user?.role === 'recruiter';

  const navigateToProfile = () => {
    setShowMenu(false);
    setShowProfile(true);
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    const fetchMessages = async () => {
      try {
        const resp = await MessageService.getMessages(id);
      } catch (e) {
        console.warn('Failed to fetch messages:', e);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [id]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: { id: user?.id, name: 'Me' },
      content: inputText,
      created_at: new Date().toISOString()
    };
    // For inverted list, add to index 0
    setMessages([newMsg, ...messages]);
    setInputText('');
  };

  const handleSendLike = () => {
    const newMsg = {
      id: Date.now(),
      sender: { id: user?.id, name: 'Me' },
      content: quickReaction,
      created_at: new Date().toISOString()
    };
    setMessages([newMsg, ...messages]);
  };

  const handlePickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) {
        const newMsg = {
          id: Date.now(),
          sender: { id: user?.id, name: 'Me' },
          content: '',
          image: result.assets[0].uri,
          created_at: new Date().toISOString()
        };
        setMessages([newMsg, ...messages]);
      }
    } catch (e) {
      console.log('Image picker error', e);
    }
  };

  const handleTakeImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) {
        const newMsg = {
          id: Date.now(),
          sender: { id: user?.id, name: 'Me' },
          content: '',
          image: result.assets[0].uri,
          created_at: new Date().toISOString()
        };
        setMessages([newMsg, ...messages]);
      }
    } catch (e) {
      console.log('Camera error', e);
    }
  };

  const showComingSoon = (feature: string) => {
    Toast.show({
      type: 'info',
      text1: `${feature} Coming Soon`,
      text2: `We are rolling out ${feature} features soon.`,
    });
  };

  const MessageBubble = ({ msg }: any) => {
    const isMe = msg.sender?.id === user?.id;
    const isLike = ['👍', '❤️', '😂', '🔥', '🤝', '🙌', '💼', '💡'].includes(msg.content) && !msg.image;

    return (
      <View style={{ alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: 12, paddingHorizontal: 16 }}>
        {isLike ? (
          <Text style={{ fontSize: 48, lineHeight: 56 }}>{msg.content}</Text>
        ) : msg.image ? (
          <RNImage
            source={{ uri: msg.image }}
            style={{ width: 220, height: 160, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.bubble,
              {
                backgroundColor: isMe ? chatColor : '#F0F2F5',
                borderBottomRightRadius: isMe ? 4 : 18,
                borderBottomLeftRadius: isMe ? 18 : 4,
              }
            ]}
          >
            <Text fontSize={15} color={isMe ? 'white' : '#050505'} lineHeight={22}>
              {msg.content}
            </Text>
          </View>
        )}
        <Text fontSize={11} color="#8A8D91" mt={4} ml={isMe ? 0 : 4} mr={isMe ? 4 : 0}>
          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  const MenuOption = ({ label, icon: Icon, color = '#050505', onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
      <HStack items="center" py={12}>
        <Box bg="#F0F2F5" p={8} rounded={20} mr={12}>
          <Icon size={20} color={color} />
        </Box>
        <Text fontSize={16} fontWeight="600" color={color}>{label}</Text>
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* FB Messenger Header — measured for precise keyboard offset */}
      <Box
        px={8} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#E5E7EB"
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <HStack justify="space-between" items="center">
          {isSearching ? (
            <HStack flex={1} items="center">
              <TouchableOpacity onPress={() => { setIsSearching(false); setSearchQuery(''); }} style={styles.backBtn}>
                <ChevronLeft size={30} color={chatColor} />
              </TouchableOpacity>
              <TextInput
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                style={{ flex: 1, backgroundColor: '#F0F2F5', padding: 10, borderRadius: 20, marginHorizontal: 8, fontSize: 16 }}
              />
            </HStack>
          ) : (
            <>
              <HStack items="center" flex={1}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                  <ChevronLeft size={30} color={chatColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={navigateToProfile}
                >
                  <Avatar source={{ uri: avatar || `https://i.pravatar.cc/150?u=${id}` }} size="md" />
                  <VStack ml={12}>
                    <Text fontSize={17} fontWeight="700" color="#050505">{name || 'User'}</Text>
                    <HStack items="center">
                      <Box w={8} h={8} rounded={4} bg="#31A24C" mr={4} />
                      <Text fontSize={13} color="#65676B">Active now</Text>
                    </HStack>
                  </VStack>
                </TouchableOpacity>
              </HStack>
              <HStack space="md" pr={8}>
                <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.actionBtnHeader}>
                  <MoreVertical size={24} color={chatColor} />
                </TouchableOpacity>
              </HStack>
            </>
          )}
        </HStack>
      </Box>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={headerHeight}
      >
        <FlatList
          style={{ flex: 1 }}
          inverted
          data={searchQuery.trim() ? messages.filter(m => m.content?.toLowerCase().includes(searchQuery.toLowerCase())) : messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          contentContainerStyle={{ paddingVertical: 12 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />

        <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
          <Box
            px={8}
            py={8}
            bg="white"
            borderTop={1}
            borderColor="#E5E7EB"
            pb={6}
          >
            <HStack items="flex-end" space="xs">
              {/* Left Actions - collapse when focused or typing */}
              {!isFocused && !inputText.trim() ? (
                <HStack space="xs" pb={2}>
                  <TouchableOpacity style={styles.inputActionBtn} onPress={() => showComingSoon('Location/Attachment')}><Plus size={24} color={chatColor} /></TouchableOpacity>
                  <TouchableOpacity style={styles.inputActionBtn} onPress={handleTakeImage}><Camera size={24} color={chatColor} /></TouchableOpacity>
                  <TouchableOpacity style={styles.inputActionBtn} onPress={handlePickImage}><ImageIcon size={24} color={chatColor} /></TouchableOpacity>
                  <TouchableOpacity style={styles.inputActionBtn} onPress={() => showComingSoon('Voice Notes')}><Mic size={24} color={chatColor} /></TouchableOpacity>
                </HStack>
              ) : (
                <TouchableOpacity
                  style={[styles.inputActionBtn, { marginBottom: 2 }]}
                  onPress={() => { Keyboard.dismiss(); setIsFocused(false); }}
                >
                  <ChevronRight size={24} color={chatColor} />
                </TouchableOpacity>
              )}

              {/* Input Pill */}
              <Box
                flex={1}
                bg="#F0F2F5"
                rounded={20}
                px={14}
                py={Platform.OS === 'ios' ? 8 : 4}
                minHeight={40}
                justify="center"
                mx={4}
              >
                <HStack items="center">
                  <TextInput
                    placeholder={isFocused || inputText ? 'Type a message...' : 'Message'}
                    placeholderTextColor="#8A8D91"
                    value={inputText}
                    onChangeText={setInputText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    multiline
                    style={[styles.textInput, { flex: 1 }]}
                  />
                  <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => showComingSoon('Emoji/GIF Board')}>
                    <Smile size={24} color={chatColor} />
                  </TouchableOpacity>
                </HStack>
              </Box>

              {/* Right Action - Send or Like */}
              {inputText.trim() ? (
                <TouchableOpacity
                  onPress={handleSend}
                  style={[styles.inputActionBtn, { marginBottom: 2 }]}
                >
                  <Send size={24} color={chatColor} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.inputActionBtn, { marginBottom: 2 }]}
                  onPress={handleSendLike}
                >
                  <Text style={{ fontSize: 28, color: chatColor }}>{quickReaction}</Text>
                </TouchableOpacity>
              )}
            </HStack>
          </Box>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Perfected Messenger-style BottomSheet — Scrollable */}
      <BottomSheet
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        title={name || 'Conversation Settings'}
        height={SCREEN_HEIGHT * 0.9}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 20 }}
        >
          {/* Top Row Circle Actions (Messenger Style) */}
          <HStack justify="center" space="xl" px={24} mb={16}>
            <TouchableOpacity onPress={navigateToProfile}>
              <VStack items="center">
                <Box mb={8}>
                  <Avatar source={{ uri: avatar || `https://i.pravatar.cc/150?u=${id}` }} size={48} />
                </Box>
                <Text fontSize={12} color="#050505">Profile</Text>
              </VStack>
            </TouchableOpacity>
          </HStack>

          <Divider color="#E5E7EB" my={12} />

          {/* Theme & Customization */}
          <Text fontSize={13} color="#65676B" fontWeight="600" ml={16} mb={8} mt={8}>Customization</Text>
          <MenuOption
            label="Theme"
            icon={Palette}
            color={chatColor}
            onPress={() => { setShowMenu(false); setShowThemeModal(true); }}
          />
          <MenuOption
            label="Quick reaction"
            icon={Smile}
            onPress={() => { setShowMenu(false); setShowReactionModal(true); }}
          />

          <Divider color="#E5E7EB" my={12} />

          {/* More Actions */}
          <Text fontSize={13} color="#65676B" fontWeight="600" ml={16} mb={8} mt={8}>More actions</Text>
          <MenuOption
            label="Search in conversation"
            icon={Search}
            onPress={() => { setShowMenu(false); setIsSearching(true); }}
          />
          <MenuOption
            label="View media, files & links"
            icon={ImageIcon}
            onPress={() => { setShowMenu(false); setShowMediaModal(true); }}
          />

          <Divider color="#E5E7EB" my={12} />

          {/* Privacy */}
          <Text fontSize={13} color="#65676B" fontWeight="600" ml={16} mb={8} mt={8}>Privacy & support</Text>
          <MenuOption
            label="Block"
            icon={Ban}
            onPress={() => { setShowMenu(false); showComingSoon('Block User'); }}
          />
          <MenuOption
            label="Delete Conversation"
            icon={Trash}
            color="#FF3B30"
            onPress={() => {
              setShowMenu(false);
              Alert.alert('Delete conversation?', 'This action cannot be undone and will explicitly remove the entire chat history.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() }
              ]);
            }}
          />
        </ScrollView>
      </BottomSheet>

      {/* Modern, Clean & Responsive Interactive Profile Viewer */}
      <BottomSheet
        visible={showProfile}
        onClose={() => setShowProfile(false)}
        height={SCREEN_HEIGHT * 0.92}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>

          {/* Clean Profile Header */}
          <VStack items="center" mt={20} mb={24}>
            <Avatar source={{ uri: avatar || `https://i.pravatar.cc/150?u=${id}` }} size={110} />
            <Text fontSize={24} fontWeight="700" color="#050505" mt={16} textAlign="center">{name || 'User'}</Text>
            <Text fontSize={16} color="#65676B" mt={4} textAlign="center">Senior Product Designer at TechHive</Text>

            <HStack mt={12} items="center" justify="center">
              <MapPin size={16} color="#666666" />
              <Text fontSize={14} color="#666666" ml={6}>Kathmandu, Bagmati</Text>
              <Text fontSize={14} color={FB_BLUE} fontWeight="600" ml={16}>500+ connections</Text>
            </HStack>
          </VStack>

          <HStack space="md" justify="center" mb={30}>
            <TouchableOpacity onPress={() => setShowProfile(false)} style={{ backgroundColor: '#F0F2F5', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24 }}>
              <Text color="#050505" fontWeight="600" fontSize={16}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: FB_BLUE, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24 }}>
              <Text color="white" fontWeight="600" fontSize={16}>Message</Text>
            </TouchableOpacity>
          </HStack>

          <Divider color="#E5E7EB" mb={24} />

          {/* About Section */}
          <VStack mb={24}>
            <Text fontSize={18} fontWeight="700" color="#050505" mb={12}>About</Text>
            <Text fontSize={15} color="#4B4D52" lineHeight={24}>
              Passionate UI/UX designer with 8+ years of experience in building scalable digital products. Focused on delivering exceptional user experiences through clean, accessible design systems.
            </Text>
          </VStack>

          {/* Experience Section */}
          <VStack mb={24}>
            <Text fontSize={18} fontWeight="700" color="#050505" mb={16}>Experience</Text>
            <VStack mb={12}>
              <HStack items="flex-start">
                <Briefcase size={22} color="#65676B" style={{ marginTop: 2 }} />
                <VStack ml={16} flex={1}>
                  <Text fontSize={16} fontWeight="600" color="#050505">Senior Product Designer</Text>
                  <Text fontSize={15} color="#4B4D52" mt={2}>TechHive</Text>
                  <Text fontSize={14} color="#8A8D91" mt={4}>2020 - Present</Text>
                </VStack>
              </HStack>
            </VStack>
            <VStack>
              <HStack items="flex-start">
                <Briefcase size={22} color="#65676B" style={{ marginTop: 2 }} />
                <VStack ml={16} flex={1}>
                  <Text fontSize={16} fontWeight="600" color="#050505">UX Designer</Text>
                  <Text fontSize={15} color="#4B4D52" mt={2}>Meta Systems</Text>
                  <Text fontSize={14} color="#8A8D91" mt={4}>2017 - 2020</Text>
                </VStack>
              </HStack>
            </VStack>
          </VStack>

          {/* Education Section */}
          <VStack mb={24}>
            <Text fontSize={18} fontWeight="700" color="#050505" mb={16}>Education</Text>
            <HStack items="flex-start">
              <GraduationCap size={24} color="#65676B" style={{ marginTop: 2 }} />
              <VStack ml={16} flex={1}>
                <Text fontSize={16} fontWeight="600" color="#050505">Tribhuvan University</Text>
                <Text fontSize={15} color="#4B4D52" mt={2}>BSc Computer Science, Design</Text>
                <Text fontSize={14} color="#8A8D91" mt={4}>2013 - 2017</Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Portfolio / Projects */}
          <VStack mb={24}>
            <Text fontSize={18} fontWeight="700" color="#050505" mb={16}>Projects</Text>
            <HStack items="flex-start">
              <ImageIcon size={22} color="#65676B" style={{ marginTop: 2 }} />
              <VStack ml={16} flex={1}>
                <Text fontSize={16} fontWeight="600" color="#050505">Global FinTech Redesign</Text>
                <Text fontSize={15} color="#4B4D52" mt={2} lineHeight={22}>Complete overhaul of the mobile banking experience.</Text>
                <Text fontSize={14} color={FB_BLUE} fontWeight="500" mt={6}>View Project</Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Fluid Photo Gallery Layer */}
          <VStack mb={12}>
            <HStack justify="space-between" items="center" mb={16}>
              <Text fontSize={18} fontWeight="700" color="#050505">Photos</Text>
              <Text fontSize={14} fontWeight="600" color={FB_BLUE}>See all</Text>
            </HStack>
            {/* Photo Gallery Logic - Cleaned for Production */}
            <HStack flexWrap="wrap" justify="space-between" style={{ gap: 8 }}>
              {messages.filter(m => m.image).slice(0, 6).map((msg, i) => (
                <Box key={i} style={{ flexBasis: '31%', aspectRatio: 1 }}>
                  <RNImage source={{ uri: msg.image }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                </Box>
              ))}
            </HStack>
          </VStack>

        </ScrollView>
      </BottomSheet>

      {/* Dynamic Theme Selection Modal (Facebook Style) */}
      <BottomSheet
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        height={SCREEN_HEIGHT * 0.45}
        title="Color theme"
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <HStack flexWrap="wrap" justify="space-between" px={16} mt={16}>
            {[
              { color: '#1877F2', name: 'Default' },
              { color: '#E91E63', name: 'Watermelon' },
              { color: '#8E24AA', name: 'Grape' },
              { color: '#FF9800', name: 'Tangerine' },
              { color: '#4CAF50', name: 'Mint' },
              { color: '#00BCD4', name: 'Ocean' },
            ].map((theme, i) => (
              <TouchableOpacity
                key={i}
                style={{ width: '30%', alignItems: 'center', marginBottom: 24 }}
                onPress={() => { setChatColor(theme.color); setShowThemeModal(false); }}
              >
                <Box
                  w={56}
                  h={56}
                  rounded={28}
                  bg={theme.color}
                  style={{
                    borderWidth: chatColor === theme.color ? 3 : 0,
                    borderColor: '#050505',
                    shadowColor: theme.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5
                  }}
                />
                <Text fontSize={13} color="#050505" mt={8} fontWeight={chatColor === theme.color ? '700' : '500'} textAlign="center">
                  {theme.name}
                </Text>
              </TouchableOpacity>
            ))}
          </HStack>
        </ScrollView>
      </BottomSheet>

      {/* Quick Reaction Selection Modal */}
      <BottomSheet
        visible={showReactionModal}
        onClose={() => setShowReactionModal(false)}
        height={SCREEN_HEIGHT * 0.35}
        title="Quick reaction"
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <HStack flexWrap="wrap" justify="space-between" px={24} mt={16}>
            {['👍', '❤️', '😂', '🔥', '🤝', '🙌', '💼', '💡'].map((react, i) => (
              <TouchableOpacity
                key={i}
                style={{ width: '22%', alignItems: 'center', marginBottom: 24 }}
                onPress={() => { setQuickReaction(react); setShowReactionModal(false); }}
              >
                <Box
                  w={50}
                  h={50}
                  rounded={25}
                  bg={quickReaction === react ? '#E5E7EB' : '#F0F2F5'}
                  items="center"
                  justify="center"
                >
                  <Text style={{ fontSize: 28 }}>{react}</Text>
                </Box>
              </TouchableOpacity>
            ))}
          </HStack>
        </ScrollView>
      </BottomSheet>

      {/* Shared Media Viewer Modal */}
      <BottomSheet
        visible={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        height={SCREEN_HEIGHT * 0.7}
        title="Shared Media"
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {messages.filter(m => m.image).length > 0 ? (
            <HStack flexWrap="wrap" justify="flex-start" style={{ gap: 4, paddingHorizontal: 4, marginTop: 16 }}>
              {messages.filter(m => m.image).map((msg, i) => (
                <Box key={i} style={{ flexBasis: '32%', aspectRatio: 1, marginBottom: 4 }}>
                  <RNImage source={{ uri: msg.image }} style={{ width: '100%', height: '100%', borderRadius: 4 }} />
                </Box>
              ))}
            </HStack>
          ) : (
            <VStack items="center" justify="center" mt={40}>
              <ImageIcon size={48} color="#8A8D91" />
              <Text fontSize={16} color="#8A8D91" mt={12}>No shared media found</Text>
            </VStack>
          )}
        </ScrollView>
      </BottomSheet>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  actionBtnHeader: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 18 },
  inputActionBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  textInput: { fontSize: 16, color: '#050505', padding: 0, maxHeight: 120 },
});
