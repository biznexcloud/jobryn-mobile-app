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
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Button } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';

const BLUE = '#0A66C2';
const GRAY_BG = '#F3F2EF';

export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'hired' | 'rejected' | 'screening' | 'online_meeting';

export default function ApplicantsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed' | 'shortlisted'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const data = await JobService.getRecruiterApplications();
        setApplicants(data?.results || []);
      } catch (e) {
        setApplicants([
          { id: 1, seeker_name: 'Alex Rivers', seeker_avatar: 'https://i.pravatar.cc/150?u=a1', seeker: 101, job_title: 'Senior Protocol Engineer', match_score: 94, status: 'pending', applied_at: '2h ago' },
          { id: 2, seeker_name: 'Sarah Mission', seeker_avatar: 'https://i.pravatar.cc/150?u=s1', seeker: 102, job_title: 'Fullstack Dev', match_score: 88, status: 'pending', applied_at: '5h ago' },
          { id: 3, seeker_name: 'Ram Bahadur', seeker_avatar: 'https://i.pravatar.cc/150?u=r1', seeker: 103, job_title: 'React Native Dev', match_score: 76, status: 'shortlisted', applied_at: '1d ago' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const filtered = applicants.filter(a => {
    const matchesSearch = !searchQuery || a.seeker_name?.toLowerCase().includes(searchQuery.toLowerCase()) || a.job_title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'pending' ? a.status === 'pending' || a.status === 'screening' : activeTab === 'shortlisted' ? a.status === 'shortlisted' : true;
    return matchesSearch && matchesTab;
  });

  const renderApplicant = ({ item }: { item: any }) => (
    <Box bg="white" mb={8} borderBottom={1} borderColor="#E5E7EB" p={16}>
      <HStack items="center" justify="space-between" mb={12}>
        <HStack items="center" flex={1}>
          <TouchableOpacity onPress={() => navigation.navigate('ApplicantDetail', { applicant: item })}>
            <Avatar source={{ uri: item.seeker_avatar }} size="lg" />
          </TouchableOpacity>
          <VStack ml={12} flex={1}>
            <Text fontSize={16} fontWeight="700" color="#111827">{item.seeker_name}</Text>
            <Text fontSize={13} color="#666666">{item.job_title}</Text>
          </VStack>
        </HStack>
        <TouchableOpacity>
          <MoreVertical size={20} color="#666666" />
        </TouchableOpacity>
      </HStack>

      <VStack space="sm" mb={16}>
        <HStack items="center">
          <CheckCircle size={16} color="#057642" />
          <Text fontSize={13} color="#057642" ml={8} fontWeight="700">{item.match_score}% Intelligence Match</Text>
        </HStack>
        <HStack items="center">
          <MapPin size={16} color="#666666" />
          <Text fontSize={13} color="#666666" ml={8}>Applied {item.applied_at}</Text>
        </HStack>
      </VStack>

      <HStack space="md">
        <Button
          label="Review Profile"
          onPress={() => navigation.navigate('ApplicantDetail', { applicant: item })}
          style={{ flex: 1, backgroundColor: BLUE, height: 40, borderRadius: 20 }}
          textStyle={{ fontSize: 13 }}
        />
        <Button
          label="Message"
          variant="outline"
          onPress={() => navigation.navigate('ChatDetail', { recipientId: item.seeker, recipientName: item.seeker_name, recipientAvatar: item.seeker_avatar })}
          style={{ flex: 1, borderColor: BLUE, height: 40, borderRadius: 20 }}
          textStyle={{ color: BLUE, fontSize: 13 }}
        />
      </HStack>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />

      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text fontSize={20} fontWeight="900" color="#111827" ml={16}>Candidates</Text>
          </HStack>
          <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
            <MessageCircle size={24} color="#666666" />
          </TouchableOpacity>
        </HStack>
      </Box>

      <Box bg="white" px={16} pt={12} borderBottom={1} borderColor="#E5E7EB">
        <HStack bg="#F3F2EF" rounded={8} items="center" px={12} py={8} mb={12}>
          <Search size={18} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or role..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#666666" />
            </TouchableOpacity>
          )}
        </HStack>
        <HStack space="lg" items="center">
          {(['pending', 'reviewed', 'shortlisted'] as const).map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
              <Text fontSize={14} fontWeight="700" color={activeTab === tab ? BLUE : '#666666'} textTransform="capitalize">{tab}</Text>
            </TouchableOpacity>
          ))}
        </HStack>
      </Box>

      <FlatList
        data={filtered}
        renderItem={renderApplicant}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          loading ? <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} /> : (
            <VStack items="center" mt={60}>
              <Briefcase size={64} color="#D1D5DB" />
              <Text fontSize={16} color="#666666" mt={16}>No candidates in this category.</Text>
            </VStack>
          )
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  tab: { paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: BLUE },
  searchInput: { flex: 1, fontSize: 14, color: '#111827', marginLeft: 8, paddingVertical: 0 },
});
