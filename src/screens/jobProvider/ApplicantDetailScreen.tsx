import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft as ChevronLeftIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon,
  GraduationCap as GraduationCapIcon,
  Briefcase as BriefcaseIcon,
  MoreVertical as MoreVerticalIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Clock as ClockIcon,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import RecruiterActionSheet from '../../components/recruiter/RecruiterActionSheet';
import { ApplicationStatus } from '../../screens/jobProvider/ApplicantsScreen';
import Toast from 'react-native-toast-message';

const BLUE = '#0A66C2'; 
const PROMOTED_GREEN = '#057642';
const GRAY_BG = '#F3F2EF';

export default function ApplicantDetailScreen({ route, navigation }: { route: any; navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { applicant } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const handleAction = async (status: ApplicationStatus) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 1000));
      Toast.show({ type: 'success', text1: 'Status Updated', text2: `Candidate moved to ${status}` });
      setActionSheetVisible(false);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Action failed' });
    } finally {
      setLoading(false);
    }
  };

  const InfoRow = ({ icon: Icon, label, value, isLink = false }: any) => (
    <HStack items="flex-start" mb={16} space="md">
       <Icon size={20} color="#666666" />
       <VStack flex={1}>
          <Text fontSize={13} fontWeight="700" color="#666666">{label}</Text>
          <Text fontSize={15} color={isLink ? BLUE : '#000000'} mt={2} fontWeight={isLink ? '700' : '400'}>
            {value || 'Not provided'}
          </Text>
       </VStack>
    </HStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="#FFFFFF">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <Box px={16} pt={insets.top + 12} py={12} bg="white" borderBottom={1} borderColor="#E0E0E0">
         <HStack items="center" justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation?.goBack()} style={{ marginRight: 16 }}>
                  <ChevronLeftIcon size={24} color="#000000" strokeWidth={2} />
               </TouchableOpacity>
               <Text fontSize={18} fontWeight="700" color="#000000">Application Detail</Text>
            </HStack>
            <TouchableOpacity>
               <MoreVerticalIcon size={24} color="#666666" />
            </TouchableOpacity>
         </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, backgroundColor: GRAY_BG }}>
         {/* Profile Card */}
         <Box bg="white" p={20} mb={8}>
            <HStack items="center">
               <Avatar source={{ uri: 'https://i.pravatar.cc/150?u=candidate' }} style={{ width: 80, height: 80, borderRadius: 40 }} />
               <VStack ml={16} flex={1}>
                  <Text fontSize={20} fontWeight="700" color="#000000">{applicant?.seeker_detail?.full_name || 'Anupama Rai'}</Text>
                  <Text fontSize={16} color="#000000" mt={4}>{applicant?.seeker_detail?.job_title || 'Product Designer'}</Text>
                  <HStack mt={8} items="center" space="xs">
                     <MapPinIcon size={14} color="#666666" />
                     <Text fontSize={14} color="#666666">Kathmandu, Nepal</Text>
                  </HStack>
               </VStack>
            </HStack>
            
            <HStack mt={24} space="md">
               <Button 
                  label="Update Status" 
                  onPress={() => setActionSheetVisible(true)} 
                  flex={1} 
                  bg={BLUE}
                  h={40}
               />
               <Button 
                  label="Message" 
                  onPress={() => navigation?.navigate('ChatDetail', { recipientId: applicant?.seeker, recipientName: applicant?.seeker_detail?.full_name || 'Candidate', recipientAvatar: applicant?.seeker_detail?.avatar })} 
                  flex={1} 
                  outline 
                  color={BLUE} 
                  borderColor={BLUE}
                  h={40}
               />
            </HStack>
         </Box>

         {/* Summary Sections */}
         <Box bg="white" p={20} mb={8}>
            <Text fontSize={16} fontWeight="700" color="#000000" mb={12}>Candidate Info</Text>
            <InfoRow icon={PhoneIcon} label="Phone" value="+977 9801234567" isLink />
            <InfoRow icon={MailIcon} label="Email" value="anupama.rai@example.com" isLink />
            <InfoRow icon={ClockIcon} label="Applied" value="2 days ago • Job ID #1204" />
         </Box>

         <Box bg="white" p={20} mb={8}>
            <Text fontSize={16} fontWeight="700" color="#000000" mb={16}>Professional Brief</Text>
            <HStack items="flex-start" mb={20} space="md">
               <BriefcaseIcon size={24} color="#666666" />
               <VStack flex={1}>
                  <Text fontSize={15} fontWeight="700" color="#000000">Experience</Text>
                  <Text fontSize={14} color="#666666" mt={4}>4.5 years total experience</Text>
                  <VStack mt={12} space="sm">
                     <VStack>
                        <Text fontSize={14} fontWeight="700" color="#1C1E21">Lead Designer</Text>
                        <Text fontSize={13} color="#666666">TechHive • 2 yrs 4 mos</Text>
                     </VStack>
                  </VStack>
               </VStack>
            </HStack>
            
            <HStack items="flex-start" space="md">
               <GraduationCapIcon size={24} color="#666666" />
               <VStack flex={1}>
                  <Text fontSize={15} fontWeight="700" color="#000000">Education</Text>
                  <Text fontSize={14} color="#666666" mt={4}>BSc Computer Science</Text>
                  <Text fontSize={13} color="#666666" mt={2}>Tribhuvan University</Text>
               </VStack>
            </HStack>
         </Box>

         <Box bg="white" p={20}>
            <Text fontSize={16} fontWeight="700" color="#000000" mb={12}>Skills Matching</Text>
            <HStack style={{ flexWrap: 'wrap', gap: 8 }}>
               {['Figma', 'React', 'Agile', 'Product Strategy'].map(s => (
                  <Box key={s} px={12} py={6} rounded={4} bg={GRAY_BG} border={1} borderColor="#E0E0E0">
                     <Text fontSize={12} fontWeight="700" color="#666666">{s}</Text>
                  </Box>
               ))}
            </HStack>
         </Box>
      </ScrollView>

      <RecruiterActionSheet 
        visible={actionSheetVisible}
        candidateName={applicant?.seeker_detail?.full_name}
        currentStatus={applicant?.status || 'screening'}
        onClose={() => setActionSheetVisible(false)}
        onAction={handleAction}
        loading={loading}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({});




