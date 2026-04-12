import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Bell,
  ChevronLeft,
  CheckCircle,
  Briefcase,
  MessageSquare,
  Clock,
  Search,
} from 'lucide-react-native';
import { NotificationService } from '../../services/api/notifications';
import { moderateScale } from '../../utils/responsive';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

export default function NotificationsScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getNotifications();
      setNotifications(data?.results || data || []);
    } catch (err) {
      console.warn('Notification fetch error');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.warn(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'application': return <Briefcase size={18} color={FB_BLUE} />;
      case 'message': return <MessageSquare size={18} color="#10B981" />;
      default: return <Bell size={18} color="#F59E0B" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack px={16} justify="space-between" items="center">
           <HStack items="center">
              <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
                 <ChevronLeft size={22} color="black" strokeWidth={2.5} />
              </TouchableOpacity>
              <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Notifications</Text>
           </HStack>
           <TouchableOpacity onPress={markAllAsRead}>
              <Text fontSize={13} fontWeight="600" color={FB_BLUE}>Mark all read</Text>
           </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={FB_BLUE} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {loading && notifications.length === 0 ? (
          <Box py={100} items="center">
             <ActivityIndicator size="small" color={FB_BLUE} />
          </Box>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <TouchableOpacity 
              key={notif.id} 
              activeOpacity={0.8}
              style={[styles.notifCard, !notif.is_read && styles.unreadRow]}
              onPress={async () => {
                if (!notif.is_read) {
                  await NotificationService.markAsRead(notif.id);
                  setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
                }

                switch(notif.type) {
                  case 'application':
                    navigation.navigate('Applicants');
                    break;
                  case 'message':
                    navigation.navigate('Messages');
                    break;
                  case 'job_posting':
                    navigation.navigate('JobPostings');
                    break;
                  default:
                    break;
                }
              }}
            >
              <HStack px={16} py={16} items="flex-start">
                 <Box w={40} h={40} rounded={20} bg="#F3F4F6" items="center" justify="center">
                    {getIcon(notif.type)}
                 </Box>
                 <VStack flex={1} ml={12}>
                    <HStack justify="space-between" items="center">
                       <Text fontSize={15} fontWeight={notif.is_read ? "600" : "700"} color="#111827" flex={1}>{notif.title}</Text>
                       <Text fontSize={11} color={GRAY_TEXT}>{notif.created_at || 'Now'}</Text>
                    </HStack>
                    <Text fontSize={14} color={GRAY_TEXT} mt={2} lineHeight={18} numberOfLines={2}>
                       {notif.message || notif.body}
                    </Text>
                 </VStack>
                 {!notif.is_read && <Box w={8} h={8} rounded={4} bg={FB_BLUE} ml={8} mt={6} />}
              </HStack>
              <Divider mx={16} color="#F3F4F6" />
            </TouchableOpacity>
          ))
        ) : (
          <VStack items="center" py={120} px={40}>
             <Box w={72} h={72} rounded={36} bg="white" items="center" justify="center" mb={16} border={1} borderColor="#F0F2F5">
                <Bell size={32} color="#D1D5DB" />
            </Box>
            <Text fontSize={17} fontWeight="700" color="#111827">All caught up!</Text>
            <Text fontSize={14} color={GRAY_TEXT} textAlign="center" mt={8} lineHeight={20}>
               We'll notify you when new candidates apply or when you receive new messages.
            </Text>
          </VStack>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  notifCard: { backgroundColor: 'white' },
  unreadRow: { backgroundColor: '#F0F9FF' },
});





