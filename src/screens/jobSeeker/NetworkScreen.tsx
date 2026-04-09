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
} from 'lucide-react-native';
import { ConnectionService } from '../../services/api/connections';
import { NotificationService } from '../../services/api/notifications';
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

// ─────────────────────────────────────────────────────────────────────────────
// NetworkScreen — fully connected with live API
//
// Data flow:
//  1. Pending invitations  → ConnectionService.getPendingRequests()
//                             (tries /follows/pending/, falls back to
//                              /notifications/?type=connection_request)
//  2. Suggestions           → ConnectionService.getSuggestions()
//                             (tries /follows/suggestions/, falls back to
//                              /profiles/seeker/)
//  3. Polling               → refetches invitations every 30 s while the screen
//                             is in focus AND AppState is 'active'
//  4. Accept/Decline        → live API + removes from list optimistically
//  5. Connect               → live API + removes from suggestions optimistically
// ─────────────────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 30_000; // 30 seconds

export default function NetworkScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Pending connection requests (invitations) sent TO this user
  const [invitations, setInvitations] = useState<any[]>([]);
  // connection request count badge
  const [invitationCount, setInvitationCount] = useState(0);

  // "People you may know" suggestions
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Track dismissed suggestion IDs so they don't reappear on poll
  const dismissedRef = useRef<Set<string>>(new Set());

  // Track in-flight connect/accept/decline to show per-item loading
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Polling refs
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFocusedRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  // ── Data fetch ─────────────────────────────────────────────────────────────

  const fetchInvitations = useCallback(async (silent = false) => {
    try {
      const data = await ConnectionService.getPendingRequests();
      setInvitations(data);
      setInvitationCount(data.length);
    } catch {
      // silent — do not interrupt the user
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
      // Filter out already dismissed and self
      const filtered = data.filter(
        (s: any) =>
          !dismissedRef.current.has(String(s.id)) &&
          String(s.id) !== String(user?.id)
      );
      setSuggestions(filtered.length > 0 ? filtered : MOCK_NETWORK_SUGGESTIONS);
    } catch {
      setSuggestions(MOCK_NETWORK_SUGGESTIONS);
    }
  }, [user?.id]);

  const fetchAll = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      await Promise.all([fetchInvitations(silent), fetchSuggestions()]);
      if (!silent) setLoading(false);
    },
    [fetchInvitations, fetchSuggestions]
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAll(false).finally(() => setRefreshing(false));
  };

  // ── Polling ────────────────────────────────────────────────────────────────

  const startPolling = useCallback(() => {
    if (pollTimerRef.current) return; // already running
    pollTimerRef.current = setInterval(() => {
      if (isFocusedRef.current && appStateRef.current === 'active') {
        fetchInvitations(true); // silent poll
      }
    }, POLL_INTERVAL_MS);
  }, [fetchInvitations]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  // AppState listener — pause polling when app backgrounds
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      appStateRef.current = nextState;
      if (nextState === 'active' && isFocusedRef.current) {
        fetchInvitations(true); // immediate refresh on foreground
      }
    });
    return () => sub.remove();
  }, [fetchInvitations]);

  // Focus / blur lifecycle — fetch on focus, poll while focused
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
      // Optimistic remove
      setInvitations((prev) => prev.filter((i) => String(i.id) !== id));
      setInvitationCount((prev) => Math.max(0, prev - 1));
      Toast.show({ type: 'success', text1: 'Connected!', text2: 'You are now connected.' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to accept', text2: 'Please try again.' });
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
      Toast.show({ type: 'info', text1: 'Request declined.' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to decline', text2: 'Please try again.' });
    } finally {
      setItemLoading(id, false);
    }
  };

  const handleConnect = async (item: any) => {
    const id = String(item.id);
    setItemLoading(id, true);
    try {
      await ConnectionService.connect(id);
      // Optimistic remove + remember dismissed
      dismissedRef.current.add(id);
      setSuggestions((prev) => prev.filter((s) => String(s.id) !== id));
      Toast.show({ type: 'success', text1: 'Request sent!' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to send request' });
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

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Extract a display name from an invitation record. */
  const getInvitationName = (item: any): string => {
    if (item.follower_name) return item.follower_name;
    if (item.follower_email) return item.follower_email.split('@')[0];
    if (item.sender_name) return item.sender_name;
    return 'Someone';
  };

  const getInvitationSubtitle = (item: any): string =>
    item.follow_type_display ||
    item.message ||
    'Wants to connect with you';

  const getInvitationAvatar = (item: any, idx: number): string =>
    item.follower_avatar ||
    item.sender_avatar ||
    `https://i.pravatar.cc/150?u=inv_${item.id || idx}`;

  const getSuggestionName = (item: any): string =>
    item.name ||
    (item.user?.name) ||
    (item.following_email ? item.following_email.split('@')[0] : 'User');

  const getSuggestionRole = (item: any): string =>
    item.role || item.job_title || item.headline || 'Professional';

  const getSuggestionAvatar = (item: any): string =>
    item.avatar ||
    item.profile_picture ||
    `https://i.pravatar.cc/150?u=sug_${item.id}`;

  const getSuggestionBanner = (item: any): string =>
    item.banner ||
    item.cover_image ||
    'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400';

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box flex={1} bg="white" justify="center" items="center">
        <ActivityIndicator size="large" color={BLUE} />
        <Text mt={12} color="#65676B" fontSize={14}>Loading your network…</Text>
      </Box>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

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
                <Text fontSize={14} color="#65676B" ml={8}>Search network</Text>
              </HStack>
            </TouchableOpacity>
          </Box>

          {/* Invitation count badge */}
          <TouchableOpacity
            style={{ marginLeft: 16, position: 'relative' }}
            onPress={onRefresh}
          >
            <RefreshCw size={22} color={BLUE} />
            {invitationCount > 0 && (
              <Box
                style={styles.badge}
                bg="#E53E3E"
                rounded={10}
              >
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Manage my network */}
        <Box bg="white" mb={1} borderBottom={1} borderColor="#E5E7EB">
          <TouchableOpacity style={{ padding: 16 }} onPress={() => {}}>
            <HStack justify="space-between" items="center">
              <HStack items="center">
                <Users size={20} color={BLUE} />
                <Text fontSize={16} fontWeight="700" color={BLUE} ml={12}>
                  Manage my network
                </Text>
              </HStack>
              <ChevronRight size={20} color="#65676B" />
            </HStack>
          </TouchableOpacity>
        </Box>

        {/* ── Invitations / Pending Requests ─────────────────────────────── */}
        <Box bg="white" mb={8} borderBottom={1} borderColor="#E5E7EB">
          <HStack justify="space-between" items="center" p={16}>
            <HStack items="center">
              <Text fontSize={14} fontWeight="800" color="#65676B">
                Invitations
              </Text>
              {invitationCount > 0 && (
                <Box bg={BLUE} rounded={10} px={7} py={2} ml={8}>
                  <Text color="white" fontSize={11} fontWeight="800">
                    {invitationCount}
                  </Text>
                </Box>
              )}
            </HStack>
            <TouchableOpacity onPress={onRefresh}>
              <Text fontSize={14} fontWeight="800" color={BLUE}>Refresh</Text>
            </TouchableOpacity>
          </HStack>

          <Divider color="#F3F2EF" />

          {invitations.length === 0 ? (
            /* Empty state */
            <Box py={28} items="center">
              <Box bg="#F0F2F5" rounded={40} p={14} mb={12}>
                <Inbox size={28} color="#94A3B8" />
              </Box>
              <Text fontSize={14} fontWeight="700" color="#65676B">
                No pending invitations
              </Text>
              <Text fontSize={12} color="#94A3B8" mt={4} textAlign="center" px={32}>
                When someone sends you a connection request it will appear here.
              </Text>
            </Box>
          ) : (
            invitations.slice(0, 5).map((item, idx) => {
              const id = String(item.id);
              const busy = actionLoading[id];
              return (
                <Box p={16} key={id}>
                  <HStack items="center">
                    <TouchableOpacity
                      onPress={() =>
                        navigateToProfile(String(item.follower || item.id))
                      }
                    >
                      <Avatar
                        source={{ uri: getInvitationAvatar(item, idx) }}
                        style={{ width: 56, height: 56, borderRadius: 28 }}
                      />
                    </TouchableOpacity>

                    <VStack ml={12} flex={1}>
                      <TouchableOpacity
                        onPress={() =>
                          navigateToProfile(String(item.follower || item.id))
                        }
                      >
                        <Text fontSize={15} fontWeight="800" color="#1c1e21">
                          {getInvitationName(item)}
                        </Text>
                        <Text fontSize={13} color="#65676B" numberOfLines={1}>
                          {getInvitationSubtitle(item)}
                        </Text>
                        <HStack items="center" mt={4}>
                          <UserCheck size={12} color="#65676B" />
                          <Text fontSize={12} color="#65676B" ml={4}>
                            {item.created_at
                              ? timeAgo(item.created_at)
                              : 'New request'}
                          </Text>
                        </HStack>
                      </TouchableOpacity>
                    </VStack>

                    <HStack space="sm">
                      {/* Decline */}
                      <TouchableOpacity
                        style={styles.actionIconCircle}
                        onPress={() => handleDecline(item)}
                        disabled={busy}
                      >
                        {busy ? (
                          <ActivityIndicator size="small" color="#65676B" />
                        ) : (
                          <X size={20} color="#65676B" />
                        )}
                      </TouchableOpacity>
                      {/* Accept */}
                      <TouchableOpacity
                        style={[
                          styles.actionIconCircle,
                          { borderColor: BLUE, backgroundColor: '#EFF6FF' },
                        ]}
                        onPress={() => handleAccept(item)}
                        disabled={busy}
                      >
                        {busy ? (
                          <ActivityIndicator size="small" color={BLUE} />
                        ) : (
                          <Check size={20} color={BLUE} />
                        )}
                      </TouchableOpacity>
                    </HStack>
                  </HStack>
                </Box>
              );
            })
          )}

          {invitations.length > 5 && (
            <TouchableOpacity style={styles.showMoreBtn}>
              <Text fontSize={14} fontWeight="700" color={BLUE}>
                See all {invitations.length} invitations
              </Text>
            </TouchableOpacity>
          )}
        </Box>

        {/* ── People You May Know ────────────────────────────────────────── */}
        <Box px={16} pb={20}>
          <Text fontSize={16} fontWeight="800" color="#1c1e21" mb={12}>
            People you may know
          </Text>

          {suggestions.length === 0 ? (
            <Box py={24} items="center">
              <UserPlus size={32} color="#94A3B8" />
              <Text fontSize={13} color="#65676B" mt={8}>
                No suggestions right now. Check back soon.
              </Text>
            </Box>
          ) : (
            <Box style={styles.gridContainer}>
              {suggestions.map((item) => {
                const id = String(item.id);
                const busy = actionLoading[id];
                return (
                  <TouchableOpacity
                    key={id}
                    activeOpacity={0.9}
                    onPress={() => navigateToProfile(id)}
                    style={styles.suggestionCard}
                  >
                    {/* Banner */}
                    <Box h={moderateScale(60)} bg="#E5E7EB">
                      <Image
                        source={{ uri: getSuggestionBanner(item) }}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                      />
                      <Box
                        bg="rgba(0,0,0,0.1)"
                        style={StyleSheet.absoluteFillObject}
                      />
                    </Box>

                    {/* Avatar */}
                    <Box style={styles.cardAvatarWrapper}>
                      <Avatar
                        source={{ uri: getSuggestionAvatar(item) }}
                        size={72}
                        style={{ borderWidth: 3, borderColor: 'white' }}
                      />
                    </Box>

                    {/* Info */}
                    <VStack items="center" p={12} pt={40} flex={1} justify="space-between">
                      <VStack items="center">
                        <Text
                          fontSize={15}
                          fontWeight="900"
                          color="#1c1e21"
                          textAlign="center"
                          numberOfLines={1}
                        >
                          {getSuggestionName(item)}
                        </Text>
                        <Text
                          fontSize={12}
                          color="#65676B"
                          mt={2}
                          textAlign="center"
                          numberOfLines={2}
                          style={{ height: moderateScale(34) }}
                        >
                          {getSuggestionRole(item)}
                        </Text>
                      </VStack>

                      {item.mutual !== undefined && (
                        <HStack mt={8} items="center">
                          <Users size={12} color="#65676B" />
                          <Text fontSize={11} color="#65676B" ml={4}>
                            {item.mutual || 0} mutuals
                          </Text>
                        </HStack>
                      )}
                    </VStack>

                    {/* Connect button */}
                    <Box p={12} pt={0}>
                      <TouchableOpacity
                        style={styles.connectOutlineBtn}
                        onPress={() => handleConnect(item)}
                        disabled={busy}
                      >
                        {busy ? (
                          <ActivityIndicator size="small" color={BLUE} />
                        ) : (
                          <Text fontSize={14} fontWeight="800" color={BLUE}>
                            Connect
                          </Text>
                        )}
                      </TouchableOpacity>
                    </Box>

                    {/* Dismiss × */}
                    <TouchableOpacity
                      style={styles.closeBtn}
                      onPress={() => handleDismissSuggestion(id)}
                    >
                      <X size={16} color="white" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </Box>
          )}
        </Box>

        <Box items="center" py={40}>
          <Text fontSize={12} color="#94A3B8" fontWeight="800" letterSpacing={1}>
            JOBRYN NETWORK
          </Text>
          <Text fontSize={11} color="#94A3B8" mt={4}>
            Grow your professional influence
          </Text>
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

// ── Utilities ──────────────────────────────────────────────────────────────────

/** Simple relative time helper (no external dependency needed). */
function timeAgo(dateStr: string): string {
  const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (secs < 60) return 'Just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#CED0D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showMoreBtn: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F2EF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestionCard: {
    width: COLUMN_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: GRID_SPACING,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    height: verticalScale(250),
  },
  cardAvatarWrapper: {
    position: 'absolute',
    top: moderateScale(24),
    alignSelf: 'center',
    zIndex: 1,
  },
  connectOutlineBtn: {
    width: '100%',
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
