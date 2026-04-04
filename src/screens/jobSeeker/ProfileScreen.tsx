import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button
} from '../../components/ui';
import {
  ChevronLeft,
  Settings,
  Camera,
  Pencil,
  Plus,
  MapPin,
  GraduationCap,
  Briefcase,
  Link,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { ProfileService } from '../../services/api/profile';
import { PortfolioService } from '../../services/api/portfolio';
import { moderateScale } from '../../utils/responsive';

const BLUE = '#0A66C2'; 
const PROMOTED_GREEN = '#057642';
const GRAY_BG = '#F3F2EF';

export default function JobSeekerProfileScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { logout, user: authUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const [seekerProfiles, edu, exp, proj] = await Promise.all([
        ProfileService.getSeekerProfiles(),
        PortfolioService.getEducation(),
        PortfolioService.getExperience(),
        PortfolioService.getProjects(),
      ]);
      setProfile(seekerProfiles?.results?.[0] || { full_name: authUser?.name || 'Professional', job_title: 'Expert' });
      setEducation(edu?.results || []);
      setExperience(exp?.results || []);
      setProjects(proj?.results || []);
    } catch (e) {
      setProfile({ full_name: authUser?.name || 'Professional', job_title: 'Expert' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) return (
     <ScreenWrapper backgroundColor="#FFFFFF" items="center" justify="center">
        <ActivityIndicator color={BLUE} />
     </ScreenWrapper>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Banner and Avatar */}
        <Box height={160} bg="#A0A0A0">
           <Image source={{ uri: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop' }} style={StyleSheet.absoluteFill} />
           <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: insets.top + 10 }]}>
              <ChevronLeft size={24} color="white" strokeWidth={2.5} />
           </TouchableOpacity>
        </Box>

        <Box bg="white" px={16} pb={20} style={{ marginTop: -40, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
           <Avatar source={{ uri: `https://i.pravatar.cc/150?u=${authUser?.email}` }} size="xl" style={styles.mainAvatar} />
           
           <HStack justify="flex-end" mt={10}>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsBtn}>
                 <Settings size={24} color="#666666" />
              </TouchableOpacity>
           </HStack>

           <VStack mt={20}>
              <Text fontSize={22} fontWeight="700" color="#000000">{profile.full_name}</Text>
              <Text fontSize={16} color="#000000" mt={4}>{profile.job_title}</Text>
              <HStack mt={10} items="center">
                 <MapPin size={16} color="#666666" />
                 <Text fontSize={14} color="#666666" ml={4}>{profile.location || 'Kathmandu, Bagmati'}</Text>
                 <Text fontSize={14} color={BLUE} fontWeight="700" ml={16}>500+ connections</Text>
              </HStack>
           </VStack>

           <HStack mt={20} space="sm">
              <Button label="Open to" onPress={() => {}} style={{ flex: 1, backgroundColor: BLUE }} />
              <Button label="Add segment" variant="outline" onPress={() => {}} style={{ flex: 1, borderColor: BLUE }} textStyle={{ color: BLUE }} />
              <TouchableOpacity style={styles.moreBtn}><Text fontSize={18} fontWeight="700" color="#666666">...</Text></TouchableOpacity>
           </HStack>
        </Box>

        {/* Analytics Section */}
        <Box bg="white" mt={8} p={16}>
           <Text fontSize={18} fontWeight="700" color="#000000" mb={4}>Analytics</Text>
           <HStack items="center" mb={12}>
              <Text fontSize={14} color="#666666">Private to you</Text>
           </HStack>
           <HStack space="md">
              <VStack flex={1}>
                 <Text fontSize={16} fontWeight="700" color="#000000">142</Text>
                 <Text fontSize={13} color="#666666">profile views</Text>
              </VStack>
              <VStack flex={1}>
                 <Text fontSize={16} fontWeight="700" color="#000000">32</Text>
                 <Text fontSize={13} color="#666666">post impressions</Text>
              </VStack>
              <VStack flex={1}>
                 <Text fontSize={16} fontWeight="700" color="#000000">12</Text>
                 <Text fontSize={13} color="#666666">search appearances</Text>
              </VStack>
           </HStack>
        </Box>

        {/* About Section */}
        <Box bg="white" mt={8} p={16}>
           <HStack justify="space-between" items="center" mb={12}>
              <Text fontSize={18} fontWeight="700" color="#000000">About</Text>
              <TouchableOpacity><Pencil size={20} color="#666666" /></TouchableOpacity>
           </HStack>
           <Text fontSize={14} color="#000000" lineHeight={20}>
              {profile.bio || 'Professional summary describing your career objectives and expertise. Add details to attract recruiters.'}
           </Text>
        </Box>

        {/* Experience Section */}
        <Box bg="white" mt={8} p={16}>
           <HStack justify="space-between" items="center" mb={16}>
              <Text fontSize={18} fontWeight="700" color="#000000">Experience</Text>
              <HStack space="md">
                 <TouchableOpacity><Plus size={24} color="#666666" /></TouchableOpacity>
                 <TouchableOpacity><Pencil size={20} color="#666666" /></TouchableOpacity>
              </HStack>
           </HStack>
           {experience.length > 0 ? experience.map((exp: any, idx: number) => (
              <VStack key={idx} mb={16}>
                 <HStack items="flex-start">
                    <Box w={48} h={48} bg="#F3F2EF" rounded={4} items="center" justify="center">
                       <Briefcase size={24} color="#666666" />
                    </Box>
                    <VStack ml={12} flex={1}>
                       <Text fontSize={16} fontWeight="700" color="#000000">{exp.position}</Text>
                       <Text fontSize={14} color="#000000">{exp.company_name}</Text>
                       <Text fontSize={13} color="#666666" mt={2}>{exp.start_date} - {exp.current ? 'Present' : exp.end_date}</Text>
                    </VStack>
                 </HStack>
                 {idx < experience.length - 1 && <Divider color="#E0E0E0" mt={12} />}
              </VStack>
           )) : (
              <Text color="#666666">No experience listed.</Text>
           )}
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  mainAvatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: 'white', position: 'absolute', top: -60, left: 16 },
  settingsBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  moreBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#666666', alignItems: 'center', justifyContent: 'center' },
});
