import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Pencil,
  Users,
  MapPin,
  DollarSign,
  Eye,
  Calendar,
  Share2,
  Briefcase,
  CheckCircle,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Button, Divider } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';

const BLUE = '#0A66C2';
const GRAY_BG = '#F3F2EF';

export default function JobDetailProviderScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { job } = route.params || {};

  const DUMMY_JOB = {
    id: job?.id || 1,
    title: job?.title || 'Senior Protocol Engineer',
    location: job?.location || 'Remote',
    salary_min: job?.salary_min || 120000,
    salary_max: job?.salary_max || 150000,
    status: job?.status || 'Active',
    applicant_count: job?.applicant_count || 24,
    views: job?.views || 142,
    posted_at: job?.posted_at || '3 days ago',
    job_type: job?.job_type || 'Full-time',
    experience_level: job?.experience_level || 'Senior',
    description: job?.description || 'We are looking for an experienced Protocol Engineer to lead the development of our core infrastructure. You will work closely with a cross-functional team to design, implement, and scale mission-critical systems.\n\nKey Responsibilities:\n• Architect and maintain backend services and APIs\n• Lead code reviews and technical discussions\n• Collaborate with product managers to define technical strategies\n• Mentor junior engineers',
    requirements: job?.requirements || ['5+ years experience', 'Proficiency in system design', 'Strong communication skills'],
  };

  const InfoBadge = ({ icon: Icon, label }: any) => (
    <HStack items="center" bg="#F3F2EF" px={12} py={6} rounded={20} mr={8} mb={8}>
      <Icon size={14} color="#666666" />
      <Text fontSize={13} color="#475569" ml={6} fontWeight="600">{label}</Text>
    </HStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />

      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text fontSize={18} fontWeight="700" color="#111827" ml={12}>Job Details</Text>
          </HStack>
          <HStack space="sm">
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('EditJob', { job: DUMMY_JOB })}>
              <Pencil size={20} color={BLUE} />
            </TouchableOpacity>
          </HStack>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Box bg="white" p={20} rounded={16} mb={12}>
          <HStack items="center" mb={16}>
            <Box bg="#EDF3F8" p={14} rounded={14}>
              <Briefcase size={28} color={BLUE} />
            </Box>
            <VStack ml={14} flex={1}>
              <Text fontSize={20} fontWeight="800" color="#111827">{DUMMY_JOB.title}</Text>
              <HStack items="center" mt={4}>
                <MapPin size={14} color="#6B7280" />
                <Text fontSize={14} color="#6B7280" ml={4}>{DUMMY_JOB.location}</Text>
              </HStack>
            </VStack>
          </HStack>

          <View style={styles.badgeRow}>
            <InfoBadge icon={Briefcase} label={DUMMY_JOB.job_type} />
            <InfoBadge icon={CheckCircle} label={DUMMY_JOB.experience_level} />
            <InfoBadge icon={Calendar} label={`Posted ${DUMMY_JOB.posted_at}`} />
          </View>

          <Divider color="#F3F2EF" my={16} />

          {/* Metrics */}
          <HStack justify="space-around">
            <VStack items="center">
              <Text fontSize={24} fontWeight="800" color={BLUE}>{DUMMY_JOB.applicant_count}</Text>
              <Text fontSize={12} color="#6B7280" mt={2}>Applicants</Text>
            </VStack>
            <Box w={1} bg="#E5E7EB" />
            <VStack items="center">
              <Text fontSize={24} fontWeight="800" color="#111827">{DUMMY_JOB.views}</Text>
              <Text fontSize={12} color="#6B7280" mt={2}>View</Text>
            </VStack>
            <Box w={1} bg="#E5E7EB" />
            <VStack items="center">
              <Text fontSize={24} fontWeight="800" color="#059669">{DUMMY_JOB.status === 'Active' ? '✓' : '✗'}</Text>
              <Text fontSize={12} color="#6B7280" mt={2}>{DUMMY_JOB.status}</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Salary */}
        <Box bg="white" p={16} rounded={16} mb={12}>
          <HStack items="center" mb={4}>
            <DollarSign size={18} color={BLUE} />
            <Text fontSize={16} fontWeight="700" color="#111827" ml={8}>Compensation</Text>
          </HStack>
          <Text fontSize={22} fontWeight="800" color="#059669" mt={8}>
            ${(DUMMY_JOB.salary_min / 1000).toFixed(0)}k – ${(DUMMY_JOB.salary_max / 1000).toFixed(0)}k / year
          </Text>
          <Text fontSize={12} color="#6B7280" mt={4}>Based on experience and role</Text>
        </Box>

        {/* Description */}
        <Box bg="white" p={16} rounded={16} mb={12}>
          <Text fontSize={16} fontWeight="700" color="#111827" mb={12}>Job Description</Text>
          <Text fontSize={14} color="#475569" lineHeight={22}>{DUMMY_JOB.description}</Text>
        </Box>

        {/* Action Buttons */}
        <VStack space="md" mb={40}>
          <Button
            label={`View ${DUMMY_JOB.applicant_count} Applicants`}
            onPress={() => navigation.navigate('Applicants', { jobId: DUMMY_JOB.id })}
            style={{ backgroundColor: BLUE, height: 52, borderRadius: 26 }}
            textStyle={{ fontSize: 16, fontWeight: '800' }}
          />
          <Button
            label="Edit This Posting"
            variant="outline"
            onPress={() => navigation.navigate('EditJob', { job: DUMMY_JOB })}
            style={{ borderColor: BLUE, height: 52, borderRadius: 26 }}
            textStyle={{ color: BLUE, fontSize: 16, fontWeight: '800' }}
          />
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EDF3F8', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
