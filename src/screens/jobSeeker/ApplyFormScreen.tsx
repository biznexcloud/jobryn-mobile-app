import React, { useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  FileText,
  CheckCircle,
  ChevronRight,
  Paperclip,
  Sparkles,
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

export default function ApplyFormScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { job } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cover_letter: '',
    expected_salary: '',
  });

  const handleApply = async () => {
    setLoading(true);
    try {
      await JobService.applyForJob({
        job: job.id,
        cover_letter: formData.cover_letter,
        expected_salary: formData.expected_salary
      });
      setStep(3); // Success step
    } catch (e) {
      Alert.alert('Error', 'Failed to synchronize mission application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
         <HStack items="center" justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                  <X size={24} color="#000000" />
               </TouchableOpacity>
               <Text fontSize={18} fontWeight="700" color="#000000" ml={12}>Application for {job?.company_name}</Text>
            </HStack>
         </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
         {step === 1 && (
            <VStack space="xl">
               <VStack mb={10}>
                  <Text fontSize={20} fontWeight="900" color="#111827">Review your professional identity</Text>
                  <Text fontSize={14} color="#666666" mt={4}>Confirm the details recruiters will see first.</Text>
               </VStack>

               <Box bg="#F9FAFB" p={16} rounded={12} border={1} borderColor="#E5E7EB">
                  <HStack items="center">
                     <Avatar source={{ uri: `https://i.pravatar.cc/150?u=me` }} size="md" />
                     <VStack ml={12} flex={1}>
                        <Text fontSize={16} fontWeight="700" color="#111827">Jhonson King</Text>
                        <Text fontSize={13} color="#666666" mt={2}>Service Engineer • London, UK</Text>
                     </VStack>
                  </HStack>
               </Box>

               <Box bg="white" p={16} rounded={12} border={1} borderColor="#E5E7EB">
                  <HStack items="center" flex={1}>
                     <FileText size={24} color="#666666" />
                     <VStack ml={12} flex={1}>
                        <Text fontSize={15} fontWeight="700" color="#111827">Standard Resume.pdf</Text>
                        <Text fontSize={12} color="#666666">Updated 2 weeks ago</Text>
                     </VStack>
                     <TouchableOpacity><Text fontSize={14} fontWeight="700" color={BLUE}>Change</Text></TouchableOpacity>
                  </HStack>
               </Box>

               <Button 
                  label="Next" 
                  onPress={() => setStep(2)} 
                  style={{ backgroundColor: BLUE, height: 50, borderRadius: 25, marginTop: 24 }}
               />
            </VStack>
         )}

         {step === 2 && (
            <VStack space="xl">
               <VStack>
                  <Text fontSize={20} fontWeight="900" color="#111827">Add a personalized message</Text>
                  <Text fontSize={14} color="#666666" mt={4}>Highly recommended for this mission.</Text>
               </VStack>

               <VStack>
                  <Text fontSize={14} fontWeight="700" color="#666666" mb={8}>Cover Letter</Text>
                  <Box bg="white" rounded={12} px={16} py={12} border={1} borderColor="#E5E7EB">
                     <TextInput 
                        placeholder="Explain why you are the best operative for this mission..."
                        value={formData.cover_letter}
                        onChangeText={(text: string) => setFormData({ ...formData, cover_letter: text })}
                        multiline
                        style={styles.textInput}
                        placeholderTextColor="#999999"
                     />
                  </Box>
               </VStack>

               <Box bg="#EDF3FB" p={16} rounded={12}>
                  <HStack items="center">
                     <Sparkles size={20} color={BLUE} />
                     <Text fontSize={12} color="#475569" ml={12} fontWeight="600" flex={1}>Your match score for this role is high. A short message specifically about the Nexus protocol will increase your response rate.</Text>
                  </HStack>
               </Box>

               <Button 
                  label="Submit Application" 
                  loading={loading} 
                  onPress={handleApply} 
                  style={{ backgroundColor: BLUE, height: 50, borderRadius: 25 }}
               />
            </VStack>
         )}

         {step === 3 && (
            <VStack items="center" mt={40}>
               <Box bg="#EDFDF5" p={20} rounded={50} mb={24}>
                  <CheckCircle size={64} color="#057642" />
               </Box>
               <Text fontSize={24} fontWeight="900" color="#111827" textAlign="center">Mission Application Sent</Text>
               <Text fontSize={16} color="#666666" textAlign="center" mt={12} px={20}>
                  Recruiters at {job?.company_name} will review your professional identity and synchronize the next steps.
               </Text>
               <Button 
                  label="Back to Marketplace" 
                  onPress={() => navigation.goBack()}
                  style={{ backgroundColor: BLUE, height: 50, borderRadius: 25, width: '100%', marginTop: 40 }}
               />
            </VStack>
         )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  textInput: { fontSize: 16, color: '#111827', minHeight: 180, padding: 0 },
});
