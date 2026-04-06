import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Briefcase,
  MapPin,
  CircleDollarSign,
  FileText,
  ChevronDown,
  Globe,
  Settings,
  Image as ImageIcon,
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Button, Divider, Heading } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

const BLUE = '#0A66C2'; 
const GRAY_TEXT = '#666666';
const SOFT_BG = '#F3F2EF';

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
      Alert.alert('Success!', 'Opportunity published to the network.', [
        { text: 'View Posting', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to publish posting.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, placeholder, value, onChangeText, icon: Icon, multiline = false, keyboardType = 'default' }: any) => (
    <Box mt={24}>
      <HStack items="center" mb={10} space="sm">
        <Icon size={16} color={GRAY_TEXT} />
        <Text fontSize={12} fontWeight="700" color={GRAY_TEXT} letterSpacing={0.5}>{label.toUpperCase()}</Text>
      </HStack>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999999"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        style={[styles.input, multiline && { minHeight: 120, textAlignVertical: 'top' }]}
      />
      <Box h={1} bg="#E0E0E0" mt={4} />
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Professional Minimal Header */}
      <Box pt={insets.top + 10} pb={12} bg="white" borderBottom={1} borderColor="#E0E0E0">
        <HStack items="center" justify="space-between" px={16}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <ChevronLeft size={24} color="#000000" />
          </TouchableOpacity>
          <Heading fontSize={18} fontWeight="700" color="#000000">Post Opportunity</Heading>
          <Button
            label={loading ? '...' : 'Publish'}
            onPress={handlePost}
            disabled={loading || (!formData.title || !formData.description)}
            style={{
              backgroundColor: (!formData.title || !formData.description) ? '#EDF3F8' : BLUE,
              paddingHorizontal: 16,
              height: 36,
              borderRadius: 18
            }}
            textStyle={{ color: (!formData.title || !formData.description) ? '#666666' : 'white', fontWeight: '700', fontSize: 13 }}
          />
        </HStack>
      </Box>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Identity Section */}
          <HStack items="center" mb={24} space="md">
            <Avatar source={{ uri: user?.profile_picture || 'https://logo.clearbit.com/linkedin.com' }} size="lg" rounded={6} />
            <VStack flex={1}>
              <Text fontSize={16} fontWeight="700" color="#000000">{user?.name || 'Managing Director'}</Text>
              <HStack space="xs" mt={4}>
                <TouchableOpacity style={styles.statusChip}>
                  <Globe size={11} color={GRAY_TEXT} />
                  <Text fontSize={11} fontWeight="700" color={GRAY_TEXT} ml={4}>Everyone</Text>
                  <ChevronDown size={11} color={GRAY_TEXT} style={{ marginLeft: 2 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.statusChip}>
                  <Settings size={11} color={GRAY_TEXT} />
                  <Text fontSize={11} fontWeight="700" color={GRAY_TEXT} ml={4}>Settings</Text>
                </TouchableOpacity>
              </HStack>
            </VStack>
          </HStack>

          {/* Form Content */}
          <InputField 
            label="Opportunity Title" placeholder="e.g. Senior Frontend Architect" 
            value={formData.title} onChangeText={(v: string) => update('title', v)} icon={Briefcase}
          />

          <InputField 
            label="Location" placeholder="e.g. Remote, San Francisco, or Hybrid" 
            value={formData.location} onChangeText={(v: string) => update('location', v)} icon={MapPin}
          />

          <HStack space="xl">
            <View style={{ flex: 1 }}>
              <InputField 
                label="Min Salary" placeholder="80000" 
                value={formData.salary_min} onChangeText={(v: string) => update('salary_min', v)} 
                icon={CircleDollarSign} keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <InputField 
                label="Max Salary" placeholder="120000" 
                value={formData.salary_max} onChangeText={(v: string) => update('salary_max', v)} 
                icon={CircleDollarSign} keyboardType="numeric"
              />
            </View>
          </HStack>

          <InputField 
            label="Mission Description" placeholder="Define the requirements, responsibilities, and future impact..." 
            value={formData.description} onChangeText={(v: string) => update('description', v)} 
            icon={FileText} multiline
          />

          <TouchableOpacity style={styles.mediaBtn}>
             <ImageIcon size={20} color={BLUE} />
             <Text fontSize={14} fontWeight="700" color={BLUE} ml={10}>Add Featured Image</Text>
          </TouchableOpacity>

          <Box mt={40} pb={60}>
            <Text fontSize={12} color={GRAY_TEXT} lineHeight={18} textAlign="center">
              By publishing, you agree to our professional guidelines. Your opportunity will be instantly visible to the Nexus network.
            </Text>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20 },
  statusChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F2EF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  input: { fontSize: 16, color: '#000000', paddingHorizontal: 0, paddingVertical: 8, fontWeight: '500' },
  mediaBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 32, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EDF3F8', backgroundColor: '#F8FAFC', borderStyle: 'dashed' }
});
