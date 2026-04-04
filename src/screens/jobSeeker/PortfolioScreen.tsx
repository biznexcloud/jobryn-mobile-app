import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Plus,
  Briefcase,
  GraduationCap,
  Layers,
  Trophy,
  Pencil,
  Trash2,
} from 'lucide-react-native';
import { PortfolioService } from '../../services/api/portfolio';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';

export default function PortfolioScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>({
    education: [],
    experience: [],
    projects: [],
    certifications: []
  });

  const fetchData = async () => {
    try {
      const [edu, exp, proj, cert] = await Promise.all([
        PortfolioService.getEducation(),
        PortfolioService.getExperience(),
        PortfolioService.getProjects(),
        PortfolioService.getCertifications()
      ]);
      setData({
        education: edu?.results || [],
        experience: exp?.results || [],
        projects: proj?.results || [],
        certifications: cert?.results || []
      });
    } catch (e) {
      console.warn('Portfolio sync failed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const PortfolioCard = ({ icon: Icon, title, subtitle, date, onDelete }: any) => (
    <Box bg="white" p={16} rounded={12} mb={12} border={1} borderColor="#E5E7EB">
      <HStack items="center">
        <View style={styles.iconCircle}>
          <Icon size={22} color="#65676B" />
        </View>
        <VStack ml={16} flex={1}>
          <Text fontSize={16} fontWeight="700" color="#050505">{title}</Text>
          <Text fontSize={14} color="#65676B" mt={2}>{subtitle}</Text>
          {date && <Text fontSize={12} color="#8A8D91" mt={4}>{date}</Text>}
        </VStack>
        <HStack space="xs">
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => {
              const screen = title === 'Experience' ? 'AddExperience' : 
                             title === 'Education' ? 'AddEducation' : 
                             title === 'Project' ? 'AddProject' : 'AddCertification';
              navigation.navigate(screen, { editData: { title, subtitle, date } });
            }}
          >
            <Pencil size={18} color="#65676B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onDelete}><Trash2 size={18} color="#FA383E" /></TouchableOpacity>
        </HStack>
      </HStack>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={28} color="#050505" />
            </TouchableOpacity>
            <Text fontSize={20} color="#050505" fontWeight="900" ml={12}>Professional Portfolio</Text>
          </HStack>
          <TouchableOpacity onPress={() => navigation.navigate('AddExperience')}>
             <Plus size={24} color={BLUE} />
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />}
      >
        <VStack mb={24}>
           <HStack items="center" justify="space-between" mb={12}>
              <Text fontSize={14} fontWeight="700" color="#65676B">EXPERIENCE</Text>
           </HStack>
           {data.experience.length === 0 && !loading ? (
             <Text fontSize={14} color="#8A8D91" textAlign="center" py={20}>No experience history found.</Text>
           ) : (
             data.experience.map((exp: any) => (
              <PortfolioCard 
                 key={exp.id} 
                 icon={Briefcase} 
                 title={exp.position} 
                 subtitle={exp.company_name} 
                 date={`${exp.start_date} - ${exp.current ? 'Present' : exp.end_date}`}
              />
             ))
           )}
        </VStack>

        <VStack mb={24}>
           <HStack items="center" justify="space-between" mb={12}>
              <Text fontSize={14} fontWeight="700" color="#65676B">EDUCATION</Text>
           </HStack>
           {data.education.length === 0 && !loading ? (
             <Text fontSize={14} color="#8A8D91" textAlign="center" py={20}>No educational records found.</Text>
           ) : (
             data.education.map((edu: any) => (
              <PortfolioCard 
                 key={edu.id} 
                 icon={GraduationCap} 
                 title={edu.degree} 
                 subtitle={edu.institution_name} 
              />
             ))
           )}
        </VStack>

        <VStack mb={24}>
           <HStack items="center" justify="space-between" mb={12}>
              <Text fontSize={14} fontWeight="700" color="#65676B">OPERATIONAL PROJECTS</Text>
           </HStack>
           {data.projects.length === 0 && !loading ? (
             <Text fontSize={14} color="#8A8D91" textAlign="center" py={20}>No mission projects listed.</Text>
           ) : (
             data.projects.map((proj: any) => (
              <PortfolioCard 
                 key={proj.id} 
                 icon={Layers} 
                 title={proj.title} 
                 subtitle="Strategic Implementation Project" 
              />
             ))
           )}
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  actionBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
