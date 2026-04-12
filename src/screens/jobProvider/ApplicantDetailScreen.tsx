import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  MoreVertical,
  Clock,
  ExternalLink,
  MessageSquare,
  UserPlus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button, Heading } from '../../components/ui';
import RecruiterActionSheet from '../../components/recruiter/RecruiterActionSheet';
import { ApplicationStatus } from '../../screens/jobProvider/ApplicantsScreen';
import Toast from 'react-native-toast-message';
import { JobService } from '../../services/api/jobs';
import { ProfileService } from '../../services/api/profile';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

export default function ApplicantDetailScreen({ route, navigation }: { route: any; navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { applicant } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [seekerProfile, setSeekerProfile] = useState<any>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (applicant?.seeker) {
        try {
          const res = await ProfileService.getSeekerProfile(applicant.seeker);
          setSeekerProfile(res);
        } catch (e) {
          console.warn('Failed to load seeker profile', e);
        }
      }
    };
    fetchProfile();
  }, [applicant?.seeker]);

  const handleAction = async (status: ApplicationStatus) => {
    setLoading(true);
    try {
      if (applicant) {
        await JobService.updateApplicationStatus(applicant.id, status as any);
        applicant.status = status;
        
        // If the new status is an interview type, navigate to scheduling
        if (status === 'online_meeting' || status === 'onsite_meeting') {
          navigation.navigate('ScheduleMeeting', { 
            applicationId: applicant.id,
            applicantName: applicant.seeker_name,
            applicantAvatar: applicant.seeker_avatar,
            meetingType: status === 'online_meeting' ? 'online' : 'onsite',
            isNewMeeting: true 
          });
        }
      }
      Toast.show({ type: 'success', text1: 'Success', text2: `Status updated to ${status}` });
      setActionSheetVisible(false);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error updating status' });
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
     <HStack items="center" mb={12} pt={8}>
        <Text fontSize={13} fontWeight="700" color="#111827" letterSpacing={0.5}>{title}</Text>
     </HStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center" justify="space-between" px={16}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
            <ChevronLeft size={22} color="black" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="700" color="#111827">Candidate Profile</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <MoreVertical size={20} color="black" />
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
         {/* Profile Card */}
         <Box p={20} bg="white">
            <HStack items="center" space="lg">
               <Box>
                  <Avatar source={{ uri: applicant?.seeker_avatar || 'https://i.pravatar.cc/150?u=a1' }} size={80} />
                  <Box position="absolute" bottom={-5} right={-5} bg="#4ADE80" w={20} h={20} rounded={10} border={2} borderColor="white" />
               </Box>
               <VStack flex={1}>
                  <Text fontSize={22} fontWeight="800" color="#111827">{applicant?.seeker_name || 'Candidate Name'}</Text>
                  <Text fontSize={15} color={GRAY_TEXT} mt={2}>{applicant?.job_title || 'Software Engineer'}</Text>
                  <HStack mt={8} items="center" space="xs">
                     <MapPin size={14} color={GRAY_TEXT} />
                     <Text fontSize={13} color={GRAY_TEXT}>Kathmandu, Nepal</Text>
                  </HStack>
               </VStack>
            </HStack>

            <Box bg="#F0F2F5" p={12} rounded={12} mt={20}>
               <HStack justify="space-between" items="center">
                  <VStack>
                     <Text fontSize={11} fontWeight="700" color={GRAY_TEXT} textTransform="uppercase">Match Score</Text>
                     <HStack items="center" mt={4}>
                        <Sparkles size={16} color={FB_BLUE} />
                        <Text fontSize={18} fontWeight="800" color={FB_BLUE} ml={6}>{applicant?.match_score || 92}% Match</Text>
                     </HStack>
                  </VStack>
                  <Box bg="white" px={12} py={6} rounded={20}>
                     <Text fontSize={12} fontWeight="700" color="#111827">{applicant?.status || 'In Progress'}</Text>
                  </Box>
               </HStack>
            </Box>

            <HStack mt={20} space="sm">
               <TouchableOpacity 
                  onPress={() => setActionSheetVisible(true)} 
                  style={[styles.mainAction, { flex: 1, backgroundColor: FB_BLUE }]}
               >
                  <Text fontSize={14} fontWeight="700" color="white">Update Status</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                  onPress={() => navigation?.navigate('ChatDetail', { 
                    recipientId: applicant?.seeker, 
                    recipientName: applicant?.seeker_name || 'Candidate', 
                    recipientAvatar: applicant?.seeker_avatar 
                  })}
                  style={styles.iconBtn}
               >
                  <MessageSquare size={20} color="black" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.iconBtn}>
                  <UserPlus size={20} color="black" />
               </TouchableOpacity>
            </HStack>
         </Box>

         {/* Sections */}
         <VStack p={20} space="lg" bg={FB_GRAY} minHeight={500}>
            <VStack>
               <SectionHeader title="Contact Information" />
               <VStack space="sm">
                  <HStack items="center" space="md" bg="white" p={14} rounded={12}>
                     <Mail size={18} color={GRAY_TEXT} />
                     <Text fontSize={14} color="#111827" fontWeight="600">{seekerProfile?.user?.email || applicant?.author_email || 'Not provided'}</Text>
                  </HStack>
                  <HStack items="center" space="md" bg="white" p={14} rounded={12}>
                     <Phone size={18} color={GRAY_TEXT} />
                     <Text fontSize={14} color="#111827" fontWeight="600">{seekerProfile?.phone || 'Not provided'}</Text>
                  </HStack>
               </VStack>
            </VStack>

            <VStack>
               <SectionHeader title="Work Experience" />
               {(seekerProfile?.experience && seekerProfile.experience.length > 0) ? seekerProfile.experience.map((exp: any, idx: number) => (
                 <Box key={idx} bg="white" p={16} rounded={12} mb={12}>
                    <HStack space="md" items="flex-start">
                       <Box bg="#F0F2F5" p={10} rounded={10}>
                          <Briefcase size={20} color={FB_BLUE} />
                       </Box>
                       <VStack flex={1}>
                          <Text fontSize={15} fontWeight="700" color="#111827">{exp.title} @ {exp.company}</Text>
                          <Text fontSize={13} color={GRAY_TEXT} mt={2}>{exp.start_date || 'Past'} - {exp.end_date || 'Present'}</Text>
                          {exp.description && (
                            <Text fontSize={13} color={GRAY_TEXT} mt={8} lineHeight={18}>
                               {exp.description}
                            </Text>
                          )}
                       </VStack>
                    </HStack>
                 </Box>
               )) : (
                 <Box bg="white" p={16} rounded={12}>
                    <Text fontSize={14} color={GRAY_TEXT}>No experience details provided.</Text>
                 </Box>
               )}
            </VStack>

            <VStack>
               <SectionHeader title="Skills" />
               <HStack space="xs" flexWrap="wrap">
                  {(seekerProfile?.skills && seekerProfile.skills.length > 0) ? seekerProfile.skills.map((skill: any) => (
                     <Box key={skill.id || skill.name || skill} px={14} py={8} rounded={20} bg="white" border={1} borderColor="#F0F2F5" mb={8}>
                        <Text fontSize={12} fontWeight="600" color="#111827">{skill.name || skill}</Text>
                     </Box>
                  )) : (
                     <Text fontSize={14} color={GRAY_TEXT} ml={4}>No skills listed.</Text>
                  )}
               </HStack>
            </VStack>

            <VStack>
               <SectionHeader title="Documents" />
               {applicant?.resume ? (
                 <TouchableOpacity style={styles.documentCard}>
                    <HStack items="center" justify="space-between">
                       <HStack items="center" space="md">
                          <Box bg="#F0F2F5" p={10} rounded={10}>
                             <ExternalLink size={20} color={FB_BLUE} />
                          </Box>
                          <VStack>
                             <Text fontSize={14} fontWeight="700" color="#111827">Resume.pdf</Text>
                             <Text fontSize={12} color={GRAY_TEXT}>PDF</Text>
                          </VStack>
                       </HStack>
                       <ChevronRight size={18} color="#D1D5DB" />
                    </HStack>
                 </TouchableOpacity>
               ) : (
                 <Box bg="white" p={16} rounded={12}>
                    <Text fontSize={14} color={GRAY_TEXT}>No documents attached.</Text>
                 </Box>
               )}
            </VStack>
         </VStack>
      </ScrollView>

      <RecruiterActionSheet 
        visible={actionSheetVisible}
        candidateName={applicant?.seeker_name}
        currentStatus={applicant?.status || 'screening'}
        onClose={() => setActionSheetVisible(false)}
        onAction={handleAction}
        loading={loading}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  mainAction: { height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  documentCard: { backgroundColor: 'white', borderRadius: 12, padding: 14 },
});
