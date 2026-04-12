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
import DateTimePicker from '@react-native-community/datetimepicker';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

export default function ScheduleMeetingScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { meeting, applicationId, applicantName, applicantAvatar, meetingType, isNewMeeting } = route.params || {};
  const [joining, setJoining] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | null>(isNewMeeting ? new Date() : null);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [agenda, setAgenda] = useState(meeting?.agenda || 'Interview Session');
  const [meetingUrl, setMeetingUrl] = useState(meeting?.meeting_link || '');

  const displayDate = isNewMeeting && rescheduleDate ? rescheduleDate : new Date(meeting?.scheduled_at || Date.now());

  const formattedDate = displayDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  const formattedTime = displayDate.toLocaleTimeString('en-US', {
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
            if (!meeting?.id) return;
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

  const handleScheduleSubmit = async (finalDate: Date) => {
    setLoading(true);
    try {
      if (isNewMeeting) {
        await MeetingService.scheduleMeeting({
          application: applicationId,
          meeting_type: meetingType || 'online',
          scheduled_at: finalDate.toISOString(),
          agenda: agenda,
          meeting_link: meetingUrl || (meetingType === 'online' ? 'https://meet.google.com/new' : null),
          duration_minutes: 30
        });
        Toast.show({ type: 'success', text1: 'Interview Scheduled!' });
      } else {
        await MeetingService.patchMeeting(meeting.id, {
          scheduled_at: finalDate.toISOString(),
          status: 'rescheduled'
        });
        Toast.show({ type: 'success', text1: 'Meeting rescheduled!' });
      }
      navigation.goBack();
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Operation failed' });
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    if (pickerMode === 'date') {
      const newD = rescheduleDate || new Date();
      selectedDate.setHours(newD.getHours(), newD.getMinutes());
      setRescheduleDate(selectedDate);
      setTimeout(() => {
        setPickerMode('time');
        setShowDatePicker(true);
      }, 100);
    } else {
      const finalDate = rescheduleDate || new Date();
      finalDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setRescheduleDate(finalDate);
      // Wait for user to click a final "Confirm" button if it's a new meeting?
      // For now, let's just trigger submit to keep it fast.
      handleScheduleSubmit(finalDate);
    }
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
            <Text fontSize={12} fontWeight="700" color={GRAY_TEXT} letterSpacing={0.5} mb={8}>{isNewMeeting ? 'NEW INTERVIEW' : 'AGENDA'}</Text>
            <Text fontSize={22} fontWeight="800" color="#111827" lineHeight={28}>{isNewMeeting ? `Interview for ${agenda}` : meeting?.agenda}</Text>
            
            <HStack mt={20} items="center" space="md">
               <Avatar source={{ uri: applicantAvatar || meeting?.seeker_avatar || meeting?.avatar || 'https://i.pravatar.cc/150?u=a1' }} size="lg" />
               <VStack flex={1}>
                  <Text fontSize={16} fontWeight="700" color="#111827">{applicantName || meeting?.seeker_name}</Text>
                  <Text fontSize={14} color={GRAY_TEXT} mt={1}>{meeting?.seeker_role || 'Candidate'}</Text>
               </VStack>
               <TouchableOpacity 
                 onPress={() => navigation?.navigate('PublicProfile', { userId: meeting?.seeker || route.params?.applicantId })}
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
                     <Text fontSize={15} fontWeight="700" color="#111827" mt={1}>{formattedTime} • {meeting?.duration_minutes || 30}m</Text>
                  </VStack>
               </HStack>

                <HStack items="center" space="md">
                   <Box w={36} h={36} rounded={18} bg="#F3F4F6" items="center" justify="center">
                      <Video size={18} color="#4B5563" />
                   </Box>
                   <VStack>
                      <Text fontSize={13} color={GRAY_TEXT}>Format</Text>
                      <Text fontSize={15} fontWeight="700" color="#111827" mt={1}>
                        {((meeting?.meeting_type || meetingType) === 'online' || (meeting?.meeting_type || meetingType) === 'virtual') ? 'Virtual Interview' : 'Office Interview'}
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
                <TouchableOpacity onPress={() => { setPickerMode('date'); setShowDatePicker(true); }} style={styles.rescheduleBtn}>
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

      {showDatePicker && (
        <DateTimePicker
          value={rescheduleDate || (meeting?.scheduled_at ? new Date(meeting.scheduled_at) : new Date())}
          mode={pickerMode}
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
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
