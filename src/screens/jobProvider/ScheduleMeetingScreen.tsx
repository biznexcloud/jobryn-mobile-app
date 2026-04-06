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

const BLUE = '#0A66C2'; 
const GRAY_TEXT = '#666666';
const SOFT_BG = '#F3F2EF';

export default function ScheduleMeetingScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { meeting } = route.params || {};
  const [joining, setJoining] = useState(false);

  const DUMMY_MEETING = {
    id: meeting?.id || 1,
    agenda: meeting?.agenda || 'Technical Portfolio Review',
    seeker_name: meeting?.seeker_name || 'Anupama Rai',
    seeker_avatar: meeting?.seeker_avatar || 'https://i.pravatar.cc/150?u=meet1',
    seeker_role: meeting?.seeker_role || 'Senior Product Designer',
    meeting_time: meeting?.meeting_time || '2026-04-05T10:00:00Z',
    duration_minutes: meeting?.duration_minutes || 45,
    is_virtual: meeting?.is_virtual !== false,
    status: meeting?.status || 'Scheduled',
    meeting_link: meeting?.meeting_link || 'https://meet.google.com/jobryn-interview',
    notes: meeting?.notes || 'Focus on architectural decisions and recent React Native contributions.',
  };

  const formattedDate = new Date(DUMMY_MEETING.meeting_time).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
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
        Alert.alert('Meeting Link', DUMMY_MEETING.meeting_link);
      }
    } catch {
      Alert.alert('Error', 'Unable to launch meeting client.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Clean Header */}
      <Box pt={insets.top + 10} pb={12} bg="white" borderBottom={1} borderColor="#E0E0E0">
        <HStack items="center" justify="space-between" px={16}>
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation?.goBack()}>
              <ChevronLeft size={24} color="#000000" />
            </TouchableOpacity>
            <Heading fontSize={18} fontWeight="700" color="#000000" ml={16}>Interview Brief</Heading>
          </HStack>
          <HStack space="md" items="center">
             <Box bg="#EDF3F8" px={10} py={4} rounded={12}>
                <Text fontSize={11} fontWeight="800" color={BLUE}>LIVE SESSION</Text>
             </Box>
             <TouchableOpacity>
                <MoreVertical size={20} color={GRAY_TEXT} />
             </TouchableOpacity>
          </HStack>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
         {/* Agenda Section */}
         <Box p={20} borderBottom={1} borderColor="#F0F0F0">
            <Text fontSize={12} fontWeight="800" color={GRAY_TEXT} letterSpacing={0.5} mb={12}>MEETING AGENDA</Text>
            <Heading fontSize={24} fontWeight="800" color="#000000" lineHeight={32}>{DUMMY_MEETING.agenda}</Heading>
            
            <HStack mt={20} items="center" space="md">
               <Avatar source={{ uri: DUMMY_MEETING.seeker_avatar }} size="lg" rounded={12} />
               <VStack flex={1}>
                  <Text fontSize={16} fontWeight="800" color="#000000">{DUMMY_MEETING.seeker_name}</Text>
                  <Text fontSize={14} color={GRAY_TEXT} mt={2}>{DUMMY_MEETING.seeker_role}</Text>
               </VStack>
               <TouchableOpacity 
                  onPress={() => navigation?.navigate('PublicProfile', { userId: meeting?.seeker_id })}
                  style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: BLUE, alignItems: 'center', justifyContent: 'center' }}
               >
                  <User size={18} color={BLUE} />
               </TouchableOpacity>
            </HStack>
         </Box>

         {/* Time & Logistics */}
         <VStack p={20} space="xl">
            <VStack space="lg">
               <HStack items="center" space="md">
                  <Box bg={SOFT_BG} p={10} rounded={8}>
                     <CalendarDays size={20} color={GRAY_TEXT} />
                  </Box>
                  <VStack>
                     <Text fontSize={13} fontWeight="700" color={GRAY_TEXT}>Session Date</Text>
                     <Text fontSize={16} fontWeight="800" color="#000000" mt={2}>{formattedDate}</Text>
                  </VStack>
               </HStack>

               <HStack items="center" space="md">
                  <Box bg={SOFT_BG} p={10} rounded={8}>
                     <Clock size={20} color={GRAY_TEXT} />
                  </Box>
                  <VStack>
                     <Text fontSize={13} fontWeight="700" color={GRAY_TEXT}>Local Time & Duration</Text>
                     <Text fontSize={16} fontWeight="800" color="#000000" mt={2}>{formattedTime} • {DUMMY_MEETING.duration_minutes} Minutes</Text>
                  </VStack>
               </HStack>

               <HStack items="center" space="md">
                  <Box bg={SOFT_BG} p={10} rounded={8}>
                     <Video size={20} color={GRAY_TEXT} />
                  </Box>
                  <VStack>
                     <Text fontSize={13} fontWeight="700" color={GRAY_TEXT}>Interaction Format</Text>
                     <Text fontSize={16} fontWeight="800" color="#000000" mt={2}>{DUMMY_MEETING.is_virtual ? 'Virtual Video Conference' : 'On-site Interview'}</Text>
                  </VStack>
               </HStack>
            </VStack>

            <Divider color="#F0F0F0" />

            {/* Preparation Notes */}
            <VStack>
               <HStack items="center" space="sm" mb={12}>
                  <Info size={16} color={BLUE} />
                  <Text fontSize={12} fontWeight="800" color={BLUE} letterSpacing={0.5}>PREPARATION NOTES</Text>
               </HStack>
               <Box bg="#EDF3F8" p={16} rounded={12}>
                  <Text fontSize={15} color="#000000" lineHeight={22}>
                     {DUMMY_MEETING.notes}
                  </Text>
               </Box>
            </VStack>

            {/* Launch Action */}
            <VStack mt={20} space="md">
               <Button 
                  label={joining ? "Launching..." : "Join Virtual Session"} 
                  onPress={handleJoin} 
                  disabled={joining}
                  style={{ backgroundColor: BLUE, height: 50, borderRadius: 25 }}
                  textStyle={{ fontWeight: '800' }}
               />
               <HStack space="md">
                  <Button 
                     label="Reschedule" 
                     onPress={() => {}} 
                     variant="outline"
                     style={{ flex: 1, borderColor: BLUE, height: 44, borderRadius: 22 }}
                     textStyle={{ color: BLUE, fontWeight: '700' }}
                  />
                  <Button 
                     label="Cancel Session" 
                     onPress={() => {}} 
                     variant="ghost"
                     style={{ flex: 1, height: 44 }}
                     textStyle={{ color: '#E02424', fontWeight: '700' }}
                  />
               </HStack>
            </VStack>
         </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({});
