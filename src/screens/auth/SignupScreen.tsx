import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import {
  User,
  Mail,
  Lock,
  ChevronLeft,
  Briefcase,
  Building2,
  CheckCircle,
  ChevronRight,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { AuthService } from '../../services/api/auth';
import { Roles } from '../../constants';
import { ScreenWrapper, Text, Box, VStack, HStack, Input, Button, Divider } from '../../components/ui';
import { isValidEmail } from '../../utils';

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

export default function SignupScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'job_seeker' | 'recruiter'>('job_seeker');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company_name: '',
  });
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');
    if (!formData.name.trim()) { setError('Please enter your full name.'); return; }
    const cleanedEmail = formData.email.trim().toLowerCase();
    if (!isValidEmail(cleanedEmail)) { setError('Please enter a valid email.'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (role === 'recruiter' && !formData.company_name.trim()) { setError('Please enter your company name.'); return; }

    setLoading(true);
    try {
      await AuthService.register({
        email: cleanedEmail,
        password: formData.password,
        name: formData.name.trim(),
        role: role,
        company_name: role === 'recruiter' ? formData.company_name.trim() : undefined,
      });
      // Navigate to OTP verification — pass password so we can auto-login after verify
      navigation.navigate('VerifyOtp', { email: cleanedEmail, password: formData.password });
    } catch (err: any) {
      const apiError = err.response?.data?.email?.[0] || err.response?.data?.error || err.response?.data?.message || 'Registration failed. This email may already be in use.';
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

   const RoleCard = ({ type, title, subtitle, icon: Icon }: any) => (
    <TouchableOpacity 
       onPress={() => setRole(type)}
       style={[styles.roleCard, role === type && styles.roleCardActive]}
    >
       <HStack items="center">
          <View style={[styles.roleIcon, role === type && { backgroundColor: BLUE }]}>
             <Icon size={24} color={role === type ? 'white' : '#666666'} />
          </View>
          <VStack ml={16} flex={1}>
             <Text fontSize={17} fontWeight="800" color="#111827">{title}</Text>
             <Text fontSize={13} color="#666666" mt={2}>{subtitle}</Text>
          </VStack>
          <View style={[styles.radio, role === type && styles.radioActive]}>
             {role === type && <View style={styles.radioInner} />}
          </View>
       </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      
      <Box px={16} pt={60} pb={10}>
         <HStack items="center" justify="space-between">
            {step < 3 && (
               <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backBtn}>
                  <ChevronLeft size={28} color="#111827" strokeWidth={2.5} />
               </TouchableOpacity>
            )}
            <Text fontSize={22} fontWeight="900" color="#111827">Join Jobryn</Text>
            <View style={{ width: 40 }} />
         </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
         {step === 1 && (
            <VStack space="lg">
               <VStack mb={12}>
                  <Text fontSize={28} fontWeight="900" color="#111827" letterSpacing={-0.5}>Choose your path</Text>
                  <Text fontSize={15} color="#666666" mt={6}>Tell us how you'll be using the platform.</Text>
               </VStack>
               <RoleCard 
                  type="job_seeker" 
                  title="I am a Job Seeker" 
                  subtitle="Search for missions, build my portfolio, and grow my career."
                  icon={User}
               />
               <RoleCard 
                  type="recruiter" 
                  title="I am a Recruiter" 
                  subtitle="Post jobs, manage candidates, and hire top-tier talent."
                  icon={Briefcase}
               />
               <Button 
                  label="Continue" 
                  onPress={() => setStep(2)} 
                  style={{ backgroundColor: BLUE, height: 56, borderRadius: 28, marginTop: 24 }}
                  textStyle={{ fontSize: 17, fontWeight: '800' }}
               />
            </VStack>
         )}

         {step === 2 && (
            <VStack space="xl">
               <VStack mb={4}>
                  <Text fontSize={24} fontWeight="900" color="#111827">Create your account</Text>
                  <Text fontSize={14} color="#666666" mt={4}>Enter your professional details below.</Text>
               </VStack>

               <Input 
                  label="Full Name"
                  placeholder="e.g. Jhonson King" 
                  value={formData.name} 
                  onChangeText={(text: string) => setFormData({...formData, name: text})}
                  bg="#F9FAFB"
               />

               <Input 
                  label="Email Address"
                  placeholder="e.g. jhonson@domain.com" 
                  value={formData.email} 
                  onChangeText={(text: string) => setFormData({...formData, email: text})}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  bg="#F9FAFB"
               />

               {role === 'recruiter' && (
                  <Input 
                     label="Company Name"
                     placeholder="e.g. Nexus Technology" 
                     value={formData.company_name} 
                     onChangeText={(text: string) => setFormData({...formData, company_name: text})}
                     autoCapitalize="none"
                     autoCorrect={false}
                     bg="#F9FAFB"
                  />
               )}

                <Input 
                   label="Set Password"
                   placeholder="At least 6 characters" 
                   value={formData.password} 
                   onChangeText={(text: string) => setFormData({...formData, password: text})}
                   secureTextEntry
                   autoCapitalize="none"
                   autoCorrect={false}
                   bg="#F9FAFB"
                />

               {error ? <Text color="#EF4444" fontSize={13} textAlign="center" mt={-8} fontWeight="700">{error}</Text> : null}

               <Button 
                  label="Agree & Join" 
                  onPress={handleSignup} 
                  loading={loading}
                  style={{ backgroundColor: BLUE, height: 56, borderRadius: 28, marginTop: 12 }}
                  textStyle={{ fontSize: 17, fontWeight: '800' }}
               />
               
               <Text fontSize={12} color="#666666" textAlign="center" mt={8} lineHeight={18}>
                  By clicking Agree & Join, you agree to our <Text fontSize={12} color={BLUE} fontWeight="700">User Agreement</Text> and <Text fontSize={12} color={BLUE} fontWeight="700">Privacy Policy</Text>.
               </Text>
            </VStack>
         )}

         {step === 3 && (
            <VStack items="center" mt={40}>
               <Box bg="#EDF3F8" p={20} rounded={50} mb={24}>
                  <CheckCircle size={64} color={BLUE} />
               </Box>
               <Text fontSize={24} fontWeight="900" color="#111827" textAlign="center">Registration Complete</Text>
               <Text fontSize={16} color="#666666" textAlign="center" mt={12} px={10}>
                  Welcome to Jobryn! Please verify your email address to initialize your professional portal.
               </Text>
               <Button 
                  label="Verify Email" 
                  onPress={() => navigation.navigate('VerifyOtp', { email: formData.email.trim() })}
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
  roleCard: { padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  roleCardActive: { borderColor: BLUE, backgroundColor: '#EDF3F8' },
  roleIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: BLUE },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: BLUE },
  input: { backgroundColor: '#F9FAFB', height: 52, borderRadius: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E5E7EB' },
});
