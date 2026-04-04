import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Video,
  Phone,
  MoreVertical,
  Send,
  Plus,
  Image as ImageIcon,
  Smile,
} from 'lucide-react-native';
import { MessageService } from '../../services/api/messages';
import { useAuthStore } from '../../store/authStore';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar } from '../../components/ui';

const FB_BLUE = '#1877F2';

export default function ChatDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { id, name, avatar } = route.params || {};
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const resp = await MessageService.getMessages(id);
        setMessages(resp?.results || [
          { id: 1, sender: { id: 99, name: name }, content: 'Hi! I saw your recent post about your amazing work. We are looking for someone with your expertise for an exciting new role.', created_at: new Date().toISOString() },
          { id: 2, sender: { id: user?.id, name: 'Me' }, content: 'Hello! Thanks for reaching out. I would love to hear more about the opportunity!', created_at: new Date().toISOString() },
          { id: 3, sender: { id: 99, name: name }, content: 'Great! We are building a next-gen product and need a strong engineer. Are you available for a quick call this week?', created_at: new Date().toISOString() },
        ]);
      } catch (e) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [id]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: { id: user?.id, name: 'Me' },
      content: inputText,
      created_at: new Date().toISOString()
    };
    setMessages([...messages, newMsg]);
    setInputText('');
    setTimeout(() => scrollRef.current?.scrollToEnd(), 100);
  };

  const MessageBubble = ({ msg }: any) => {
    const isMe = msg.sender?.id === user?.id;
    return (
      <View style={{ alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: 16, paddingHorizontal: 16 }}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isMe ? FB_BLUE : '#F0F2F5',
              borderBottomRightRadius: isMe ? 2 : 18,
              borderBottomLeftRadius: isMe ? 18 : 2,
            }
          ]}
        >
          <Text fontSize={14} color={isMe ? 'white' : '#050505'} lineHeight={20}>
            {msg.content}
          </Text>
        </View>
        <Text fontSize={11} color="#8A8D91" mt={4}>
          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* FB Messenger-style Header */}
      <Box px={12} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack justify="space-between" items="center">
          <HStack items="center" flex={1}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={28} color="#050505" />
            </TouchableOpacity>
            <Avatar source={{ uri: avatar || `https://i.pravatar.cc/150?u=${id}` }} size="md" />
            <VStack ml={10}>
              <Text fontSize={16} fontWeight="700" color="#050505">{name || 'User'}</Text>
              <Text fontSize={12} color="#31A24C" fontWeight="600">Active now</Text>
            </VStack>
          </HStack>
          <HStack space="md">
            <TouchableOpacity style={styles.actionBtn}><Phone size={22} color={FB_BLUE} /></TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}><Video size={22} color={FB_BLUE} /></TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}><MoreVertical size={22} color={FB_BLUE} /></TouchableOpacity>
          </HStack>
        </HStack>
      </Box>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} msg={msg} />
        ))}
      </ScrollView>

      {/* Input Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Box p={8} bg="white" borderTop={1} borderColor="#E5E7EB" pb={insets.bottom + 8}>
          <HStack items="center" style={{ gap: 8 }}>
            <TouchableOpacity style={styles.actionBtn}><Plus size={24} color={FB_BLUE} /></TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}><ImageIcon size={24} color={FB_BLUE} /></TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}><Smile size={24} color={FB_BLUE} /></TouchableOpacity>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Aa"
                placeholderTextColor="#65676B"
                value={inputText}
                onChangeText={setInputText}
                multiline
                style={styles.textInput}
              />
            </View>
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: inputText.trim() ? FB_BLUE : '#E4E6EB' }]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Send size={18} color={inputText.trim() ? 'white' : '#65676B'} />
            </TouchableOpacity>
          </HStack>
        </Box>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E4E6EB', alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 18 },
  inputContainer: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, minHeight: 36, justifyContent: 'center' },
  textInput: { fontSize: 15, color: '#050505', padding: 0, maxHeight: 100 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
