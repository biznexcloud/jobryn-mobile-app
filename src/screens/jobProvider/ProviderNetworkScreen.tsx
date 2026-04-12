import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Image,
  Dimensions,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  UserPlus,
  ChevronRight,
  Users,
  Search,
  X,
  Check,
  UserCheck,
  Inbox,
  RefreshCw,
  Zap,
} from 'lucide-react-native';
import { ConnectionService } from '../../services/api/connections';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/authStore';
import {
  ScreenWrapper,
  Text,
  Box,
  VStack,
  HStack,
  Avatar,
  Divider,
} from '../../components/ui';
import { moderateScale, verticalScale } from '../../utils/responsive';
import { MOCK_NETWORK_SUGGESTIONS } from '../../constants/MockData';

const { width } = Dimensions.get('window');
const GRID_SPACING = 12;
const COLUMN_WIDTH = (width - 16 * 2 - GRID_SPACING) / 2;

const BLUE = '#0A66C2';
const GRAY_BG = '#F3F2EF';
const POLL_INTERVAL_MS = 30_000; // 30 seconds

// ─────────────────────────────────────────────────────────────────────────────
// ProviderNetworkScreen — Fully connected with live API
// 
// Transitions from a tabbed layout to a LinkedIn-style sectioned layout
// designed for rapid Talent Discovery and Request Management.
// ─────────────────────────────────────────────────────────────────────────────

