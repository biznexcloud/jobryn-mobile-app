import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, HStack, VStack } from '../../components/ui';
import { ChevronLeftIcon, SearchIcon, LocationMarkerIcon, BriefcaseIcon, UserAddIcon } from 'react-native-heroicons/outline';
import { ProfileService } from '../../services/api/profile';
import { ConnectionService } from '../../services/api/connections';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#4F46E5';

export default function TalentSearchScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [invited, setInvited] = useState<string[]>([]);

  const fetchCandidates = useCallback(async (searchQuery = '') => {
    setLoading(true);
    try {
      // Using Seeker profiles for Talent Search
      const data = await ProfileService.getSeekerProfiles({ search: searchQuery });
      setCandidates(data?.results || []);
    } catch (e) {
      console.warn('Failed to fetch candidates', e);
      setCandidates([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCandidates(query);
  };

  const handleSearch = () => {
    fetchCandidates(query);
  };

  const toggleInvite = async (id: string | number) => {
    // In a real app, this might call an API to invite a user to a job
    // For now, we'll simulate it by toggling the local state and maybe calling ConnectionService.follow
    const idStr = id.toString();
    if (invited.includes(idStr)) {
      setInvited(prev => prev.filter(i => i !== idStr));
    } else {
      try {
        // Example: Following them as a recruiter is a way of "inviting" or expressing interest
        await ConnectionService.follow(id);
        setInvited(prev => [...prev, idStr]);
      } catch (e) {
        console.warn('Failed to invite candidate', e);
      }
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="#F9FAFB">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(8) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeftIcon size={moderateScale(22)} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text fontSize={moderateScale(17)} fontWeight="800" color="#111827">Talent Search</Text>
        <View style={{ width: moderateScale(36) }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchWrap}>
          <SearchIcon size={moderateScale(18)} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search candidates by name, role, skill..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); fetchCandidates(''); }}>
               <Text fontSize={moderateScale(12)} color={BLUE} fontWeight="700">Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}><ActivityIndicator size="large" color={BLUE} /></View>
      ) : (
        <FlatList
          data={candidates}
          keyExtractor={item => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />}
          contentContainerStyle={{
            padding: moderateScale(16),
            paddingBottom: Math.max(insets.bottom + moderateScale(20), moderateScale(40)),
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: moderateScale(12) }} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <SearchIcon size={moderateScale(40)} color="#E5E7EB" />
              <Text fontSize={moderateScale(15)} fontWeight="700" color="#9CA3AF" mt={moderateScale(12)}>No candidates found</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const isInvited = invited.includes(item.id.toString());
            const avatar = item.avatar || (item.user?.profile_picture) || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.full_name || 'User')}&background=F3F4F6&color=4F46E5`;
            
            return (
              <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('PublicProfile', { userId: item.id })}
              >
                <HStack items="flex-start">
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                  <VStack ml={moderateScale(12)} flex={1}>
                    <HStack justify="space-between" items="flex-start">
                      <VStack flex={1} mr={moderateScale(8)}>
                        <Text fontSize={moderateScale(15)} fontWeight="800" color="#111827">{item.full_name || item.user?.username || 'Candidate'}</Text>
                        <Text fontSize={moderateScale(13)} color="#6B7280" mt={2}>{item.headline || item.bio || 'Professional'}</Text>
                      </VStack>
                      {item.match_score && (
                        <View style={styles.matchBadge}>
                          <Text fontSize={moderateScale(12)} fontWeight="800" color={BLUE}>{item.match_score}%</Text>
                        </View>
                      )}
                    </HStack>

                    <HStack mt={moderateScale(8)} style={{ gap: moderateScale(12) }}>
                      {item.location && (
                        <HStack items="center">
                          <LocationMarkerIcon size={moderateScale(13)} color="#9CA3AF" />
                          <Text fontSize={moderateScale(12)} color="#6B7280" ml={3}>{item.location}</Text>
                        </HStack>
                      )}
                      {item.experience_years && (
                        <HStack items="center">
                          <BriefcaseIcon size={moderateScale(13)} color="#9CA3AF" />
                          <Text fontSize={moderateScale(12)} color="#6B7280" ml={3}>{item.experience_years} yrs</Text>
                        </HStack>
                      )}
                    </HStack>

                    {item.skills && item.skills.length > 0 && (
                      <HStack mt={moderateScale(10)} style={{ gap: moderateScale(6), flexWrap: 'wrap' }}>
                        {item.skills.slice(0, 3).map((skill: any, i: number) => (
                          <View key={i} style={styles.skillTag}>
                            <Text fontSize={moderateScale(11)} fontWeight="600" color="#374151">{typeof skill === 'string' ? skill : skill.name}</Text>
                          </View>
                        ))}
                      </HStack>
                    )}
                  </VStack>
                </HStack>

                <TouchableOpacity
                  style={[styles.inviteBtn, isInvited && styles.invitedBtn]}
                  onPress={() => toggleInvite(item.id)}
                >
                  {!isInvited && <UserAddIcon size={moderateScale(16)} color="#FFFFFF" style={{ marginRight: moderateScale(6) }} />}
                  <Text fontSize={moderateScale(14)} fontWeight="700" color={isInvited ? '#6B7280' : '#FFFFFF'}>
                    {isInvited ? 'Interested ✓' : 'Express Interest'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(14), borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18),
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  searchSection: { backgroundColor: '#FFFFFF', padding: moderateScale(12), borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(10), paddingHorizontal: moderateScale(12), height: moderateScale(44), gap: moderateScale(8),
  },
  searchInput: { flex: 1, fontSize: moderateScale(15), color: '#111827' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: moderateScale(16), padding: moderateScale(16),
    borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  avatar: { width: moderateScale(52), height: moderateScale(52), borderRadius: moderateScale(26), backgroundColor: '#F3F4F6' },
  matchBadge: {
    backgroundColor: '#EEF2FF', paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(4),
    borderRadius: moderateScale(20),
  },
  skillTag: {
    backgroundColor: '#F3F4F6', paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(4), borderRadius: moderateScale(8),
  },
  inviteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: BLUE, height: moderateScale(44), borderRadius: moderateScale(10), marginTop: moderateScale(14),
  },
  invitedBtn: { backgroundColor: '#F3F4F6' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', paddingTop: verticalScale(60) },
});





