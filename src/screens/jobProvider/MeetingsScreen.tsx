import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Sidebar from '../../components/common/Sidebar';
import {
  CalendarIcon,
  VideoCameraIcon,
  ClockIcon,
  ChevronRightIcon,
  BellIcon,
} from 'react-native-heroicons/outline';
import { moderateScale } from '../../utils/responsive';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Avatar } from '../../components/ui';
import { MeetingService } from '../../services/api/meetings';
import { useAuthStore } from '../../store/authStore';

const GREEN = '#10B981';
const BLUE = '#4F46E5';

interface MeetingsScreenProps {
  navigation?: any;
  route?: any;
}

export default function MeetingsScreen({ navigation, route }: MeetingsScreenProps) {
  const role = route?.params?.role || 'recruiter';
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMeetings = async () => {
    try {
      const res = await MeetingService.getRecruiterMeetings();
      setUpcoming(res?.results || []);
    } catch (err) {
      console.warn('Failed to load meetings', err);
      // Fallback for Demo Mode
      if (useAuthStore.getState().token === 'demo-token' || true) {
        setUpcoming([
          { 
            id: 1, 
            agenda: 'Candidate Portfolio Review', 
            seeker_name: 'Sanjeev Giri', 
            meeting_time: '2026-04-05T10:00:00Z',
            is_virtual: true,
            status: 'scheduled'
          },
          { 
            id: 2, 
            agenda: 'Discovery Call: Frontend Role', 
            seeker_name: 'Anupama Rai', 
            meeting_time: '2026-04-05T14:30:00Z',
            is_virtual: true,
            status: 'scheduled'
          }
        ]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  return (
    <ScreenWrapper safeAreaTop safeAreaBottom={false} backgroundColor="#F8FAFC">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Titanium Header */}
      <Box p={20} bg="white" borderBottom={1} borderColor="#F1F5F9">
         <HStack justify="space-between" items="center">
            <TouchableOpacity onPress={() => navigation?.goBack()}>
               <Text fontSize={18} fontWeight="900" color="#111827">Mission Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation?.navigate('Notifications')}>
               <BellIcon size={24} color="#111827" />
            </TouchableOpacity>
         </HStack>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadMeetings} tintColor={BLUE} />}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        <VStack space="lg">
           <HStack justify="space-between" items="center">
              <VStack>
                 <Text fontSize={12} fontWeight="900" color="#94A3B8" letterSpacing={1}>ENGAGEMENT PIPELINE</Text>
                 <Text fontSize={20} fontWeight="900" color="#111827" mt={2}>{upcoming.length} Active Briefings</Text>
              </VStack>
              <Box bg={BLUE} px={12} py={6} rounded={8}>
                 <Text fontSize={11} fontWeight="900" color="white">LIVE SYNC</Text>
              </Box>
           </HStack>

           <Divider color="#F1F5F9" />

           {loading ? (
             <ActivityIndicator size="small" color={BLUE} style={{ marginTop: 40 }} />
           ) : (
             upcoming.map((meeting) => (
               <TouchableOpacity 
                 key={meeting.id} 
                 style={styles.meetingCard}
                 activeOpacity={0.9}
                 onPress={() => navigation?.navigate('ScheduleMeeting', { meeting })}
               >
                  <VStack p={20} bg="white" rounded={24} border={1} borderColor="#F1F5F9" style={styles.premiumShadow}>
                     <HStack justify="space-between" items="center" mb={16}>
                        <HStack items="center">
                           <Box w={40} h={40} rounded={12} bg="#F0F7FF" items="center" justify="center">
                              <CalendarIcon size={20} color={BLUE} />
                           </Box>
                           <VStack ml={12}>
                              <Text fontSize={15} fontWeight="900" color="#111827">{meeting.agenda}</Text>
                              <Text fontSize={12} color="#64748B" fontWeight="700">Interview with {meeting.seeker_name}</Text>
                           </VStack>
                        </HStack>
                        <Box bg="#E1F0E5" px={8} py={4} rounded={6}>
                           <Text fontSize={10} fontWeight="900" color={GREEN}>CONFIRMED</Text>
                        </Box>
                     </HStack>

                     <Divider color="#F8FAFC" mb={16} />

                     <HStack justify="space-between" items="center">
                        <HStack space="md">
                           <HStack items="center">
                              <ClockIcon size={14} color="#94A3B8" />
                              <Text fontSize={13} color="#64748B" ml={6} fontWeight="700">10:00 AM</Text>
                           </HStack>
                           {meeting.is_virtual && (
                             <HStack items="center">
                                <VideoCameraIcon size={14} color="#94A3B8" />
                                <Text fontSize={13} color="#64748B" ml={6} fontWeight="700">Virtual Hub</Text>
                             </HStack>
                           )}
                        </HStack>
                        <TouchableOpacity style={styles.joinBtn}>
                           <Text fontSize={13} fontWeight="900" color="white">Launch Meeting</Text>
                        </TouchableOpacity>
                     </HStack>
                  </VStack>
               </TouchableOpacity>
             ))
           )}
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  meetingCard: { marginBottom: 16 },
  premiumShadow: {
     shadowColor: '#0A1628', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 4
  },
  joinBtn: {
     backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12
  }
});





