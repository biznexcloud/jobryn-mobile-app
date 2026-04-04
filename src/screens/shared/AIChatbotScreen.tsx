import React, { useState, useRef } from 'react';
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Send,
  Sparkles,
  Bot,
  User
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, HStack, VStack } from '../../components/ui';

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
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('job') || q.includes('search')) {
      return "I can help you find jobs! Based on your profile, I recommend looking at 'Senior Frontend Developer' roles at TechFlow or Prisma.";
    }
    if (q.includes('resume') || q.includes('profile')) {
      return "Your profile is 85% complete. Adding your latest certification in 'Cloud Architecture' would boost your visibility by 20%!";
    }
    if (q.includes('hello') || q.includes('hi')) {
      return "Hi there! Ready to take the next step in your career? Ask me anything about networking, job applications, or profile optimization.";
    }
    return "That's an interesting question! Within the Jobryn ecosystem, I can help you navigate networking opportunities, optimize your portfolio, or track your application status. What would you like to explore first?";
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isAI = item.sender === 'ai';
    return (
      <HStack 
        mb={16} 
        justify={isAI ? 'flex-start' : 'flex-end'} 
        items="flex-end"
        px={16}
      >
        {isAI && (
          <Box mr={8} bg="#E7F3FF" p={6} rounded={16}>
             <Sparkles size={20} color="#0A66C2" />
          </Box>
        )}
        <Box 
          bg={isAI ? '#F3F2EF' : '#0A66C2'} 
          p={12} 
          rounded={16} 
          maxW="80%"
          borderBottomLeft={isAI ? 0 : 16}
          borderBottomRight={isAI ? 16 : 0}
        >
          <Text color={isAI ? '#1C1E21' : 'white'} fontSize={14} lineHeight={20}>
            {item.text}
          </Text>
        </Box>
      </HStack>
    );
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      {/* Header */}
      <Box px={16} pt={insets.top + 8} pb={12} borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#000" />
            </TouchableOpacity>
            <VStack ml={12}>
              <Text fontSize={18} fontWeight="700">Jobryn AI</Text>
              <HStack items="center">
                <Box bg="#057642" w={8} h={8} rounded={4} mr={4} />
                <Text fontSize={12} color="#65676B">Online & Ready</Text>
              </HStack>
            </VStack>
          </HStack>
        </HStack>
      </Box>

      {/* Chat Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isTyping ? (
            <HStack px={16} mb={16} items="center">
               <Box mr={8} bg="#E7F3FF" p={6} rounded={16}>
                <Sparkles size={20} color="#0A66C2" />
              </Box>
              <ActivityIndicator color="#0A66C2" size="small" />
            </HStack>
          ) : null
        }
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Box px={16} pt={8} pb={insets.bottom + 8} borderTop={1} borderColor="#E5E7EB" bg="white">
          <HStack items="center" bg="#F3F2EF" rounded={24} px={16} py={4}>
            <TextInput
              placeholder="Ask anything..."
              value={inputText}
              onChangeText={setInputText}
              style={styles.input}
              multiline
            />
            <TouchableOpacity 
              onPress={handleSend} 
              style={[
                styles.sendBtn, 
                { backgroundColor: inputText.trim() ? '#0A66C2' : '#CED0D4' }
              ]}
              disabled={!inputText.trim()}
            >
              <Send size={20} color="white" />
            </TouchableOpacity>
          </HStack>
        </Box>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { padding: 4 },
  listContainer: { paddingVertical: 20 },
  input: { flex: 1, paddingVertical: 10, fontSize: 15, color: '#000', maxHeight: 100 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' , marginLeft: 8 },
});

