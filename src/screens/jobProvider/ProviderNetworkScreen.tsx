import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, HStack, VStack, Box } from '../../components/ui';
import { ChevronLeftIcon, UserGroupIcon } from 'react-native-heroicons/outline';
import { ConnectionService } from '../../services/api/connections';
import { useAuthStore } from '../../store/authStore';
import { ActivityIndicator, RefreshControl } from 'react-native';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

const TABS = ['Connections', 'Requests'];

const MOCK_CONNECTIONS = [
  { id: 1, name: 'Binod Tamang', role: 'React Native Dev', mutual: 8, avatar: 'https://i.pravatar.cc/150?u=binod' },
  { id: 2, name: 'Priya Mehta', role: 'UI/UX Designer', mutual: 5, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 3, name: 'Saurav Koirala', role: 'Backend Engineer', mutual: 12, avatar: 'https://i.pravatar.cc/150?u=saurav' },
];

const MOCK_REQUESTS = [
  {
    id: 1, name: 'Alice Johnson', role: 'Product Manager', avatar: 'https://i.pravatar.cc/150?img=10',
    message: 'Hi! I noticed your company\'s open roles and would love to connect.',
  },
  {
    id: 2, name: 'Raju Pandey', role: 'DevOps Engineer', avatar: 'https://i.pravatar.cc/150?u=raju',
    message: null,
  },
];

export default function ProviderNetworkScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Connections');
  const [connections, setConnections] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNetwork = async () => {
    if (!user?.id) return;
    try {
      const [following, followers] = await Promise.all([
        ConnectionService.getFollowing(user.id),
        ConnectionService.getFollowers(user.id),
      ]);
      setConnections(following?.results || (Array.isArray(following) ? following : []));
      setRequests(followers?.results || (Array.isArray(followers) ? followers : []));
    } catch (err) {
      console.warn('Network load failed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchNetwork(); }, []);

  const acceptRequest = async (id: number) => {
    try {
      await ConnectionService.acceptRequest(id);
      setRequests(prev => prev.filter((r: any) => r.id !== id));
    } catch (e) {
      console.warn('Accept failed');
    }
  };

  const declineRequest = async (id: number) => {
    try {
      await ConnectionService.declineRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.warn('Decline failed');
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack px={16} items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
              <ChevronLeftIcon size={22} color="black" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>My Network</Text>
          </HStack>
          <Box w={36} h={36} />
        </HStack>
      </Box>

      {/* Tabs */}
      <HStack bg="white" borderBottom={1} borderColor="#F0F2F5">
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text fontSize={14} fontWeight="700" color={activeTab === tab ? FB_BLUE : GRAY_TEXT}>
              {tab}{tab === 'Requests' ? ` (${requests.length})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </HStack>

       <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 60 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchNetwork(); }} tintColor={FB_BLUE} />}
       >
          {loading ? (
             <Box py={100} justify="center" items="center">
                <ActivityIndicator size="large" color={FB_BLUE} />
             </Box>
          ) : activeTab === 'Connections' ? (
          <VStack p={16} space="md">
            {connections.map((item, idx) => (
              <Box key={item.id || idx} bg="white" rounded={16} p={16} border={1} borderColor="#F0F2F5">
                <HStack items="center">
                  <Image source={{ uri: item.avatar || 'https://i.pravatar.cc/150?u=' + idx }} style={styles.avatar} />
                  <VStack ml={12} flex={1}>
                    <Text fontSize={15} fontWeight="700" color="#111827">{item.following_email ? item.following_email.split('@')[0] : 'Professional'}</Text>
                    <Text fontSize={13} color={GRAY_TEXT} mt={1}>{item.follow_type_display || 'Interested Party'}</Text>
                    <HStack items="center" mt={4}>
                      <UserGroupIcon size={12} color="#9CA3AF" />
                      <Text fontSize={11} color="#9CA3AF" ml={4}>Active Connection</Text>
                    </HStack>
                  </VStack>
                  <TouchableOpacity style={styles.msgBtn}>
                    <Text fontSize={13} fontWeight="700" color={FB_BLUE}>Message</Text>
                  </TouchableOpacity>
                </HStack>
              </Box>
            ))}
            {connections.length === 0 && (
               <VStack items="center" py={100} px={40}>
                  <UserGroupIcon size={48} color="#D1D5DB" />
                  <Text fontSize={17} fontWeight="700" color="#111827" mt={16}>No connections yet</Text>
                  <Text fontSize={14} color={GRAY_TEXT} textAlign="center" mt={8}>Grow your professional network by following candidates and peers.</Text>
               </VStack>
            )}
          </VStack>
        ) : (
          <VStack p={16} space="md">
            {requests.length > 0 ? requests.map((item, idx) => (
              <Box key={item.id || idx} bg="white" rounded={16} p={16} border={1} borderColor="#F0F2F5">
                <HStack items="flex-start">
                  <Image source={{ uri: item.avatar || 'https://i.pravatar.cc/150?u=' + idx }} style={styles.avatar} />
                  <VStack ml={12} flex={1}>
                    <Text fontSize={15} fontWeight="700" color="#111827">{item.follower_email ? item.follower_email.split('@')[0] : 'New Request'}</Text>
                    <Text fontSize={13} color={GRAY_TEXT} mt={1}>{item.follow_type_display || 'Job Seeker'}</Text>
                    {item.message && (
                      <Box bg="#F3F4F6" rounded={12} p={10} mt={10}>
                        <Text fontSize={13} color="#4B5563" style={{ fontStyle: 'italic' }}>"{item.message}"</Text>
                      </Box>
                    )}
                    <HStack mt={16} space="md">
                      <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptRequest(item.id)}>
                        <Text fontSize={13} fontWeight="700" color="white">Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.declineBtn} onPress={() => declineRequest(item.id)}>
                        <Text fontSize={13} fontWeight="700" color="#111827">Decline</Text>
                      </TouchableOpacity>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            )) : (
              <VStack items="center" py={100} px={40}>
                <UserGroupIcon size={48} color="#D1D5DB" />
                <Text fontSize={17} fontWeight="700" color="#111827" mt={16}>No pending requests</Text>
                <Text fontSize={14} color={GRAY_TEXT} textAlign="center" mt={8}>We'll notify you when candidates want to connect.</Text>
              </VStack>
            )}
          </VStack>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F2F5' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: FB_BLUE },
  msgBtn: { borderWidth: 1.5, borderColor: FB_BLUE, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  acceptBtn: { flex: 1, height: 36, backgroundColor: FB_BLUE, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  declineBtn: { flex: 1, height: 36, backgroundColor: '#F3F4F6', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