export default function ProviderNetworkScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Pending connection requests (invitations) sent TO this Provider
  const [invitations, setInvitations] = useState<any[]>([]);
  const [invitationCount, setInvitationCount] = useState(0);

  // "Discover Talent" — seeker profiles to connect with
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Track dismissed suggestion IDs
  const dismissedRef = useRef<Set<string>>(new Set());

  // Action loading states
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Polling & Life-cycle refs
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFocusedRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  // ── Data Fetching ──────────────────────────────────────────────────────────

  const fetchInvitations = useCallback(async (silent = false) => {
    try {
      const data = await ConnectionService.getPendingRequests();
      setInvitations(data);
      setInvitationCount(data.length);
    } catch (err) {
      console.warn('[ProviderNetwork] Invitation fetch failed', err);
    } finally {
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  const fetchSuggestions = useCallback(async () => {
    try {
      const data = await ConnectionService.getSuggestions();
      const filtered = data.filter(
        (s: any) => 
          !dismissedRef.current.has(String(s.id)) && 
          String(s.id) !== String(user?.id)
      );
      setSuggestions(filtered);
    } catch (err) {
      console.warn('[ProviderNetwork] Suggestion fetch failed', err);
      setSuggestions([]);
    }
  }, [user?.id]);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    await Promise.all([fetchInvitations(silent), fetchSuggestions()]);
    if (!silent) setLoading(false);
  }, [fetchInvitations, fetchSuggestions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAll(false).finally(() => setRefreshing(false));
  };

  // ── Polling & Foreground Refresh ──────────────────────────────────────────

  const startPolling = useCallback(() => {
    if (pollTimerRef.current) return;
    pollTimerRef.current = setInterval(() => {
      if (isFocusedRef.current && appStateRef.current === 'active') {
        fetchInvitations(true);
      }
    }, POLL_INTERVAL_MS);
  }, [fetchInvitations]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      appStateRef.current = nextState;
      if (nextState === 'active' && isFocusedRef.current) {
        fetchInvitations(true);
      }
    });
    return () => sub.remove();
  }, [fetchInvitations]);

  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      fetchAll(false);
      startPolling();
      return () => {
        isFocusedRef.current = false;
        stopPolling();
      };
    }, [fetchAll, startPolling, stopPolling])
  );

  // ── Actions ────────────────────────────────────────────────────────────────

  const setItemLoading = (id: string, value: boolean) =>
    setActionLoading((prev) => ({ ...prev, [id]: value }));

  const handleAccept = async (item: any) => {
    const id = String(item.id);
    setItemLoading(id, true);
    try {
      await ConnectionService.acceptRequest(
        item.follower || item.id,
        item.notification_id
      );
      setInvitations((prev) => prev.filter((i) => String(i.id) !== id));
      setInvitationCount((prev) => Math.max(0, prev - 1));
      Toast.show({ type: 'success', text1: 'Connected!', text2: 'Candidate added to network.' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to accept' });
    } finally {
      setItemLoading(id, false);
    }
  };

  const handleDecline = async (item: any) => {
    const id = String(item.id);
    setItemLoading(id, true);
    try {
      await ConnectionService.declineRequest(
        item._from_notification ? undefined : item.id,
        item.notification_id || item.id
      );
      setInvitations((prev) => prev.filter((i) => String(i.id) !== id));
      setInvitationCount((prev) => Math.max(0, prev - 1));
      Toast.show({ type: 'info', text1: 'Request declined' });
    } catch {
      Toast.show({ type: 'error', text1: 'Action failed' });
    } finally {
      setItemLoading(id, false);
    }
  };

  const handleConnect = async (item: any) => {
    const id = String(item.id);
    setItemLoading(id, true);
    try {
      await ConnectionService.connect(id);
      dismissedRef.current.add(id);
      setSuggestions((prev) => prev.filter((s) => String(s.id) !== id));
      Toast.show({ type: 'success', text1: 'Request sent to candidate!' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to send connect request' });
    } finally {
      setItemLoading(id, false);
    }
  };

  const handleDismissSuggestion = (id: string) => {
    dismissedRef.current.add(id);
    setSuggestions((prev) => prev.filter((s) => String(s.id) !== id));
  };

  const navigateToProfile = (userId: string) => {
    navigation?.navigate('PublicProfile', { userId });
  };

  // ── Render Helpers ────────────────────────────────────────────────────────

  const getInvitationName = (item: any): string => 
    item.follower_name || item.sender_name || item.follower_email?.split('@')[0] || 'Member';

  const getInvitationAvatar = (item: any, idx: number): string => 
    item.follower_avatar || item.sender_avatar || `https://i.pravatar.cc/150?u=tsug_${item.id || idx}`;

  if (loading) {
    return (
      <Box flex={1} bg="white" justify="center" items="center">
        <ActivityIndicator size="large" color={BLUE} />
        <Text mt={12} color="#65676B" fontSize={14}>Loading your talent network…</Text>
      </Box>
    );
  }

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <Box px={16} pt={insets.top + 4} pb={12} bg="white">
        <HStack items="center" justify="space-between">
          <Box flex={1} bg="#F0F2F5" rounded={20} h={36} px={12} justify="center">
            <TouchableOpacity onPress={() => navigation?.navigate('SearchExplore')}>
              <HStack items="center">
                <Search size={18} color="#65676B" />
                <Text fontSize={14} color="#65676B" ml={8}>Search talent & candidates</Text>
              </HStack>
            </TouchableOpacity>
          </Box>
          
          <TouchableOpacity style={{ marginLeft: 16, position: 'relative' }} onPress={onRefresh}>
            <RefreshCw size={22} color={BLUE} />
            {invitationCount > 0 && (
              <Box style={styles.badge} bg="#E53E3E" rounded={10}>
                <Text color="white" fontSize={10} fontWeight="800">
                  {invitationCount > 99 ? '99+' : invitationCount}
                </Text>
              </Box>
            )}
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Manage Network Section */}
        <Box bg="white" mb={1} borderBottom={1} borderColor="#E5E7EB">
          <TouchableOpacity style={{ padding: 16 }} onPress={() => {}}>
            <HStack justify="space-between" items="center">
              <HStack items="center">
                <Users size={20} color={BLUE} />
                <Text fontSize={16} fontWeight="700" color={BLUE} ml={12}>
                  Manage Talent Network
                </Text>
              </HStack>
              <ChevronRight size={20} color="#65676B" />
            </HStack>
          </TouchableOpacity>
        </Box>

        {/* Invitations Section */}
        <Box bg="white" mb={8} borderBottom={1} borderColor="#E5E7EB">
          <HStack justify="space-between" items="center" p={16}>
            <HStack items="center">
              <Text fontSize={16} fontWeight="800" color="#1c1e21">Invitations</Text>
              {invitationCount > 0 && (
                <Box bg={BLUE} rounded={10} px={7} py={2} ml={8}>
                  <Text color="white" fontSize={11} fontWeight="800">{invitationCount}</Text>
                </Box>
              )}
              {/* Live Sync Status */}
              <HStack items="center" bg="#ECFDF5" px={8} py={2} rounded={12} ml={12}>
                <Box w={6} h={6} rounded={3} bg="#10B981" mr={6} />
                <Text fontSize={10} fontWeight="700" color="#059669">LIVE SYNC</Text>
              </HStack>
            </HStack>
            <TouchableOpacity onPress={onRefresh}><Text fontSize={14} fontWeight="800" color={BLUE}>Manage</Text></TouchableOpacity>
          </HStack>
          <Divider color="#F3F2EF" />

          {invitations.length === 0 ? (
            <Box py={28} items="center">
              <Box bg="#F0F2F5" rounded={40} p={14} mb={12}><Inbox size={28} color="#94A3B8" /></Box>
              <Text fontSize={14} fontWeight="700" color="#65676B">No pending invitations</Text>
              <Text fontSize={12} color="#94A3B8" mt={4} textAlign="center" px={32}>New candidate requests will appear here instantly.</Text>
            </Box>
          ) : (
            invitations.slice(0, 5).map((item, idx) => {
              const id = String(item.id);
              const busy = actionLoading[id];
              return (
                <Box p={16} key={id}>
                  <HStack items="center">
                    <TouchableOpacity onPress={() => navigateToProfile(String(item.follower || item.id))}>
                      <Avatar source={{ uri: getInvitationAvatar(item, idx) }} style={{ width: 56, height: 56, borderRadius: 28 }} />
                    </TouchableOpacity>
                    <VStack ml={12} flex={1}>
                      <TouchableOpacity onPress={() => navigateToProfile(String(item.follower || item.id))}>
                        <Text fontSize={15} fontWeight="800" color="#1c1e21">{getInvitationName(item)}</Text>
                        <Text fontSize={13} color="#65676B" numberOfLines={1}>{item.follow_type_display || 'Interested in your jobs'}</Text>
                        <HStack items="center" mt={4}>
                          <UserCheck size={12} color="#65676B" />
                          <Text fontSize={12} color="#65676B" ml={4}>{item.created_at ? timeAgo(item.created_at) : 'Recent'}</Text>
                        </HStack>
                      </TouchableOpacity>
                    </VStack>
                    <HStack space="sm">
                      <TouchableOpacity style={styles.actionIconCircle} onPress={() => handleDecline(item)} disabled={busy}>
                        {busy ? <ActivityIndicator size="small" color="#65676B" /> : <X size={20} color="#65676B" />}
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionIconCircle, { borderColor: BLUE, backgroundColor: '#EFF6FF' }]} onPress={() => handleAccept(item)} disabled={busy}>
                        {busy ? <ActivityIndicator size="small" color={BLUE} /> : <Check size={20} color={BLUE} />}
                      </TouchableOpacity>
                    </HStack>
                  </HStack>
                </Box>
              );
            })
          )}
        </Box>

        {/* Discover Talent Section */}
        <Box px={16} pb={20}>
          <HStack items="center" mb={12}>
            <Zap size={20} color="#F59E0B" fill="#F59E0B" />
            <Text fontSize={16} fontWeight="800" color="#1c1e21" ml={8}>Discover Top Talent</Text>
          </HStack>

          {suggestions.length === 0 ? (
            <Box py={24} items="center">
              <UserPlus size={32} color="#94A3B8" />
              <Text fontSize={13} color="#65676B" mt={8}>Checking for new candidate matches…</Text>
            </Box>
          ) : (
            <Box style={styles.gridContainer}>
              {suggestions.map((item) => {
                const id = String(item.id);
                const busy = actionLoading[id];
                // Unified Name Mapping
                const name = item.user_detail?.name || item.full_name || item.name || item.user?.name || (item.first_name ? `${item.first_name} ${item.last_name || ''}`.trim() : null) || item.email?.split('@')[0] || 'Candidate';
                const avatar = item.profile_picture || item.avatar || `https://i.pravatar.cc/150?u=tsug_${id}`;
                const banner = item.cover_photo || item.banner || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400';
                
                return (
                  <TouchableOpacity key={id} activeOpacity={0.9} onPress={() => navigateToProfile(id)} style={styles.suggestionCard}>
                    <Box h={moderateScale(60)} bg="#E5E7EB">
                      <Image source={{ uri: banner }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                      <Box bg="rgba(0,0,0,0.1)" style={StyleSheet.absoluteFillObject} />
                    </Box>
                    <Box style={styles.cardAvatarWrapper}>
                      <Avatar source={{ uri: avatar }} size={72} style={{ borderWidth: 3, borderColor: 'white' }} />
                    </Box>
                    <VStack items="center" p={12} pt={40} flex={1} justify="space-between">
                      <VStack items="center">
                        <Text fontSize={15} fontWeight="900" color="#1c1e21" textAlign="center" numberOfLines={1}>{name}</Text>
                        <Text fontSize={12} color="#65676B" mt={2} textAlign="center" numberOfLines={2} style={{ height: moderateScale(34) }}>
                          {item.role || item.job_title || item.headline || 'Job Seeker'}
                        </Text>
                      </VStack>
                    </VStack>
                    <Box p={12} pt={0}>
                      <TouchableOpacity style={styles.connectOutlineBtn} onPress={() => handleConnect(item)} disabled={busy}>
                        {busy ? <ActivityIndicator size="small" color={BLUE} /> : <Text fontSize={14} fontWeight="800" color={BLUE}>Connect</Text>}
                      </TouchableOpacity>
                    </Box>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => handleDismissSuggestion(id)}><X size={16} color="white" /></TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </Box>
          )}
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

function timeAgo(dateStr: string): string {
  const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (secs < 60) return 'Just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

const styles = StyleSheet.create({
  badge: { position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  actionIconCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#CED0D4', alignItems: 'center', justifyContent: 'center' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  suggestionCard: { width: COLUMN_WIDTH, backgroundColor: 'white', borderRadius: 12, marginBottom: GRID_SPACING, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', height: verticalScale(250) },
  cardAvatarWrapper: { position: 'absolute', top: moderateScale(24), alignSelf: 'center', zIndex: 1 },
  connectOutlineBtn: { width: '100%', height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  closeBtn: { position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
});
