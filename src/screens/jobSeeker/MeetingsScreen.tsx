import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Linking,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Calendar,
  Video,
  MapPin,
  ChevronLeft,
  Clock,
  Plus,
  ArrowRight,
  FileText,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import { MeetingService } from '../../services/api/meetings';

const BLUE = '#3B82F6'; 
const GRAY_TEXT = '#6B7280';
const DARK_TEXT = '#111827';
const SOFT_BG = '#F9FAFB';

const MEETINGS_DATA = [
  { 
    id: '1', 
    title: 'Technical Interview', 
    company: 'Netflix', 
    time: '11:00 AM', 
    date: 'Today', 
    type: 'online', 
    status: 'upcoming', 
    avatar: 'https://logo.clearbit.com/netflix.com',
    cover_image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    duration: '60 Min'
  },
  { 
    id: '2', 
    title: 'System Architecture Sync', 
    company: 'Airbnb', 
    time: '02:30 PM', 
    date: 'Tomorrow', 
    type: 'onsite', 
    status: 'upcoming', 
    avatar: 'https://logo.clearbit.com/airbnb.com',
    cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    duration: '45 Min'
  },
  { 
    id: '3', 
    title: 'Onboarding Brief', 
    company: 'Spotify', 
    time: '10:00 AM', 
    date: 'Oct 24', 
    type: 'online', 
    status: 'completed', 
    avatar: 'https://logo.clearbit.com/spotify.com',
    cover_image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80',
    duration: '30 Min'
  },
];

