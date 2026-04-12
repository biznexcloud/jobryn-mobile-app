import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  View,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Plus,
  MapPin,
  Calendar,
  Video,
  Clock,
  ChevronLeft,
  Bell,
  MoreVertical,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Avatar, Heading, Button } from '../../components/ui';
import { MeetingService } from '../../services/api/meetings';
import { useAuthStore } from '../../store/authStore';
import { useFocusEffect } from '@react-navigation/native';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

export default function MeetingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMeetings = async () => {
    try {
      const res = await MeetingService.getRecruiterMeetings();
      setUpcoming(res.results || res);
    } catch (err) {
      console.warn('Failed to load recruiter meetings:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMeetings();
    }, [])
  );

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return { color: FB_BLUE, bg: '#EBF5FF', label: 'Scheduled' };
      case 'confirmed': return { color: '#16A34A', bg: '#F0FDF4', label: 'Confirmed' };
      default: return { color: '#666', bg: '#F1F1F1', label: status };
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box px={16} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
         <HStack justify="space-between" items="center">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
                  <ChevronLeft size={22} color="black" strokeWidth={2.5} />
               </TouchableOpacity>
               <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Meetings</Text>
            </HStack>
            <HStack space="sm">
               <TouchableOpacity onPress={() => navigation?.navigate('Notifications')} style={styles.headerIcon}>
                  <Bell size={20} color="black" />
               </TouchableOpacity>
               <TouchableOpacity 
                 onPress={() => navigation?.navigate('Pipeline')} 
                 style={[styles.headerIcon, { backgroundColor: FB_BLUE }]}
               >
                  <Plus size={20} color="white" strokeWidth={2.5} />
               </TouchableOpacity>
            </HStack>
         </HStack>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadMeetings} tintColor={FB_BLUE} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Box p={12}>
            {/* Summary Card */}
            <Box bg="white" p={16} rounded={12} mb={16} border={1} borderColor="#F0F2F5">
               <HStack justify="space-between" items="center">
                  <VStack>
                     <Text fontSize={12} fontWeight="700" color={FB_BLUE} textTransform="uppercase">Upcoming</Text>
                     <Text fontSize={20} fontWeight="800" color="#111827" mt={2}>{upcoming.length} Meetings Today</Text>
                  </VStack>
                  <Box bg="#EBF5FF" p={10} rounded={10}>
                     <Calendar size={22} color={FB_BLUE} />
                  </Box>
               </HStack>
            </Box>

            {loading ? (
              <ActivityIndicator size="small" color={FB_BLUE} style={{ marginTop: 40 }} />
            ) : (
              upcoming.map((meeting) => {
                const status = getStatusConfig(meeting.status);
                return (
                  <TouchableOpacity 
                    key={meeting.id}
                    activeOpacity={0.9}
                    onPress={() => navigation?.navigate('ScheduleMeeting', { meeting })}
                    style={styles.meetingCard}
                  >
                     <HStack justify="space-between" items="flex-start">
                        <HStack space="md" flex={1}>
                           <Avatar source={{ uri: meeting.avatar }} size={48} />
                           <VStack flex={1}>
                              <Text fontSize={16} fontWeight="700" color="#111827">{meeting.agenda}</Text>
                              <Text fontSize={13} color={GRAY_TEXT} mt={2}>With {meeting.seeker_name}</Text>
                           </VStack>
                        </HStack>
                        <Box bg={status.bg} px={10} py={4} rounded={20}>
                           <Text fontSize={10} fontWeight="700" color={status.color}>{status.label}</Text>
                        </Box>
                     </HStack>

                     <HStack mt={14} space="sm" items="center">
                        <Box bg="#F3F4F6" px={10} py={6} rounded={8} items="center" style={{ flexDirection: 'row' }}>
                           <Clock size={14} color="#4B5563" />
                           <Text fontSize={12} fontWeight="700" color="#4B5563" ml={6}>
                             {new Date(meeting.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </Text>
                        </Box>
                        {meeting.meeting_type === 'online' && (
                          <Box bg="#ECFDF5" px={10} py={6} rounded={8} items="center" style={{ flexDirection: 'row' }}>
                             <Video size={14} color="#10B981" />
                             <Text fontSize={12} fontWeight="700" color="#10B981" ml={6}>Video Call</Text>
                          </Box>
                        )}
                        {(meeting.meeting_type === 'onsite' || meeting.meeting_type === 'in_person') && (
                          <Box bg="#FEF3C7" px={10} py={6} rounded={8} items="center" style={{ flexDirection: 'row' }}>
                             <MapPin size={14} color="#D97706" />
                             <Text fontSize={12} fontWeight="700" color="#D97706" ml={6}>Office Visit</Text>
                          </Box>
                        )}
                     </HStack>

                     <Box h={1} bg="#F3F4F6" my={16} />

                     <HStack justify="space-between" items="center">
                        <TouchableOpacity 
                           style={styles.actionBtn}
                           onPress={() => {
                             if (!meeting.meeting_link) {
                               Alert.alert('Link ready soon', 'The organizer hasn\'t shared the meeting link yet.');
                               return;
                             }
                             Linking.openURL(meeting.meeting_link).catch(() => 
                               Alert.alert('Error', 'Unable to launch meeting client.')
                             );
                           }}
                        >
                           <Text fontSize={13} fontWeight="700" color="white">Join Meeting</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                           <MoreVertical size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                     </HStack>
                  </TouchableOpacity>

                );
              })
            )}

            {upcoming.length === 0 && !loading && (
               <VStack items="center" mt={60} px={40}>
                  <Box bg="white" w={72} h={72} rounded={36} border={1} borderColor="#F0F2F5" items="center" justify="center">
                    <Calendar size={32} color="#D1D5DB" />
                  </Box>
                  <Text fontSize={17} fontWeight="800" color="#111827" mt={20}>No Meetings</Text>
                  <Text fontSize={14} color={GRAY_TEXT} mt={8} textAlign="center" lineHeight={20}>
                    You haven't scheduled any meetings yet.
                  </Text>
               </VStack>
            )}
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  meetingCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F0F2F5' },
  actionBtn: { backgroundColor: FB_BLUE, height: 36, borderRadius: 18, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
});





