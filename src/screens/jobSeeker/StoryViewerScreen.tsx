import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  Dimensions,
  GestureResponderEvent,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, HStack, Avatar, VStack } from '../../components/ui';
import {
  X,
  Heart,
  ThumbsUp,
  Send,
  MoreVertical,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000;
const FB_BLUE = '#1877F2';

export default function StoryViewerScreen({ route, navigation }: { route: any, navigation: any }) {
  const insets = useSafeAreaInsets();
  const stories = route.params?.stories || [];
  const initialIndex = route.params?.initialIndex || 0;
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [reactionMode, setReactionMode] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  // Fallback to avoid crashes if stories array is inexplicably empty
  const currentStory = stories[currentIndex] || { 
    user: { name: 'Expert', avatar: 'https://i.pravatar.cc/150' }, 
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800' 
  };

  useEffect(() => {
    if (reactionMode) {
      progress.stopAnimation();
    } else {
      startProgress();
    }
  }, [currentIndex, reactionMode]);

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !reactionMode) {
        next();
      }
    });
  };

  const next = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  const handlePress = (e: GestureResponderEvent) => {
    if (reactionMode) return;
    const x = e.nativeEvent.locationX;
    if (x < width / 3) {
      prev();
    } else {
      next();
    }
  };

  return (
    <Box flex={1} bg="#000000">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background Image Area */}
      <TouchableOpacity activeOpacity={1} onPress={handlePress} style={StyleSheet.absoluteFill}>
        <Image source={{ uri: currentStory.image }} style={styles.storyImage} resizeMode="cover" />
      </TouchableOpacity>

      {/* Top Details */}
      <Box position="absolute" top={insets.top + 8} width="100%" px={12} pointerEvents="box-none">
         {/* Segmented Progress Bars */}
         <HStack space="xs">
            {stories.map((_: any, index: number) => (
              <Box key={index} flex={1} h={3} bg="rgba(255,255,255,0.3)" rounded={1.5} overflow="hidden">
                 {index === currentIndex ? (
                   <Animated.View 
                     style={[
                        styles.progressBar, 
                        { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }
                     ]} 
                   />
                 ) : index < currentIndex ? (
                   <Box flex={1} bg="white" />
                 ) : null}
              </Box>
            ))}
         </HStack>

         {/* Author Header */}
         <HStack mt={16} items="center" justify="space-between">
            <HStack items="center">
               <Avatar source={{ uri: currentStory.user?.avatar || 'https://i.pravatar.cc/150' }} size={38} />
               <VStack ml={10}>
                  <Text fontSize={15} fontWeight="700" color="white" style={styles.textShadow}>{currentStory.user?.name}</Text>
                  <Text fontSize={12} color="rgba(255,255,255,0.8)" style={styles.textShadow}>2h</Text>
               </VStack>
            </HStack>
            <HStack space="md" items="center">
               <TouchableOpacity>
                  <MoreVertical size={24} color="white" />
               </TouchableOpacity>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <X size={28} color="white" />
               </TouchableOpacity>
            </HStack>
         </HStack>
      </Box>

      {/* Footer Interactions */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.footerContainer} pointerEvents="box-none">
         <Box width="100%" px={16} pb={insets.bottom + 16}>
            <HStack items="center" style={{ gap: 16 }}>
               <Box flex={1} bg="rgba(0,0,0,0.5)" rounded={24} border={1} borderColor="rgba(255,255,255,0.3)" minHeight={48} px={16} justify="center">
                  <TextInput 
                     placeholder="Send message..."
                     placeholderTextColor="white"
                     style={styles.replyInput}
                     onFocus={() => setReactionMode(true)}
                     onBlur={() => setReactionMode(false)}
                  />
               </Box>
               <TouchableOpacity>
                  <Heart size={28} color="white" />
               </TouchableOpacity>
               <TouchableOpacity>
                  <ThumbsUp size={28} color="white" />
               </TouchableOpacity>
               <TouchableOpacity>
                  <Send size={28} color="white" />
               </TouchableOpacity>
            </HStack>
         </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}

const styles = StyleSheet.create({
  storyImage: { width: width, height: height, borderRadius: 12 },
  progressBar: { height: '100%', backgroundColor: 'white' },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  replyInput: { fontSize: 16, color: 'white', fontWeight: '500', padding: 0 },
  textShadow: { textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }
});
