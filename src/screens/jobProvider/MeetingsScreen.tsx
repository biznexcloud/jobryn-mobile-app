import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  Video,
  Clock,
  ChevronRight,
  Bell,
  MoreVertical,
  Plus,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Avatar, Heading, Button } from '../../components/ui';
import { MeetingService } from '../../services/api/meetings';
import { useAuthStore } from '../../store/authStore';

const BLUE = '#0A66C2'; 
const GREEN = '#057642';
const GRAY_TEXT = '#666666';
const SOFT_BG = '#F3F2EF';

export default function MeetingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMeetings = async () => {
    try {
      const res = await MeetingService.getRecruiterMeetings();
      setUpcoming(res?.results || []);
    } catch (err) {
      // Fallback for Demo
      setUpcoming([
        { 
          id: 1, 
          agenda: 'Technical Interview', 
          seeker_name: 'Sanjeev Giri', 
          meeting_time: '2026-04-05T10:00:00Z',
          is_virtual: true,
          status: 'scheduled',
          avatar: 'https://i.pravatar.cc/150?u=s1'
        },
        { 
          id: 2, 
          agenda: 'Portfolio Review', 
          seeker_name: 'Anupama Rai', 
          meeting_time: '2026-04-05T14:30:00Z',
          is_virtual: true,
          status: 'scheduled',
          avatar: 'https://i.pravatar.cc/150?u=a1'
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return { color: BLUE, bg: '#EDF3F8', label: 'Scheduled' };
      case 'confirmed': return { color: GREEN, bg: '#EDF9F2', label: 'Confirmed' };
      default: return { color: GRAY_TEXT, bg: '#F3F2EF', label: status };
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={SOFT_BG}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E0E0E0">
         <HStack justify="space-between" items="center">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation?.goBack()}>
                  <Heading fontSize={22} fontWeight="800" color="#000000">Mission Schedule</Heading>
               </TouchableOpacity>
            </HStack>
            <HStack space="lg">
               <TouchableOpacity onPress={() => navigation?.navigate('Notifications')}>
                  <Bell size={22} color="#000000" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.addBtn}>
                  <Plus size={22} color="white" />
               </TouchableOpacity>
            </HStack>
         </HStack>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadMeetings} tintColor={BLUE} />}
      >
        <VStack p={12} space="lg">
            {/* Analytics Summary */}
            <Box bg="white" p={16} rounded={12} border={1} borderColor="#E0E0E0">
               <HStack justify="space-between" items="center">
                  <VStack>
                     <Text fontSize={12} fontWeight="700" color={GRAY_TEXT} letterSpacing={0.5}>ACTIVE PIPELINE</Text>
                     <Heading fontSize={20} fontWeight="800" color="#000000" mt={4}>{upcoming.length} Sessions</Heading>
                  </VStack>
                  <Box bg="#EDF3F8" p={10} rounded={8}>
                     <Calendar size={20} color={BLUE} />
                  </Box>
               </HStack>
            </Box>

            {loading ? (
              <ActivityIndicator size="small" color={BLUE} style={{ marginTop: 40 }} />
            ) : (
              upcoming.map((meeting) => {
                const status = getStatusConfig(meeting.status);
                return (
                  <Box key={meeting.id} bg="white" rounded={12} border={1} borderColor="#E0E0E0" overflow="hidden">
                    <TouchableOpacity 
                      activeOpacity={0.9}
                      onPress={() => navigation?.navigate('ScheduleMeeting', { meeting })}
                      style={{ padding: 16 }}
                    >
                       <HStack justify="space-between" items="flex-start">
                          <HStack space="md" flex={1}>
                             <Avatar source={{ uri: meeting.avatar }} size="md" rounded={6} />
                             <VStack flex={1}>
                                <Heading fontSize={16} fontWeight="700" color="#000000">{meeting.agenda}</Heading>
                                <Text fontSize={13} color={GRAY_TEXT} mt={2}>Interview with {meeting.seeker_name}</Text>
                             </VStack>
                          </HStack>
                          <Box bg={status.bg} px={8} py={4} rounded={4}>
                             <Text fontSize={10} fontWeight="800" color={status.color}>{status.label.toUpperCase()}</Text>
                          </Box>
                       </HStack>

                       <HStack mt={16} space="md" flexWrap="wrap">
                          <HStack items="center" space="xs" mr={8} mb={4}>
                             <Clock size={14} color={GRAY_TEXT} />
                             <Text fontSize={13} color={GRAY_TEXT} fontWeight="600">10:00 AM</Text>
                          </HStack>
                          {meeting.is_virtual && (
                            <HStack items="center" space="xs" mb={4}>
                               <Video size={14} color={BLUE} />
                               <Text fontSize={13} color={BLUE} fontWeight="600">Virtual Hub</Text>
                            </HStack>
                          )}
                       </HStack>

                       <Divider color="#F1F1F1" my={16} />

                       <HStack justify="space-between" items="center">
                          <Button 
                             label="Launch Meeting" 
                             onPress={() => {}} 
                             style={{ backgroundColor: BLUE, height: 36, borderRadius: 18, paddingHorizontal: 16 }}
                             textStyle={{ fontSize: 13, fontWeight: '700' }}
                          />
                          <TouchableOpacity>
                             <MoreVertical size={20} color={GRAY_TEXT} />
                          </TouchableOpacity>
                       </HStack>
                    </TouchableOpacity>
                  </Box>
                );
              })
            )}

            {upcoming.length === 0 && !loading && (
               <VStack items="center" mt={40} px={40}>
                  <Box bg="white" p={24} rounded={999} mb={20} border={1} borderColor="#E0E0E0">
                    <Calendar size={40} color="#D1D5DB" />
                  </Box>
                  <Text fontSize={18} fontWeight="800" color="#000000">Quiet schedule</Text>
                  <Text fontSize={14} color={GRAY_TEXT} mt={8} textAlign="center">
                    No active sessions scheduled. Try reaching out to potential candidates.
                  </Text>
               </VStack>
            )}
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
});





