import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Button, 
  Input, 
  ScreenWrapper,
  Box,
  Divider
} from '../../components/ui';
import { ProfileService } from '../../services/api/profile';
import { Roles } from '../../constants/Roles';
import {
  UserCircle,
  Camera,
  Briefcase,
  GraduationCap,
  CheckCircle,
  MapPin,
  BadgeCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native';

import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale } from '../../utils/responsive';

const BLUE = '#4F46E5';

const STEPS = [
  { id: 0, title: 'IDENTITY', icon: UserCircle, label: 'Identity Visuals' },
  { id: 1, title: 'MATRIX', icon: BadgeCheck, label: 'Professional Matrix' },
  { id: 2, title: 'DEPLOY', icon: MapPin, label: 'Mission Deployment' },
];

export default function ProfileWizardScreen({ navigation }: { navigation: any }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { setOnboarded, userRole, user } = useAuthStore();
  
  // Wizard Data
  const [photo, setPhoto] = useState<string | null>(null);
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const profileData = {
        headline,
        bio,
        location,
        avatar: photo,
      };

      if (userRole === Roles.JOB_SEEKER) {
        await ProfileService.createSeekerProfile(profileData);
      } else {
        await ProfileService.createRecruiterProfile({
          ...profileData,
          company_name: headline,
        });
      }
      
      setOnboarded(true);
    } catch (e) {
      console.warn('Failed to initialize profile:', e);
      setOnboarded(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <VStack space="xl" items="center" px={24} py={40}>
            <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.placeholder]}>
                  <UserCircle size={120} color="#E2E8F0" strokeWidth={1} />
                  <LinearGradient colors={[BLUE, '#0A1628']} style={styles.cameraIcon}>
                    <Camera size={24} color="#FFF" strokeWidth={2} />
                  </LinearGradient>
                </View>
              )}
            </TouchableOpacity>
            <VStack space="sm" items="center" mt={20}>
              <Text fontSize={24} fontWeight="900" color="#111827">Visual Identity</Text>
              <Text fontSize={15} color="#64748B" textAlign="center" fontWeight="500" lineHeight={22}>
                 Deploy a professional mission visual to synchronize with potential recruiters and partners.
              </Text>
            </VStack>
          </VStack>
        );
      case 1:
        return (
          <VStack space="xl" px={24} py={32}>
            <VStack space="md">
              <Text style={styles.label}>PROFESSIONAL HEADLINE</Text>
              <Box h={60} bg="#F8FAFC" rounded={18} border={1.5} borderColor="#F1F5F9" style={{ flexDirection: 'row' }} items="center" px={20}>
                 <Briefcase size={22} color={BLUE} />
                 <Input 
                   placeholder="Ex: Senior Mission Architect" 
                   value={headline}
                   onChangeText={setHeadline}
                   style={styles.inputStyle}
                 />
              </Box>
            </VStack>
            <VStack space="md">
              <Text style={styles.label}>OPERATIONAL BIO</Text>
              <Box bg="#F8FAFC" rounded={22} border={1.5} borderColor="#F1F5F9" p={20}>
                 <Input 
                   placeholder="Briefly synthesize your professional journey and core expertise..."
                   value={bio}
                   onChangeText={setBio}
                   multiline
                   numberOfLines={6}
                   style={[styles.inputStyle, { height: 120, textAlignVertical: 'top' }]}
                 />
              </Box>
            </VStack>
          </VStack>
        );
      case 2:
        return (
          <VStack space="xl" px={24} py={32}>
            <VStack space="md">
              <Text style={styles.label}>MISSION LOCATION</Text>
              <Box h={60} bg="#F8FAFC" rounded={18} border={1.5} borderColor="#F1F5F9" style={{ flexDirection: 'row' }} items="center" px={20}>
                 <MapPin size={22} color={BLUE} />
                 <Input 
                   placeholder="Primary Deployment Zone (Ex: London, UK)" 
                   value={location}
                   onChangeText={setLocation}
                   style={styles.inputStyle}
                 />
              </Box>
            </VStack>
            
            <Box bg="#F0F9FF" p={24} rounded={32} border={1.5} borderColor="#DBEAFE" style={styles.readyCard}>
               <HStack space="md" items="center">
                 <Box w={48} h={48} rounded={16} bg={BLUE} items="center" justify="center">
                   <Sparkles size={24} color="#FFF" />
                 </Box>
                 <VStack flex={1} ml={12}>
                   <Text fontSize={18} fontWeight="900" color="#111827">Nexus Ready</Text>
                   <Text fontSize={14} color="#475569" fontWeight="600" mt={2}>
                      Initialization cycle complete. Finalize to deploy your identity to the matrix.
                   </Text>
                 </VStack>
               </HStack>
            </Box>
          </VStack>
        );
      default:
        return null;
    }
  };

  return (
    <ScreenWrapper safeAreaTop safeAreaBottom={false} backgroundColor="#FFFFFF">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <VStack flex={1}>
        {/* Progress Tracker */}
        <Box px={20} pt={16}>
           <HStack justify="space-between" items="center" mb={24}>
              <TouchableOpacity 
                style={styles.backBtn} 
                onPress={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                disabled={currentStep === 0}
              >
                 <ArrowRight size={22} color={currentStep === 0 ? "#E2E8F0" : "#111827"} style={{ transform: [{ rotate: '180deg' }] } as any} />
              </TouchableOpacity>
              
              <HStack space="sm">
                 {STEPS.map((step) => {
                   const active = step.id === currentStep;
                   const completed = step.id < currentStep;
                   return (
                     <Box 
                       key={step.id} 
                       w={moderateScale(70)} 
                       h={6} 
                       rounded={3} 
                       bg={completed ? BLUE : active ? "#E0E7FF" : "#F1F5F9"}
                       overflow="hidden"
                     >
                        {active && (
                          <LinearGradient 
                            colors={[BLUE, '#60A5FA']} 
                            start={{ x: 0, y: 0 }} 
                            end={{ x: 1, y: 0 }} 
                            style={{ height: '100%', width: '60%' }} 
                          />
                        )}
                     </Box>
                   );
                 })}
              </HStack>

              <TouchableOpacity onPress={() => setOnboarded(true)}>
                 <Text fontSize={14} fontWeight="900" color={BLUE}>SKIP</Text>
              </TouchableOpacity>
           </HStack>

           <VStack mb={8}>
              <Text fontSize={12} fontWeight="900" color="#94A3B8" letterSpacing={1.5}>MISSION INITIALIZATION</Text>
              <Text fontSize={28} fontWeight="900" color="#111827" mt={4}>{STEPS[currentStep].label}</Text>
           </VStack>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
           {renderStepContent()}
        </ScrollView>

        <Box p={24} bg="white" borderTop={1} borderColor="#F1F5F9" style={styles.footerShadow}>
           <TouchableOpacity 
             style={styles.primaryBtn} 
             onPress={handleNext} 
             disabled={loading}
             activeOpacity={0.9}
           >
              {loading ? <ActivityIndicator color="white" /> : (
                <HStack items="center">
                   <Text fontSize={16} fontWeight="900" color="white">
                     {currentStep === STEPS.length - 1 ? 'FINALIZE INITIALIZATION' : 'CONTINUE SEQUENCE'}
                   </Text>
                   <ChevronRight size={20} color="white" style={{ marginLeft: 10 }} strokeWidth={3} />
                </HStack>
              )}
           </TouchableOpacity>
        </Box>
      </VStack>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9'
  },
  photoContainer: {
    width: 180, height: 180, borderRadius: 90,
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8
  },
  avatar: {
    width: '100%', height: '100%', borderRadius: 90, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F1F5F9'
  },
  placeholder: { backgroundColor: '#F1F5F9' },
  cameraIcon: {
    position: 'absolute', bottom: 4, right: 4, width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'white'
  },
  label: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 },
  inputStyle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#111827', marginLeft: 16 },
  readyCard: {
     shadowColor: BLUE, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 4
  },
  footerShadow: {
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4
  },
  primaryBtn: {
    height: 64, backgroundColor: BLUE, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    shadowColor: BLUE, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12
  },
});
