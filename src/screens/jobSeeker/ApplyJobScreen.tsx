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
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import Toast from 'react-native-toast-message';

const BLUE = '#1877F2'; 
const GRAY_BG = '#F0F2F5';

export default function ApplyJobScreen({ route, navigation }: { route: any; navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { job } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const handleApply = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 1500));
      setApplied(true);
      Toast.show({ type: 'success', text1: 'Application Sent', text2: 'The recruiter has been notified.' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Submission failed' });
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <ScreenWrapper backgroundColor="white" justify="center" items="center" px={40}>
         <Box bg="#E1F0E5" p={20} rounded={60} mb={24}>
            <CheckCircle size={80} color="#057642" strokeWidth={1.5} />
         </Box>
         <Text fontSize={24} fontWeight="700" color="#000000" textAlign="center">Application Sent!</Text>
         <Text fontSize={16} color="#666666" textAlign="center" mt={12} lineHeight={24}>
            Your profile and cover letter have been transmitted to the hiring team at {job?.company_name || 'the company'}.
         </Text>
         <Button 
            label="Back to Jobs" 
            onPress={() => navigation?.goBack()} 
            mt={40} 
            w="100%"
            bg={BLUE}
         />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="#FFFFFF">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <Box style={{ paddingHorizontal: 16, paddingTop: insets.top + 12, paddingBottom: 12 }} bg="white" borderBottom={1} borderColor="#E0E0E0">
        <HStack items="center" justify="space-between">
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <ChevronLeft size={24} color="#000000" />
          </TouchableOpacity>
          <Text fontSize={18} fontWeight="700" color="#000000">Apply to {job?.company_name || 'Job'}</Text>
          <View style={{ width: 24 }} />
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <VStack style={{ marginBottom: 24 }}>
           <Text fontSize={20} fontWeight="700" color="#000000">{job?.title || 'Senior Software Engineer'}</Text>
           <Text fontSize={16} color="#666666" style={{ marginTop: 4 }}>{job?.company_name || 'Tech Solutions'} • {job?.location || 'London, UK'}</Text>
        </VStack>

        <Divider style={{ marginBottom: 24 }} color="#F3F2EF" />

        <Text fontSize={16} fontWeight="700" color="#000000" style={{ marginBottom: 16 }}>Contact info</Text>
        <VStack space="md" style={{ marginBottom: 32 }}>
           <HStack items="center" space="md">
              <Avatar source={{ uri: 'https://i.pravatar.cc/150?u=me' }} size="lg" />
              <VStack style={{ marginLeft: 12 }}>
                 <Text fontSize={15} fontWeight="700" color="#000000">Jhonson King</Text>
                 <Text fontSize={13} color="#666666">Software Engineer at TechCorp</Text>
              </VStack>
           </HStack>
           <HStack items="center" space="md" style={{ marginTop: 16 }}>
              <Mail size={20} color="#666666" />
              <Text fontSize={14} color="#000000" style={{ marginLeft: 12 }}>jhonson.king@example.com</Text>
           </HStack>
           <HStack items="center" space="md" style={{ marginTop: 8 }}>
              <Phone size={20} color="#666666" />
              <Text fontSize={14} color="#000000" style={{ marginLeft: 12 }}>+44 7700 900000</Text>
           </HStack>
        </VStack>

        <Text fontSize={16} fontWeight="700" color="#000000" style={{ marginBottom: 16 }}>Resume</Text>
        <Box style={{ padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', borderStyle: 'dashed' }} items="center">
           <Paperclip size={24} color={BLUE} />
           <Text fontSize={14} color={BLUE} fontWeight="700" mt={8}>Jhonson_King_Resume.pdf</Text>
           <Text fontSize={12} color="#666666" mt={4}>Uploaded 2 days ago</Text>
        </Box>

        <VStack mt={32}>
           <Text fontSize={16} fontWeight="700" color="#000000" mb={12}>Cover letter (Optional)</Text>
           <Box bg={GRAY_BG} rounded={12} p={12} minH={120}>
              <TextInput 
                 multiline 
                 placeholder="Why are you a good fit for this role?" 
                 placeholderTextColor="#9CA3AF"
                 value={coverLetter}
                 onChangeText={setCoverLetter}
                 style={styles.input}
              />
           </Box>
        </VStack>
      </ScrollView>

      <Box p={16} bg="white" borderTop={1} borderColor="#E0E0E0" pb={insets.bottom + 16}>
         <Button 
            label={loading ? "Submitting..." : "Submit Application"} 
            onPress={handleApply} 
            disabled={loading}
            bg={BLUE}
            style={{ height: 50, borderRadius: 25 }}
         />
      </Box>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  input: { fontSize: 15, color: '#1C1E21', lineHeight: 22, padding: 0 }
});
