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

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

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
    { label: 'Active Jobs', value: activeJobs.toString(), icon: BriefcaseIcon, color: '#EBF5FF', iconColor: FB_BLUE },
    { label: 'Applications', value: totalApps.toString(), icon: UsersIcon, color: '#E6FFFA', iconColor: '#319795' },
    { label: 'Interviews', value: interviews.toString(), icon: TrendingUpIcon, color: '#FFF5F5', iconColor: '#E53E3E' },
    { label: 'Success Hires', value: hired.toString(), icon: BarChart2Icon, color: '#FAF5FF', iconColor: '#805AD5' },
  ];

  const FUNNEL = [
    { stage: 'Applications', count: totalApps, pct: 100 },
    { stage: 'Shortlisted', count: shortlisted, pct: totalApps ? Math.round((shortlisted / totalApps) * 100) : 0 },
    { stage: 'Interviews', count: interviews, pct: totalApps ? Math.round((interviews / totalApps) * 100) : 0 },
    { stage: 'Hired', count: hired, pct: totalApps ? Math.round((hired / totalApps) * 100) : 0 },
  ];

  if (loading) {
    return (
      <Box flex={1} bg="white" justify="center" items="center">
        <ActivityIndicator size="large" color={FB_BLUE} />
      </Box>
    );
  }

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />
      
      <Box px={16} pt={insets.top + 10} pb={15} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center" justify="space-between">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <ChevronLeftIcon size={22} color="black" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="700" color="#111827">Hiring Analytics</Text>
          <Box w={36} />
        </HStack>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={FB_BLUE} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* Performance Overview */}
        <Box p={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
           <Text fontSize={13} fontWeight="700" color="#111827" mb={16} letterSpacing={0.5}>Performance Overview</Text>
           <View style={styles.metricsGrid}>
            {METRICS.map((m, i) => (
              <Box key={i} w={(screenWidth - 44) / 2} p={14} bg="white" rounded={12} border={1} borderColor="#F0F2F5">
                <HStack items="center" justify="space-between">
                   <Box bg={m.color} p={8} rounded={10}>
                      <m.icon size={16} color={m.iconColor} />
                   </Box>
                   <Text fontSize={20} fontWeight="800" color="#111827">{m.value}</Text>
                </HStack>
                <Text fontSize={12} fontWeight="600" color={GRAY_TEXT} mt={12}>{m.label}</Text>
              </Box>
            ))}
           </View>
        </Box>

        {/* Hiring Funnel */}
        <Box mt={8} p={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
           <Text fontSize={13} fontWeight="700" color="#111827" mb={20} letterSpacing={0.5}>Hiring Funnel</Text>
           {FUNNEL.map((stage, i) => (
              <View key={i} style={{ marginBottom: 20 }}>
                <HStack justify="space-between" mb={8}>
                  <Text fontSize={14} color="#111827" fontWeight="600">{stage.stage}</Text>
                  <Text fontSize={14} fontWeight="700" color={FB_BLUE}>{stage.count}</Text>
                </HStack>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${Math.max(stage.pct, 5)}%`, backgroundColor: i === 0 ? FB_BLUE : '#4ADE80', opacity: 1 - i * 0.15 }]} />
                </View>
              </View>
           ))}
        </Box>

        {/* Top Active Postings */}
        <Box mt={8} p={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
           <Text fontSize={13} fontWeight="700" color="#111827" mb={16} letterSpacing={0.5}>Top Active Postings</Text>
           {jobs.length > 0 ? jobs.slice(0, 3).map((job, i) => (
              <TouchableOpacity key={i} onPress={() => navigation.navigate('Applicants', { jobId: job.id })} activeOpacity={0.7}>
                <HStack py={12} items="center" justify="space-between" borderBottom={i < 2 ? 1 : 0} borderColor="#F0F2F5">
                   <VStack flex={1}>
                      <Text fontSize={15} fontWeight="700" color="#111827" numberOfLines={1}>{job.title}</Text>
                      <Text fontSize={13} color={GRAY_TEXT} mt={2}>{job.applications_count || 0} applications received</Text>
                   </VStack>
                   <Box bg="#F0FDF4" p={8} rounded={10}>
                      <TrendingUpIcon size={18} color="#16A34A" />
                   </Box>
                </HStack>
              </TouchableOpacity>
           )) : (
              <Box items="center" py={30}>
                <BriefcaseIcon size={40} color="#E5E7EB" />
                <Text fontSize={14} color={GRAY_TEXT} mt={12}>No active jobs with data yet.</Text>
              </Box>
           )}
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  barTrack: { height: 8, backgroundColor: '#F0F2F5', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
});





