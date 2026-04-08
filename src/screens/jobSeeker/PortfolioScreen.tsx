import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Alert,
  Image,
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
  Star,
  ChevronRight,
} from 'lucide-react-native';
import { PortfolioService } from '../../services/api/portfolio';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';

const BLUE = '#1877F2';
const FB_GRAY = '#F0F2F5';

export default function PortfolioScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<{
    education: any[];
    experience: any[];
    projects: any[];
    certifications: any[];
  }>({
    education: [],
    experience: [],
    projects: [],
    certifications: [],
  });

  const fetchData = async () => {
    try {
      const [edu, exp, proj, cert] = await Promise.all([
        PortfolioService.getEducation(),
        PortfolioService.getExperience(),
        PortfolioService.getProjects(),
        PortfolioService.getCertifications(),
      ]);
      setData({
        education: edu?.results ?? (Array.isArray(edu) ? edu : []),
        experience: exp?.results ?? (Array.isArray(exp) ? exp : []),
        projects: proj?.results ?? (Array.isArray(proj) ? proj : []),
        certifications: cert?.results ?? (Array.isArray(cert) ? cert : []),
      });
    } catch (e) {
      console.warn('Portfolio fetch failed:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const confirmDelete = (label: string, onConfirm: () => void) => {
    Alert.alert(
      `Remove ${label}?`,
      'This will permanently delete this entry from your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onConfirm },
      ]
    );
  };

  const handleDeleteExperience = async (id: number) => {
    confirmDelete('Experience', async () => {
      try {
        await PortfolioService.deleteExperience(id);
        setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
      } catch { Alert.alert('Error', 'Could not delete experience.'); }
    });
  };

  const handleDeleteEducation = async (id: number) => {
    confirmDelete('Education', async () => {
      try {
        await PortfolioService.deleteEducation(id);
        setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
      } catch { Alert.alert('Error', 'Could not delete education.'); }
    });
  };

  const handleDeleteProject = async (id: number) => {
    confirmDelete('Project', async () => {
      try {
        await PortfolioService.deleteProject(id);
        setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
      } catch { Alert.alert('Error', 'Could not delete project.'); }
    });
  };

  const handleDeleteCertification = async (id: number) => {
    confirmDelete('Certification', async () => {
      try {
        await PortfolioService.deleteCertification(id);
        setData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
      } catch { Alert.alert('Error', 'Could not delete certification.'); }
    });
  };

  // ─── Section Header ────────────────────────────────────────────────────────
  const SectionHeader = ({ title, onAdd }: { title: string; onAdd: () => void }) => (
    <HStack items="center" justify="space-between" mb={12}>
      <Text fontSize={moderateScale(12)} fontWeight="800" color="#65676B" style={{ letterSpacing: 1 }}>
        {title.toUpperCase()}
      </Text>
      <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
        <Plus size={14} color={BLUE} strokeWidth={2.5} />
        <Text fontSize={moderateScale(12)} fontWeight="700" color={BLUE} ml={4}>Add</Text>
      </TouchableOpacity>
    </HStack>
  );

  // ─── Empty State ───────────────────────────────────────────────────────────
  const EmptyState = ({ label }: { label: string }) => (
    <Box bg="white" rounded={12} p={20} mb={8} items="center" justify="center" border={1} borderColor="#E5E7EB" borderStyle="dashed">
      <Text fontSize={13} color="#8A8D91" textAlign="center">{label}</Text>
    </Box>
  );

  // ─── Experience Card ────────────────────────────────────────────────────────
  const ExperienceCard = ({ item }: { item: any }) => (
    <Box bg="white" p={16} rounded={12} mb={10} border={1} borderColor="#E5E7EB">
      <HStack items="flex-start">
        <View style={styles.iconCircle}>
          <Briefcase size={22} color="#65676B" />
        </View>
        <VStack ml={12} flex={1}>
          <HStack justify="space-between" items="flex-start">
            <VStack flex={1} mr={8}>
              <Text fontSize={moderateScale(15)} fontWeight="800" color="#111827" numberOfLines={1}>{item.title}</Text>
              <Text fontSize={moderateScale(13)} fontWeight="600" color="#65676B">{item.company_name}</Text>
              <Text fontSize={moderateScale(12)} color="#8A8D91" mt={2}>
                {item.start_date} – {item.is_current ? 'Present' : (item.end_date || '—')}
                {item.employment_type ? ` · ${item.employment_type.replace('-', ' ')}` : ''}
              </Text>
              {item.location && <Text fontSize={moderateScale(12)} color="#8A8D91">{item.location}</Text>}
            </VStack>
            <HStack space="xs">
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('AddExperience', { experience: item, edit: true })}
              >
                <Pencil size={16} color="#65676B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteExperience(item.id)}>
                <Trash2 size={16} color="#FA383E" />
              </TouchableOpacity>
            </HStack>
          </HStack>
          {item.description ? (
            <Text fontSize={moderateScale(13)} color="#374151" mt={8} numberOfLines={2}>{item.description}</Text>
          ) : null}
        </VStack>
      </HStack>
    </Box>
  );

  // ─── Education Card ─────────────────────────────────────────────────────────
  const EducationCard = ({ item }: { item: any }) => (
    <Box bg="white" p={16} rounded={12} mb={10} border={1} borderColor="#E5E7EB">
      <HStack items="flex-start">
        <View style={styles.iconCircle}>
          <GraduationCap size={22} color="#65676B" />
        </View>
        <VStack ml={12} flex={1}>
          <HStack justify="space-between" items="flex-start">
            <VStack flex={1} mr={8}>
              <Text fontSize={moderateScale(15)} fontWeight="800" color="#111827" numberOfLines={1}>{item.school}</Text>
              {item.degree && <Text fontSize={moderateScale(13)} fontWeight="600" color="#65676B">{item.degree}{item.field_of_study ? ` · ${item.field_of_study}` : ''}</Text>}
              <Text fontSize={moderateScale(12)} color="#8A8D91" mt={2}>
                {item.start_date} – {item.end_date || 'Present'}
                {item.grade ? ` · ${item.grade}` : ''}
                {item.gpa_score ? ` · GPA ${item.gpa_score}` : ''}
              </Text>
            </VStack>
            <HStack space="xs">
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('AddEducation', { education: item, edit: true })}
              >
                <Pencil size={16} color="#65676B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteEducation(item.id)}>
                <Trash2 size={16} color="#FA383E" />
              </TouchableOpacity>
            </HStack>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );

  // ─── Project Card ───────────────────────────────────────────────────────────
  const ProjectCard = ({ item }: { item: any }) => {
    const techList = Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies;
    return (
      <Box bg="white" p={16} rounded={12} mb={10} border={1} borderColor="#E5E7EB">
        <HStack items="flex-start">
          <View style={styles.iconCircle}>
            <Layers size={22} color="#65676B" />
          </View>
          <VStack ml={12} flex={1}>
            <HStack justify="space-between" items="flex-start">
              <VStack flex={1} mr={8}>
                <Text fontSize={moderateScale(15)} fontWeight="800" color="#111827" numberOfLines={1}>{item.name}</Text>
                {item.role && <Text fontSize={moderateScale(13)} color="#65676B">{item.role}</Text>}
                {item.status && (
                  <Box alignSelf="flex-start" px={8} py={2} bg="#EEF2FF" rounded={8} mt={4}>
                    <Text fontSize={11} color={BLUE} fontWeight="700">{item.status}</Text>
                  </Box>
                )}
                {techList ? <Text fontSize={moderateScale(12)} color="#8A8D91" mt={4} numberOfLines={1}>🔧 {techList}</Text> : null}
              </VStack>
              <HStack space="xs">
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('AddProject', { project: item, edit: true })}
                >
                  <Pencil size={16} color="#65676B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteProject(item.id)}>
                  <Trash2 size={16} color="#FA383E" />
                </TouchableOpacity>
              </HStack>
            </HStack>
            {item.description ? (
              <Text fontSize={moderateScale(13)} color="#374151" mt={8} numberOfLines={2}>{item.description}</Text>
            ) : null}
          </VStack>
        </HStack>
      </Box>
    );
  };

  // ─── Certification Card ─────────────────────────────────────────────────────
  const CertificationCard = ({ item }: { item: any }) => (
    <Box bg="white" p={16} rounded={12} mb={10} border={1} borderColor="#E5E7EB">
      <HStack items="flex-start">
        <View style={styles.iconCircle}>
          <Trophy size={22} color="#65676B" />
        </View>
        <VStack ml={12} flex={1}>
          <HStack justify="space-between" items="flex-start">
            <VStack flex={1} mr={8}>
              <Text fontSize={moderateScale(15)} fontWeight="800" color="#111827" numberOfLines={1}>{item.name}</Text>
              <Text fontSize={moderateScale(13)} color="#65676B">{item.issuing_organization}</Text>
              <Text fontSize={moderateScale(12)} color="#8A8D91" mt={2}>
                Issued {item.issue_date}
                {item.expiration_date ? ` · Expires ${item.expiration_date}` : ''}
                {item.score ? ` · Score: ${item.score}` : ''}
              </Text>
              {item.credential_id && (
                <Text fontSize={moderateScale(11)} color="#8A8D91">ID: {item.credential_id}</Text>
              )}
            </VStack>
            <HStack space="xs">
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('AddCertification', { certification: item, edit: true })}
              >
                <Pencil size={16} color="#65676B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteCertification(item.id)}>
                <Trash2 size={16} color="#FA383E" />
              </TouchableOpacity>
            </HStack>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={28} color="#050505" />
            </TouchableOpacity>
            <Text fontSize={20} color="#050505" fontWeight="900" ml={8}>Professional Portfolio</Text>
          </HStack>
        </HStack>
      </Box>

      {loading ? (
        <Box flex={1} items="center" justify="center">
          <ActivityIndicator color={BLUE} size="large" />
        </Box>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />}
          showsVerticalScrollIndicator={false}
        >
          {/* Experience */}
          <VStack mb={24}>
            <SectionHeader title="Experience" onAdd={() => navigation.navigate('AddExperience')} />
            {data.experience.length === 0
              ? <EmptyState label="Add your work experience to stand out to recruiters." />
              : data.experience.map(item => <ExperienceCard key={item.id} item={item} />)
            }
          </VStack>

          {/* Education */}
          <VStack mb={24}>
            <SectionHeader title="Education" onAdd={() => navigation.navigate('AddEducation')} />
            {data.education.length === 0
              ? <EmptyState label="Add your educational background and qualifications." />
              : data.education.map(item => <EducationCard key={item.id} item={item} />)
            }
          </VStack>

          {/* Projects */}
          <VStack mb={24}>
            <SectionHeader title="Projects" onAdd={() => navigation.navigate('AddProject')} />
            {data.projects.length === 0
              ? <EmptyState label="Showcase your operational projects and case studies." />
              : data.projects.map(item => <ProjectCard key={item.id} item={item} />)
            }
          </VStack>

          {/* Certifications */}
          <VStack mb={24}>
            <SectionHeader title="Certifications" onAdd={() => navigation.navigate('AddCertification')} />
            {data.certifications.length === 0
              ? <EmptyState label="Add professional certifications to verify your expertise." />
              : data.certifications.map(item => <CertificationCard key={item.id} item={item} />)
            }
          </VStack>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
  },
});
