import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Box, VStack, HStack, ScreenWrapper, Avatar, Divider, Button } from '../../components/ui';
import { 
  ChevronLeft,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  MapPin,
  MessageCircle,
  Briefcase,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { JobService } from '../../services/api/jobs';
import { useAuthStore } from '../../store/authStore';

const BLUE = '#3B82F6';
const GRAY_TEXT = '#6B7280';
const DARK_TEXT = '#111827';
const SOFT_BG = '#F9FAFB';

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: any }> = {
  applied:        { color: '#6B7280', bg: '#F3F4F6', label: 'Applied',      icon: Send },
  screening:      { color: '#F59E0B', bg: '#FFFBEB', label: 'Screening',    icon: AlertCircle },
  online_meeting: { color: '#3B82F6', bg: '#EFF6FF', label: 'Online Int.',  icon: MessageCircle },
  onsite_meeting: { color: '#3B82F6', bg: '#EFF6FF', label: 'Onsite Int.',  icon: MapPin },
  hired:          { color: '#059669', bg: '#ECFDF5', label: 'Hired',       icon: CheckCircle2 },
  rejected:       { color: '#EF4444', bg: '#FEF2F2', label: 'Rejected',    icon: XCircle },
  withdrawn:      { color: '#6B7280', bg: '#F3F4F6', label: 'Withdrawn',   icon: Clock },
};

const AppliedJobsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({ applied: 0, screening: 0, interview: 0 });

  const fetchApplications = useCallback(async () => {
    try {
      const data = await JobService.getSeekerApplications();
      // data.results if paginated, data if not
      const results = data.results || (Array.isArray(data) ? data : []);
      setApplications(results);
      
      // Calculate stats
      const counts = {
        applied: results.filter((a: any) => a.status === 'applied').length,
        screening: results.filter((a: any) => a.status === 'screening').length,
        interview: results.filter((a: any) => a.status === 'online_meeting' || a.status === 'onsite_meeting').length,
      };
      setStats(counts);
    } catch (e) {
      console.warn('Failed to fetch applications:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const renderItem = ({ item }: any) => {
    const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.applied;
    const StatusIcon = status.icon;

    // Timeline Steps Logic
    const steps = ['Applied', 'Screening', 'Interview', 'Result'];
    let currentStepIndex = 0;
    if (['screening', 'online_meeting', 'onsite_meeting', 'hired', 'rejected'].includes(item.status)) currentStepIndex = 1;
    if (['online_meeting', 'onsite_meeting', 'hired', 'rejected'].includes(item.status)) currentStepIndex = 2;
    if (['hired', 'rejected'].includes(item.status)) currentStepIndex = 3;
    
    const isRejected = item.status === 'rejected';
    const isHired = item.status === 'hired';

    return (
      <View style={styles.trackingCard}>
        {/* Top Image & Badge */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.job_details?.featured_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800' }} 
            style={styles.featuredImage} 
          />
          <Box style={styles.locationBadge}>
            <HStack items="center" space="xs">
              <MapPin size={12} color="white" />
              <Text fontSize={12} fontWeight="700" color="white">{item.job_details?.location || 'Remote'}</Text>
            </HStack>
          </Box>
        </View>

        <VStack p={16}>
          {/* Header Info */}
          <HStack items="center" space="md" mb={16}>
             <Avatar source={{ uri: item.job_details?.company_logo }} size="md" rounded={12} style={styles.companyLogo} />
             <VStack flex={1}>
                <Text fontSize={18} fontWeight="800" color={DARK_TEXT} numberOfLines={1}>{item.job_title || 'Software Engineer'}</Text>
                <HStack mt={4} space="xs" items="center">
                   <Briefcase size={12} color={GRAY_TEXT} />
                   <Text fontSize={13} color={GRAY_TEXT}>{item.job_details?.company_name || 'Hiring Department'}</Text>
                </HStack>
             </VStack>
             <HStack px={12} py={6} rounded={12} bg={status.bg} items="center" space="xs">
                <StatusIcon size={14} color={status.color} />
                <Text fontSize={12} fontWeight="800" color={status.color}>{status.label}</Text>
             </HStack>
          </HStack>

          <Divider color="#F3F4F6" style={{ marginVertical: 8 }} />

          {/* Timeline Visual */}
          <VStack mt={12} mb={20}>
             <Text fontSize={14} fontWeight="800" color={DARK_TEXT} mb={16}>Application Progress</Text>
             <HStack justify="space-between" items="center" px={10}>
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isActive = index === currentStepIndex;
                    const isStepFailed = isRejected && index === 3;
                    const isStepSuccess = isHired && index === 3;
                    
                    return (
                       <React.Fragment key={step}>
                          <VStack items="center" style={{ width: 50 }}>
                             <Box 
                                w={28} 
                                h={28} 
                                rounded={14} 
                                items="center" 
                                justify="center"
                                bg={isStepFailed ? '#EF4444' : isStepSuccess ? '#10B981' : isCompleted ? BLUE : '#F3F4F6'}
                                style={isActive ? styles.activeStepRing : {}}
                             >
                                {isStepFailed ? (
                                   <XCircle size={16} color="white" />
                                ) : (isCompleted || isStepSuccess) ? (
                                   <CheckCircle2 size={16} color="white" />
                                ) : (
                                   <Text fontSize={12} color="#9CA3AF" fontWeight="700">{index + 1}</Text>
                                )}
                             </Box>
                             <Text 
                                fontSize={10} 
                                fontWeight="800" 
                                color={isStepFailed ? '#EF4444' : (isCompleted || isStepSuccess) ? DARK_TEXT : '#9CA3AF'} 
                                mt={8} 
                                textAlign="center"
                             >
                                {step}
                             </Text>
                          </VStack>
                         {index < steps.length - 1 && (
                            <Box flex={1} h={3} bg={index < currentStepIndex ? BLUE : '#F3F4F6'} mt={-20} rounded={2} mx={4} />
                         )}
                      </React.Fragment>
                   );
                })}
             </HStack>
          </VStack>

          {/* Details & Actions */}
          <HStack items="center" justify="space-between" p={12} bg="#F9FAFB" rounded={16} mb={16}>
              <HStack space="sm" items="center" flex={1}>
                 <FileText size={16} color={GRAY_TEXT} />
                 <VStack>
                    <Text fontSize={13} fontWeight="700" color={DARK_TEXT}>application_materials.pdf</Text>
                    <Text fontSize={11} color={GRAY_TEXT} mt={2}>Applied {new Date(item.created_at).toLocaleDateString()}</Text>
                 </VStack>
              </HStack>
          </HStack>

          <HStack space="md">
             <TouchableOpacity style={styles.messageBtn} onPress={() => {}}>
                <HStack items="center" justify="center" space="xs">
                   <MessageCircle size={18} color={DARK_TEXT} />
                   <Text fontSize={14} fontWeight="800" color={DARK_TEXT}>Message Recruiter</Text>
                </HStack>
             </TouchableOpacity>
          </HStack>

        </VStack>
      </View>
    );
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={SOFT_BG}>
      <StatusBar barStyle="dark-content" />

      {/* ─── PREMIUM HEADER ─── */}
      <Box
        bg="white"
        pt={insets.top + 10}
        pb={20}
        px={20}
        borderBottomLeft={30}
        borderBottomRight={30}
        style={styles.headerCard}
      >
        <HStack items="center" justify="space-between" mb={20}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={22} color={DARK_TEXT} />
          </TouchableOpacity>
          <VStack items="center">
            <Text fontSize={20} fontWeight="900" color={DARK_TEXT}>Applications</Text>
            <Text fontSize={12} fontWeight="700" color={BLUE} mt={2}>{applications.length} total active</Text>
          </VStack>
          <View style={{ width: 44 }} />
        </HStack>

        {/* Stats strip */}
        <HStack space="md" px={10}>
          {[
            { label: 'Applied', count: stats.applied, color: GRAY_TEXT, bg: '#F3F4F6' },
            { label: 'Screening', count: stats.screening, color: '#F59E0B', bg: '#FFFBEB' },
            { label: 'Interview', count: stats.interview, color: BLUE, bg: '#EFF6FF' },
          ].map(s => (
            <VStack key={s.label} items="center" flex={1} style={[styles.statBox, { backgroundColor: s.bg }]}>
              <Text fontSize={18} fontWeight="900" color={s.color}>{s.count}</Text>
              <Text fontSize={10} color={s.color} fontWeight="800" mt={2} textTransform="uppercase">{s.label}</Text>
            </VStack>
          ))}
        </HStack>
      </Box>

      {/* ─── APPLICATION LIST ─── */}
      <FlatList
        data={applications}
        renderItem={renderItem}
        contentContainerStyle={[styles.feedContent, { paddingBottom: insets.bottom + 120 }]}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />
        }
        ListEmptyComponent={
          <VStack items="center" mt={60} px={40}>
            <View style={styles.emptyIconContainer}>
              <FileText size={40} color="#D1D5DB" />
            </View>
            <Text fontSize={18} fontWeight="900" color={DARK_TEXT} mt={20}>No applications yet</Text>
            <Text fontSize={14} color={GRAY_TEXT} mt={8} style={{ textAlign: 'center' }} lineHeight={20}>
              Start applying for your dream jobs to see your progress here.
            </Text>
          </VStack>
        }
      />
    </ScreenWrapper>
  );
};

export default AppliedJobsScreen;



const styles = StyleSheet.create({
  headerCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBox: {
    paddingVertical: 10,
    borderRadius: 16,
  },
  feedContent: {
    padding: 16,
    paddingTop: 24,
  },
  trackingCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imageContainer: {
    height: 140,
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  companyLogo: {
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  activeStepRing: {
    borderWidth: 3,
    borderColor: '#DBEAFE',
  },
  messageBtn: {
    backgroundColor: '#F3F4F6',
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
});
