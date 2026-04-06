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
import { AuthService } from '../../services/api/auth';
import { ScreenWrapper, Text, Box, VStack, HStack, Input, Button, Divider } from '../../components/ui';
import { isValidEmail } from '../../utils';

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

export default function ForgotPasswordScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleReset = async () => {
    setError('');
    if (!isValidEmail(email)) { setError('Please enter a valid email.'); return; }
    
    setLoading(true);
    try {
      await AuthService.forgotPassword(email.trim());
      setStep(2);
    } catch (err: any) {
      const apiError = err.response?.data?.msg || err.response?.data?.error || 'Failed to send reset code. Please check your email and try again.';
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    setError('');
    if (otp.length < 4) { setError('Please enter the verification code.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await AuthService.resetPassword(email.trim(), otp, newPassword);
      setStep(3); // Success Screen
    } catch (err: any) {
      const apiError = err.response?.data?.msg || err.response?.data?.error || 'Failed to reset password. Please check your code and try again.';
      setError(apiError);
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
                     Enter your email address and we'll send you a verification code to reset your password.
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
         ) : step === 2 ? (
            <VStack space="xl">
               <VStack>
                  <Text fontSize={24} fontWeight="900" color="#111827">Create New Password</Text>
                  <Text fontSize={15} color="#666666" mt={8}>
                     We've sent a code to <Text fontWeight="700">{email}</Text>. Please enter it below along with your new password.
                  </Text>
               </VStack>

               <VStack space="lg">
                  <Input 
                     label="Verification Code"
                     placeholder="6-digit code" 
                     value={otp} 
                     onChangeText={setOtp}
                     keyboardType="number-pad"
                     bg="#F9FAFB"
                  />
                  
                  <Input 
                     label="New Password"
                     placeholder="At least 6 characters" 
                     value={newPassword} 
                     onChangeText={setNewPassword}
                     secureTextEntry={!showPw}
                     bg="#F9FAFB"
                  />

                  <Input 
                     label="Confirm New Password"
                     placeholder="Re-type new password" 
                     value={confirmPassword} 
                     onChangeText={setConfirmPassword}
                     secureTextEntry={!showPw}
                     bg="#F9FAFB"
                  />
               </VStack>

               {error ? <Text color="#EF4444" fontSize={13} textAlign="center" mt={4} fontWeight="700">{error}</Text> : null}

               <Button 
                  label="Confirm Reset" 
                  onPress={handleConfirmReset} 
                  loading={loading}
                  style={{ backgroundColor: BLUE, height: 52, borderRadius: 26, marginTop: 12 }}
               />

               <HStack mt={10} justify="center" items="center" space="xs">
                  <Text fontSize={14} color="#666666">Didn't receive the code?</Text>
                  <TouchableOpacity onPress={() => setStep(1)}>
                     <Text fontSize={14} color={BLUE} fontWeight="700">Resend Code</Text>
                  </TouchableOpacity>
               </HStack>
            </VStack>
         ) : (
            <VStack items="center" mt={40}>
               <Box bg="#EDF3F8" p={20} rounded={50} mb={24}>
                  <CheckCircle size={64} color={BLUE} />
               </Box>
               <Text fontSize={24} fontWeight="900" color="#111827" textAlign="center">Password Reset!</Text>
               <Text fontSize={16} color="#666666" textAlign="center" mt={12} px={10}>
                  Your password has been successfully updated. You can now use your new credentials to sign in.
               </Text>
               <Button 
                  label="Go to Sign In" 
                  onPress={() => navigation.navigate('Login')}
                  style={{ backgroundColor: BLUE, width: '100%', height: 52, borderRadius: 26, marginTop: 40 }}
               />
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
