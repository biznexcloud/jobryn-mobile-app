import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  View, s
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  ChevronDown,
  Globe,
  Settings,
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Button, Divider } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';
import { useAuthStore } from '../../store/authStore';

const FB_BLUE = '#1877F2';

export default function PostJobScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salary_min: '',
    salary_max: '',
    description: '',
    job_type: 'Full-time',
  });

  const update = (key: string, val: string) => setFormData(f => ({ ...f, [key]: val }));

  const handlePost = async () => {
    if (!formData.title || !formData.description) {
      Alert.alert('Missing Fields', 'Title and Description are required to post an opportunity.');
      return;
    }
    setLoading(true);
    try {
      await JobService.postJob({
        ...formData,
        job_type: 'full_time',
        experience_level: 'mid',
        salary_min: formData.salary_min || null,
        salary_max: formData.salary_max || null,
      });
      Alert.alert('Job Posted!', 'You successfully created a new opportunity.', [
        { text: 'View Posting', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to publish job posting.');
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ icon: Icon, label, placeholder, value, onChangeText, multiline = false, keyboardType = 'default' }: any) => (
    <Box mt={20}>
      <HStack items="center" mb={12}>
        <Icon size={18} color="#65676B" />
        <Text fontSize={14} fontWeight="700" color="#65676B" ml={10}>{label}</Text>
      </HStack>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#8E9194"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        style={[styles.input, multiline && { minHeight: 120, textAlignVertical: 'top' }]}
      />
      <Divider color="#E5E7EB" mt={8} />
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Facebook-style Header */}
      <Box pt={insets.top + 10} pb={12} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between" px={16}>
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerBtn}>
              <ChevronLeft size={24} color="#000000" />
            </TouchableOpacity>
            <Text fontSize={18} fontWeight="700" color="#1C1E21" ml={16}>Create Job</Text>
          </HStack>
          <Button
            label={loading ? '...' : 'Create'}
            onPress={handlePost}
            disabled={loading || (!formData.title || !formData.description)}
            style={{
              backgroundColor: (!formData.title || !formData.description) ? '#F0F2F5' : FB_BLUE,
              paddingHorizontal: 16,
              height: 36,
              borderRadius: 6
            }}
            textStyle={{ color: (!formData.title || !formData.description) ? '#8E9194' : 'white', fontWeight: '800' }}
          />
        </HStack>
      </Box>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Identity Header */}
          <HStack items="center" mb={12}>
            <Avatar source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150' }} size="lg" />
            <VStack ml={12}>
              <Text fontSize={16} fontWeight="800" color="#1C1E21">{user?.name || 'Recruiter'}</Text>
              <HStack space="sm" mt={4}>
                <TouchableOpacity style={styles.audienceChip}>
                  <Globe size={11} color="#65676B" />
                  <Text fontSize={11} fontWeight="800" color="#65676B" ml={4}>Public</Text>
                  <ChevronDown size={11} color="#65676B" style={{ marginLeft: 3 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.audienceChip}>
                  <Settings size={11} color="#65676B" />
                  <Text fontSize={11} fontWeight="800" color="#65676B" ml={4}>Post Settings</Text>
                </TouchableOpacity>
              </HStack>
            </VStack>
          </HStack>

          {/* Form Fields */}
          <Section
            icon={Briefcase} label="JOB TITLE"
            placeholder="e.g. Senior Software Architect"
            value={formData.title} onChangeText={(v: string) => update('title', v)}
          />

          <Section
            icon={MapPin} label="LOCATION"
            placeholder="e.g. Remote, Kathmandu, or Hybrid"
            value={formData.location} onChangeText={(v: string) => update('location', v)}
          />

          <HStack space="xl">
            <View style={{ flex: 1 }}>
              <Section
                icon={DollarSign} label="MIN SALARY"
                placeholder="80000"
                value={formData.salary_min} onChangeText={(v: string) => update('salary_min', v)}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Section
                icon={DollarSign} label="MAX SALARY"
                placeholder="120000"
                value={formData.salary_max} onChangeText={(v: string) => update('salary_max', v)}
                keyboardType="numeric"
              />
            </View>
          </HStack>

          <Section
            icon={FileText} label="JOB DESCRIPTION"
            placeholder="Describe the opportunity, responsibilities, and requirements..."
            value={formData.description} onChangeText={(v: string) => update('description', v)}
            multiline
          />

          <Box mt={30} pb={40}>
            <Text fontSize={13} color="#65676B" lineHeight={18} textAlign="center">
              By posting, you agree to our corporate community guidelines. Your opportunity will be visible to active seekers instantly.
            </Text>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16 },
  audienceChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  input: { fontSize: 17, color: '#1C1E21', paddingHorizontal: 0, paddingVertical: 8 },
});
