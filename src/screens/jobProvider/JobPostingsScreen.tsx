import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Plus,
  Briefcase,
  Pencil,
  Trash2,
  MapPin,
  DollarSign,
  Eye,
  Users,
  ChevronRight,
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

export default function JobPostingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const fetchJobs = async () => {
    const dummyJobs = [
      { id: 1, title: 'Senior Protocol Engineer', location: 'Remote', salary_min: 120000, salary_max: 150000, applicant_count: 24, status: 'Active', views: 842 },
      { id: 2, title: 'UX/UI Design Lead', location: 'Hybrid', salary_min: 90000, salary_max: 110000, applicant_count: 12, status: 'Closed', views: 421 },
      { id: 3, title: 'Backend Architect', location: 'Kathmandu, NP', salary_min: 80000, salary_max: 100000, applicant_count: 8, status: 'Active', views: 312 },
    ];
    try {
      const data = await JobService.getRecruiterJobs();
      if (data?.results && data.results.length > 0) {
        setJobs(data.results);
      } else {
        setJobs(dummyJobs);
      }
    } catch (e) {
      setJobs(dummyJobs);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchJobs(); };

  const handleDelete = (job: any) => {
    Alert.alert(
      'Delete Job Posting',
      `Are you sure you want to delete "${job.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
             // Mock delete
             setJobs(prev => prev.filter(j => j.id !== job.id));
          }
        }
      ]
    );
  };

  const JobPostCard = ({ job }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetailProvider', { job })}
      activeOpacity={0.9}
    >
      <HStack items="center" mb={16} justify="space-between">
        <HStack items="center" flex={1}>
           <Box bg="#F0F2F5" p={10} rounded={12}>
              <Briefcase size={22} color={FB_BLUE} />
           </Box>
           <VStack ml={12} flex={1}>
              <Text fontSize={16} fontWeight="700" color="#111827" numberOfLines={1}>{job.title}</Text>
              <Text fontSize={13} color={GRAY_TEXT} mt={2}>{job.location || 'Remote'}</Text>
           </VStack>
        </HStack>
        <Box bg={job.status === 'Active' ? '#EBFDF5' : '#F9FAFB'} px={10} py={4} rounded={20}>
           <Text fontSize={11} fontWeight="700" color={job.status === 'Active' ? '#10B981' : '#9CA3AF'}>{job.status}</Text>
        </Box>
      </HStack>

      <HStack space="md" mb={16}>
         <Box bg="#F9FAFB" px={10} py={6} rounded={8} items="center" style={{ flexDirection: 'row' }}>
            <Users size={14} color="#4B5563" />
            <Text fontSize={12} fontWeight="600" color="#4B5563" ml={6}>{job.applicant_count || 0} applicants</Text>
         </Box>
         <Box bg="#F9FAFB" px={10} py={6} rounded={8} items="center" style={{ flexDirection: 'row' }}>
            <Eye size={14} color="#4B5563" />
            <Text fontSize={12} fontWeight="600" color="#4B5563" ml={6}>{job.views || 0} views</Text>
         </Box>
      </HStack>

      <Box h={1} bg="#F3F4F6" mb={16} />

      <HStack justify="space-between" items="center">
         <HStack space="sm">
            <TouchableOpacity 
               style={styles.actionBtn} 
               onPress={() => navigation.navigate('Applicants', { jobId: job.id })}
            >
               <Text fontSize={13} fontWeight="700" color={FB_BLUE}>View Applicants</Text>
            </TouchableOpacity>
         </HStack>
         <HStack space="xs">
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('EditJob', { job })}>
               <Pencil size={16} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(job)}>
               <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
         </HStack>
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box px={16} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
              <ChevronLeft size={22} color="black" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Job Postings</Text>
          </HStack>
          <TouchableOpacity onPress={() => navigation.navigate('PostJob')} style={styles.addBtn}>
            <Plus size={22} color="white" strokeWidth={2.5} />
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={FB_BLUE} />}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color={FB_BLUE} style={{ marginTop: 40 }} />
        ) : jobs.length > 0 ? (
          jobs.map(job => <JobPostCard key={job.id} job={job} />)
        ) : (
          <VStack mt={80} items="center" px={40}>
            <Box w={72} h={72} rounded={36} border={1} borderColor="#E5E7EB" items="center" justify="center" bg="white">
               <Briefcase size={32} color="#D1D5DB" />
            </Box>
            <Text mt={20} fontSize={17} fontWeight="800" color="#111827">No jobs posted yet</Text>
            <Text mt={8} fontSize={14} color={GRAY_TEXT} textAlign="center">Get started by creating your first job posting.</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('PostJob')}
              style={styles.emptyActionBtn}
            >
              <Text color="white" fontWeight="700">Post a Job</Text>
            </TouchableOpacity>
          </VStack>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  addBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: FB_BLUE, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 12, paddingBottom: 40 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F0F2F5' },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F0FAFF' },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F0F2F5' },
  emptyActionBtn: { marginTop: 24, backgroundColor: FB_BLUE, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24 },
});
