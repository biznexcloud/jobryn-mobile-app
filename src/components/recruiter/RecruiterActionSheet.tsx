import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
  Pressable,
} from 'react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';
import {
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Calendar as CalendarIcon,
  Star as StarIcon,
  Eye as EyeIcon,
  Clock as ClockIcon,
} from 'lucide-react-native';
import { ApplicationStatus } from '../../screens/jobProvider/ApplicantsScreen';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#0A66C2'; 
const PROMOTED_GREEN = '#057642';
const GRAY_BG = '#F3F2EF';

interface ActionOption {
  label: string;
  subtitle: string;
  status: ApplicationStatus;
  color: string;
  bg: string;
  Icon: any;
}

const ACTIONS: ActionOption[] = [
  {
    label: 'Shortlist',
    subtitle: 'Identify as top talent',
    status: 'screening',
    color: '#0A66C2',
    bg: '#EBF3FF',
    Icon: StarIcon,
  },
  {
    label: 'Online Interview',
    subtitle: 'Schedule a discovery call',
    status: 'online_meeting' as any,
    color: '#0A66C2',
    bg: '#EBF3FF',
    Icon: CalendarIcon,
  },
  {
    label: 'Onsite Interview',
    subtitle: 'Meet at the office',
    status: 'onsite_meeting' as any,
    color: '#0A66C2',
    bg: '#EBF3FF',
    Icon: CalendarIcon,
  },
  {
    label: 'Hire',
    subtitle: 'Release official offer',
    status: 'hired',
    color: '#057642',
    bg: '#E1F0E5',
    Icon: CheckCircleIcon,
  },
  {
    label: 'Reject',
    subtitle: 'Archive this profile',
    status: 'rejected',
    color: '#666666',
    bg: '#F3F2EF',
    Icon: XCircleIcon,
  },
];

interface Props {
  visible: boolean;
  candidateName: string | null;
  currentStatus: ApplicationStatus;
  onClose: () => void;
  onAction: (status: ApplicationStatus) => void;
  loading?: boolean;
}

export default function RecruiterActionSheet({
  visible,
  candidateName,
  currentStatus,
  onClose,
  onAction,
  loading = false,
}: Props) {
  const translateY = useRef(new Animated.Value(600)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 25,
          stiffness: 200,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 600,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.handle} />

        <Box px={16} pb={16}>
          <Text fontSize={18} fontWeight="700" color="#000000">Next step</Text>
          {candidateName && <Text fontSize={14} color="#666666" mt={2}>{candidateName}</Text>}
        </Box>

        <Divider color="#F3F2EF" />

        <Box p={16}>
          {ACTIONS.map((action) => {
            const isCurrent = action.status === currentStatus;
            const Icon = action.Icon;
            return (
              <TouchableOpacity
                key={action.status}
                disabled={loading || isCurrent}
                onPress={() => onAction(action.status)}
                style={[styles.actionRow, isCurrent && styles.actionRowCurrent]}
              >
                <HStack items="center">
                   <Box w={40} h={40} rounded={4} bg={action.bg} items="center" justify="center">
                      <Icon size={20} color={action.color} strokeWidth={2} />
                   </Box>
                   <VStack ml={12} flex={1}>
                      <Text fontSize={15} fontWeight="700" color="#000000">{action.label}</Text>
                      <Text fontSize={13} color="#666666" mt={2}>{action.subtitle}</Text>
                   </VStack>
                   {isCurrent && (
                     <Box px={8} py={2} rounded={2} bg={GRAY_BG}>
                        <Text fontSize={11} fontWeight="700" color="#666666">CURRENT</Text>
                     </Box>
                   )}
                </HStack>
              </TouchableOpacity>
            );
          })}
        </Box>

        <Box p={16} pb={40}>
           <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text fontSize={15} fontWeight="700" color="#000000">Cancel</Text>
           </TouchableOpacity>
        </Box>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  backdropPress: { flex: 1 },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginVertical: 12,
  },
  actionRow: { paddingVertical: 12 },
  actionRowCurrent: { opacity: 0.5 },
  cancelBtn: {
     height: 48, borderRadius: 24, backgroundColor: '#F3F2EF',
     flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  }
});





