import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Text, HStack, Box } from '../ui';
import { Music, Link2 as LinkIcon, AtSign } from 'lucide-react-native';

interface DraggableElementProps {
  type: 'text' | 'sticker' | 'music' | 'tag' | 'link';
  content?: string;
  data?: any;
  bgStyle?: 'none' | 'semi' | 'solid';
  fontStyle?: any;
  initialX?: number;
  initialY?: number;
  color?: string;
  onDragEnd?: (x: number, y: number) => void;
}

const FB_BLUE = '#1877F2';

export function DraggableElement({ 
  type,
  content, 
  data,
  bgStyle = 'none', 
  fontStyle, 
  initialX = 0, 
  initialY = 0,
  color = 'white',
  onDragEnd 
}: DraggableElementProps) {
  const translateX = useSharedValue(initialX || 0);
  const translateY = useSharedValue(initialY || 0);
  const offset = useSharedValue({ x: 0, y: 0 });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      offset.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      translateX.value = offset.value.x + event.translationX;
      translateY.value = offset.value.y + event.translationY;
    })
    .onEnd(() => {
      if (onDragEnd) {
        onDragEnd(translateX.value, translateY.value);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <View style={[
            styles.textBgOverlay,
            bgStyle === 'semi' && { backgroundColor: 'rgba(0,0,0,0.5)' },
            bgStyle === 'solid' && { backgroundColor: 'white' }
          ]}>
            <Text style={[styles.text, fontStyle || {}, { color: bgStyle === 'solid' ? 'black' : color }]}>
              {content}
            </Text>
          </View>
        );
      case 'sticker':
        return <Text style={{ fontSize: 80 }}>{content}</Text>;
      case 'music':
        return (
          <HStack bg="white" p={12} rounded={12} items="center" shadow={1}>
             <Box bg={FB_BLUE} p={8} rounded={8} mr={12}>
                <Music size={20} color="white" />
             </Box>
             <Box>
                <Text fontSize={14} fontWeight="800" color="black" numberOfLines={1}>{data?.title || 'Unknown Song'}</Text>
                <Text fontSize={12} color="#65676B" numberOfLines={1}>{data?.artist || 'Unknown Artist'}</Text>
             </Box>
          </HStack>
        );
      case 'tag':
        return (
          <HStack bg="rgba(0,0,0,0.6)" p={8} px={12} rounded={20} items="center">
             <AtSign size={14} color="white" />
             <Text fontSize={14} fontWeight="800" color="white" ml={6}>{content}</Text>
          </HStack>
        );
      case 'link':
        return (
          <HStack bg="white" p={10} px={16} rounded={24} items="center">
             <LinkIcon size={16} color={FB_BLUE} />
             <Text fontSize={14} fontWeight="800" color={FB_BLUE} ml={8}>{content || 'Visit Link'}</Text>
          </HStack>
        );
      default:
        return null;
    }
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
         {renderContent()}
      </Animated.View>
    </GestureDetector>
  );
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 100,
  },
  textBgOverlay: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  text: {
    fontSize: 28,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

