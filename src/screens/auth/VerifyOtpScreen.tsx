import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Input, Button } from '../../components/ui';
import { AuthService } from '../../services/api/auth';
import { useAuthStore } from '../../store/authStore';
import { Roles } from '../../constants/Roles';

const BLUE = '#0A66C2';

export default function VerifyOtpScreen({ navigation, route }: any) {
  const { email, password } = route.params || {};
  const cleanedEmail = email?.trim().toLowerCase();
  const login = useAuthStore((state: any) => state.login);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await AuthService.verifyOtp(cleanedEmail, otp);

      // Auto-login after OTP verification if we have credentials
      if (password) {
        try {
          const resp = await AuthService.login(cleanedEmail, password);
          const access   = typeof resp.token === 'string' ? resp.token : (resp.token?.access || resp.access);
          const rawRole  = resp.role || resp.user?.role;
          const targetRole = (rawRole === 'recruiter' || rawRole === 'job_provider')
            ? Roles.JOB_PROVIDER
            : Roles.JOB_SEEKER;
          const userData = resp.user || { email: cleanedEmail, role: rawRole };
          // onboarded = false → triggers ProfileWizard for new users
          login(targetRole, access, userData, false);
          return;
        } catch {
          // fall through to manual sign-in screen
        }
      }
      // No password available — show the verified screen and let user sign in
      navigation.navigate('Login', { email: cleanedEmail, password });
    } catch (err: any) {
      const apiError = err.response?.data?.msg || err.response?.data?.error || 'Invalid OTP. Please try again.';
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      const response = await AuthService.resendOtp(email);
      setError(response.msg || 'OTP re-sent successfully.'); // Using error for feedback, but in a non-red color if possible
    } catch (err: any) {
      const apiError = err.response?.data?.msg || err.response?.data?.error || 'Failed to resend OTP. Please try again.';
      setError(apiError);
    } finally {
      setResending(false);
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
            <Text fontSize={20} fontWeight="700" color="#111827" ml={16}>Verify OTP</Text>
         </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <VStack space="xl">
          <VStack>
            <Text fontSize={28} fontWeight="900" color="#111827" letterSpacing={-0.5}>Check your email</Text>
            <HStack items="center" mt={12} space="xs">
              <Mail size={16} color="#666666" />
              <Text fontSize={15} color="#666666">We've sent a code to </Text>
            </HStack>
            <Text fontSize={15} fontWeight="700" color="#111827" mt={2}>{email}</Text>
          </VStack>

          <VStack mt={10}>
            <Text fontSize={14} fontWeight="700" color="#111827" mb={8} ml={4}>Enter 6-digit code</Text>
            <Input 
              placeholder="e.g. 123456" 
              value={otp} 
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              bg="#F9FAFB"
              style={styles.otpInput}
            />
          </VStack>

          {error ? (
            <Text 
              color={error.toLowerCase().includes('sent') ? "#059669" : "#EF4444"} 
              fontSize={13} 
              textAlign="center" 
              mt={4} 
              fontWeight="700"
            >
              {error}
            </Text>
          ) : null}

          <Button 
            label="Verify Email" 
            onPress={handleVerify} 
            loading={loading}
            style={{ backgroundColor: BLUE, height: 56, borderRadius: 28, marginTop: 12 }}
            textStyle={{ fontSize: 17, fontWeight: '800' }}
          />

          <HStack mt={24} justify="center" items="center" space="xs">
            <Text fontSize={15} color="#666666">Didn't receive the code?</Text>
            {resending ? (
              <ActivityIndicator size="small" color={BLUE} />
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text fontSize={15} color={BLUE} fontWeight="700">Resend Code</Text>
              </TouchableOpacity>
            )}
          </HStack>
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  otpInput: { 
    fontSize: 24, 
    textAlign: 'center', 
    letterSpacing: 8, 
    fontWeight: '700',
    height: 60
  }
});
