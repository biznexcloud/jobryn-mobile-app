import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Mail,
  CheckCircle,
  RefreshCw,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Input, Button, Divider } from '../../components/ui';
import { isValidEmail } from '../../utils';

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

export default function ForgotPasswordScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleReset = async () => {
    setError('');
    if (!isValidEmail(email)) { setError('Please enter a valid email.'); return; }
    
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(2);
    } catch (e) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      
      <Box px={16} pt={60} pb={20}>
         <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
               <ChevronLeft size={24} color="#111827" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text fontSize={20} fontWeight="700" color="#111827" ml={16}>Reset Password</Text>
         </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
         {step === 1 ? (
            <VStack space="xl">
               <VStack>
                  <Text fontSize={24} fontWeight="900" color="#111827">Forgotten your password?</Text>
                  <Text fontSize={16} color="#666666" mt={12}>
                     Enter your email address and we'll send you a link to reset your password.
                  </Text>
               </VStack>

               <VStack>
                  <Text fontSize={14} fontWeight="700" color="#111827" mb={8} ml={4}>Email Address</Text>
                  <Input 
                     placeholder="e.g. jhonson@domain.com" 
                     value={email} 
                     onChangeText={setEmail}
                     autoCapitalize="none"
                     keyboardType="email-address"
                     style={styles.input}
                  />
               </VStack>

               {error ? <Text color="#EF4444" fontSize={13} textAlign="center" mt={4} fontWeight="700">{error}</Text> : null}

               <Button 
                  label="Reset password" 
                  onPress={handleReset} 
                  loading={loading}
                  style={{ backgroundColor: BLUE, height: 52, borderRadius: 26, marginTop: 12 }}
               />
               
               <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignSelf: 'center', marginTop: 20 }}>
                  <Text fontSize={16} fontWeight="700" color={BLUE}>Back to Sign In</Text>
               </TouchableOpacity>
            </VStack>
         ) : (
            <VStack items="center" mt={40}>
               <Box bg="#EDF3F8" p={20} rounded={50} mb={24}>
                  <CheckCircle size={64} color={BLUE} />
               </Box>
               <Text fontSize={24} fontWeight="900" color="#111827" textAlign="center">Check your email</Text>
               <Text fontSize={16} color="#666666" textAlign="center" mt={12} px={10}>
                  We've sent a password reset link to <Text fontWeight="700">{email}</Text>. Please follow the instructions to regain access.
               </Text>
               <Button 
                  label="Back to Sign In" 
                  onPress={() => navigation.navigate('Login')}
                  style={{ backgroundColor: BLUE, width: '100%', height: 52, borderRadius: 26, marginTop: 40 }}
               />
               <HStack mt={20} space="xs" items="center">
                  <Text fontSize={14} color="#666666">Didn't receive the email?</Text>
                  <TouchableOpacity onPress={() => setStep(1)}>
                     <Text fontSize={14} color={BLUE} fontWeight="700">Check again</Text>
                  </TouchableOpacity>
               </HStack>
            </VStack>
         )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  input: { backgroundColor: '#F9FAFB', height: 52, borderRadius: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E5E7EB' },
});
