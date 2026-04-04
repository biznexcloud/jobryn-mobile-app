import React, { useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  Video,
  Map,
  MapPin,
  ChevronRight,
  Clock,
  Plus,
  Search,
  SlidersHorizontal,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

const MEETINGS_DATA = [
  { id: '1', title: 'Technical Interview', company: 'Nexus Corp', time: '11:00 AM - 12:00 PM', date: 'Today', type: 'online', status: 'upcoming', avatar: 'https://i.pravatar.cc/150?u=n1' },
  { id: '2', title: 'System Architecture Sync', company: 'DevOps Grid', time: '02:30 PM - 03:30 PM', date: 'Tomorrow', type: 'onsite', status: 'upcoming', avatar: 'https://i.pravatar.cc/150?u=d1' },
  { id: '3', title: 'Onboarding Brief', company: 'Mission Control', time: '10:00 AM - 10:45 AM', date: 'Oct 24', type: 'online', status: 'completed', avatar: 'https://i.pravatar.cc/150?u=m1' },
];

export default function MeetingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const renderMeeting = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => {}} style={styles.meetingCard}>
       <HStack p={16} items="center">
          <Avatar source={{ uri: item.avatar }} size="lg" rounded={8} />
          <VStack ml={12} flex={1}>
             <Text fontSize={16} fontWeight="700" color="#111827">{item.title}</Text>
             <Text fontSize={13} color="#666666" mt={2}>{item.company}</Text>
             <HStack items="center" mt={8} space="md">
                <HStack items="center" bg="#F3F2EF" px={8} py={4} rounded={4}>
                   <Clock size={14} color="#666666" />
                   <Text fontSize={11} color="#666666" ml={4}>{item.time}</Text>
                </HStack>
                <HStack items="center" bg={item.type === 'online' ? '#EDF3F8' : '#F3F2EF'} px={8} py={4} rounded={4}>
                   {item.type === 'online' ? <Video size={14} color={BLUE} /> : <MapPin size={14} color="#666666" />}
                   <Text fontSize={11} color={item.type === 'online' ? BLUE : '#666666'} ml={4}>{item.type.toUpperCase()}</Text>
                </HStack>
             </HStack>
          </VStack>
          <ChevronRight size={20} color="#999999" />
       </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
         <HStack items="center" justify="space-between">
            <Text fontSize={24} fontWeight="900" color="#111827">Nexus Syncs</Text>
            <TouchableOpacity style={styles.addBtn}>
               <Plus size={24} color="white" />
            </TouchableOpacity>
         </HStack>
      </Box>

      {/* Tabs */}
      <HStack px={16} py={12} bg="white" borderBottom={1} borderColor="#F3F2EF">
         <TouchableOpacity onPress={() => setActiveTab('upcoming')} style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}>
            <Text fontSize={14} fontWeight="700" color={activeTab === 'upcoming' ? BLUE : '#666666'}>Upcoming</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => setActiveTab('past')} style={[styles.tab, activeTab === 'past' && styles.activeTab]}>
            <Text fontSize={14} fontWeight="700" color={activeTab === 'past' ? BLUE : '#666666'}>Past Missions</Text>
         </TouchableOpacity>
      </HStack>

      <FlatList 
         data={MEETINGS_DATA.filter(m => activeTab === 'upcoming' ? m.status === 'upcoming' : m.status === 'completed')}
         renderItem={renderMeeting}
         keyExtractor={(item) => item.id}
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
         ListEmptyComponent={
            <VStack items="center" mt={60}>
               <Calendar size={64} color="#D1D5DB" />
               <Text fontSize={16} color="#666666" mt={16}>No syncs scheduled in this sector.</Text>
            </VStack>
         }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  tab: { paddingVertical: 8, paddingHorizontal: 16, marginRight: 8, borderRadius: 20 },
  activeTab: { backgroundColor: '#EDF3F8' },
  meetingCard: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F3F2EF', marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: '#F3F2EF' },
});
