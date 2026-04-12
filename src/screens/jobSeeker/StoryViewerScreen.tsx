import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated as RNAnimated,
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
  Smile,
  MessageCircle,
} from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeOutDown, 
  Layout, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { SocialService } from '../../services/api/social';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000;
const FB_BLUE = '#1877F2';

const REACTIONS = ['❤️', '😆', '😮', '😢', '😡', '👍', '🔥', '💯'];

export default function StoryViewerScreen({ route, navigation }: { route: any, navigation: any }) {
  const insets = useSafeAreaInsets();
  const stories = route.params?.stories || [];
  const initialIndex = route.params?.initialIndex || 0;
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [reactionMode, setReactionMode] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showSentFeedback, setShowSentFeedback] = useState('');
  const progress = useRef(new RNAnimated.Value(0)).current;
  const pulse = useSharedValue(1);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  // The stories passed here are already normalized by SocialService.getStories
  const currentStory = stories[currentIndex] || {};

  useEffect(() => {
    if (reactionMode) {
      progress.stopAnimation();
    } else {
      startProgress();
    }
    // Reset like state for new story
    setIsLiked(false);
  }, [currentIndex, reactionMode]);

  // Track view when story changes
  useEffect(() => {
    if (currentStory.id) {
       SocialService.trackStoryView(currentStory.id);
    }
  }, [currentIndex]);

  const startProgress = () => {
    progress.setValue(0);
    RNAnimated.timing(progress, {
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
    if (reactionMode) {
      setReactionMode(false);
      return;
    }
    const x = e.nativeEvent.locationX;
    if (x < width / 3) {
      prev();
    } else {
      next();
    }
  };

  const handleLike = async () => {
     const prevLiked = isLiked;
     setIsLiked(!prevLiked);
     
     // Pulse animation
     pulse.value = withSpring(1.2, { damping: 2, stiffness: 80 }, () => {
       pulse.value = withSpring(1);
     });

     try {
        await SocialService.likeStory(currentStory.id);
        if (!prevLiked) {
           setShowSentFeedback('❤️');
           setTimeout(() => setShowSentFeedback(''), 1000);
        }
     } catch (e) {
        console.warn('Like failed');
        setIsLiked(prevLiked); // revert on failure
     }
  };

  const handleReply = async (content: string) => {
     if (!content.trim()) return;
     try {
        await SocialService.addStoryComment(currentStory.id, content);
        setReplyText('');
        setReactionMode(false);
        // Show brief sent feedback
        setShowSentFeedback(content.length <= 2 ? content : 'Sent!');
        setTimeout(() => setShowSentFeedback(''), 1500);
        // Resume story
        startProgress();
     } catch (e) {
        console.warn('Reply failed');
     }
  };

  return (
    <Box flex={1} bg="#000000">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background Image Area */}
      <TouchableOpacity activeOpacity={1} onPress={handlePress} style={StyleSheet.absoluteFill}>
        <Image source={{ uri: currentStory.image }} style={styles.storyImage} resizeMode="cover" />
      </TouchableOpacity>

      {/* Top Details */}
      <Box position="absolute" top={insets.top + 8} width="100%" px={12} pointerEvents="box-none">
         <HStack space="xs">
            {stories.map((_: any, index: number) => (
               <Box key={index} flex={1} h={2} bg="rgba(255,255,255,0.3)" rounded={1} overflow="hidden">
                  {index === currentIndex ? (
                    <RNAnimated.View 
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

         <HStack mt={16} items="center" justify="space-between">
            <HStack items="center">
               <Avatar source={{ uri: currentStory.user?.avatar }} size={36} />
               <VStack ml={10}>
                  <Text fontSize={14} fontWeight="800" color="white" style={styles.textShadow}>{currentStory.user?.name}</Text>
                  <Text fontSize={11} color="rgba(255,255,255,0.8)" style={styles.textShadow}>{currentStory.created_at || 'Just now'}</Text>
               </VStack>
            </HStack>
            <HStack space="md" items="center">
               <TouchableOpacity>
                  <MoreVertical size={20} color="white" />
               </TouchableOpacity>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <X size={26} color="white" />
               </TouchableOpacity>
            </HStack>
         </HStack>

         {/* Caption overlay */}
         {currentStory.caption ? (
           <Box mt={12} bg="rgba(0,0,0,0.4)" px={12} py={8} rounded={8} alignSelf="flex-start">
             <Text fontSize={14} color="white" fontWeight="600">{currentStory.caption}</Text>
           </Box>
         ) : null}
      </Box>

      {/* Footer & Reactions */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.footerContainer} 
        pointerEvents="box-none"
      >
         {/* Reaction Bar */}
         {reactionMode && (
           <Animated.View 
             entering={FadeInDown.springify()} 
             exiting={FadeOutDown} 
             style={styles.reactionContainer}
           >
              <HStack space="md" px={16} py={12} bg="rgba(0,0,0,0.8)" rounded={32}>
                 {REACTIONS.map((r, i) => (
                   <TouchableOpacity key={i} onPress={() => handleReply(r)}>
                      <Text fontSize={28}>{r}</Text>
                   </TouchableOpacity>
                 ))}
              </HStack>
           </Animated.View>
         )}

         <Box width="100%" px={16} pb={insets.bottom + 16}>
            {/* Sent feedback */}
            {showSentFeedback ? (
              <Animated.View entering={FadeInDown.springify()} style={{ alignItems: 'center', marginBottom: 8 }}>
                <Box bg="rgba(0,0,0,0.7)" px={16} py={8} rounded={20}>
                  <Text fontSize={14} fontWeight="700" color="white">{showSentFeedback}</Text>
                </Box>
              </Animated.View>
            ) : null}

            <HStack items="center" space="md">
               <Box 
                 flex={1} 
                 bg="rgba(255,255,255,0.15)" 
                 rounded={24} 
                 border={1} 
                 borderColor="rgba(255,255,255,0.2)" 
                 minHeight={44} 
                 px={16} 
                 justify="center"
               >
                  <TextInput 
                     placeholder="Reply to story..."
                     placeholderTextColor="rgba(255,255,255,0.7)"
                     style={styles.replyInput}
                     value={replyText}
                     onChangeText={setReplyText}
                     onFocus={() => setReactionMode(true)}
                     onSubmitEditing={() => handleReply(replyText)}
                  />
               </Box>
               
                {!reactionMode && (
                  <HStack space="md">
                    <TouchableOpacity onPress={handleLike}>
                       <Animated.View style={heartStyle}>
                          <Heart size={26} color={isLiked ? '#FF3B5C' : 'white'} fill={isLiked ? '#FF3B5C' : 'none'} />
                       </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleReply(replyText)}>
                       <Send size={26} color="white" />
                    </TouchableOpacity>
                  </HStack>
                )}
            </HStack>
         </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}

const styles = StyleSheet.create({
  storyImage: { width: width, height: height },
  progressBar: { height: '100%', backgroundColor: 'white' },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  reactionContainer: { alignItems: 'center', marginBottom: 12 },
  replyInput: { fontSize: 15, color: 'white', fontWeight: '600', padding: 0 },
  textShadow: { textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }
});

