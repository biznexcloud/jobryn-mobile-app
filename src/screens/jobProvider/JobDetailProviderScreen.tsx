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

const BLUE = '#0A66C2'; 
const GRAY_TEXT = '#666666';
const SOFT_BG = '#F3F2EF';

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

  const MetricCard = ({ icon: Icon, value, label, color = BLUE }: any) => (
     <VStack items="center" flex={1}>
        <Box bg="#EDF3F8" p={8} rounded={8} mb={8}>
           <Icon size={18} color={color} />
        </Box>
        <Text fontSize={18} fontWeight="800" color="#000000">{value}</Text>
        <Text fontSize={11} fontWeight="700" color={GRAY_TEXT} mt={2}>{label.toUpperCase()}</Text>
     </VStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Clean Header */}
      <Box pt={insets.top + 10} pb={12} bg="white" borderBottom={1} borderColor="#E0E0E0">
        <HStack items="center" justify="space-between" px={16}>
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation?.goBack()}>
              <ChevronLeft size={24} color="#000000" />
            </TouchableOpacity>
            <Heading fontSize={18} fontWeight="700" color="#000000" ml={16}>Opportunity Management</Heading>
          </HStack>
          <HStack space="md">
             <TouchableOpacity onPress={() => navigation?.navigate('EditJob', { job: DUMMY_JOB })}>
                <Pencil size={20} color={BLUE} />
             </TouchableOpacity>
             <TouchableOpacity>
                <MoreVertical size={20} color={GRAY_TEXT} />
             </TouchableOpacity>
          </HStack>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
         {/* Identity Section */}
         <Box p={20} borderBottom={1} borderColor="#F0F0F0">
            <HStack space="md" items="flex-start" mb={20}>
               <Box bg="#EDF3F8" p={12} rounded={12}>
                  <Briefcase size={28} color={BLUE} />
               </Box>
               <VStack flex={1}>
                  <Heading fontSize={22} fontWeight="800" color="#000000">{DUMMY_JOB.title}</Heading>
                  <HStack items="center" mt={4} space="xs">
                     <MapPin size={14} color={GRAY_TEXT} />
                     <Text fontSize={14} color={GRAY_TEXT}>{DUMMY_JOB.location} • {DUMMY_JOB.job_type}</Text>
                  </HStack>
               </VStack>
            </HStack>

            <Divider color="#F0F0F0" mb={20} />

            {/* Performance Metrics */}
            <HStack justify="space-between" items="center">
               <MetricCard icon={Users} value={DUMMY_JOB.applicant_count} label="Candidates" />
               <MetricCard icon={Eye} value={DUMMY_JOB.views} label="Reach" />
               <MetricCard icon={CheckCircle2} value={DUMMY_JOB.status} label="Status" color="#057642" />
            </HStack>
         </Box>

         <VStack p={20} space="xl">
            {/* Comp Section */}
            <VStack>
               <HStack items="center" space="sm" mb={12}>
                  <CircleDollarSign size={16} color={GRAY_TEXT} />
                  <Text fontSize={12} fontWeight="700" color={GRAY_TEXT} letterSpacing={0.5}>COMPENSATION RANGE</Text>
               </HStack>
               <Text fontSize={20} fontWeight="800" color="#057642">
                  ${(DUMMY_JOB.salary_min / 1000).toFixed(0)}k – ${(DUMMY_JOB.salary_max / 1000).toFixed(0)}k <Text fontSize={14} color={GRAY_TEXT}>/ Annual</Text>
               </Text>
            </VStack>

            <Divider color="#F0F0F0" />

            {/* Description Section */}
            <VStack>
               <Text fontSize={16} fontWeight="800" color="#000000" mb={12}>Mission Description</Text>
               <Text fontSize={15} color="#000000" lineHeight={24}>
                  {DUMMY_JOB.description}
               </Text>
            </VStack>

            {/* Admin Actions */}
            <VStack mt={20} space="md">
               <Button 
                  title={`Manage ${DUMMY_JOB.applicant_count} Candidates`} 
                  onPress={() => navigation?.navigate('Applicants', { jobId: DUMMY_JOB.id })} 
                  style={{ backgroundColor: BLUE, height: 48, borderRadius: 24 }}
                  textStyle={{ fontWeight: '800' }}
               />
               <Button 
                  title="Update Posting" 
                  onPress={() => navigation?.navigate('EditJob', { job: DUMMY_JOB })} 
                  variant="outline"
                  style={{ borderColor: BLUE, height: 48, borderRadius: 24 }}
                  textStyle={{ color: BLUE, fontWeight: '800' }}
               />
               <Button 
                  label="Share Opportunity" 
                  onPress={() => {}} 
                  variant="ghost"
                  textStyle={{ color: GRAY_TEXT, fontWeight: '700' }}
               />
            </VStack>
         </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({});
