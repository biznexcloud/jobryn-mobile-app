import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  BellIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  ChatAlt2Icon,
  ClockIcon,
  SearchIcon,
} from 'react-native-heroicons/outline';
import { NotificationService } from '../../services/api/notifications';
import { moderateScale } from '../../utils/responsive';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';

const BLUE = '#4F46E5';

export default function NotificationsScreen({ navigation }: { navigation?: any }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getNotifications();
      setNotifications(data?.results || data || []);
    } catch (err) {
      console.warn('Sync error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
      case 'application': return <BriefcaseIcon size={20} color={BLUE} />;
      case 'message': return <ChatAlt2Icon size={20} color="#10B981" />;
      default: return <CheckCircleIcon size={20} color="#F59E0B" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <ScreenWrapper safeAreaTop safeAreaBottom={false} backgroundColor="#F8FAFC">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Titanium Header */}
      <Box bg="white" borderBottom={1} borderColor="#F1F5F9" style={styles.headerShadow}>
        <VStack px={20} pt={16}>
           <HStack justify="space-between" items="center" mb={12}>
              <TouchableOpacity style={styles.iconBtnHeader} onPress={() => navigation?.goBack()}>
                 <ChevronLeftIcon size={24} color="#111827" strokeWidth={2.5} />
              </TouchableOpacity>
              <Text fontSize={18} fontWeight="900" color="#111827">Operational Alerts</Text>
              <TouchableOpacity style={styles.iconBtnHeader}>
                 <SearchIcon size={22} color="#111827" strokeWidth={2} />
              </TouchableOpacity>
           </HStack>
           
           <HStack py={16} justify="space-between" items="center">
              <VStack>
                 <Text fontSize={12} fontWeight="900" color="#94A3B8" letterSpacing={1}>MISSION UPDATES</Text>
                 <Text fontSize={20} fontWeight="900" color="#111827" mt={2}>{unreadCount} Pending Intel</Text>
              </VStack>
              <TouchableOpacity style={styles.markBtn} onPress={markAllAsRead}>
                 <Text fontSize={13} fontWeight="900" color={BLUE}>Mark all read</Text>
              </TouchableOpacity>
           </HStack>
        </VStack>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {loading && notifications.length === 0 ? (
          <Box py={100} items="center">
             <ActivityIndicator size="large" color={BLUE} />
          </Box>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <TouchableOpacity 
              key={notif.id} 
              activeOpacity={0.8}
              style={[styles.notifCard, !notif.is_read && styles.unreadBG]}
              onPress={async () => {
                if (!notif.is_read) {
                  await NotificationService.markAsRead(notif.id);
                  setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
                }

                // Smart Navigation
                switch(notif.type) {
                  case 'application':
                    if (notif.application_id) {
                       navigation.navigate('ApplicantDetail', { id: notif.application_id, name: notif.applicant_name });
                    } else {
                       navigation.navigate('Applicants');
                    }
                    break;
                  case 'message':
                    if (notif.conversation_id) {
                      navigation.navigate('ChatDetail', { 
                        id: notif.conversation_id,
                        name: notif.sender_name || 'Partner',
                        avatar: notif.sender_avatar
                      });
                    } else {
                      navigation.navigate('Messages');
                    }
                    break;
                  case 'job_posting':
                    navigation.navigate('JobPostings');
                    break;
                  default:
                    // Fallback to general area
                    break;
                }
              }}
            >
              <HStack px={20} py={20} items="flex-start">
                 <Box w={48} h={48} rounded={14} bg={notif.is_read ? "#F8FAFC" : "white"} border={1} borderColor="#F1F5F9" items="center" justify="center" style={!notif.is_read ? styles.premiumShadow : undefined}>
                    {getIcon(notif.type)}
                 </Box>
                 <VStack flex={1} ml={16}>
                    <HStack justify="space-between" items="center">
                       <Text fontSize={15} fontWeight={notif.is_read ? "700" : "900"} color="#111827" flex={1}>{notif.title}</Text>
                       <HStack items="center">
                          <ClockIcon size={12} color="#94A3B8" />
                          <Text fontSize={11} color="#94A3B8" ml={4} fontWeight="600">{notif.created_at || 'Now'}</Text>
                       </HStack>
                    </HStack>
                    <Text fontSize={14} color="#64748B" mt={4} lineHeight={20} numberOfLines={2}>
                       {notif.message || notif.body}
                    </Text>
                 </VStack>
                 {!notif.is_read && <Box w={8} h={8} rounded={4} bg={BLUE} ml={12} mt={10} />}
              </HStack>
              <Divider mx={20} color="#F1F5F9" />
            </TouchableOpacity>
          ))
        ) : (
          <VStack items="center" py={120} px={40}>
            <Box w={100} h={100} rounded={50} bg="white" items="center" justify="center" mb={24} style={styles.premiumShadow}>
               <BellIcon size={44} color="#CBD5E1" />
            </Box>
            <Text fontSize={20} fontWeight="900" color="#111827">Matrix Status: Dark</Text>
            <Text fontSize={14} color="#94A3B8" textAlign="center" mt={8} fontWeight="500" lineHeight={22}>
               No active intel streams detected. Your operational feed will automatically update when candidate or mission developments occur.
            </Text>
          </VStack>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerShadow: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2
  },
  iconBtnHeader: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center'
  },
  markBtn: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#F1F5F9', backgroundColor: '#F8FAFC'
  },
  notifCard: { backgroundColor: 'transparent' },
  unreadBG: { backgroundColor: 'rgba(29, 111, 232, 0.02)' },
  premiumShadow: {
    shadowColor: '#0A1628', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 4
  },
});





