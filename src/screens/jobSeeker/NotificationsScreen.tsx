import React, { useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Bell,
  Briefcase,
  UserPlus,
  MessageCircle,
  MoreHorizontal,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

const MOCK_NOTIFS = [
  { id: 1, type: 'job', title: 'New mission match: "Senior Protocol Engineer"', subtitle: 'Nexus Corp is hiring in your area.', time: '2h', unread: true },
  { id: 2, type: 'conn', title: 'Jhonson King connected with you', subtitle: 'Global Solutions Architect at FiberLink.', time: '4h', unread: true },
  { id: 3, type: 'post', title: 'Sita Rai liked your post', subtitle: '"Optimizing the grid infrastructure..."', time: '1d', unread: false },
  { id: 4, type: 'msg', title: 'You have a new message from Rahul', subtitle: '"Hey, are you interested in a new mission?"', time: '2d', unread: false },
];

export default function SeekerNotificationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase size={22} color={BLUE} />;
      case 'conn': return <UserPlus size={22} color="#057642" />;
      case 'post': return <MessageCircle size={22} color={BLUE} />;
      default: return <Bell size={22} color="#666666" />;
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
         <HStack items="center" justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                  <ChevronLeft size={24} color="#1F2937" strokeWidth={2.5} />
               </TouchableOpacity>
               <Text fontSize={20} color="#1F2937" fontWeight="700" ml={16}>Notifications</Text>
            </HStack>
            <TouchableOpacity><MoreHorizontal size={24} color="#666666" /></TouchableOpacity>
         </HStack>
      </Box>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />}
      >
        {notifs.map((notif, idx) => (
           <TouchableOpacity key={idx} style={[styles.notifItem, notif.unread && styles.notifUnread]}>
              <HStack items="center">
                 <View style={styles.iconCircle}>{getIcon(notif.type)}</View>
                 <VStack ml={16} flex={1}>
                    <Text fontSize={15} fontWeight={notif.unread ? '700' : '500'} color="#000000">{notif.title}</Text>
                    <Text fontSize={13} color="#666666" mt={2}>{notif.subtitle}</Text>
                    <Text fontSize={11} color="#999999" mt={4}>{notif.time}</Text>
                 </VStack>
                 {notif.unread && <View style={styles.unreadDot} />}
              </HStack>
           </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  notifItem: { padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F3F2EF' },
  notifUnread: { backgroundColor: '#F0F7FF' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F2EF', alignItems: 'center', justifyContent: 'center' },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: BLUE, marginLeft: 8 },
});
