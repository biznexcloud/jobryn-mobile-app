import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, HStack, VStack, Box, Divider } from '../../components/ui';
import { ChevronLeft as ChevronLeftIcon, BarChart2 as BarChart2Icon, Users as UsersIcon, Briefcase as BriefcaseIcon, TrendingUp as TrendingUpIcon } from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { moderateScale, screenWidth } from '../../utils/responsive';

const BLUE = '#0A66C2'; 
const PROMOTED_GREEN = '#057642';

export default function AnalyticsScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [jobsData, appsData] = await Promise.all([
        JobService.getRecruiterJobs(),
        JobService.getRecruiterApplications(),
      ]);
      setJobs(jobsData?.results || []);
      setApplications(appsData?.results || []);
    } catch (e) {
      console.warn('Analytics fetch failed', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status?.toLowerCase() === 'active').length || totalJobs;
  const totalApps = applications.length;
  const shortlisted = applications.filter(a => a.status === 'screening').length;
  const hired = applications.filter(a => a.status === 'hired').length;
  const interviews = applications.filter(a => ['online_meeting', 'onsite_meeting'].includes(a.status)).length;

  const METRICS = [
    { label: 'Active positions', value: activeJobs.toString() },
    { label: 'Total applicants', value: totalApps.toString() },
    { label: 'Interviews', value: interviews.toString() },
    { label: 'Hired', value: hired.toString() },
  ];

  const FUNNEL = [
    { stage: 'Applications', count: totalApps, pct: 100 },
    { stage: 'Shortlisted', count: shortlisted, pct: totalApps ? Math.round((shortlisted / totalApps) * 100) : 0 },
    { stage: 'Interviews', count: interviews, pct: totalApps ? Math.round((interviews / totalApps) * 100) : 0 },
    { stage: 'Offers/Hired', count: hired, pct: totalApps ? Math.round((hired / totalApps) * 100) : 0 },
  ];

  if (loading) {
    return (
      <Box flex={1} bg="white" justify="center" items="center">
        <ActivityIndicator size="large" color={BLUE} />
      </Box>
    );
  }

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="#FFFFFF">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Box px={16} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#E0E0E0">
        <HStack items="center" justify="space-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={24} color="#000000" strokeWidth={2} />
          </TouchableOpacity>
          <Text fontSize={18} fontWeight="700" color="#000000">Analytics</Text>
          <Box w={24} />
        </HStack>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40, backgroundColor: 'white' }}
      >
        <Box p={16}>
           <Text fontSize={14} fontWeight="700" color="#000000" mb={16}>Performance overview</Text>
           <View style={styles.metricsGrid}>
            {METRICS.map((m, i) => (
              <Box key={i} w={(screenWidth - 44) / 2} p={16} bg="#F3F2EF" rounded={4}>
                <Text fontSize={24} fontWeight="700" color="#000000">{m.value}</Text>
                <Text fontSize={12} color="#666666" mt={4}>{m.label}</Text>
              </Box>
            ))}
           </View>
        </Box>

        <Divider color="#F3F2EF" h={8} />

        <Box p={16}>
           <Text fontSize={14} fontWeight="700" color="#000000" mb={20}>Hiring funnel</Text>
           {FUNNEL.map((stage, i) => (
             <View key={i} style={{ marginBottom: 20 }}>
               <HStack justify="space-between" mb={8}>
                 <Text fontSize={14} color="#000000" fontWeight={i === 0 ? "700" : "500"}>{stage.stage}</Text>
                 <Text fontSize={14} fontWeight="700" color="#000000">{stage.count}</Text>
               </HStack>
               <View style={styles.barTrack}>
                 <View style={[styles.barFill, { width: `${Math.max(stage.pct, 2)}%`, backgroundColor: i === 0 ? BLUE : PROMOTED_GREEN, opacity: 1 - i * 0.15 }]} />
               </View>
             </View>
           ))}
        </Box>

        <Divider color="#F3F2EF" h={8} />

        <Box p={16}>
           <Text fontSize={14} fontWeight="700" color="#000000" mb={16}>Top performing jobs</Text>
           {jobs.length > 0 ? jobs.slice(0, 3).map((job, i) => (
             <TouchableOpacity key={i} onPress={() => navigation.navigate('Applicants', { jobId: job.id })}>
               <HStack py={12} items="center" justify="space-between" borderBottom={i < 2 ? 1 : 0} borderColor="#F3F2EF">
                  <VStack flex={1}>
                     <Text fontSize={15} fontWeight="700" color="#000000" numberOfLines={1}>{job.title}</Text>
                     <Text fontSize={12} color="#666666" mt={2}>{job.applications_count || 0} applicants</Text>
                  </VStack>
                  <TrendingUpIcon size={20} color={PROMOTED_GREEN} />
               </HStack>
             </TouchableOpacity>
           )) : (
             <Box items="center" py={20}>
               <BriefcaseIcon size={32} color="#E0E0E0" />
               <Text fontSize={14} color="#999999" mt={8}>No job data available</Text>
             </Box>
           )}
        </Box>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  barTrack: { height: 8, backgroundColor: '#F3F2EF', borderRadius: 4 },
  barFill: { height: '100%', borderRadius: 4 },
});





