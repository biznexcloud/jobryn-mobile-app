import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Video,
  Calendar,
  Clock,
  User,
  ExternalLink,
  MoreVertical,
  MapPin,
  Info,
  CalendarDays,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Button, Divider, Heading } from '../../components/ui';
import { MeetingService } from '../../services/api/meetings';
import Toast from 'react-native-toast-message';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

export default function ScheduleMeetingScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { meeting } = route.params || {};
  const [joining, setJoining] = useState(false);
  const [loading, setLoading] = useState(false);

  const formattedDate = new Date(meeting?.scheduled_at).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  const formattedTime = new Date(meeting?.scheduled_at).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  const handleJoin = async () => {
    if (!meeting?.meeting_link) {
       Alert.alert('Link ready soon', 'The organizer hasn\'t shared the meeting link yet.');
       return;
    }
    setJoining(true);
    try {
       await Linking.openURL(meeting.meeting_link);
    } catch {
       Alert.alert('Error', 'Unable to launch meeting client.');
    } finally {
       setJoining(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Meeting',
      'Are you sure you want to cancel this interview session?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await MeetingService.deleteMeeting(meeting.id);
              Toast.show({ type: 'success', text1: 'Meeting cancelled' });
              navigation.goBack();
            } catch (e) {
              Toast.show({ type: 'error', text1: 'Failed to cancel' });
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center" justify="space-between" px={16}>
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
              <ChevronLeft size={22} color="black" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Interview Details</Text>
          </HStack>
          <TouchableOpacity style={styles.headerIcon}>
             <MoreVertical size={20} color="black" />
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <Box p={16} bg="white" borderBottom={1} borderColor="#F0F2F5">
            <Text fontSize={12} fontWeight="700" color={GRAY_TEXT} letterSpacing={0.5} mb={8}>AGENDA</Text>
            <Text fontSize={22} fontWeight="800" color="#111827" lineHeight={28}>{meeting?.agenda}</Text>
            
            <HStack mt={20} items="center" space="md">
               <Avatar source={{ uri: meeting?.seeker_avatar || meeting?.avatar || 'https://i.pravatar.cc/150?u=a1' }} size="lg" />
               <VStack flex={1}>
                  <Text fontSize={16} fontWeight="700" color="#111827">{meeting?.seeker_name}</Text>
                  <Text fontSize={14} color={GRAY_TEXT} mt={1}>{meeting?.seeker_role || 'Candidate'}</Text>
               </VStack>
               <TouchableOpacity 
                 onPress={() => navigation?.navigate('PublicProfile', { userId: meeting?.seeker })}
                 style={styles.profileBtn}
               >
                  <User size={18} color="#111827" />
               </TouchableOpacity>
            </HStack>
          </Box>

         {/* Logistics Section */}
         <Box bg="white" mt={8} p={16}>
            <VStack space="lg">
               <HStack items="center" space="md">
                  <Box w={36} h={36} rounded={18} bg="#F3F4F6" items="center" justify="center">
                     <Calendar size={18} color="#4B5563" />
                  </Box>
                  <VStack>
                     <Text fontSize={13} color={GRAY_TEXT}>Date</Text>
                     <Text fontSize={15} fontWeight="700" color="#111827" mt={1}>{formattedDate}</Text>
                  </VStack>
               </HStack>

               <HStack items="center" space="md">
                  <Box w={36} h={36} rounded={18} bg="#F3F4F6" items="center" justify="center">
                     <Clock size={18} color="#4B5563" />
                  </Box>
                  <VStack>
                     <Text fontSize={13} color={GRAY_TEXT}>Time & Duration</Text>
                     <Text fontSize={15} fontWeight="700" color="#111827" mt={1}>{formattedTime} • {meeting.duration_minutes}m</Text>
                  </VStack>
               </HStack>

                <HStack items="center" space="md">
                   <Box w={36} h={36} rounded={18} bg="#F3F4F6" items="center" justify="center">
                      <Video size={18} color="#4B5563" />
                   </Box>
                   <VStack>
                      <Text fontSize={13} color={GRAY_TEXT}>Format</Text>
                      <Text fontSize={15} fontWeight="700" color="#111827" mt={1}>
                        {(meeting.meeting_type === 'online' || meeting.meeting_type === 'virtual') ? 'Virtual Interview' : 'Office Interview'}
                      </Text>
                   </VStack>
                </HStack>
            </VStack>
         </Box>

         {/* Notes Section */}
         <Box bg="white" mt={8} p={16}>
            <Text fontSize={14} fontWeight="700" color={GRAY_TEXT} mb={12}>NOTES</Text>
             <Box bg="#F0F9FF" p={16} rounded={12}>
                <Text fontSize={15} color="#1E3A8A" lineHeight={22}>
                   {meeting?.notes || 'No specific notes provided for this session.'}
                </Text>
             </Box>
         </Box>

         {/* Actions Section */}
         <Box mt={20} px={16}>
            <TouchableOpacity 
              style={styles.joinBtn}
              onPress={handleJoin}
              disabled={joining}
            >
               <Text fontSize={15} fontWeight="700" color="white">{joining ? "Launching..." : "Join Session"}</Text>
            </TouchableOpacity>

             <HStack space="md" mt={12}>
                <TouchableOpacity style={styles.rescheduleBtn}>
                   <Text fontSize={14} fontWeight="700" color="#111827">Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={handleCancel}
                   disabled={loading}
                   style={styles.cancelBtn}
                >
                   <Text fontSize={14} fontWeight="700" color="#EF4444">{loading ? '...' : 'Cancel'}</Text>
                </TouchableOpacity>
             </HStack>
         </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  profileBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  joinBtn: { height: 48, borderRadius: 24, backgroundColor: FB_BLUE, alignItems: 'center', justifyContent: 'center' },
  rescheduleBtn: { flex: 1, height: 44, borderRadius: 22, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { flex: 1, height: 44, borderRadius: 22, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' },
});
