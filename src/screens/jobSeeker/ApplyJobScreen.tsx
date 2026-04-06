import React, { useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  CheckCircle,
  Paperclip,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  CheckCircle2,
  FileText,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import Toast from 'react-native-toast-message';

const BLUE = '#3B82F6';
const GRAY_TEXT = '#6B7280';
const DARK_TEXT = '#111827';
const SOFT_BG = '#F9FAFB';

export default function ApplyJobScreen({ route, navigation }: { route: any; navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { job, showSuccessFlow } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(showSuccessFlow || false);
  const [coverLetter, setCoverLetter] = useState('');

  const handleApply = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 1500));
      setApplied(true);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Submission failed' });
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <ScreenWrapper backgroundColor="white" justify="center" items="center" px={40}>
         <Box bg="#ECFDF5" p={24} rounded={60} mb={32} style={styles.successIconShadow}>
            <CheckCircle2 size={80} color="#10B981" strokeWidth={2} />
         </Box>
         <Text fontSize={28} fontWeight="900" color={DARK_TEXT} textAlign="center" mb={16}>
            Application Sent!
         </Text>
         <Text fontSize={16} color={GRAY_TEXT} textAlign="center" lineHeight={24} px={10}>
            Your profile and materials have been successfully transmitted to the hiring team at <Text fontWeight="700" color={DARK_TEXT}>{job?.company_name || 'the company'}</Text>.
         </Text>
         <Button 
            label="Return to Jobs" 
            onPress={() => navigation.navigate('SeekerDashboard')} 
            mt={48} 
            w="100%"
            style={styles.primaryBtn}
            textStyle={{ fontWeight: '900', fontSize: 16 }}
         />
         <TouchableOpacity onPress={() => navigation.navigate('AppliedJobs')} style={{ marginTop: 20 }}>
            <Text fontSize={15} fontWeight="700" color={BLUE}>Track your application</Text>
         </TouchableOpacity>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={SOFT_BG}>
      <StatusBar barStyle="dark-content" />

      {/* Premium Header */}
      <Box pt={insets.top + 10} pb={20} px={20} bg="white" borderBottomLeft={30} borderBottomRight={30} style={styles.headerCard}>
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
            <ChevronLeft size={22} color={DARK_TEXT} />
          </TouchableOpacity>
          <VStack flex={1} items="center" style={{ marginRight: 44 }}>
             <Text fontSize={18} fontWeight="900" color={DARK_TEXT}>Quick Apply</Text>
          </VStack>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Job Recap Section */}
        <Box bg="white" p={20} rounded={24} mb={24} style={styles.contentCard}>
           <HStack space="md" items="center">
              <Avatar source={{ uri: job?.company_logo }} size="lg" rounded={12} style={styles.companyLogo} />
              <VStack flex={1}>
                 <Text fontSize={18} fontWeight="800" color={DARK_TEXT}>{job?.title || 'Senior Software Engineer'}</Text>
                 <HStack mt={4} space="sm" items="center">
                    <Briefcase size={14} color={BLUE} />
                    <Text fontSize={14} color={GRAY_TEXT}>{job?.company_name || 'Tech Solutions'}</Text>
                 </HStack>
                 <HStack mt={4} space="sm" items="center">
                    <MapPin size={14} color={GRAY_TEXT} />
                    <Text fontSize={13} color={GRAY_TEXT}>{job?.location || 'London, UK'}</Text>
                 </HStack>
              </VStack>
           </HStack>
        </Box>

        <Text fontSize={18} fontWeight="900" color={DARK_TEXT} mb={16}>Contact Information</Text>
        
        <Box bg="white" p={20} rounded={24} mb={32} style={styles.contentCard}>
           <HStack items="center" space="md" mb={20}>
              <Avatar source={{ uri: 'https://i.pravatar.cc/150?u=me' }} size="lg" />
              <VStack ml={12} flex={1}>
                 <Text fontSize={16} fontWeight="800" color={DARK_TEXT}>Jhonson King</Text>
                 <Text fontSize={14} color={GRAY_TEXT} mt={2}>Software Engineer</Text>
              </VStack>
           </HStack>
           <Divider color="#F3F4F6" style={{ marginVertical: 8 }} />
           <HStack items="center" space="md" mt={12}>
              <Box p={10} bg="#F3F4F6" rounded={12}>
                <Mail size={18} color={DARK_TEXT} />
              </Box>
              <Text fontSize={15} fontWeight="600" color={DARK_TEXT}>jhonson.king@example.com</Text>
           </HStack>
           <HStack items="center" space="md" mt={16}>
              <Box p={10} bg="#F3F4F6" rounded={12}>
                <Phone size={18} color={DARK_TEXT} />
              </Box>
              <Text fontSize={15} fontWeight="600" color={DARK_TEXT}>+44 7700 900000</Text>
           </HStack>
        </Box>

        <Text fontSize={18} fontWeight="900" color={DARK_TEXT} mb={16}>Attached Resume</Text>
        <HStack p={16} rounded={20} bg="#EFF6FF" items="center" space="md" mb={32} style={{ borderWidth: 1, borderColor: '#BFDBFE' }}>
           <Box bg="white" p={12} rounded={12}>
              <FileText size={20} color={BLUE} />
           </Box>
           <VStack flex={1}>
              <Text fontSize={15} fontWeight="800" color={DARK_TEXT}>Jhonson_King_Resume.pdf</Text>
              <Text fontSize={13} color={BLUE} mt={2}>Primary Resume</Text>
           </VStack>
        </HStack>

        <Text fontSize={18} fontWeight="900" color={DARK_TEXT} mb={12}>Cover Letter (Optional)</Text>
        <Box mb={40}>
           <TextInput 
              multiline 
              placeholder="Briefly explain why you're a perfect match..." 
              placeholderTextColor="#9CA3AF"
              value={coverLetter}
              onChangeText={setCoverLetter}
              style={styles.textArea}
           />
        </Box>
      </ScrollView>

      {/* Sticky Footer */}
      <Box 
        px={20} 
        pt={16} 
        pb={insets.bottom + 16} 
        bg="white" 
        style={styles.footer}
      >
         <Button 
            label={loading ? "Submitting..." : "Submit Application"} 
            onPress={handleApply} 
            disabled={loading}
            style={[{ backgroundColor: loading ? '#F3F4F6' : BLUE }, styles.submitBtn]}
            textStyle={{ fontWeight: '900', fontSize: 16, color: loading ? '#9CA3AF' : 'white' }}
         />
      </Box>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { 
    padding: 20,
    paddingTop: 30,
  },
  contentCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  companyLogo: {
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  textArea: { 
    minHeight: 140, 
    backgroundColor: 'white',
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 20, 
    padding: 16, 
    textAlignVertical: 'top', 
    fontSize: 15, 
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  footer: {
    borderTopWidth: 1, 
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 15,
  },
  submitBtn: {
    height: 56,
    borderRadius: 20,
  },
  primaryBtn: {
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 20,
  },
  successIconShadow: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  }
});