export default function MeetingsScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const insets = useSafeAreaInsets();
  const { role = 'seeker' } = route?.params || {};
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMeetings = useCallback(async () => {
    try {
      // Use the universal getMeetings helper which handles seeker/recruiter endpoints
      const data = await MeetingService.getMeetings(role === 'jobProvider' ? 'recruiter' : 'seeker');
      setMeetings(Array.isArray(data) ? data : (data.results || []));
    } catch (e) {
      console.warn('Meetings fetch failed:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const filteredMeetings = meetings.filter(m => {
     const isPast = m.status === 'completed' || m.status === 'cancelled';
     return activeTab === 'upcoming' ? !isPast : isPast;
  });

  const handleJoin = async (url: string) => {
    if (!url) {
       Alert.alert('Link ready soon', 'The organizer hasn\'t shared the meeting link yet.');
       return;
    }
    try { await Linking.openURL(url); } catch { Alert.alert('Error', 'Unable to open link'); }
  };

  const renderMeeting = ({ item }: { item: any }) => {
    const meetTime = new Date(item.scheduled_at);
    const timeStr = meetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = meetTime.toDateString() === new Date().toDateString() ? 'Today' : meetTime.toLocaleDateString();

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => role === 'jobProvider' ? navigation.navigate('ScheduleMeeting', { meeting: item }) : null}
        activeOpacity={role === 'jobProvider' ? 0.9 : 1}
      >
         {/* Visual Cover Header */}
         <View style={styles.imageContainer}>
            <Image source={{ uri: item.cover_image || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80' }} style={styles.coverImage} />
            <Box style={styles.timeBadge}>
               <HStack items="center" space="xs">
                  <Clock size={12} color="white" />
                  <Text fontSize={12} fontWeight="800" color="white">{dateStr} • {timeStr}</Text>
               </HStack>
            </Box>
            <Box style={[styles.typeBadge, item.meeting_type === 'online' ? { backgroundColor: BLUE } : { backgroundColor: DARK_TEXT }]}>
               <HStack items="center" space="xs">
                  {item.meeting_type === 'online' ? <Video size={12} color="white" /> : <MapPin size={12} color="white" />}
                  <Text fontSize={10} fontWeight="900" color="white" textTransform="uppercase">{item.meeting_type_display || item.meeting_type}</Text>
               </HStack>
            </Box>
         </View>

         {/* Content Details */}
         <VStack p={16}>
            <HStack items="center" space="md" mb={12}>
               <Avatar source={{ uri: item.organizer_avatar || 'https://i.pravatar.cc/150?u=org' }} size="md" rounded={12} style={styles.companyLogo} />
               <VStack flex={1}>
                  <Text fontSize={18} fontWeight="900" color={DARK_TEXT} numberOfLines={1}>{item.agenda}</Text>
                  <Text fontSize={14} fontWeight="600" color={GRAY_TEXT} mt={2}>
                    {item.company_name || 'Hiring Session'}
                  </Text>
               </VStack>
            </HStack>

            <HStack items="center" bg="#F3F4F6" p={12} rounded={16} space="sm" mb={16}>
               <View style={{ width: 4, height: 24, backgroundColor: BLUE, borderRadius: 2 }} />
               <VStack flex={1}>
                  <Text fontSize={12} color={GRAY_TEXT} fontWeight="700">Duration Scheduled</Text>
                  <Text fontSize={14} fontWeight="900" color={DARK_TEXT}>{item.duration_minutes || '--'} Min</Text>
               </VStack>
               {(item.meeting_type === 'onsite' || item.meeting_type === 'in_person') && (
                  <VStack items="flex-end">
                     <Text fontSize={12} color={GRAY_TEXT} fontWeight="700">Location</Text>
                     <Text fontSize={14} fontWeight="800" color={DARK_TEXT} numberOfLines={1}>
                        {item.location_address || 'TBD'}
                     </Text>
                  </VStack>
               )}
            </HStack>

            {/* Contextual CTA */}
            {activeTab === 'upcoming' && (
               <TouchableOpacity 
                  onPress={() => item.meeting_type === 'online' ? handleJoin(item.meeting_link) : null}
                  style={item.meeting_type === 'online' ? styles.primaryBtn : styles.secondaryBtn}
               >
                  <HStack items="center" justify="center" space="xs">
                     {item.meeting_type === 'online' ? <Video size={18} color="white" /> : <MapPin size={18} color={DARK_TEXT} />}
                     <Text fontSize={15} fontWeight="800" color={item.meeting_type === 'online' ? 'white' : DARK_TEXT}>
                        {item.meeting_type === 'online' ? 'Join Video Hub' : 'View Placement'}
                     </Text>
                  </HStack>
               </TouchableOpacity>
            )}

            {activeTab === 'past' && (
               <TouchableOpacity style={styles.secondaryBtn}>
                  <HStack items="center" justify="center" space="xs">
                     <FileText size={18} color={DARK_TEXT} />
                     <Text fontSize={15} fontWeight="800" color={DARK_TEXT}>{item.status_display || 'Session Ended'}</Text>
                  </HStack>
               </TouchableOpacity>
            )}
         </VStack>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={SOFT_BG}>
      <StatusBar barStyle="dark-content" />

      {/* Premium Curved Header */}
      <Box pt={insets.top + 10} pb={24} px={20} bg="white" borderBottomLeft={30} borderBottomRight={30} style={styles.headerShadow}>
        <HStack items="center" justify="space-between" mb={24}>
           <VStack>
              <Text fontSize={24} fontWeight="900" color={DARK_TEXT}>Syncs</Text>
              <Text fontSize={13} fontWeight="600" color={GRAY_TEXT} mt={2}>Your professional sessions</Text>
           </VStack>
           <TouchableOpacity style={styles.addCta}>
              <Plus size={24} color="white" strokeWidth={3} />
           </TouchableOpacity>
        </HStack>

        {/* Integrated Segmented Tabs */}
        <HStack bg="#F3F4F6" p={4} rounded={20}>
           <TouchableOpacity 
             style={[styles.tabItem, activeTab === 'upcoming' && styles.activeTabItem]}
             onPress={() => setActiveTab('upcoming')}
             activeOpacity={0.9}
           >
              <Text fontSize={14} fontWeight="800" color={activeTab === 'upcoming' ? 'white' : GRAY_TEXT}>Upcoming</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.tabItem, activeTab === 'past' && styles.activeTabItem]}
             onPress={() => setActiveTab('past')}
             activeOpacity={0.9}
           >
              <Text fontSize={14} fontWeight="800" color={activeTab === 'past' ? 'white' : GRAY_TEXT}>Past Briefings</Text>
           </TouchableOpacity>
        </HStack>
      </Box>

      {/* Feed */}
      <FlatList 
         data={filteredMeetings}
         renderItem={renderMeeting}
         keyExtractor={(item) => item.id.toString()}
         showsVerticalScrollIndicator={false}
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMeetings(); }} tintColor={BLUE} />}
         ListHeaderComponent={loading ? <ActivityIndicator size="large" color={BLUE} style={{ marginTop: 24 }} /> : null}
         contentContainerStyle={[styles.feedContainer, { paddingBottom: insets.bottom + 120 }]}
         ListEmptyComponent={
            <VStack items="center" mt={60} px={40}>
               <View style={styles.emptyIconCircle}>
                  <Calendar size={40} color="#D1D5DB" />
               </View>
               <Text fontSize={18} fontWeight="900" color={DARK_TEXT} mt={24}>No sessions aligned</Text>
               <Text fontSize={14} color={GRAY_TEXT} mt={8} textAlign="center" lineHeight={22}>
                 When you schedule an interview or networking sync, it will appear here.
               </Text>
            </VStack>
         }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 10,
  },
  addCta: {
     width: 48,
     height: 48,
     borderRadius: 24,
     backgroundColor: BLUE,
     alignItems: 'center',
     justifyContent: 'center',
     shadowColor: BLUE,
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.3,
     shadowRadius: 8,
     elevation: 6,
  },
  tabItem: {
     flex: 1,
     paddingVertical: 12,
     alignItems: 'center',
     borderRadius: 16,
  },
  activeTabItem: {
     backgroundColor: DARK_TEXT,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 2,
  },
  feedContainer: {
     padding: 20,
     paddingTop: 24,
  },
  card: {
     backgroundColor: 'white',
     borderRadius: 24,
     marginBottom: 24,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 6 },
     shadowOpacity: 0.04,
     shadowRadius: 12,
     elevation: 4,
     borderWidth: 1,
     borderColor: '#F3F4F6',
  },
  imageContainer: {
     height: 140,
     width: '100%',
     borderTopLeftRadius: 24,
     borderTopRightRadius: 24,
     overflow: 'hidden',
     position: 'relative',
  },
  coverImage: {
     width: '100%',
     height: '100%',
     resizeMode: 'cover',
  },
  timeBadge: {
     position: 'absolute',
     top: 12,
     left: 12,
     backgroundColor: 'rgba(0,0,0,0.6)',
     paddingHorizontal: 12,
     paddingVertical: 8,
     borderRadius: 14,
  },
  typeBadge: {
     position: 'absolute',
     top: 12,
     right: 12,
     paddingHorizontal: 12,
     paddingVertical: 8,
     borderRadius: 14,
  },
  companyLogo: {
     borderWidth: 1,
     borderColor: '#F3F4F6',
  },
  primaryBtn: {
     backgroundColor: BLUE,
     height: 52,
     borderRadius: 16,
     alignItems: 'center',
     justifyContent: 'center',
  },
  secondaryBtn: {
     backgroundColor: '#F3F4F6',
     height: 52,
     borderRadius: 16,
     alignItems: 'center',
     justifyContent: 'center',
     borderWidth: 1,
     borderColor: '#E5E7EB',
  },
  emptyIconCircle: {
     width: 100,
     height: 100,
     borderRadius: 50,
     backgroundColor: 'white',
     alignItems: 'center',
     justifyContent: 'center',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 6 },
     shadowOpacity: 0.06,
     shadowRadius: 15,
     elevation: 5,
  },
});
