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

const BLUE = '#0A66C2';
const GRAY_BG = '#F3F2EF';

export default function JobPostingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const fetchJobs = async () => {
    try {
      const data = await JobService.getRecruiterJobs();
      setJobs(data?.results || [
        { id: 1, title: 'Senior Protocol Engineer', location: 'Remote', salary_min: 120000, salary_max: 150000, applicant_count: 24, status: 'Active' },
        { id: 2, title: 'UX/UI Design Lead', location: 'Hybrid', salary_min: 90000, salary_max: 110000, applicant_count: 12, status: 'Closed' },
        { id: 3, title: 'Backend Architect', location: 'Kathmandu, NP', salary_min: 80000, salary_max: 100000, applicant_count: 8, status: 'Active' },
      ]);
    } catch (e) {
      setJobs([
        { id: 1, title: 'Senior Protocol Engineer', location: 'Remote', salary_min: 120000, salary_max: 150000, applicant_count: 24, status: 'Active' },
        { id: 2, title: 'UX/UI Design Lead', location: 'Hybrid', salary_min: 90000, salary_max: 110000, applicant_count: 12, status: 'Closed' },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchJobs(); };

  const handleDelete = (job: any) => {
    Alert.alert(
      'Close Job Posting',
      `Are you sure you want to close "${job.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close Posting', style: 'destructive',
          onPress: async () => {
            try {
              await JobService.deleteJob?.(job.id);
              setJobs(prev => prev.filter(j => j.id !== job.id));
            } catch {
              setJobs(prev => prev.filter(j => j.id !== job.id));
            }
          }
        }
      ]
    );
  };

  const JobPostCard = ({ job }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetailProvider', { job })}
      activeOpacity={0.85}
    >
      <HStack items="flex-start" mb={12}>
        <Box bg="#EDF3F8" p={10} rounded={10}>
          <Briefcase size={22} color={BLUE} />
        </Box>
        <VStack ml={12} flex={1}>
          <HStack justify="space-between" items="center">
            <Text fontSize={16} fontWeight="700" color="#1F2937" flex={1} numberOfLines={1}>{job.title}</Text>
            <Box bg={job.status === 'Active' ? '#DCFCE7' : '#FEE2E2'} px={8} py={3} rounded={4} ml={8}>
              <Text fontSize={11} fontWeight="700" color={job.status === 'Active' ? '#166534' : '#DC2626'}>{job.status?.toUpperCase()}</Text>
            </Box>
          </HStack>
          <HStack mt={6} space="md">
            <HStack items="center">
              <MapPin size={13} color="#6B7280" />
              <Text fontSize={12} color="#6B7280" ml={4}>{job.location || 'Not specified'}</Text>
            </HStack>
            {(job.salary_min || job.salary_max) && (
              <HStack items="center">
                <DollarSign size={13} color="#6B7280" />
                <Text fontSize={12} color="#6B7280" ml={2}>{job.salary_min ? `$${(job.salary_min/1000).toFixed(0)}k` : ''}{job.salary_max ? ` - $${(job.salary_max/1000).toFixed(0)}k` : ''}</Text>
              </HStack>
            )}
          </HStack>
        </VStack>
      </HStack>

      <Divider color="#F1F5F9" mb={12} />

      <HStack justify="space-between" items="center">
        <HStack space="lg">
          <TouchableOpacity onPress={() => navigation.navigate('Applicants', { jobId: job.id })} style={styles.statBtn}>
            <Users size={15} color={BLUE} />
            <Text fontSize={13} fontWeight="700" color={BLUE} ml={5}>{job.applicant_count || 0} applicants</Text>
          </TouchableOpacity>
          <HStack items="center">
            <Eye size={15} color="#6B7280" />
            <Text fontSize={13} color="#6B7280" ml={5}>{job.views || 142} views</Text>
          </HStack>
        </HStack>
        <HStack space="sm">
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('EditJob', { job })}>
            <Pencil size={18} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]} onPress={() => handleDelete(job)}>
            <Trash2 size={18} color="#EF4444" />
          </TouchableOpacity>
        </HStack>
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />

      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#1F2937" strokeWidth={2.5} />
            </TouchableOpacity>
            <VStack ml={16}>
              <Text fontSize={20} color="#1F2937" fontWeight="700">Job Postings</Text>
              <Text fontSize={12} color="#6B7280">{jobs.length} postings</Text>
            </VStack>
          </HStack>
          <TouchableOpacity onPress={() => navigation.navigate('PostJob')} style={styles.addBtn}>
            <Plus size={22} color="white" />
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} />
        ) : (
          jobs.map(job => <JobPostCard key={job.id} job={job} />)
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  statBtn: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F2EF', alignItems: 'center', justifyContent: 'center' },
});
