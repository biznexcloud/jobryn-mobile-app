import React, { useState, useRef, useEffect } from 'react';
import { 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  StyleSheet, 
  ActivityIndicator,
  View,
  Dimensions,
  Modal,
  Animated,
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
  const [successVisible, setSuccessVisible] = useState(false);
  const [successRole, setSuccessRole] = useState<'job_provider' | 'job_seeker'>('job_seeker');
  const [successName, setSuccessName] = useState('');

  // Animation values for the popup
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const showSuccessPopup = (roleName: 'job_provider' | 'job_seeker', name: string) => {
    setSuccessRole(roleName);
    setSuccessName(name);
    setSuccessVisible(true);
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 7, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    setError('');
    if (!isValidEmail(email)) { setError('Please enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const resp = await AuthService.login(email, password);
      
      // Support token string, or { token: { access } }, or { access }
      const access = typeof resp.token === 'string' ? resp.token : (resp.token?.access || resp.access);
      const rawRole = resp.role || resp.user?.role;
      
      // Map backend role to app role
      const targetRole = (rawRole === 'recruiter' || rawRole === 'job_provider') 
         ? Roles.JOB_PROVIDER 
         : Roles.JOB_SEEKER;
         
      const userData = resp.user || { email, role: rawRole };
      const displayName = (userData as any)?.name || email.split('@')[0];
      const roleKey = (rawRole === 'recruiter' || rawRole === 'job_provider') ? 'job_provider' : 'job_seeker';

      // Show success popup first, then login (which triggers navigation reactively)
      showSuccessPopup(roleKey, displayName);
      setLoading(false);

      // Short delay so user sees the popup, then auth store triggers navigation
      setTimeout(() => {
        login(targetRole, access, userData, true);
      }, 1600);
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

  const isProvider = successRole === 'job_provider';

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">

      {/* ─── Login Success Popup Modal ─────────────────────────────────────── */}
      <Modal
        visible={successVisible}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.successCard,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            {/* Gradient Top Bar */}
            <View style={[styles.successTopBar, { backgroundColor: isProvider ? '#0A66C2' : '#059669' }]} />

            {/* Icon Circle */}
            <View style={[styles.successIconCircle, { backgroundColor: isProvider ? '#EBF5FF' : '#D1FAE5' }]}>
              <View style={[styles.successIconInner, { backgroundColor: isProvider ? '#0A66C2' : '#059669' }]}>
                <Text style={styles.successIconCheck}>✓</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.successTitle}>Login Successful!</Text>

            {/* Subtitle */}
            <Text style={styles.successSubtitle}>
              Welcome back,{' '}
              <Text style={[styles.successName, { color: isProvider ? '#0A66C2' : '#059669' }]}>
                {successName}
              </Text>
              {'!'}
            </Text>

            {/* Role Badge */}
            <View style={[styles.roleBadge, { backgroundColor: isProvider ? '#EBF5FF' : '#D1FAE5' }]}>
              <Text style={[styles.roleBadgeText, { color: isProvider ? '#0A66C2' : '#059669' }]}>
                {isProvider ? '🏢  Job Provider Dashboard' : '👤  Job Seeker Dashboard'}
              </Text>
            </View>

            {/* Redirect note */}
            <Text style={styles.successRedirect}>Navigating to your dashboard...</Text>

            {/* Loading dots */}
            <View style={styles.dotsRow}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[styles.dot, { backgroundColor: isProvider ? '#0A66C2' : '#059669', opacity: 0.4 + i * 0.3 }]}
                />
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>
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
  // ─── Success Popup Styles ───────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 20,
  },
  successTopBar: {
    width: '100%',
    height: 6,
    marginBottom: 0,
  },
  successIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 20,
  },
  successIconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconCheck: {
    color: 'white',
    fontSize: 30,
    fontWeight: '900',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  successName: {
    fontWeight: '800',
  },
  roleBadge: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 20,
  },
  roleBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  successRedirect: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
