import React, { useState } from 'react';
import { 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  StyleSheet, 
  ActivityIndicator,
  View,
  Dimensions,
} from 'react-native';
import { Colors, Fonts, Strings, Roles, UserRole } from '../../constants';
import { Heading, Text, Input, Button, VStack, HStack, Box, ScreenWrapper, Divider } from '../../components/ui';
import { isValidEmail } from '../../utils';
import { useAuthStore } from '../../store/authStore';
import { AuthService } from '../../services/api/auth';
import { moderateScale, verticalScale } from '../../utils/responsive';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

export default function LoginScreen({ navigation }: { navigation?: any }) {
  const login = useAuthStore((state: any) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!isValidEmail(email)) { setError('Please enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const resp = await AuthService.login(email, password);
      
      // Support both { token: { access }, role } and older { access, user } formats to be safe
      const access = resp.token?.access || resp.access;
      const rawRole = resp.role || resp.user?.role;
      
      // Map backend role to app role
      const targetRole = (rawRole === 'recruiter' || rawRole === 'job_provider') 
         ? Roles.JOB_PROVIDER 
         : Roles.JOB_SEEKER;
         
      const userData = resp.user || { email, role: rawRole };

      // Existing users logging in are already onboarded — set true so they land on dashboard
      login(targetRole, access, userData, true);
    } catch (err: any) {
      setLoading(false);
      const apiError = err.response?.data?.msg || err.response?.data?.error || err.response?.data?.detail || 'Invalid credentials. Please check your email and password.';
      setError(apiError);
      
      // If unverified, navigate to OTP screen
      if (apiError.toLowerCase().includes('verify') || apiError.toLowerCase().includes('otp')) {
        setTimeout(() => {
          navigation.navigate('VerifyOtp', { email });
        }, 1500);
      }
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
         <VStack items="center" mt={verticalScale(60)} mb={verticalScale(40)}>
            <Text fontSize={32} fontWeight="900" color={BLUE}>Jobryn</Text>
            <Text fontSize={16} color="#666666" mt={4}>Stay updated on your professional world</Text>
         </VStack>

         <VStack space="lg">
            <Input 
               label="Email"
               placeholder="Enter your email" 
               value={email} 
               onChangeText={setEmail}
               autoCapitalize="none"
               keyboardType="email-address"
               bg="#F9FAFB"
            />

            <Input 
               label="Password"
               placeholder="Enter your password" 
               value={password} 
               onChangeText={setPassword}
               secureTextEntry={!showPw}
               bg="#F9FAFB"
               rightIcon={
                 <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={20} color="#666666" /> : <Eye size={20} color="#666666" />}
                 </TouchableOpacity>
               }
            />

            {error ? <Text color="#EF4444" fontSize={13} textAlign="center" mt={0} fontWeight="700">{error}</Text> : null}

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-start', marginTop: -8 }}>
               <Text fontSize={14} color={BLUE} fontWeight="700">Forgot password?</Text>
            </TouchableOpacity>

            <Button 
               label="Sign In" 
               onPress={handleLogin} 
               loading={loading}
               style={{ backgroundColor: BLUE, height: 52, borderRadius: 26, marginTop: 12 }}
               textStyle={{ fontSize: 16, fontWeight: '800' }}
            />

            <HStack items="center" justify="center" mt={20}>
               <Divider color="#E0E0E0" w={60} />
               <Text fontSize={14} color="#666666" mx={10}>or</Text>
               <Divider color="#E0E0E0" w={60} />
            </HStack>

            <Button 
               label="Join now" 
               variant="outline"
               onPress={() => navigation.navigate('Signup')}
               style={{ borderColor: BLUE, height: 52, borderRadius: 26 }}
               textStyle={{ color: BLUE, fontSize: 16, fontWeight: '800' }}
            />

         </VStack>

         <VStack items="center" mt={40} mb={20}>
            <Text fontSize={12} color="#666666">By clicking Continue, you agree to Jobryn's</Text>
            <HStack space="xs">
               <TouchableOpacity><Text fontSize={12} color={BLUE} fontWeight="700">User Agreement</Text></TouchableOpacity>
               <Text fontSize={12} color="#666666">and</Text>
               <TouchableOpacity><Text fontSize={12} color={BLUE} fontWeight="700">Privacy Policy</Text></TouchableOpacity>
            </HStack>
         </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 30 },
  input: { backgroundColor: '#F9FAFB', height: 52, borderRadius: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  inputContainer: { backgroundColor: '#F9FAFB', height: 52, borderRadius: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  demoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BLUE,
    backgroundColor: 'white',
  },
});
