// UI_VERSION_1.1
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, HStack, VStack } from '../../components/ui';
import { ChevronLeftIcon, SearchIcon, ClockIcon, XIcon, LocationMarkerIcon, BriefcaseIcon } from 'react-native-heroicons/outline';
import { ProfileService } from '../../services/api/profile';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#4F46E5';

import { useAuthStore } from '../../store/authStore';

export default function SearchExploreScreen({ navigation, route }: { navigation: any; route: any }) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const RECENT_SEARCHES = ['React Native Developer', 'UI/UX Designer', 'Product Manager'];
  const TRENDING = ['Python', 'Remote', 'Entry Level', 'Full-time'];

  useEffect(() => {
    const initial = (route.params as any)?.initialQuery;
    if (initial) {
      setQuery(initial);
      doSearch(initial);
    }
  }, [route.params]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await ProfileService.getSeekerProfiles({ search: q });
      setResults(data?.results || []);
    } catch (e) {
      console.warn('Search failed:', e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
  };

  return (
    <ScreenWrapper safeAreaTop safeAreaBottom={false} backgroundColor="#FFFFFF">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <HStack items="center" px={moderateScale(16)} py={moderateScale(12)} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeftIcon size={moderateScale(22)} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <SearchIcon size={moderateScale(18)} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="Search candidates by name, role..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => doSearch(query)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <XIcon size={moderateScale(16)} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </HStack>

      {!searched ? (
        <View style={{ padding: moderateScale(16) }}>
          <HStack justify="space-between" items="center" mb={moderateScale(14)}>
            <Text fontSize={moderateScale(14)} fontWeight="800" color="#111827">Recent Searches</Text>
            <TouchableOpacity>
              <Text fontSize={moderateScale(13)} fontWeight="700" color={BLUE}>Clear all</Text>
            </TouchableOpacity>
          </HStack>

          {RECENT_SEARCHES.map((item, i) => (
            <TouchableOpacity key={i} style={styles.recentRow} onPress={() => { setQuery(item); doSearch(item); }}>
              <View style={styles.recentIcon}>
                <ClockIcon size={moderateScale(16)} color="#9CA3AF" />
              </View>
              <Text fontSize={moderateScale(15)} color="#374151" style={{ flex: 1 }}>{item}</Text>
              <ChevronLeftIcon size={moderateScale(16)} color="#D1D5DB" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          ))}

          <Text fontSize={moderateScale(14)} fontWeight="800" color="#111827" mt={moderateScale(24)} mb={moderateScale(14)}>
            Trending
          </Text>
          <div style={styles.tagsWrap}>
            {TRENDING.map((tag, i) => (
              <TouchableOpacity key={i} style={styles.tag} onPress={() => { setQuery(tag); doSearch(tag); }}>
                <Text fontSize={moderateScale(13)} fontWeight="600" color={BLUE}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </div>
        </View>
      ) : loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={BLUE} /></View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: moderateScale(16), paddingBottom: Math.max(insets.bottom + moderateScale(20), moderateScale(40)) }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: moderateScale(10) }} />}
          ListHeaderComponent={
            <Text fontSize={moderateScale(13)} color="#6B7280" mb={moderateScale(12)} fontWeight="600">
              {results.length} candidates found for "{query}"
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <SearchIcon size={moderateScale(40)} color="#E5E7EB" />
              <Text fontSize={moderateScale(15)} fontWeight="700" color="#9CA3AF" mt={moderateScale(12)} textAlign="center">No candidates found</Text>
            </View>
          }
          renderItem={({ item }) => {
            if (!item) return null;
            const avatar = item.avatar || (item.user?.profile_picture) || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.full_name || 'User')}&background=F3F4F6&color=4F46E5`;
            return (
              <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('PublicUserProfile', { profile: item })}
              >
                <HStack items="center">
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                  <VStack ml={moderateScale(12)} flex={1}>
                    <Text fontSize={moderateScale(15)} fontWeight="800" color="#111827" numberOfLines={1}>{item.full_name || item.user?.username || 'Candidate'}</Text>
                    <Text fontSize={moderateScale(13)} color="#6B7280" mt={2} numberOfLines={1}>{item.headline || 'Professional'}</Text>
                    <HStack mt={moderateScale(6)} style={{ gap: moderateScale(12) }}>
                      {item.location && (
                        <HStack items="center">
                          <LocationMarkerIcon size={moderateScale(12)} color="#9CA3AF" />
                          <Text fontSize={moderateScale(11)} color="#6B7280" ml={3}>{item.location}</Text>
                        </HStack>
                      )}
                      {item.experience_years && (
                        <HStack items="center">
                          <BriefcaseIcon size={moderateScale(12)} color="#9CA3AF" />
                          <Text fontSize={moderateScale(11)} color="#6B7280" ml={3}>{item.experience_years} yrs</Text>
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
                  <ChevronLeftIcon size={moderateScale(18)} color="#D1D5DB" style={{ transform: [{ rotate: '180deg' }] }} />
                </HStack>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: {
    width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18),
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: moderateScale(10),
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(10), paddingHorizontal: moderateScale(12), height: moderateScale(42), gap: moderateScale(8),
  },
  input: { flex: 1, fontSize: moderateScale(15), color: '#111827' },
  recentRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: moderateScale(12),
    borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
  },
  recentIcon: {
    width: moderateScale(34), height: moderateScale(34), borderRadius: moderateScale(17),
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: moderateScale(12),
  },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(8) },
  tag: { backgroundColor: '#EEF2FF', paddingHorizontal: moderateScale(14), paddingVertical: moderateScale(8), borderRadius: moderateScale(20) },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', paddingTop: verticalScale(60), paddingHorizontal: moderateScale(40) },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: moderateScale(14), padding: moderateScale(16),
    borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  avatar: { width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24), backgroundColor: '#F3F4F6' },
});





