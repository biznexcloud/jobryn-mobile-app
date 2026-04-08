// UI_VERSION_1.1
import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, HStack, VStack, Box } from '../../components/ui';
import { ChevronLeftIcon, SearchIcon, ClockIcon, XIcon, LocationMarkerIcon, BriefcaseIcon } from 'react-native-heroicons/outline';
import { ProfileService } from '../../services/api/profile';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

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
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
         <HStack px={16} items="center">
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
               <ChevronLeftIcon size={22} color="black" strokeWidth={2.5} />
            </TouchableOpacity>
            <Box flex={1} ml={12} bg="#F0F2F5" rounded={10} px={10} py={8} flexDirection="row" items="center">
               <SearchIcon size={18} color="#9CA3AF" />
               <TextInput
                  style={styles.input}
                  placeholder="Search by name, skill, or role..."
                  placeholderTextColor="#9CA3AF"
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                  returnKeyType="search"
                  onSubmitEditing={() => doSearch(query)}
               />
               {query.length > 0 && (
                  <TouchableOpacity onPress={clearSearch}>
                     <XIcon size={16} color="#9CA3AF" />
                  </TouchableOpacity>
               )}
            </Box>
         </HStack>
      </Box>

      {!searched ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
          <HStack justify="space-between" items="center" mb={12}>
            <Text fontSize={14} fontWeight="700" color="#111827">RECENT SEARCHES</Text>
            <TouchableOpacity>
              <Text fontSize={13} fontWeight="600" color={FB_BLUE}>Clear all</Text>
            </TouchableOpacity>
          </HStack>

          {RECENT_SEARCHES.map((item, i) => (
            <TouchableOpacity key={i} style={styles.recentRow} onPress={() => { setQuery(item); doSearch(item); }}>
              <HStack items="center" flex={1}>
                <ClockIcon size={18} color="#9CA3AF" />
                <Text fontSize={15} color="#374151" ml={12} flex={1}>{item}</Text>
              </HStack>
              <ChevronLeftIcon size={16} color="#D1D5DB" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          ))}

          <Text fontSize={14} fontWeight="700" color="#111827" mt={24} mb={12}>
            TRENDING
          </Text>
          <HStack flexWrap="wrap" space="sm">
            {TRENDING.map((tag, i) => (
              <TouchableOpacity key={i} style={styles.tag} onPress={() => { setQuery(tag); doSearch(tag); }}>
                <Text fontSize={13} fontWeight="600" color={FB_BLUE}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </HStack>
        </ScrollView>
      ) : loading ? (
        <VStack flex={1} items="center" justify="center">
           <ActivityIndicator size="small" color={FB_BLUE} />
        </VStack>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text fontSize={13} color={GRAY_TEXT} mb={12} fontWeight="600">
              {results.length} candidates found for "{query}"
            </Text>
          }
          ListEmptyComponent={
            <VStack items="center" py={60} px={40}>
              <Box w={72} h={72} rounded={36} bg="#F9FAFB" items="center" justify="center" mb={16} border={1} borderColor="#F0F2F5">
                 <SearchIcon size={32} color="#D1D5DB" />
              </Box>
              <Text fontSize={17} fontWeight="700" color="#111827">No candidates found</Text>
              <Text fontSize={14} color={GRAY_TEXT} textAlign="center" mt={8}>Try adjusting your search query.</Text>
            </VStack>
          }
          renderItem={({ item }) => {
            const avatar = item.avatar || (item.user?.profile_picture) || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.full_name || 'User')}&background=F0F2F5&color=1877F2`;
            return (
              <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('PublicProfile', { userId: item.id })}
              >
                <HStack items="center" space="md">
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                  <VStack flex={1}>
                    <Text fontSize={16} fontWeight="700" color="#111827" numberOfLines={1}>{item.full_name || item.user?.username || 'Candidate'}</Text>
                    <Text fontSize={13} color={GRAY_TEXT} mt={1} numberOfLines={1}>{item.headline || 'Professional'}</Text>
                    <HStack mt={6} items="center" space="md">
                      {item.location && (
                        <HStack items="center">
                          <LocationMarkerIcon size={12} color="#9CA3AF" />
                          <Text fontSize={11} color={GRAY_TEXT} ml={4}>{item.location}</Text>
                        </HStack>
                      )}
                      {item.experience_years && (
                        <HStack items="center">
                          <BriefcaseIcon size={12} color="#9CA3AF" />
                          <Text fontSize={11} color={GRAY_TEXT} ml={4}>{item.experience_years} yrs</Text>
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
                  <ChevronLeftIcon size={18} color="#D1D5DB" style={{ transform: [{ rotate: '180deg' }] }} />
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
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontSize: 15, color: '#111827', marginLeft: 10, paddingVertical: 0 },
  recentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  tag: { backgroundColor: '#F0F9FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F0F2F5' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F2F5' },
});
