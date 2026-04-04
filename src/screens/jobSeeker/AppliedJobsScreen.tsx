import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, StyleSheet, Dimensions } from 'react-native';
import { Text, Box, VStack, HStack, ScreenWrapper, Divider } from '../../components/ui';
import { 
  ChevronLeft,
  Briefcase,
  Clock,
  ChevronRight,
  FileText,
} from 'lucide-react-native';
import { Colors } from '../../constants';
import { JobService } from '../../services/api/jobs';
import { moderateScale } from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AppliedJobsScreen = () => {
  const navigation = useNavigation<any>();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const response = await JobService.getAppliedJobs();
      setAppliedJobs(response.results || response.data || []);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'shortlisted': return { color: '#059669', bg: '#EDFDF7', label: 'Shortlisted' };
      case 'rejected': return { color: '#DC2626', bg: '#FEF2F2', label: 'Rejected' };
      case 'pending': return { color: '#D97706', bg: '#FFFBEB', label: 'Pending' };
      case 'applied': return { color: '#2563EB', bg: '#EFF6FF', label: 'Applied' };
      default: return { color: '#64748B', bg: '#F8FAFC', label: status || 'Processing' };
    }
  };

  const renderItem = ({ item }: any) => {
    const status = getStatusConfig(item.status);
    const jobTitle = item.job_title || item.job?.title || 'Unknown Role';
    const company = item.company_name || item.job?.company_name || 'Anonymous Company';
    const date = item.applied_date || item.created_at || 'Recent';

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => item.job && navigation.navigate('JobDetail', { job: item.job })}
      >
        <VStack space="md">
          <HStack justify="space-between" items="center">
            <Box bg={status.bg} px={10} py={2} rounded={6}>
              <Text fontSize={11} fontWeight="800" color={status.color}>{status.label.toUpperCase()}</Text>
            </Box>
            <HStack items="center">
              <Clock size={14} color="#94A3B8" />
              <Text fontSize={12} color="#94A3B8" ml={4}>{date}</Text>
            </HStack>
          </HStack>

          <VStack space="xs">
            <Text fontSize={17} fontWeight="800" color="#111827" numberOfLines={1}>{jobTitle}</Text>
            <HStack items="center">
              <Briefcase size={14} color="#64748B" />
              <Text fontSize={14} color="#64748B" ml={6} numberOfLines={1}>{company}</Text>
            </HStack>
          </VStack>

          <Divider color="#F1F5F9" />

          <HStack justify="space-between" items="center">
             <Text fontSize={13} color="#0A66C2" fontWeight="700">View application details</Text>
             <ChevronRight size={16} color="#0A66C2" />
          </HStack>
        </VStack>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper safeAreaTop={true} backgroundColor="#F8FAFC">
      <Box px={16} pt={moderateScale(12)} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center">
           <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="#111827" />
           </TouchableOpacity>
           <VStack ml={16}>
              <Text fontSize={22} fontWeight="900" color="#111827">Applications</Text>
              <Text fontSize={13} color="#64748B">Track your active seeker journey</Text>
           </VStack>
        </HStack>
      </Box>

      <FlatList
        data={appliedJobs}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
        keyExtractor={(item: any) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchAppliedJobs} colors={["#0A66C2"]} />
        }
        ListEmptyComponent={
          loading ? null : (
            <VStack flex={1} items="center" justify="center" style={{ paddingHorizontal: 40, marginTop: 60 }}>
               <Box bg="#F1F5F9" style={{ padding: 20, borderRadius: 60 }}>
                 <FileText size={48} color="#94A3B8" />
               </Box>
              <Text fontWeight="800" fontSize={20} color="#111827" mt={20}>No Applications Yet</Text>
              <Text textAlign="center" color="#64748B" mt={8} fontSize={15}>Your job applications will appear here once you start applying to roles.</Text>
              <TouchableOpacity 
                style={styles.browseBtn}
                onPress={() => navigation.navigate('SearchExplore')}
              >
                <Text color="white" fontWeight="800">Browse Jobs</Text>
              </TouchableOpacity>
            </VStack>
          )
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  browseBtn: {
    marginTop: 24,
    backgroundColor: '#0A66C2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  }
});

export default AppliedJobsScreen;
