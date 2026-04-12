import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import {
  ChevronLeft,
  Pencil,
  Users,
  MapPin,
  Eye,
  Briefcase,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';
import { JobService } from '../../services/api/jobs';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

const JOB_TYPE_MAP: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};

const EXP_LEVEL_MAP: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
  executive: 'Executive',
};

export default function JobDetailProviderScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { job: initialJob } = route.params || {};
  
  const [job, setJob] = useState<any>(initialJob || null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toggling, setToggling] = useState(false);

  const fetchJobDetails = async () => {
    if (!job?.id && !initialJob?.id) return;
    try {
      const data = await JobService.getRecruiterJobById(job?.id || initialJob?.id);
      setJob(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchJobDetails().finally(() => setLoading(false));
    }, [initialJob?.id])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobDetails();
    setRefreshing(false);
  };

  const handleToggleStatus = async () => {
    if (!job?.id) return;
    try {
      setToggling(true);
      const resp = await JobService.toggleJobStatus(job.id);
      setJob((prev: any) => ({ ...prev, is_active: resp.is_active ?? !prev.is_active }));
    } catch (e) {
      Alert.alert('Error', 'Could not toggle job status.');
    } finally {
      setToggling(false);
    }
  };

  const MetricCard = ({ icon: Icon, value, label, color = FB_BLUE }: any) => (
     <VStack items="center" flex={1} bg={FB_GRAY} p={12} rounded={16} mx={4}>
        <Icon size={18} color={color} />
        <Text fontSize={18} fontWeight="800" color="#111827" mt={8}>{value}</Text>
        <Text fontSize={10} fontWeight="700" color={GRAY_TEXT} mt={2}>{label.toUpperCase()}</Text>
     </VStack>
  );

  if (!job) {
    return (
      <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
        <Box pt={insets.top + 8} px={16} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
           <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
              <ChevronLeft size={22} color="black" strokeWidth={2.5} />
           </TouchableOpacity>
        </Box>
        <Box flex={1} justify="center" items="center">
           <ActivityIndicator size="large" color={FB_BLUE} />
        </Box>
      </ScreenWrapper>
    );
  }

  const jobTypeStr = JOB_TYPE_MAP[job.job_type] || job.job_type || 'Full-time';
  const expTypeStr = EXP_LEVEL_MAP[job.experience_level] || job.experience_level;
  
  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack px={16} items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
              <ChevronLeft size={22} color="black" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Job Details</Text>
          </HStack>
          <TouchableOpacity onPress={() => navigation?.navigate('EditJob', { job })} style={styles.headerIcon}>
            <Pencil size={18} color={FB_BLUE} />
          </TouchableOpacity>
        </HStack>
      </Box>

      {loading && !refreshing && (
         <Box py={16} items="center">
            <ActivityIndicator size="small" color={FB_BLUE} />
         </Box>
      )}

      <ScrollView 
         showsVerticalScrollIndicator={false} 
         contentContainerStyle={{ paddingBottom: 60 }}
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[FB_BLUE]} />}
       >
         {/* Identity Section */}
         <Box p={20}>
            <HStack space="md" items="center" mb={24}>
               <Box bg="#F0F9FF" w={56} h={56} rounded={16} items="center" justify="center">
                  <Briefcase size={28} color={FB_BLUE} />
               </Box>
               <VStack flex={1}>
                  <Text fontSize={22} fontWeight="800" color="#111827">{job.title}</Text>
                  <HStack items="center" mt={4} space="xs" style={{ flexWrap: 'wrap' }}>
                     <MapPin size={14} color={GRAY_TEXT} />
                     <Text fontSize={14} color={GRAY_TEXT}>{job.location || 'Remote'} • {jobTypeStr}</Text>
                  </HStack>
               </VStack>
            </HStack>

            {/* Performance Metrics */}
            <HStack justify="space-between" items="center">
               <MetricCard icon={Users} value={job.applicant_count || 0} label="Applied" />
               <MetricCard icon={Eye} value={job.views || 0} label="Views" color="#8B5CF6" />
               <MetricCard 
                  icon={job.is_active ? CheckCircle2 : XCircle} 
                  value={job.is_active ? 'Active' : 'Closed'} 
                  label="Status" 
                  color={job.is_active ? '#10B981' : '#EF4444'} 
               />
            </HStack>
         </Box>

         <Divider color="#F9FAFB" h={8} />

         <VStack p={20} space="xl">
            {/* Comp Section */}
            <VStack>
               <Text fontSize={12} fontWeight="700" color={GRAY_TEXT} mb={8} ml={4}>COMPENSATION</Text>
               {(job.salary_min || job.salary_max) ? (
                 <Text fontSize={20} fontWeight="800" color="#10B981">
                    ${(Number(job.salary_min || 0) / 1000).toFixed(0)}k – ${(Number(job.salary_max || 0) / 1000).toFixed(0)}k <Text fontSize={14} color={GRAY_TEXT}>/ Annual</Text>
                 </Text>
               ) : (
                 <Text fontSize={16} fontWeight="600" color="#111827">Not specified</Text>
               )}
            </VStack>

            <Divider color="#F0F2F5" />

            {/* Description Section */}
            <VStack>
               <Text fontSize={16} fontWeight="800" color="#111827" mb={12}>Description</Text>
               <Text fontSize={15} color="#374151" lineHeight={24}>
                  {job.description || 'No description provided.'}
               </Text>
            </VStack>
            
            {expTypeStr && (
               <VStack mt={8}>
                  <Text fontSize={16} fontWeight="800" color="#111827" mb={4}>Experience Level</Text>
                  <Text fontSize={15} color="#374151">{expTypeStr}</Text>
               </VStack>
            )}

            {/* Admin Actions */}
            <VStack mt={24} space="md">
               <TouchableOpacity 
                 style={styles.primaryBtn}
                 onPress={() => navigation?.navigate('Applicants', { jobId: job.id })} 
               >
                 <Text fontSize={16} fontWeight="700" color="white">View {job.applicant_count || 0} Applicants</Text>
               </TouchableOpacity>

               <TouchableOpacity 
                 style={styles.outlineBtn}
                 onPress={() => navigation?.navigate('EditJob', { job })} 
               >
                 <Text fontSize={16} fontWeight="700" color={FB_BLUE}>Edit Job Details</Text>
               </TouchableOpacity>

               <TouchableOpacity 
                 style={{ alignItems: 'center', marginTop: 12 }}
                 onPress={handleToggleStatus}
                 disabled={toggling}
               >
                 {toggling ? (
                   <ActivityIndicator size="small" color={GRAY_TEXT} />
                 ) : (
                   <Text fontSize={15} fontWeight="700" color={job.is_active ? "#EF4444" : "#10B981"}>
                     {job.is_active ? "Close Job Posting" : "Reopen Job Posting"}
                   </Text>
                 )}
               </TouchableOpacity>
            </VStack>
         </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { height: 50, borderRadius: 25, backgroundColor: FB_BLUE, alignItems: 'center', justifyContent: 'center' },
  outlineBtn: { height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: FB_BLUE, alignItems: 'center', justifyContent: 'center' },
});
