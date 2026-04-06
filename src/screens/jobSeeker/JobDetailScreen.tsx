import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Share,
  Image,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  MapPin,
  Bookmark,
  Share2,
  BadgeCheck,
  Building2,
  ChevronRight,
  Globe,
  Clock,
  Briefcase,
  CircleDollarSign,
  Users,
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button, Heading } from '../../components/ui';

const BLUE = '#3B82F6'; 
const GRAY_TEXT = '#6B7280';
const DARK_TEXT = '#111827';
const SOFT_BG = '#F9FAFB';

export default function JobDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { id } = route.params || {};
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await JobService.getJobById(id);
        setJob(data || DUMMY_JOB);
      } catch {
        setJob(DUMMY_JOB);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const DUMMY_JOB = {
    id: 1,
    title: 'Senior Product Designer',
    company_name: 'Netflix',
    location: 'Remote',
    job_type: 'Full-time',
    experience_level: 'Mid-Senior',
    salary_min: '140k',
    salary_max: '180k',
    applicant_count: 48,
    posted_at: '2 days ago',
    company_logo: 'https://logo.clearbit.com/netflix.com',
    featured_image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    description: 'At Netflix, we connect people with stories they love. We are looking for a Senior Product Designer to join our inclusive team and help shape the next generation of entertainment discovery.\n\nYou will work on high-impact features that are used by hundreds of millions of people worldwide. This is a fully remote position with a strong emphasis on collaboration and craft.',
    match: '92%',
  };

  const onShare = async () => {
    try {
      await Share.share({ message: `Check out this opportunity: ${job.title} at ${job.company_name}` });
    } catch {}
  };

  if (loading) return (
    <ScreenWrapper backgroundColor="white" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={BLUE} size="large" />
    </ScreenWrapper>
  );

  const salaryDisplay = job.salary_min && job.salary_max
    ? `$${job.salary_min} – $${job.salary_max}`
    : job.salary_min ? `From $${job.salary_min}` : null;

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={SOFT_BG}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ─── FEATURED IMAGE HEADER ─── */}
        <View style={styles.imageHeader}>
          <Image
            source={{ uri: job.featured_image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' }}
            style={styles.headerImg}
          />
          <View style={[styles.headerOverlay, { paddingTop: insets.top + 10 }]}>
            <HStack justify="space-between" items="center" px={16}>
              <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.blurBtn}>
                <ChevronLeft size={22} color="white" />
              </TouchableOpacity>
              <HStack space="md">
                <TouchableOpacity onPress={() => setIsSaved(!isSaved)} style={styles.blurBtn}>
                  <Bookmark size={20} color={isSaved ? BLUE : 'white'} fill={isSaved ? BLUE : 'transparent'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onShare} style={styles.blurBtn}>
                  <Share2 size={20} color="white" />
                </TouchableOpacity>
              </HStack>
            </HStack>
          </View>
        </View>

        {/* ─── JOB IDENTITY ─── */}
        <Box bg="white" px={20} pt={24} pb={20} borderBottomLeft={30} borderBottomRight={30} style={styles.mainCard}>
          {/* Logo + Company */}
          <HStack items="center" space="sm" mb={16}>
            <Avatar
              source={{ uri: job.company_logo }}
              size="lg"
              rounded={12}
              style={styles.companyLogo}
            />
            <VStack flex={1}>
              <Text fontSize={15} fontWeight="800" color={DARK_TEXT}>{job.company_name}</Text>
              <HStack items="center" mt={2}>
                <Clock size={12} color={GRAY_TEXT} />
                <Text fontSize={12} color={GRAY_TEXT} ml={4}>Posted {job.posted_at || '2 days ago'}</Text>
              </HStack>
            </VStack>
            <Box bg="#DBEAFE" px={10} py={4} rounded={8}>
               <Text fontSize={12} fontWeight="700" color={BLUE}>Active</Text>
            </Box>
          </HStack>

          {/* Job Title */}
          <Text fontSize={26} fontWeight="900" color={DARK_TEXT} mb={12} lineHeight={32}>
            {job.title}
          </Text>

          {/* Key Metadata Chips */}
          <HStack flexWrap="wrap" space="sm" mb={20}>
            <View style={styles.metaChip}>
              <MapPin size={14} color={BLUE} />
              <Text fontSize={13} fontWeight="600" color={DARK_TEXT} ml={6}>{job.location}</Text>
            </View>
            <View style={styles.metaChip}>
              <Briefcase size={14} color={BLUE} />
              <Text fontSize={13} fontWeight="600" color={DARK_TEXT} ml={6}>{job.job_type}</Text>
            </View>
            {salaryDisplay && (
              <View style={styles.metaChip}>
                <CircleDollarSign size={14} color="#10B981" />
                <Text fontSize={13} fontWeight="600" color={DARK_TEXT} ml={6}>{salaryDisplay}</Text>
              </View>
            )}
          </HStack>

          {/* Match Badge */}
          {job.match && (
            <HStack
              bg="#ECFDF5"
              p={16}
              rounded={20}
              items="center"
              space="sm"
              style={{ borderWidth: 1, borderColor: '#A7F3D0' }}
            >
              <BadgeCheck size={20} color="#059669" />
              <VStack flex={1}>
                <Text fontSize={14} color="#065F46" fontWeight="800">
                  {job.match} match
                </Text>
                <Text fontSize={12} color="#065F46" mt={2}>
                  Your skills align perfectly with this role.
                </Text>
              </VStack>
            </HStack>
          )}
        </Box>

        {/* ─── ABOUT THE JOB ─── */}
        <Box px={20} pt={28} pb={20}>
          <Text fontSize={18} fontWeight="900" color={DARK_TEXT} mb={14}>About the vacancy</Text>
          <Text fontSize={15} color="#4B5563" style={styles.bodyText}>
            {job.description}
          </Text>
          <TouchableOpacity style={styles.readMoreBtn}>
            <Text fontSize={14} fontWeight="800" color={BLUE}>Read entire description</Text>
            <ChevronRight size={14} color={BLUE} />
          </TouchableOpacity>
        </Box>

        {/* ─── COMPANY SECTION ─── */}
        <Box px={20} pt={10} pb={40}>
          <Text fontSize={18} fontWeight="900" color={DARK_TEXT} mb={16}>Company details</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.companyProfileCard}
            onPress={() => navigation?.navigate('CompanyDetail')}
          >
            <HStack items="center" space="md">
               <Avatar source={{ uri: job.company_logo }} size="md" rounded={12} />
               <VStack flex={1}>
                 <Text fontSize={16} fontWeight="800" color={DARK_TEXT}>{job.company_name}</Text>
                 <Text fontSize={13} color={GRAY_TEXT} mt={2}>Entertainment • 10k+ employees</Text>
               </VStack>
               <ChevronRight size={20} color="#D1D5DB" />
            </HStack>
            
            <HStack mt={16} pt={16} style={styles.borderTop} justify="space-between">
               <HStack items="center">
                  <Globe size={14} color={BLUE} />
                  <Text fontSize={14} color={BLUE} fontWeight="700" ml={6}>Official Website</Text>
               </HStack>
               <HStack items="center">
                  <Users size={14} color={GRAY_TEXT} />
                  <Text fontSize={14} color={GRAY_TEXT} fontWeight="600" ml={6}>48 Alumni</Text>
               </HStack>
            </HStack>
          </TouchableOpacity>
        </Box>

      </ScrollView>

      {/* ─── STICKY FOOTER ─── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <HStack space="md">
           <TouchableOpacity style={styles.secondaryBtn}>
              <Bookmark size={20} color={DARK_TEXT} />
           </TouchableOpacity>
           <TouchableOpacity 
             style={styles.primaryBtn}
             onPress={() => navigation?.navigate('ApplyForm', { job })}
           >
              <Text fontSize={16} fontWeight="900" color="white">Apply for this role</Text>
           </TouchableOpacity>
        </HStack>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  imageHeader: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  headerImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  blurBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  mainCard: {
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  companyLogo: {
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  bodyText: {
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  companyProfileCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: BLUE,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
