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
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button, Heading } from '../../components/ui';
import RecruiterActionSheet from '../../components/recruiter/RecruiterActionSheet';
import { ApplicationStatus } from '../../screens/jobProvider/ApplicantsScreen';
import Toast from 'react-native-toast-message';

const BLUE = '#0A66C2'; 
const GRAY_TEXT = '#666666';
const SOFT_BG = '#F3F2EF';

export default function ApplicantDetailScreen({ route, navigation }: { route: any; navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { applicant } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const handleAction = async (status: ApplicationStatus) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      Toast.show({ type: 'success', text1: 'Success', text2: `Status changed to ${status}` });
      setActionSheetVisible(false);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error updating status' });
    } finally {
      setLoading(false);
    }
  };

  const SectionTitle = ({ title }: { title: string }) => (
     <HStack items="center" mb={12} space="sm">
        <Text fontSize={12} fontWeight="700" color={GRAY_TEXT} letterSpacing={0.5}>{title.toUpperCase()}</Text>
     </HStack>
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
            <Heading fontSize={18} fontWeight="700" color="#000000" ml={16}>Candidate Profile</Heading>
          </HStack>
          <TouchableOpacity>
            <MoreVertical size={20} color={GRAY_TEXT} />
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
         {/* Identity Section */}
         <Box p={20} borderBottom={1} borderColor="#F0F0F0">
            <HStack items="center" space="lg">
               <Avatar source={{ uri: applicant?.seeker_detail?.avatar || 'https://i.pravatar.cc/150?u=a1' }} size="xl" rounded={12} />
               <VStack flex={1}>
                  <Heading fontSize={22} fontWeight="800" color="#000000">{applicant?.seeker_detail?.full_name || 'Anupama Rai'}</Heading>
                  <Text fontSize={16} color="#000000" mt={2}>{applicant?.seeker_detail?.job_title || 'Lead Product Designer'}</Text>
                  <HStack mt={8} items="center" space="xs">
                     <MapPin size={14} color={GRAY_TEXT} />
                     <Text fontSize={14} color={GRAY_TEXT}>Kathmandu, Nepal</Text>
                  </HStack>
               </VStack>
            </HStack>

            <HStack mt={24} space="md">
               <Button 
                  label="Update Pipeline" 
                  onPress={() => setActionSheetVisible(true)} 
                  variant="solid"
                  style={{ backgroundColor: BLUE, flex: 1, height: 40, borderRadius: 20 }}
                  textStyle={{ fontWeight: '700', fontSize: 13 }}
               />
               <TouchableOpacity 
                  onPress={() => navigation?.navigate('ChatDetail', { 
                    recipientId: applicant?.seeker, 
                    recipientName: applicant?.seeker_detail?.full_name || 'Candidate', 
                    recipientAvatar: applicant?.seeker_detail?.avatar 
                  })}
                  style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: BLUE, alignItems: 'center', justifyContent: 'center' }}
               >
                  <MessageSquare size={18} color={BLUE} />
               </TouchableOpacity>
               <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: BLUE, alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={18} color={BLUE} />
               </TouchableOpacity>
            </HStack>
         </Box>

         {/* Candidate Details */}
         <VStack p={20} space="xl">
            <VStack>
               <SectionTitle title="Application Metadata" />
               <HStack space="md" flexWrap="wrap">
                  <HStack bg="#EDF3F8" px={10} py={6} rounded={6} items="center" space="xs" mb={8}>
                     <Clock size={12} color={BLUE} />
                     <Text fontSize={12} fontWeight="700" color={BLUE}>Applied 2d ago</Text>
                  </HStack>
                  <HStack bg="#F3F2EF" px={10} py={6} rounded={6} items="center" space="xs" mb={8}>
                     <ShieldCheck size={12} color={GRAY_TEXT} />
                     <Text fontSize={12} fontWeight="700" color={GRAY_TEXT}>Verified Profile</Text>
                  </HStack>
               </HStack>
            </VStack>

            <VStack>
               <SectionTitle title="Contact Information" />
               <VStack space="md">
                  <HStack items="center" space="md">
                     <Box bg={SOFT_BG} p={8} rounded={8}>
                        <Phone size={18} color={GRAY_TEXT} />
                     </Box>
                     <Text fontSize={15} color="#000000" fontWeight="600">+977 9801234567</Text>
                  </HStack>
                  <HStack items="center" space="md">
                     <Box bg={SOFT_BG} p={8} rounded={8}>
                        <Mail size={18} color={GRAY_TEXT} />
                     </Box>
                     <Text fontSize={15} color="#000000" fontWeight="600">anupama.rai@example.com</Text>
                  </HStack>
               </VStack>
            </VStack>

            <VStack>
               <SectionTitle title="Experience Highlights" />
               <HStack space="md" items="flex-start">
                  <Box bg="#EDF3F8" p={10} rounded={8}>
                     <Briefcase size={20} color={BLUE} />
                  </Box>
                  <VStack flex={1}>
                     <Text fontSize={15} fontWeight="700" color="#000000">4.5 Years of Professional Design</Text>
                     <Text fontSize={14} color={GRAY_TEXT} mt={4}>Previously Lead Designer at TechHive Systems. Expert in Figma, React components, and user-centric systems.</Text>
                  </VStack>
               </HStack>
            </VStack>

            <VStack>
               <SectionTitle title="Core Competencies" />
               <HStack space="sm" flexWrap="wrap">
                  {['Figma', 'React', 'Product Design', 'Visual Systems', 'Research', 'Agile'].map(skill => (
                     <Box key={skill} px={12} py={6} rounded={16} bg="white" border={1} borderColor="#E0E0E0">
                        <Text fontSize={12} fontWeight="700" color={GRAY_TEXT}>{skill}</Text>
                     </Box>
                  ))}
               </HStack>
            </VStack>

            <VStack>
               <SectionTitle title="Attached Documents" />
               <TouchableOpacity style={{ borderStyle: 'dashed', borderWidth: 1, borderColor: BLUE, borderRadius: 12, padding: 16, backgroundColor: '#EDF3F8' }}>
                  <HStack items="center" justify="space-between">
                     <HStack items="center" space="md">
                        <Box bg="white" p={8} rounded={8}>
                           <ExternalLink size={18} color={BLUE} />
                        </Box>
                        <VStack>
                           <Text fontSize={14} fontWeight="700" color="#000000">Resume_Anupama_Giri.pdf</Text>
                           <Text fontSize={12} color={GRAY_TEXT}>PDF Document • 1.2 MB</Text>
                        </VStack>
                     </HStack>
                     <Box style={{ transform: [{ rotate: '180deg' }] }}>
                        <ChevronLeft size={16} color={BLUE} />
                     </Box>
                  </HStack>
               </TouchableOpacity>
            </VStack>
         </VStack>
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
