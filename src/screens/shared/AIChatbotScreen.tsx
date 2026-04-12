import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { 
  ChevronLeft, 
  Send,
  Sparkles,
  Bot,
  Plus,
  Camera,
  Image as ImageIcon,
  Mic,
  Smile,
  ChevronRight,
  MoreVertical,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, HStack, VStack } from '../../components/ui';
import { AIService } from '../../services/api/ai';

const BLUE = '#0A66C2';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIChatbotScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I am your Jobryn AI Assistant. How can I help you today with your job search or recruitment process?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  const showComingSoon = (feature: string) => {
    Toast.show({
      type: 'info',
      text1: `${feature} Coming Soon`,
      text2: `We are rolling out ${feature} features for AI Chat soon.`,
    });
  };

  const handleSend = async () => {
    if (inputText.trim() === '' || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [userMessage, ...prev]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const resp = await AIService.sendMessage(currentInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: resp.response || "I received an empty response. How else can I help?",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [aiMessage, ...prev]);
    } catch (err: any) {
      console.error('[AIChat] API Error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [errorMessage, ...prev]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isAI = item.sender === 'ai';
    return (
      <View style={{ alignItems: isAI ? 'flex-start' : 'flex-end', marginBottom: 12, paddingHorizontal: 16 }}>
        <HStack items="flex-end" justify={isAI ? 'flex-start' : 'flex-end'}>
          {isAI && (
            <Box mr={8} bg="#E7F3FF" p={6} rounded={16} items="center" justify="center">
               <Sparkles size={16} color={BLUE} />
            </Box>
          )}
          <View
            style={[
              styles.bubble,
              {
                backgroundColor: isAI ? '#F0F2F5' : BLUE,
                borderBottomLeftRadius: isAI ? 4 : 18,
                borderBottomRightRadius: isAI ? 18 : 4,
              }
            ]}
          >
            <Text fontSize={15} color={isAI ? '#050505' : 'white'} lineHeight={22}>
              {item.text}
            </Text>
          </View>
        </HStack>
        <Text fontSize={11} color="#8A8D91" mt={4} ml={isAI ? 40 : 0} mr={isAI ? 0 : 4}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* FB Messenger Style Header — measured for precise keyboard offset */}
      <Box
        px={8} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#E5E7EB"
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <HStack justify="space-between" items="center">
          <HStack items="center" flex={1}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={30} color={BLUE} />
            </TouchableOpacity>
            <HStack items="center" ml={8}>
              <Box w={40} h={40} rounded={20} bg="#E7F3FF" items="center" justify="center">
                 <Bot size={24} color={BLUE} />
              </Box>
              <VStack ml={12}>
                <Text fontSize={17} fontWeight="700" color="#050505">Jobryn AI</Text>
                <HStack items="center">
                  <Box w={8} h={8} rounded={4} bg="#31A24C" mr={4} />
                  <Text fontSize={13} color="#65676B">Online & Ready</Text>
                </HStack>
              </VStack>
            </HStack>
          </HStack>
          <HStack space="md" pr={8}>
            <TouchableOpacity onPress={() => showComingSoon('AI Settings')} style={styles.actionBtnHeader}>
              <MoreVertical size={24} color={BLUE} />
            </TouchableOpacity>
          </HStack>
        </HStack>
      </Box>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      >
        <FlatList
          ref={flatListRef}
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
          inverted
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingVertical: 12 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          ListHeaderComponent={
            isTyping ? (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <HStack px={16} mb={16} mt={8} items="center">
                  <Box mr={8} bg="#E7F3FF" p={6} rounded={16}>
                    <Sparkles size={16} color={BLUE} />
                  </Box>
                  <VStack>
                    <HStack items="center" space="xs">
                       <ActivityIndicator color={BLUE} size="small" />
                       <Text fontSize={13} color="#65676B" fontWeight="600">Jobryn AI is thinking...</Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Animated.View>
            ) : null
          }
        />

        <Box bg="white" borderTop={1} borderColor="#E5E7EB">
          <SafeAreaView edges={['bottom']}>
            <Box px={8} py={8} pb={Platform.OS === 'ios' ? 0 : 8}>
              <HStack items="flex-end" space="xs">
                {/* Left Actions - visible when not focused or typing */}
                {!isFocused && !inputText.trim() ? (
                  <Animated.View entering={FadeIn} layout={LinearTransition}>
                    <HStack space="xs" pb={2}>
                      <TouchableOpacity style={styles.inputActionBtn} onPress={() => showComingSoon('Upload Document')}><Plus size={24} color={BLUE} /></TouchableOpacity>
                      <TouchableOpacity style={styles.inputActionBtn} onPress={() => showComingSoon('AI Vision')}><Camera size={24} color={BLUE} /></TouchableOpacity>
                    </HStack>
                  </Animated.View>
                ) : (
                  <TouchableOpacity
                    style={[styles.inputActionBtn, { marginBottom: 2 }]}
                    onPress={() => { Keyboard.dismiss(); setIsFocused(false); }}
                  >
                    <ChevronRight size={24} color={BLUE} />
                  </TouchableOpacity>
                )}

                {/* Input Pill */}
                <Box
                  flex={1}
                  bg="#F0F2F5"
                  rounded={20}
                  px={14}
                  py={Platform.OS === 'ios' ? 8 : 4}
                  minHeight={38}
                  justify="center"
                  mx={4}
                >
                  <HStack items="center">
                    <TextInput
                      placeholder="Ask Jobryn AI..."
                      placeholderTextColor="#8A8D91"
                      value={inputText}
                      onChangeText={setInputText}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      multiline
                      style={[styles.textInput, { flex: 1, maxHeight: 100 }]}
                    />
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => showComingSoon('Emoji Board')}>
                      <Smile size={24} color={BLUE} />
                    </TouchableOpacity>
                  </HStack>
                </Box>

                {/* Right Action - Send */}
                <TouchableOpacity
                  onPress={handleSend}
                  disabled={!inputText.trim() || isTyping}
                  style={[styles.inputActionBtn, { 
                    marginBottom: 2, 
                    backgroundColor: inputText.trim() && !isTyping ? BLUE : 'transparent',
                    borderRadius: 19
                  }]}
                >
                  <Send size={20} color={inputText.trim() && !isTyping ? 'white' : BLUE} />
                </TouchableOpacity>
              </HStack>
            </Box>
          </SafeAreaView>
        </Box>
      </KeyboardAvoidingView>
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
