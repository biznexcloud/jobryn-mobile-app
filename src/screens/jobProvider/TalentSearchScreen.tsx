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
import { ScreenWrapper, Text, Box, HStack, VStack } from '../../components/ui';
import {
  ChevronLeft,
  Search,
  MapPin,
  Briefcase,
  UserPlus,
  CheckCircle,
  X,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react-native';
import { ProfileService } from '../../services/api/profile';
import { ConnectionService } from '../../services/api/connections';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

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
      const data = await ProfileService.getSeekerProfiles({ search: searchQuery });
      setCandidates(data?.results || []);
    } catch (e) {
      console.error('[TalentSearch] Fetch error:', e);
      setCandidates([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);
  const onRefresh = () => { setRefreshing(true); fetchCandidates(query); };
  const handleSearch = () => fetchCandidates(query);

  const toggleInvite = async (id: string | number) => {
    const idStr = id.toString();
    if (invited.includes(idStr)) {
      setInvited(prev => prev.filter(i => i !== idStr));
    } else {
      try {
        await ConnectionService.follow(id);
        setInvited(prev => [...prev, idStr]);
      } catch (e) {
        console.warn('Failed to invite candidate', e);
      }
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center" justify="space-between" px={16}>
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
              <ChevronLeft size={22} color="black" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Talent Search</Text>
          </HStack>
          <TouchableOpacity style={styles.headerIcon}>
             <SlidersHorizontal size={18} color="black" />
          </TouchableOpacity>
        </HStack>
      </Box>

      {/* Search Bar */}
      <Box bg="white" px={16} pb={12} borderBottom={1} borderColor="#F0F2F5">
        <HStack bg="#F0F2F5" rounded={10} items="center" px={12} py={8}>
          <Search size={17} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, skill, or role..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); fetchCandidates(''); }}>
              <X size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </HStack>
      </Box>

      {loading && !refreshing ? (
        <VStack flex={1} items="center" justify="center">
          <ActivityIndicator size="large" color={FB_BLUE} />
        </VStack>
      ) : (
        <FlatList
          data={candidates}
          keyExtractor={item => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={FB_BLUE} />}
          contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <VStack items="center" mt={60} px={40}>
              <Box w={72} h={72} rounded={36} border={1} borderColor="#E5E7EB" items="center" justify="center" bg="white">
                 <Search size={32} color="#D1D5DB" />
              </Box>
              <Text fontSize={17} fontWeight="800" color="#111827" mt={20}>No candidates found</Text>
              <Text fontSize={14} color={GRAY_TEXT} textAlign="center" mt={8}>Try adjusting your search filters.</Text>
            </VStack>
          )}
          renderItem={({ item }) => {
            const isInvited = invited.includes(item.id.toString());
            const avatar = item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.full_name || 'User')}&background=F0F2F5&color=1877F2`;
            
            return (
              <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('PublicProfile', { userId: item.id })}
                activeOpacity={0.9}
              >
                <HStack items="center" space="md" mb={12}>
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                  <VStack flex={1}>
                    <HStack justify="space-between" items="center">
                      <VStack flex={1} mr={8}>
                        <Text fontSize={16} fontWeight="700" color="#111827">{item.full_name || 'Candidate'}</Text>
                        <Text fontSize={13} color={GRAY_TEXT} mt={1} numberOfLines={1}>{item.headline || 'Professional'}</Text>
                      </VStack>
                      {item.match_score && (
                        <HStack items="center">
                           <Sparkles size={14} color={FB_BLUE} />
                           <Text fontSize={13} fontWeight="700" color={FB_BLUE} ml={4}>{item.match_score}%</Text>
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
                </HStack>

                <HStack mt={4} items="center" space="md" mb={12}>
                  {item.location && (
                    <HStack items="center">
                      <MapPin size={12} color="#9BA3AF" />
                      <Text fontSize={11} color="#6B7280" ml={4}>{item.location}</Text>
                    </HStack>
                  )}
                  {item.experience_years && (
                    <HStack items="center">
                      <Briefcase size={12} color="#9BA3AF" />
                      <Text fontSize={11} color="#6B7280" ml={4}>{item.experience_years}y Experience</Text>
                    </HStack>
                  )}
                </HStack>

                <HStack space="sm">
                   <TouchableOpacity 
                     style={[styles.profileBtn, { flex: 1 }]}
                     onPress={() => navigation.navigate('PublicProfile', { userId: item.id })}
                   >
                      <Text fontSize={13} fontWeight="700" color="#111827">View Profile</Text>
                   </TouchableOpacity>
                   <TouchableOpacity 
                     style={[styles.inviteBtn, isInvited && styles.invitedBtn]}
                     onPress={() => toggleInvite(item.id)}
                   >
                      <Text fontSize={13} fontWeight="700" color={isInvited ? GRAY_TEXT : 'white'}>
                        {isInvited ? 'Saved' : 'Connect'}
                      </Text>
                   </TouchableOpacity>
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
  searchInput: { flex: 1, fontSize: 14, color: '#111827', marginLeft: 10, paddingVertical: 0 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F0F2F5' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F2F5' },
  profileBtn: { height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  inviteBtn: { height: 36, borderRadius: 18, backgroundColor: FB_BLUE, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  invitedBtn: { backgroundColor: '#F0F2F5' },
});
