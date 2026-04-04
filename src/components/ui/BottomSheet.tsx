import React from 'react';
import { 
  Modal, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  PanResponder 
} from 'react-native';
import { Colors } from '../../constants';
import { VStack } from './VStack';
import { HStack } from './HStack';
import { Heading } from './Heading';
import { Text } from './Text';
import { XIcon } from 'react-native-heroicons/outline';
import { moderateScale, verticalScale } from '../../utils/responsive';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number;
}

export const BottomSheet = ({ 
  visible, 
  onClose, 
  title, 
  children, 
  height = SCREEN_HEIGHT * 0.7 
}: BottomSheetProps) => {
  const translateY = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 100,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        <Animated.View 
          style={[
            styles.container, 
            { height, transform: [{ translateY }] }
          ]}
        >
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <VStack style={styles.content}>
            <HStack style={styles.header}>
              <Heading size="lg">{title}</Heading>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <XIcon size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </HStack>

            <View style={styles.body}>
              {children}
            </View>
          </VStack>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  handleContainer: {
    paddingVertical: verticalScale(12),
    alignItems: 'center',
  },
  handle: {
    width: moderateScale(40),
    height: verticalScale(4),
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(24),
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    flex: 1,
  },
});
