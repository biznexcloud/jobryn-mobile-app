import React, { useEffect, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from '../../utils/responsive';
import { Text } from '../ui';

/**
 * AskAIFab — Global floating "Ask AI" button.
 * Drop this anywhere above the screen tree; it uses
 * its own navigation ref so it works from any screen.
 */
export default function AskAIFab() {
  const navigation: any = useNavigation();
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(0)).current;
 
  // TabBar height is approx 52 + insets.bottom. 
  // We want the FAB to be 32px ABOVE the TabBar so it sits completely clear of it.
  const bottomOffset = verticalScale(52) + insets.bottom + 32;

  // Entrance pop-in animation when mounted
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 14,
      stiffness: 180,
    }).start();
  }, []);

  const handlePress = () => {
    // Tiny press shrink for tactile feedback
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 220 }),
    ]).start(() => navigation.navigate('AIChat'));
  };

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]} pointerEvents="box-none">
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handlePress}
          activeOpacity={0.85}
        >
          <Sparkles size={18} color="white" />
          <Text color="white" fontWeight="700" ml={7} fontSize={14}>Ask AI</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 999,
    elevation: 999,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A66C2',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#0A66C2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
  },
});
