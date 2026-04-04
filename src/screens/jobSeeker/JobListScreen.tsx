import React, { useState, useEffect } from 'react';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { moderateScale } from '../../utils/responsive';
import { 
  ScreenWrapper, BottomSheet, Button, VStack, HStack, Text, Box, Divider 
} from '../../components/ui';
import {
  Search,
  MapPin,
  Bookmark,
  SlidersHorizontal,
  Globe,
  Briefcase,
  Star,
  ChevronRight,
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { useAuthStore } from '../../store/authStore';
import { timeAgo } from '../../utils';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

const BLUE = '#1877F2'; 
const LIGHT_BLUE = '#EBF3FF';
const PROMOTED_GREEN = '#057642';
const FILTERS = [
  { label: 'All Roles', value: 'all' },
  { label: 'Full-time', value: 'full_time' },
  { label: 'Remote', value: 'remote' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
];

export default function JobListScreen({ navigation }: { navigation?: any }) {
  const { token } = useAuthStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  
  const [expLevel, setExpLevel] = useState<string | null>(null);
  const [isRemote, setIsRemote] = useState<boolean | null>(null);

  const fetchJobs = async () => {
    try {
      const data = await JobService.getJobs();
      setAllJobs(data?.results || []);
    } catch (e) {
      if (!token?.startsWith('demo_') && token !== 'demo-token') {
        console.warn('Sync failed');
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchJobs(); };

  const filteredJobs = allJobs.filter(job => 
    (job.title.toLowerCase().includes(query.toLowerCase()) || 
     job.company_name.toLowerCase().includes(query.toLowerCase())) &&
    (filter === 'all' || job.job_type === filter)
  );

  const toggleSave = (id: string) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter(sid => sid !== id));
      Toast.show({ type: 'info', text1: 'Intelligence Archive Outdated', text2: 'Mission removed from saved spectrum.' });
    } else {
      setSavedJobs([...savedJobs, id]);
      Toast.show({ type: 'success', text1: 'Intelligence Archived', text2: 'Mission saved to your secure profile.' });
    }
  };

  const renderJob = ({ item: job }: { item: any }) => (
    <TouchableOpacity 
      style={styles.jobCard} 
      onPress={() => navigation?.navigate('JobDetail', { job })}
      activeOpacity={0.7}
    >
      <HStack items="flex-start" justify="space-between" mb={12}>
        <HStack items="center" flex={1}>
          <Box bg="white" p={10} rounded={12} border={1} borderColor="#E5E7EB" shadow={1}>
             <Image source={{ uri: job.company_logo || 'https://via.placeholder.com/100' }} style={{ width: 44, height: 44, borderRadius: 8 }} />
          </Box>
          <VStack ml={16} flex={1}>
             <Text fontSize={17} fontWeight="900" color="#111827" numberOfLines={1}>{job.title}</Text>
             <Text fontSize={14} color={BLUE} fontWeight="700" mt={2}>{job.company_name}</Text>
          </VStack>
        </HStack>
        <TouchableOpacity onPress={() => toggleSave(job.id)}>
           {savedJobs.includes(job.id) ? (
             <Bookmark size={24} color={BLUE} fill={BLUE} />
           ) : (
             <Bookmark size={24} color="#D1D5DB" />
           )}
        </TouchableOpacity>
      </HStack>

      <HStack flexWrap="wrap" space="sm" mb={12}>
         <Box bg="#F3F2EF" px={10} py={4} rounded={20}>
            <HStack items="center">
               <MapPin size={14} color="#666666" />
               <Text fontSize={12} color="#666666" ml={4}>{job.location}</Text>
            </HStack>
         </Box>
         <Box bg={LIGHT_BLUE} px={10} py={4} rounded={20}>
            <Text fontSize={12} color={BLUE} fontWeight="700">{job.job_type_label || job.job_type}</Text>
         </Box>
         {job.salary_range && (
            <Box bg="#ECFDF5" px={10} py={4} rounded={20}>
               <Text fontSize={12} color="#047857" fontWeight="700">{job.salary_range}</Text>
            </Box>
         )}
      </HStack>

      <Divider color="#F3F2EF" mb={12} />

      <HStack justify="space-between" items="center">
         <Text fontSize={12} color="#94A3B8" fontWeight="600">Sync: {timeAgo(job.created_at)}</Text>
         <HStack items="center">
            <Text fontSize={12} color="#057642" fontWeight="900" mr={4}>AI MATCH 94%</Text>
            <ChevronRight size={16} color="#057642" />
         </HStack>
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="#F3F2EF">
      <StatusBar barStyle="dark-content" />
      
      {/* Search Header */}
      <Box px={16} pt={60} pb={20} bg="white" borderBottomLeft={24} borderBottomRight={24} shadow={3}>
         <Text fontSize={28} fontWeight="900" color="#111827" mb={16}>Nexus Explorer</Text>
         <HStack space="md">
            <Box flex={1} bg="#F3F2EF" rounded={14} px={14} flexDir="row" items="center">
               <Search size={20} color="#666666" />
               <TextInput 
                  placeholder="Design, Tech, Missions..."
                  placeholderTextColor="#94A3B8"
                  style={styles.searchInput}
                  value={query}
                  onChangeText={setQuery}
               />
            </Box>
            <TouchableOpacity 
              style={styles.filterBtn} 
              onPress={() => setShowFilter(true)}
            >
               <SlidersHorizontal size={22} color="white" />
            </TouchableOpacity>
         </HStack>
      </Box>

      {/* Categories Toolbar */}
      <Box py={16}>
         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {FILTERS.map((f) => (
               <TouchableOpacity 
                  key={f.value} 
                  style={[styles.catBtn, filter === f.value && styles.catBtnActive]}
                  onPress={() => setFilter(f.value)}
               >
                  <Text 
                    fontSize={14} 
                    fontWeight="700" 
                    color={filter === f.value ? 'white' : '#666666'}
                  >
                    {f.label}
                  </Text>
               </TouchableOpacity>
            ))}
         </ScrollView>
      </Box>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderJob}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />}
        ListEmptyComponent={
          allJobs.length === 0 && !refreshing ? <ActivityIndicator color={BLUE} style={{ marginTop: 60 }} /> : (
            filteredJobs.length === 0 ? (
               <VStack items="center" mt={60}>
                  <Box bg="white" p={32} rounded={999} mb={24}>
                     <Briefcase size={64} color="#D1D5DB" />
                  </Box>
                  <Text fontSize={18} fontWeight="900" color="#111827">Intelligence Spectrum Empty</Text>
                  <Text fontSize={14} color="#666666" mt={8}>Recalibrating search parameters...</Text>
               </VStack>
            ) : null
          )
        }
      />

      <BottomSheet visible={showFilter} onClose={() => setShowFilter(false)}>
         <Box p={24}>
            <Text fontSize={22} fontWeight="900" color="#111827" mb={24}>Refine Spectrum</Text>
            
            <Text fontSize={16} fontWeight="700" color="#374151" mb={12}>Experience Matrix</Text>
            <HStack flexWrap="wrap" space="sm" mb={24}>
               {['Entry', 'Mid', 'Senior', 'Lead'].map((l) => (
                  <TouchableOpacity 
                     key={l} 
                     style={[styles.filterChip, expLevel === l && styles.filterChipActive]}
                     onPress={() => setExpLevel(l)}
                  >
                     <Text fontSize={14} color={expLevel === l ? 'white' : '#111827'}>{l}</Text>
                  </TouchableOpacity>
               ))}
            </HStack>

            <Text fontSize={16} fontWeight="700" color="#374151" mb={12}>Operational Sector</Text>
             <HStack flexWrap="wrap" space="sm" mb={32}>
               {[{ label: 'Remote Only', val: true }, { label: 'On-site', val: false }].map((s) => (
                  <TouchableOpacity 
                     key={s.label} 
                     style={[styles.filterChip, isRemote === s.val && styles.filterChipActive]}
                     onPress={() => setIsRemote(s.val)}
                  >
                     <Text fontSize={14} color={isRemote === s.val ? 'white' : '#111827'}>{s.label}</Text>
                  </TouchableOpacity>
               ))}
            </HStack>

            <Button 
               label="Apply Refinement" 
               onPress={() => setShowFilter(false)} 
               variant="solid" 
               bg={BLUE}
               height={56}
            />
         </Box>
      </BottomSheet>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchInput: { flex: 1, height: 50, marginLeft: 12, fontSize: 16, color: '#111827', fontWeight: '500' },
  filterBtn: { backgroundColor: '#111827', width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  catBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, backgroundColor: 'white', marginRight: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  catBtnActive: { backgroundColor: '#111827', borderColor: '#111827' },
  jobCard: { backgroundColor: 'white', padding: 18, borderRadius: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F3F2EF', marginBottom: 8 },
  filterChipActive: { backgroundColor: '#111827' },
});
