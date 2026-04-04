import React, { useState, useMemo } from 'react';
import { ScrollView, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Text, Box, HStack, VStack, ScreenWrapper, Divider } from '../../components/ui';
import { 
  SearchIcon, 
  LocationMarkerIcon, 
  AdjustmentsIcon,
  ChevronLeftIcon
} from 'react-native-heroicons/outline';
import { Colors } from '../../constants';
import { moderateScale } from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';

const BLUE = '#0A66C2';

const SearchExploreScreen = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('Remote');
  const [activeFilter, setActiveFilter] = useState('Jobs');

  const filters = ['Jobs', 'People', 'Companies', 'Remote', 'Full-time'];

  const categories = [
    { id: 1, title: 'Development', count: '1.2k', color: '#E0F2FE' },
    { id: 2, title: 'Design', count: '850', color: '#F0FDF4' },
    { id: 3, title: 'Marketing', count: '420', color: '#FEF3C7' },
    { id: 4, title: 'Writing', count: '210', color: '#F5F3FF' },
  ];

  const allJobs = [
    { id: 1, title: 'Senior Frontend Developer', company: 'TechFlow', location: 'New York, US', salary: '$120k - $150k', type: 'Full-time' },
    { id: 2, title: 'UX/UI Designer', company: 'CreativCo', location: 'Remote', salary: '$90k - $120k', type: 'Contract' },
    { id: 3, title: 'Backend Engineer', company: 'DataSystems', location: 'Austin, TX', salary: '$130k - $160k', type: 'Full-time' },
    { id: 4, title: 'Product Manager', company: 'GrowthX', location: 'Remote', salary: '$110k - $140k', type: 'Full-time' },
    { id: 5, title: 'Graphic Designer', company: 'StudioInk', location: 'Los Angeles, CA', salary: '$70k - $90k', type: 'Part-time' },
  ];

  // Rough Search Logic (Fuzzy Filtering)
  const filteredJobs = useMemo(() => {
    if (!search.trim()) return allJobs;
    const term = search.toLowerCase();
    return allJobs.filter(job => 
      job.title.toLowerCase().includes(term) || 
      job.company.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term)
    );
  }, [search]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const term = search.toLowerCase();
    return categories.filter(cat => cat.title.toLowerCase().includes(term));
  }, [search]);

  return (
    <ScreenWrapper safeAreaTop={true} backgroundColor="#FFFFFF">
      {/* LinkedIn-Style Top Search Bar */}
      <Box px={16} py={8} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" space="md">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeftIcon size={24} color="#667085" />
          </TouchableOpacity>
          <Box flex={1} bg="#F3F4F6" rounded={12} px={12} height={44} justify="center">
            <HStack items="center">
              <SearchIcon size={20} color="#667085" />
              <TextInput
                placeholder="Search jobs, people, companies..."
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                autoFocus={false}
              />
            </HStack>
          </Box>
        </HStack>
      </Box>

      {/* Filter Chips */}
      <Box py={12} borderBottom={1} borderColor="#F3F4F6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <HStack space="xs">
            {filters.map((filter) => (
              <TouchableOpacity 
                key={filter} 
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterChip, 
                  activeFilter === filter && { backgroundColor: BLUE, borderColor: BLUE }
                ]}
              >
                <Text color={activeFilter === filter ? 'white' : '#667085'} fontWeight="700" fontSize={13}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </HStack>
        </ScrollView>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack p={20} space="lg">
          {/* Categories Section (Only if searching cat or no search) */}
          {filteredCategories.length > 0 && (
            <VStack space="md">
              <HStack justify="space-between" items="center">
                <Text fontSize={18} fontWeight="800" color="#111827">Categories</Text>
                <TouchableOpacity>
                  <Text fontSize={14} fontWeight="700" color={BLUE}>See All</Text>
                </TouchableOpacity>
              </HStack>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                <HStack space="md">
                  {filteredCategories.map((cat) => (
                    <TouchableOpacity key={cat.id} style={[styles.catCard, { backgroundColor: cat.color }]}>
                      <Text fontWeight="800" fontSize={14} color="#1E293B">{cat.title}</Text>
                      <Text fontSize={12} color="#64748B" mt={2}>{cat.count} jobs</Text>
                    </TouchableOpacity>
                  ))}
                </HStack>
              </ScrollView>
            </VStack>
          )}

          {/* Results Section */}
          <VStack space="md" mt={4}>
            <HStack justify="space-between" items="center" mb={4}>
              <Text fontSize={18} fontWeight="800" color="#111827">
                {search ? `Results for "${search}"` : 'Recommended Jobs'}
              </Text>
              <TouchableOpacity style={styles.filterIconBtn}>
                <AdjustmentsIcon size={20} color={BLUE} />
              </TouchableOpacity>
            </HStack>

            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <TouchableOpacity key={job.id} style={styles.jobCard} onPress={() => navigation.navigate('JobDetail', { job })}>
                  <HStack justify="space-between" items="flex-start">
                    <VStack space="xs" flex={1}>
                      <Text fontWeight="800" fontSize={16} color="#111827">{job.title}</Text>
                      <Text fontSize={13} color="#64748B" mt={2}>{job.company} • {job.location}</Text>
                    </VStack>
                    <Box bg="#EFF6FF" px={8} py={4} rounded={8}>
                      <Text color="#2563EB" fontSize={11} fontWeight="800">{job.type.toUpperCase()}</Text>
                    </Box>
                  </HStack>
                  
                  <Divider color="#F1F5F9" my={16} />
                  
                  <HStack justify="space-between" items="center">
                    <Text fontWeight="900" fontSize={16} color="#059669">{job.salary}</Text>
                    <Box bg="#111827" px={16} py={8} rounded={10}>
                      <Text color="white" fontSize={12} fontWeight="800">Apply</Text>
                    </Box>
                  </HStack>
                </TouchableOpacity>
              ))
            ) : (
              <VStack items="center" py={40} space="sm">
                <Text fontSize={16} fontWeight="700" color="#64748B">No results found</Text>
                <Text fontSize={14} color="#94A3B8" textAlign="center">Try a different keyword or check your spelling</Text>
              </VStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  backBtn: { padding: 4 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1E293B', height: '100%', fontWeight: '500' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: 'white' },
  catCard: { padding: 20, borderRadius: 20, minWidth: moderateScale(130), borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  filterIconBtn: { padding: 10, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  jobCard: { backgroundColor: 'white', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 12 },
});

export default SearchExploreScreen;
