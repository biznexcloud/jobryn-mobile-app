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
  CircleDollarSign,
  Eye,
  Calendar,
  Share2,
  Briefcase,
  CheckCircle2,
  MoreVertical,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Button, Divider, Heading } from '../../components/ui';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

export default function JobDetailProviderScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { job } = route.params || {};

  const DUMMY_JOB = {
    id: job?.id || 1,
    title: job?.title || 'Lead Protocol Architect',
    location: job?.location || 'Remote (Global)',
    salary_min: job?.salary_min || 120000,
    salary_max: job?.salary_max || 155000,
    status: job?.status || 'Active',
    applicant_count: job?.applicant_count || 32,
    views: job?.views || 840,
    posted_at: job?.posted_at || '3 days ago',
    job_type: job?.job_type || 'Full-time',
    experience_level: job?.experience_level || 'Senior-Lead',
    description: job?.description || 'We are looking for a visionary Protocol Architect to lead our core infrastructure division. You will be responsible for the architectural integrity and scalability of our mission-critical decentralized services.\n\nKey Responsibilities:\n• Lead the technical design of scalable protocols\n• Direct high-impact engineering projects\n• Interface with strategic partners on technical integration\n• Guide the professional growth of senior engineering staff',
  };

  const MetricCard = ({ icon: Icon, value, label, color = FB_BLUE }: any) => (
     <VStack items="center" flex={1} bg={FB_GRAY} p={12} rounded={16} mx={4}>
        <Icon size={18} color={color} />
        <Text fontSize={18} fontWeight="800" color="#111827" mt={8}>{value}</Text>
        <Text fontSize={10} fontWeight="700" color={GRAY_TEXT} mt={2}>{label.toUpperCase()}</Text>
     </VStack>
  );

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
          <TouchableOpacity onPress={() => navigation?.navigate('EditJob', { job: DUMMY_JOB })} style={styles.headerIcon}>
            <Pencil size={18} color={FB_BLUE} />
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
         {/* Identity Section */}
         <Box p={20}>
            <HStack space="md" items="center" mb={24}>
               <Box bg="#F0F9FF" w={56} h={56} rounded={16} items="center" justify="center">
                  <Briefcase size={28} color={FB_BLUE} />
               </Box>
               <VStack flex={1}>
                  <Text fontSize={22} fontWeight="800" color="#111827">{DUMMY_JOB.title}</Text>
                  <HStack items="center" mt={4} space="xs">
                     <MapPin size={14} color={GRAY_TEXT} />
                     <Text fontSize={14} color={GRAY_TEXT}>{DUMMY_JOB.location} • {DUMMY_JOB.job_type}</Text>
                  </HStack>
               </VStack>
            </HStack>

            {/* Performance Metrics */}
            <HStack justify="space-between" items="center">
               <MetricCard icon={Users} value={DUMMY_JOB.applicant_count} label="Applied" />
               <MetricCard icon={Eye} value={DUMMY_JOB.views} label="Views" />
               <MetricCard icon={CheckCircle2} value={DUMMY_JOB.status} label="Status" color="#10B981" />
            </HStack>
         </Box>

         <Divider color="#F9FAFB" h={8} />

         <VStack p={20} space="xl">
            {/* Comp Section */}
            <VStack>
               <Text fontSize={12} fontWeight="700" color={GRAY_TEXT} mb={8} ml={4}>COMPENSATION</Text>
               <Text fontSize={20} fontWeight="800" color="#10B981">
                  ${(DUMMY_JOB.salary_min / 1000).toFixed(0)}k – ${(DUMMY_JOB.salary_max / 1000).toFixed(0)}k <Text fontSize={14} color={GRAY_TEXT}>/ Annual</Text>
               </Text>
            </VStack>

            <Divider color="#F0F2F5" />

            {/* Description Section */}
            <VStack>
               <Text fontSize={16} fontWeight="800" color="#111827" mb={12}>Description</Text>
               <Text fontSize={15} color="#374151" lineHeight={24}>
                  {DUMMY_JOB.description}
               </Text>
            </VStack>

            {/* Admin Actions */}
            <VStack mt={24} space="md">
               <TouchableOpacity 
                 style={styles.primaryBtn}
                 onPress={() => navigation?.navigate('Applicants', { jobId: DUMMY_JOB.id })} 
               >
                 <Text fontSize={16} fontWeight="700" color="white">View {DUMMY_JOB.applicant_count} Applicants</Text>
               </TouchableOpacity>

               <TouchableOpacity 
                 style={styles.outlineBtn}
                 onPress={() => navigation?.navigate('EditJob', { job: DUMMY_JOB })} 
               >
                 <Text fontSize={16} fontWeight="700" color={FB_BLUE}>Edit Job Details</Text>
               </TouchableOpacity>

               <TouchableOpacity style={{ alignItems: 'center', marginTop: 12 }}>
                  <Text fontSize={15} fontWeight="700" color={GRAY_TEXT}>Close Job Posting</Text>
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
