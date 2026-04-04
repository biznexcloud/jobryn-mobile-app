import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft as ChevronLeftIcon,
  Settings as CogIcon,
  Edit2 as EditIcon,
  Building as OfficeIcon,
  Globe as GlobeAltIcon,
  Users as UsersIcon,
  MapPin as LocationIcon,
  Briefcase as BriefcaseIcon,
  Plus as PlusIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const { width } = Dimensions.get('window');

const BLUE = '#0A66C2'; 
const GREEN = '#057642';
const GRAY_BG = '#F3F2EF';

export default function ProviderProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeJobs, setActiveJobs] = useState(8);

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
       <StatusBar barStyle="dark-content" />

       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Banner & Logo */}
          <Box height={160} bg="#CCD3D9">
             <Image source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2938&auto=format&fit=crop' }} style={StyleSheet.absoluteFill} />
             <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: insets.top + 10 }]}>
                <ChevronLeftIcon size={24} color="white" strokeWidth={2.5} />
             </TouchableOpacity>
          </Box>

          <Box bg="white" px={16} pb={20} style={{ marginTop: -40, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
             <Box style={styles.logoContainer} bg="white" rounded={12} border={1} borderColor="#E5E7EB">
                <OfficeIcon size={64} color="#666666" strokeWidth={1} />
             </Box>
             
             <HStack justify="flex-end" mt={10}>
                <TouchableOpacity onPress={() => navigation.navigate('ProviderSettings')} style={styles.utilityBtn}>
                   <CogIcon size={24} color="#666666" />
                </TouchableOpacity>
             </HStack>

             <VStack mt={20}>
                <Text fontSize={24} fontWeight="900" color="#000000">{user?.company_name || 'Nexus Corporation'}</Text>
                <Text fontSize={16} color="#000000" mt={4}>Pioneering the Future of Nexus Grid Infrastructure</Text>
                <Text fontSize={14} color="#666666" mt={8}>Information Services • Kathmandu, Nepal • 10,240 followers</Text>
             </VStack>

             <HStack mt={20} space="sm">
                <Button label="Edit Page" variant="outline" onPress={() => {}} style={{ flex: 1, borderColor: BLUE }} textStyle={{ color: BLUE, fontWeight: '700' }} />
                <Button label="Share" variant="outline" onPress={() => {}} style={{ flex: 1, borderColor: '#666666' }} textStyle={{ color: '#666666', fontWeight: '700' }} />
             </HStack>
          </Box>

          {/* About Section */}
          <Box bg="white" mt={8} p={16}>
             <HStack justify="space-between" items="center" mb={12}>
                <Text fontSize={18} fontWeight="700" color="#000000">About</Text>
                <TouchableOpacity><EditIcon size={20} color="#666666" /></TouchableOpacity>
             </HStack>
             <Text fontSize={14} color="#000000" lineHeight={20}>
                Nexus Corporation is a leader in protocol optimization and grid reliability. Our team of mission-driven operatives work across the globe to ensure the security of international communication channels.
             </Text>
             <Divider color="#F1F5F9" mt={16} mb={16} />
             <VStack space="sm">
                <HStack items="center">
                   <GlobeAltIcon size={18} color="#666666" />
                   <Text fontSize={14} color={BLUE} ml={12} fontWeight="700">nexuscorp.intel</Text>
                </HStack>
                <HStack items="center">
                   <UsersIcon size={18} color="#666666" />
                   <Text fontSize={14} color="#666666" ml={12}>51-200 employees</Text>
                </HStack>
                <HStack items="center">
                   <LocationIcon size={18} color="#666666" />
                   <Text fontSize={14} color="#666666" ml={12}>HQ: Nexus Park, Kathmandu</Text>
                </HStack>
             </VStack>
          </Box>

          {/* Recent Openings Section */}
          <Box bg="white" mt={8} p={16}>
             <HStack justify="space-between" items="center" mb={16}>
                <Text fontSize={18} fontWeight="700" color="#000000">Recent Openings</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PostJob')}><PlusIcon size={24} color={BLUE} /></TouchableOpacity>
             </HStack>
             <Box bg="#F3F2EF" p={16} rounded={12}>
                <HStack items="center" justify="space-between">
                   <VStack>
                      <Text fontSize={16} fontWeight="700" color={BLUE}>{activeJobs} Active Missions</Text>
                      <Text fontSize={13} color="#666666" mt={2}>Broadcast across Nexus Grid</Text>
                   </VStack>
                   <ChevronRightIcon size={22} color={BLUE} />
                </HStack>
             </Box>
          </Box>
       </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  logoContainer: { position: 'absolute', top: -60, left: 16, width: 90, height: 90, alignItems: 'center', justifyContent: 'center', padding: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  utilityBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});





