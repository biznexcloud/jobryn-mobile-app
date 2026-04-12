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
  Image,
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
  X,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Button, Divider, Heading } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

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
    experience_level: 'Mid Level',
  });
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const update = (key: string, val: string) => setFormData(f => ({ ...f, [key]: val }));

  const handlePost = async () => {
    if (!formData.title || !formData.description) {
      Alert.alert('Incomplete Form', 'Please provide a job title and description.');
      return;
    }
    setLoading(true);
    try {
      const payload: any = {
        ...formData,
        job_type: ({
          'Full-time': 'full_time', 'Part-time': 'part_time',
          'Contract': 'contract', 'Internship': 'internship', 'Freelance': 'freelance',
        } as any)[formData.job_type] || formData.job_type,
        experience_level: ({
          'Entry Level': 'entry', 'Mid Level': 'mid', 'Senior': 'senior',
          'Lead': 'lead', 'Executive': 'executive',
        } as any)[formData.experience_level] || formData.experience_level,
        // Django DecimalFields require string numeric values
        salary_min: formData.salary_min ? String(formData.salary_min) : null,
        salary_max: formData.salary_max ? String(formData.salary_max) : null,
      };

      if (selectedImage) {
        payload.image = selectedImage;
      }

      await JobService.postJob(payload);
      Alert.alert('Success', 'Your job posting is now live.', [
        { text: 'Done', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  const InputLabel = ({ label }: { label: string }) => (
    <Text fontSize={13} fontWeight="700" color="#111827" mb={8} mt={20}>{label}</Text>
  );

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Could not open photo gallery.');
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center" justify="space-between" px={16}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
            <ChevronLeft size={22} color="black" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="700" color="#111827">Post a Job</Text>
          <TouchableOpacity 
             onPress={handlePost}
             disabled={loading || (!formData.title || !formData.description)}
             style={[
                styles.postBtn, 
                { backgroundColor: (!formData.title || !formData.description) ? '#F0F2F5' : FB_BLUE }
             ]}
          >
             <Text fontSize={13} fontWeight="700" color={(!formData.title || !formData.description) ? '#9CA3AF' : 'white'}>
                {loading ? '...' : 'Post'}
             </Text>
          </TouchableOpacity>
        </HStack>
      </Box>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Box bg="white" p={20} rounded={16}>
            <HStack items="center" mb={24} space="sm">
              <Avatar source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150' }} size="md" />
              <VStack>
                 <Text fontSize={16} fontWeight="700" color="#111827">{user?.name || 'Recruiter'}</Text>
                 <Text fontSize={13} color={GRAY_TEXT}>Hiring Manager</Text>
              </VStack>
            </HStack>

            <InputLabel label="Job Title" />
            <TextInput
              placeholder="e.g. Senior Frontend Developer"
              placeholderTextColor="#9CA3AF"
              value={formData.title}
              onChangeText={(v) => update('title', v)}
              style={styles.input}
            />

            <InputLabel label="Location" />
            <TextInput
              placeholder="e.g. Kathmandu (Remote / Hybrid)"
              placeholderTextColor="#9CA3AF"
              value={formData.location}
              onChangeText={(v) => update('location', v)}
              style={styles.input}
            />

            <HStack space="md">
               <VStack flex={1}>
                  <InputLabel label="Min Salary" />
                  <TextInput
                    placeholder="e.g. 50,000"
                    placeholderTextColor="#9CA3AF"
                    value={formData.salary_min}
                    onChangeText={(v) => update('salary_min', v)}
                    keyboardType="numeric"
                    style={styles.input}
                  />
               </VStack>
               <VStack flex={1}>
                  <InputLabel label="Max Salary" />
                  <TextInput
                    placeholder="e.g. 80,000"
                    placeholderTextColor="#9CA3AF"
                    value={formData.salary_max}
                    onChangeText={(v) => update('salary_max', v)}
                    keyboardType="numeric"
                    style={styles.input}
                  />
               </VStack>
            </HStack>

            <InputLabel label="Job Description" />
            <TextInput
              placeholder="What are the responsibilities and requirements?"
              placeholderTextColor="#9CA3AF"
              value={formData.description}
              onChangeText={(v) => update('description', v)}
              multiline
              style={[styles.input, styles.textArea]}
            />

            <VStack mt={20}>
              <Text fontSize={13} fontWeight="700" color="#111827" mb={12}>Job Type</Text>
              <HStack space="xs" flexWrap="wrap">
                {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(t => (
                  <TouchableOpacity 
                    key={t}
                    onPress={() => update('job_type', t)}
                    style={[styles.tag, formData.job_type === t && styles.activeTag]}
                  >
                    <Text fontSize={12} fontWeight="600" color={formData.job_type === t ? 'white' : '#65676B'}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </HStack>
            </VStack>

            <VStack mt={20}>
              <Text fontSize={13} fontWeight="700" color="#111827" mb={12}>Experience Level</Text>
              <HStack space="xs" flexWrap="wrap">
                {['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive'].map(l => (
                  <TouchableOpacity 
                    key={l}
                    onPress={() => update('experience_level', l)}
                    style={[styles.tag, formData.experience_level === l && styles.activeTag]}
                  >
                    <Text fontSize={12} fontWeight="600" color={formData.experience_level === l ? 'white' : '#65676B'}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </HStack>
            </VStack>

            {!selectedImage ? (
              <TouchableOpacity style={styles.mediaBtn} onPress={pickImage}>
                 <ImageIcon size={20} color={FB_BLUE} />
                 <Text fontSize={14} fontWeight="700" color={FB_BLUE} ml={10}>Add Media (Optional)</Text>
              </TouchableOpacity>
            ) : (
              <Box mt={24} style={{ borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                 <Image source={{ uri: selectedImage.uri }} style={{ width: '100%', height: 200 }} resizeMode="cover" />
                 <TouchableOpacity 
                   onPress={() => setSelectedImage(null)}
                   style={{
                     position: 'absolute', top: 8, right: 8,
                     backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16, padding: 6
                   }}
                 >
                   <X size={16} color="white" />
                 </TouchableOpacity>
              </Box>
            )}

            <Box items="center" mt={32}>
               <Text fontSize={12} color={GRAY_TEXT} textAlign="center" lineHeight={18}>
                  By posting this job, you agree to our Terms of Service. Your posting will be visible for 30 days.
               </Text>
            </Box>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 12, paddingBottom: 40 },
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  postBtn: { paddingHorizontal: 16, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  input: { backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#F0F2F5' },
  textArea: { minHeight: 150, textAlignVertical: 'top' },
  mediaBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 24, padding: 16, borderRadius: 12, backgroundColor: '#F0F9FF', justifyContent: 'center' },
  tag: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 },
  activeTag: { backgroundColor: FB_BLUE, borderColor: FB_BLUE },
});
