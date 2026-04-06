import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  Paperclip,
  Briefcase,
  MapPin,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Button, Heading } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

const BLUE = '#3B82F6'; 
const GRAY_TEXT = '#6B7280';
const DARK_TEXT = '#111827';
const SOFT_BG = '#F9FAFB';

export default function ApplyFormScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { job } = route.params || {};
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState('');

  const handleSubmit = async () => {
    if (!resume) {
      Alert.alert('Resume Required', 'Please upload your professional resume to proceed.');
      return;
    }
    setLoading(true);
    try {
       // Simulate application submission
       setTimeout(() => {
          setLoading(false);
          navigation.navigate('ApplyJob', { job, showSuccessFlow: true });
       }, 1500);
    } catch (e) {
      setLoading(false);
    }
  };

  const InputLabel = ({ label, required = false }: { label: string, required?: boolean }) => (
     <HStack items="center" mb={12} space="xs">
        <Text fontSize={13} fontWeight="800" color={DARK_TEXT} letterSpacing={0.5}>{label.toUpperCase()}</Text>
        {required && <Text color="#EF4444">*</Text>}
     </HStack>
  );

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
             <Text fontSize={18} fontWeight="900" color={DARK_TEXT}>Apply for Role</Text>
          </VStack>
        </HStack>
      </Box>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Job Recap Section */}
          <Box bg="white" p={20} rounded={24} mb={24} style={styles.contentCard}>
             <HStack space="md" items="center">
                <Avatar source={{ uri: job?.company_logo }} size="lg" rounded={12} style={styles.companyLogo} />
                <VStack flex={1}>
                   <Text fontSize={18} fontWeight="800" color={DARK_TEXT}>{job?.title || 'Senior Software Engineer'}</Text>
                   <HStack mt={4} space="sm" items="center">
                      <Briefcase size={14} color={BLUE} />
                      <Text fontSize={14} color={GRAY_TEXT}>{job?.company_name || 'Tech Corp'}</Text>
                   </HStack>
                   <HStack mt={4} space="sm" items="center">
                      <MapPin size={14} color={GRAY_TEXT} />
                      <Text fontSize={13} color={GRAY_TEXT}>{job?.location || 'Remote'}</Text>
                   </HStack>
                </VStack>
             </HStack>
          </Box>

          <Box px={4} mb={24}>
             <Text fontSize={22} fontWeight="900" color={DARK_TEXT} mb={6}>Submit Application</Text>
             <Text fontSize={15} color={GRAY_TEXT}>The company will review your profile and attached documents.</Text>
          </Box>

          {/* Profile Data Review */}
          <Box mb={32}>
             <InputLabel label="Profile Data" />
             <HStack p={16} rounded={20} bg="white" items="center" space="md" style={styles.contentCard}>
                <Avatar source={{ uri: user?.profile_picture }} size="md" />
                <VStack flex={1}>
                   <Text fontSize={16} fontWeight="800" color={DARK_TEXT}>{user?.name || 'Candidate Name'}</Text>
                   <Text fontSize={13} color={GRAY_TEXT} mt={2}>Include profile data</Text>
                </VStack>
                <CheckCircle2 size={24} color="#10B981" />
             </HStack>
          </Box>

          {/* Resume Upload */}
          <Box mb={32}>
             <InputLabel label="Resume Upload" required />
             {!resume ? (
                <TouchableOpacity style={styles.uploadBox} onPress={() => setResume('Resume_Final_2026.pdf')}>
                   <View style={styles.uploadIconContainer}>
                      <Upload size={24} color={BLUE} />
                   </View>
                   <Text fontSize={15} fontWeight="800" color={BLUE} mt={12}>Select PDF Document</Text>
                   <Text fontSize={13} color={GRAY_TEXT} mt={6}>Max 5MB • PDF, DOCX</Text>
                </TouchableOpacity>
             ) : (
                <HStack p={16} rounded={20} bg="#EFF6FF" items="center" space="md" style={{ borderWidth: 1, borderColor: '#BFDBFE' }}>
                   <Box bg="white" p={12} rounded={12}>
                      <FileText size={20} color={BLUE} />
                   </Box>
                   <VStack flex={1}>
                      <Text fontSize={15} fontWeight="800" color={DARK_TEXT}>{resume}</Text>
                      <Text fontSize={13} color={BLUE} mt={2}>Uploaded successfully</Text>
                   </VStack>
                   <TouchableOpacity onPress={() => setResume(null)} style={styles.deleteBtn}>
                      <Trash2 size={18} color="#EF4444" />
                   </TouchableOpacity>
                </HStack>
             )}
          </Box>

          {/* Cover Letter / Additional Info */}
          <Box mb={40}>
             <InputLabel label="Additional Information" />
             <HStack items="center" mb={12} space="xs">
                <Paperclip size={14} color={GRAY_TEXT} />
                <Text fontSize={13} color={GRAY_TEXT}>Add a brief message (Optional)</Text>
             </HStack>
             <TextInput
                placeholder="Why are you a great fit for this role? What makes you unique?"
                placeholderTextColor="#9CA3AF"
                value={coverLetter}
                onChangeText={setCoverLetter}
                multiline
                style={styles.textArea}
             />
          </Box>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Sticky Footer Action */}
      <Box 
        px={20} 
        pt={16} 
        pb={insets.bottom + 16} 
        bg="white" 
        style={styles.footer}
      >
         <Button 
            label={loading ? "Sending..." : "Submit Application"} 
            onPress={handleSubmit} 
            disabled={loading || !resume}
            style={[{ backgroundColor: (loading || !resume) ? '#F3F4F6' : BLUE }, styles.submitBtn]}
            textStyle={{ fontWeight: '900', fontSize: 16, color: (loading || !resume) ? '#9CA3AF' : 'white' }}
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
  uploadBox: { 
    height: 160, 
    borderRadius: 24, 
    borderWidth: 2, 
    borderColor: '#E5E7EB', 
    borderStyle: 'dashed', 
    backgroundColor: '#F9FAFB', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  uploadIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
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
  }
});
