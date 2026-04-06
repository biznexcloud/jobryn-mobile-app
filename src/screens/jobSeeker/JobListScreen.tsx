import React, { useState } from 'react';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ScreenWrapper, BottomSheet, Button, VStack, HStack, Text, Box
} from '../../components/ui';
import {
  Search,
  SlidersHorizontal,
  Briefcase,
  MapPin,
  Sparkles,
} from 'lucide-react-native';
import { JobCard } from '../../components/cards/JobCard';

const BLUE = '#0A66C2'; 
const SOFT_BG = '#F8F8F8';

import { MOCK_JOBS } from '../../constants/MockData';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Remote', value: 'remote' },
  { label: 'Full-time', value: 'full_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Part-time', value: 'part_time' },
];

export default function JobListScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const filteredJobs = MOCK_JOBS.filter(job => 
    (job.title.toLowerCase().includes(query.toLowerCase()) || 
     job.company_name.toLowerCase().includes(query.toLowerCase())) &&
    (filter === 'all' || job.job_type === filter || (filter === 'remote' && job.location.toLowerCase().includes('remote')))
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const ListHeader = () => (
    <View>
      {/* Recommended Section Label */}
      <HStack items="center" space="xs" px={16} pt={14} pb={8}>
        <Sparkles size={14} color={BLUE} />
        <Text fontSize={13} fontWeight="700" color={BLUE}>
          {filteredJobs.length} opportunities matched for you
        </Text>
      </HStack>
    </View>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={SOFT_BG}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* ─── HEADER ─── */}
      <Box
        bg="white"
        pt={insets.top + 12}
        pb={12}
        px={16}
        style={styles.headerShadow}
      >
        {/* Title row */}
        <HStack items="center" justify="space-between" mb={12}>
          <Text fontSize={22} fontWeight="800" color="#111111">Jobs</Text>
          <TouchableOpacity
            onPress={() => setShowFilter(true)}
            style={styles.filterBtn}
          >
            <SlidersHorizontal size={17} color={BLUE} />
            <Text fontSize={13} fontWeight="700" color={BLUE} ml={6}>Filter</Text>
          </TouchableOpacity>
        </HStack>

        {/* Search Bar */}
        <HStack
          bg="#F4F4F4"
          rounded={10}
          px={12}
          items="center"
          style={styles.searchBar}
        >
          <Search size={17} color="#999999" />
          <TextInput
            placeholder="Search jobs, companies..."
            placeholderTextColor="#AAAAAA"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </HStack>
      </Box>

      <Box bg="white" borderBottom={1} borderColor="#F0F0F0">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.chip, filter === f.value && styles.chipActive]}
              onPress={() => setFilter(f.value)}
            >
              <Text
                fontSize={13}
                fontWeight="700"
                color={filter === f.value ? 'white' : '#555555'}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Box>

      {/* ─── JOB FEED ─── */}
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Box px={12}>
            <JobCard
              job={item as any}
              onPress={() => navigation?.navigate('JobDetail', { id: item.id })}
              onApply={() => navigation?.navigate('ApplyForm', { job: item })}
              onSave={() => {}}
            />
          </Box>
        )}
        ListHeaderComponent={<ListHeader />}
        contentContainerStyle={[styles.feedContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />
        }
        ListEmptyComponent={
          <VStack items="center" mt={60} px={40}>
            <Box style={styles.emptyIcon}>
              <Briefcase size={36} color="#CCCCCC" />
            </Box>
            <Text fontSize={17} fontWeight="800" color="#222222" mt={16}>No jobs found</Text>
            <Text fontSize={14} color="#999999" mt={8} style={{ textAlign: 'center' }}>
              Try adjusting your search or browse by a different filter.
            </Text>
          </VStack>
        }
      />

      {/* ─── FILTER BOTTOM SHEET ─── */}
      <BottomSheet visible={showFilter} onClose={() => setShowFilter(false)}>
        <Box p={24}>
          <Text fontSize={18} fontWeight="800" color="#111111" mb={20}>Filter Jobs</Text>

          <Text fontSize={11} fontWeight="700" color="#999999" mb={12} letterSpacing={0.8}>
            EXPERIENCE LEVEL
          </Text>
          <HStack flexWrap="wrap" space="xs" mb={28}>
            {['Entry', 'Mid-Level', 'Senior', 'Lead', 'Executive'].map((l) => (
              <TouchableOpacity key={l} style={styles.filterChip}>
                <Text fontSize={13} color="#333333" fontWeight="600">{l}</Text>
              </TouchableOpacity>
            ))}
          </HStack>

          <Text fontSize={11} fontWeight="700" color="#999999" mb={12} letterSpacing={0.8}>
            JOB TYPE
          </Text>
          <HStack flexWrap="wrap" space="xs" mb={28}>
            {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map((l) => (
              <TouchableOpacity key={l} style={styles.filterChip}>
                <Text fontSize={13} color="#333333" fontWeight="600">{l}</Text>
              </TouchableOpacity>
            ))}
          </HStack>

          <Button
            label="Show Results"
            onPress={() => setShowFilter(false)}
            style={{ backgroundColor: BLUE, height: 48, borderRadius: 24 }}
            textStyle={{ fontWeight: '700' }}
          />
        </Box>
      </BottomSheet>
    </ScreenWrapper>
  );
}

const BLUE_C = '#0A66C2';
const styles = StyleSheet.create({
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: BLUE_C,
  },
  searchBar: {
    height: 44,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 14,
    color: '#111111',
  },
  chipScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F4F4F4',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: BLUE_C,
  },
  feedContent: {
    paddingBottom: 120,
    paddingHorizontal: 4,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F4F4F4',
    marginRight: 8,
    marginBottom: 8,
  },
});
