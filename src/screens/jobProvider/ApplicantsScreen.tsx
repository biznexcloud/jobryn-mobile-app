import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  Filter,
  MessageCircle,
  CheckCircle,
  X,
  Briefcase,
  MapPin,
  MoreVertical,
  Sparkles,
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Button } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offered' | 'hired' | 'rejected' | 'pending';

export default function ApplicantsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<ApplicationStatus>('applied');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      const dummyApplicants = [
        { id: 1, seeker_name: 'Alex Rivers', seeker_avatar: 'https://i.pravatar.cc/150?u=a1', seeker: 101, job_title: 'Senior Protocol Engineer', match_score: 94, status: 'applied', applied_at: '2h ago' },
        { id: 2, seeker_name: 'Sarah Mission', seeker_avatar: 'https://i.pravatar.cc/150?u=s1', seeker: 102, job_title: 'Fullstack Dev', match_score: 88, status: 'applied', applied_at: '5h ago' },
        { id: 3, seeker_name: 'Ram Bahadur', seeker_avatar: 'https://i.pravatar.cc/150?u=r1', seeker: 103, job_title: 'React Native Dev', match_score: 76, status: 'screening', applied_at: '1d ago' },
        { id: 4, seeker_name: 'Jessica Lam', seeker_avatar: 'https://i.pravatar.cc/150?u=j1', seeker: 104, job_title: 'UI/UX Designer', match_score: 91, status: 'interview', applied_at: '2d ago' },
      ];

      try {
        const data = await JobService.getRecruiterApplications();
        if (data?.results && data.results.length > 0) {
          setApplicants(data.results);
        } else {
          setApplicants(dummyApplicants);
        }
      } catch (e) {
        setApplicants(dummyApplicants);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const filtered = applicants.filter(a => {
    const matchesSearch = !searchQuery || a.seeker_name?.toLowerCase().includes(searchQuery.toLowerCase()) || a.job_title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'applied' ? a.status === 'applied' || a.status === 'pending' : a.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const renderApplicant = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ApplicantDetail', { applicant: item })}
      activeOpacity={0.9}
    >
      <HStack items="center" justify="space-between" mb={12}>
        <HStack items="center" flex={1}>
           <Avatar source={{ uri: item.seeker_avatar }} size={52} />
           <VStack ml={12} flex={1}>
             <Text fontSize={16} fontWeight="700" color="#111827">{item.seeker_name}</Text>
             <Text fontSize={13} color={GRAY_TEXT}>{item.job_title}</Text>
           </VStack>
        </HStack>
        <TouchableOpacity style={styles.moreBtn}>
          <MoreVertical size={18} color="#9BA3AF" />
        </TouchableOpacity>
      </HStack>

      <Box bg="#F0F2F5" p={12} rounded={12} mb={16}>
        <HStack items="center" justify="space-between">
           <HStack items="center">
              <Sparkles size={14} color={FB_BLUE} />
              <Text fontSize={12} fontWeight="700" color={FB_BLUE} ml={6}>{item.match_score}% Match</Text>
           </HStack>
           <Text fontSize={11} color={GRAY_TEXT}>Applied {item.applied_at}</Text>
        </HStack>
      </Box>

      <HStack space="sm">
        <TouchableOpacity 
           style={[styles.actionBtn, { flex: 1, backgroundColor: FB_BLUE }]} 
           onPress={() => navigation.navigate('ApplicantDetail', { applicant: item })}
        >
          <Text fontSize={13} fontWeight="700" color="white">View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
           style={[styles.actionBtn, { paddingHorizontal: 16, backgroundColor: '#F0F2F5' }]} 
           onPress={() => navigation.navigate('ChatDetail', { recipientId: item.seeker, recipientName: item.seeker_name, recipientAvatar: item.seeker_avatar })}
        >
          <MessageCircle size={18} color="black" />
        </TouchableOpacity>
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Seeker-style Header */}
      <Box px={16} pt={insets.top + 10} pb={12} bg="white">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
              <ChevronLeft size={22} color="black" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text fontSize={20} fontWeight="800" color="#111827" ml={12}>Applicants</Text>
          </HStack>
          <TouchableOpacity onPress={() => navigation.navigate('Messages')} style={styles.headerIcon}>
            <MessageCircle size={20} color="black" />
          </TouchableOpacity>
        </HStack>
      </Box>

      {/* Seeker-style Search & Filter */}
      <Box bg="white" px={16} pb={12} borderBottom={1} borderColor="#F0F2F5">
        <HStack bg="#F0F2F5" rounded={10} px={12} py={8} items="center" mb={12}>
          <Search size={17} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or role..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </HStack>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="xs">
            {(['applied', 'screening', 'interview', 'offered', 'hired', 'rejected'] as const).map(tab => (
              <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)} 
                style={[styles.chip, activeTab === tab && styles.chipActive]}
              >
                <Text 
                  fontSize={13} 
                  fontWeight="700" 
                  color={activeTab === tab ? 'white' : '#65676B'} 
                  textTransform="capitalize"
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </HStack>
        </ScrollView>
      </Box>

      <FlatList
        data={filtered}
        renderItem={renderApplicant}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        ListEmptyComponent={
          loading ? <ActivityIndicator color={FB_BLUE} style={{ marginTop: 40 }} /> : (
            <VStack items="center" mt={60} px={40}>
              <Box style={styles.emptyIcon}>
                 <Briefcase size={36} color="#CCCCCC" />
              </Box>
              <Text fontSize={17} fontWeight="800" color="#222222" mt={16}>No applicants found</Text>
              <Text fontSize={14} color="#999999" mt={8} textAlign="center">Try adjusting your filters or search.</Text>
            </VStack>
          )
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { backgroundColor: '#F0F2F5', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  searchInput: { flex: 1, fontSize: 14, color: '#111827', marginLeft: 10, paddingVertical: 0 },
  chip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F0F2F5', marginRight: 8 },
  chipActive: { backgroundColor: FB_BLUE },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F0F2F5' },
  actionBtn: { height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  moreBtn: { padding: 4 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F0F2F5' },
});
