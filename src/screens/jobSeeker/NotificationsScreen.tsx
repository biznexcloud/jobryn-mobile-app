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

import { NotificationService } from '../../services/api/notifications';
import { MOCK_NOTIFICATIONS } from '../../constants/MockData';

export default function SeekerNotificationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifs, setNotifs] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getNotifications();
      setNotifs(data?.results || []);
    } catch (e) {
      console.warn('Failed to fetch notifications:', e);
      // Fallback to empty if API fails, or keep previous
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = async (id: number | string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {
      console.warn('Mark as read failed:', e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'job_application_received': 
      case 'job_status_change': return <Briefcase size={22} color={BLUE} />;
      case 'connection_request': return <UserPlus size={22} color="#057642" />;
      case 'new_message': return <MessageCircle size={22} color={BLUE} />;
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
        {loading && notifs.length === 0 ? (
           <Box py={100} items="center"><ActivityIndicator color={BLUE} /></Box>
        ) : notifs.map((notif, idx) => (
           <TouchableOpacity 
             key={idx} 
             style={[styles.notifItem, !notif.is_read && styles.notifUnread]}
             onPress={() => markAsRead(notif.id)}
           >
              <HStack items="center">
                 <View style={styles.iconCircle}>{getIcon(notif.notification_type || notif.type)}</View>
                 <VStack ml={16} flex={1}>
                    <Text fontSize={15} fontWeight={!notif.is_read ? '700' : '500'} color="#000000">
                      {notif.title || 'Notification'}
                    </Text>
                    <Text fontSize={13} color="#666666" mt={2}>{notif.message || notif.subtitle}</Text>
                    <Text fontSize={11} color="#999999" mt={4}>
                      {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : (notif.time || 'recently')}
                    </Text>
                 </VStack>
                 {!notif.is_read && <View style={styles.unreadDot} />}
              </HStack>
           </TouchableOpacity>
        ))}
        {notifs.length === 0 && !loading && (
          <Box py={100} items="center">
            <Text color="#666666">No new notifications</Text>
          </Box>
        )}
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
