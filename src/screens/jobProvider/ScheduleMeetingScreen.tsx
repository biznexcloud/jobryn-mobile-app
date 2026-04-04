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
  XCircle,
  RefreshCw,
  CheckCircle,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Button, Divider } from '../../components/ui';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#4F46E5';
const GREEN = '#059669';

export default function ScheduleMeetingScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { meeting } = route.params || {};
  const [joining, setJoining] = useState(false);

  const DUMMY_MEETING = {
    id: meeting?.id || 1,
    agenda: meeting?.agenda || 'Candidate Portfolio Review',
    seeker_name: meeting?.seeker_name || 'Anupama Rai',
    seeker_avatar: meeting?.seeker_avatar || 'https://i.pravatar.cc/150?u=meet1',
    seeker_role: meeting?.seeker_role || 'Product Designer',
    meeting_time: meeting?.meeting_time || '2026-04-05T10:00:00Z',
    duration_minutes: meeting?.duration_minutes || 45,
    is_virtual: meeting?.is_virtual !== false,
    status: meeting?.status || 'scheduled',
    meeting_link: meeting?.meeting_link || 'https://meet.google.com/jobryn-interview',
    notes: meeting?.notes || 'Please review the candidate\'s portfolio prior to this session.',
  };

  const formattedDate = new Date(DUMMY_MEETING.meeting_time).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedTime = new Date(DUMMY_MEETING.meeting_time).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  const handleJoin = async () => {
    setJoining(true);
    try {
      const canOpen = await Linking.canOpenURL(DUMMY_MEETING.meeting_link);
      if (canOpen) {
        await Linking.openURL(DUMMY_MEETING.meeting_link);
      } else {
        Alert.alert('Meeting Link', DUMMY_MEETING.meeting_link, [{ text: 'OK' }]);
      }
    } catch {
      Alert.alert('Error', 'Could not open the meeting link.');
    } finally {
      setJoining(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Meeting',
      'Are you sure you want to cancel this session with ' + DUMMY_MEETING.seeker_name + '?',
      [
        { text: 'Keep Meeting', style: 'cancel' },
        { text: 'Cancel Meeting', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="#F8FAFC">
      <StatusBar barStyle="dark-content" />

      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text fontSize={18} fontWeight="700" color="#111827" ml={12}>Meeting Brief</Text>
          </HStack>
          <Box bg="#EEF2FF" px={10} py={4} rounded={12}>
            <Text fontSize={12} fontWeight="700" color={BLUE}>SCHEDULED</Text>
          </Box>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Candidate Card */}
        <Box bg="white" p={20} rounded={20} mb={16} style={styles.shadow}>
          <Text fontSize={13} fontWeight="700" color="#6B7280" mb={12}>CANDIDATE</Text>
          <HStack items="center">
            <Avatar source={{ uri: DUMMY_MEETING.seeker_avatar }} size="lg" />
            <VStack ml={14} flex={1}>
              <Text fontSize={18} fontWeight="800" color="#111827">{DUMMY_MEETING.seeker_name}</Text>
              <Text fontSize={14} color="#6B7280" mt={2}>{DUMMY_MEETING.seeker_role}</Text>
            </VStack>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => navigation.navigate('PublicProfile', { userId: meeting?.seeker_id })}
            >
              <User size={18} color={BLUE} />
            </TouchableOpacity>
          </HStack>
        </Box>

        {/* Meeting Info */}
        <Box bg="white" p={20} rounded={20} mb={16} style={styles.shadow}>
          <Text fontSize={13} fontWeight="700" color="#6B7280" mb={16}>AGENDA</Text>
          <Text fontSize={18} fontWeight="800" color="#111827" mb={20}>{DUMMY_MEETING.agenda}</Text>

          <Divider color="#F1F5F9" mb={16} />

          <VStack space="md">
            <HStack items="center">
              <Box bg="#EEF2FF" p={8} rounded={10}>
                <Calendar size={18} color={BLUE} />
              </Box>
              <VStack ml={12}>
                <Text fontSize={13} color="#6B7280" fontWeight="600">Date</Text>
                <Text fontSize={15} color="#111827" fontWeight="700">{formattedDate}</Text>
              </VStack>
            </HStack>
            <HStack items="center">
              <Box bg="#EEF2FF" p={8} rounded={10}>
                <Clock size={18} color={BLUE} />
              </Box>
              <VStack ml={12}>
                <Text fontSize={13} color="#6B7280" fontWeight="600">Time & Duration</Text>
                <Text fontSize={15} color="#111827" fontWeight="700">{formattedTime} · {DUMMY_MEETING.duration_minutes} mins</Text>
              </VStack>
            </HStack>
            <HStack items="center">
              <Box bg="#EEF2FF" p={8} rounded={10}>
                <Video size={18} color={BLUE} />
              </Box>
              <VStack ml={12}>
                <Text fontSize={13} color="#6B7280" fontWeight="600">Format</Text>
                <Text fontSize={15} color="#111827" fontWeight="700">{DUMMY_MEETING.is_virtual ? 'Virtual (Video Call)' : 'On-site'}</Text>
              </VStack>
            </HStack>
          </VStack>
        </Box>

        {/* Notes */}
        {DUMMY_MEETING.notes && (
          <Box bg="#FFFBEB" p={16} rounded={16} mb={24} border={1} borderColor="#FDE68A">
            <Text fontSize={13} fontWeight="700" color="#92400E" mb={6}>📝 Preparation Notes</Text>
            <Text fontSize={13} color="#78350F" lineHeight={20}>{DUMMY_MEETING.notes}</Text>
          </Box>
        )}

        {/* Action Buttons */}
        <Button
          label="Launch Meeting"
          loading={joining}
          onPress={handleJoin}
          style={{ backgroundColor: BLUE, height: 56, borderRadius: 28, marginBottom: 12 }}
          textStyle={{ fontSize: 17, fontWeight: '800' }}
        />
        <HStack space="md" mb={40}>
          <Button
            label="Reschedule"
            variant="outline"
            onPress={() => Alert.alert('Reschedule', 'Reschedule feature coming soon!')}
            style={{ flex: 1, borderColor: '#CBD5E1', height: 48, borderRadius: 24 }}
            textStyle={{ color: '#64748B', fontWeight: '700' }}
          />
          <Button
            label="Cancel"
            variant="outline"
            onPress={handleCancel}
            style={{ flex: 1, borderColor: '#FCA5A5', height: 48, borderRadius: 24 }}
            textStyle={{ color: '#EF4444', fontWeight: '700' }}
          />
        </HStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  profileBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16 },
  shadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
});
