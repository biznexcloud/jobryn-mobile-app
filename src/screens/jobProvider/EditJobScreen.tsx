import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  TextInput,
  Alert,
  View,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Briefcase,
  MapPin,
  CircleDollarSign,
  FileText,
  Tag,
  ChevronDown,
  Info,
  Save,
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Button, Divider, Heading } from '../../components/ui';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const EXP_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive'];

// ── Enum ↔ Display label maps ──────────────────────────────────────────────────
// API → UI label (for initialising form from existing job data)
const JOB_TYPE_TO_LABEL: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};
const EXP_LEVEL_TO_LABEL: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
  executive: 'Executive',
};
// UI label → API enum (for sending to backend)
const LABEL_TO_JOB_TYPE: Record<string, string> = {
  'Full-time': 'full_time',
  'Part-time': 'part_time',
  'Contract': 'contract',
  'Internship': 'internship',
  'Freelance': 'freelance',
};
const LABEL_TO_EXP_LEVEL: Record<string, string> = {
  'Entry Level': 'entry',
  'Mid Level': 'mid',
  'Senior': 'senior',
  'Lead': 'lead',
  'Executive': 'executive',
};

export default function EditJobScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { job } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: job?.title || '',
    location: job?.location || '',
    salary_min: job?.salary_min?.toString() || '',
    salary_max: job?.salary_max?.toString() || '',
    description: job?.description || '',
    // Reverse-map API enum value → display label so correct chip is highlighted
    job_type: JOB_TYPE_TO_LABEL[job?.job_type] || job?.job_type || 'Full-time',
    experience_level: EXP_LEVEL_TO_LABEL[job?.experience_level] || job?.experience_level || 'Mid Level',
  });

  const update = (key: string, val: string) => setFormData(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      Alert.alert('Required Fields', 'Please provide a job title and description.');
      return;
    }
    setLoading(true);
    try {
      await JobService.updateJob(job.id, {
        ...formData,
        // Use lookup maps for reliable enum conversion
        job_type: LABEL_TO_JOB_TYPE[formData.job_type] || formData.job_type,
        experience_level: LABEL_TO_EXP_LEVEL[formData.experience_level] || formData.experience_level,
        // Convert salary strings to numbers (or null) — Django rejects string values
        salary_min: formData.salary_min ? Number(formData.salary_min) : null,
        salary_max: formData.salary_max ? Number(formData.salary_max) : null,
      });
      Toast.show({ type: 'success', text1: 'Job updated successfully' });
      navigation.goBack();
    } catch (e) {
      console.error('[EditJob] Save failed:', e);
      Toast.show({ type: 'error', text1: 'Failed to update job' });
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, value, onChangeText, placeholder, multiline = false, keyboardType = 'default' }: any) => (
    <VStack mb={20}>
       <Text fontSize={13} fontWeight="700" color={GRAY_TEXT} mb={8} ml={4}>{label.toUpperCase()}</Text>
       <Box bg={FB_GRAY} rounded={12} px={14} py={12} minH={multiline ? 120 : 50}>
          <TextInput 
             value={value}
             onChangeText={onChangeText}
             placeholder={placeholder}
             placeholderTextColor="#9CA3AF"
             multiline={multiline}
             keyboardType={keyboardType}
             style={styles.input}
             textAlignVertical={multiline ? 'top' : 'center'}
          />
       </Box>
    </VStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box px={16} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center" justify="space-between">
          <HStack items="center">
             <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
                <ChevronLeft size={22} color="black" strokeWidth={2.5} />
             </TouchableOpacity>
             <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Edit Job</Text>
          </HStack>
          <TouchableOpacity disabled={loading} onPress={handleSave}>
             {loading ? <ActivityIndicator size="small" color={FB_BLUE} /> : <Text fontSize={15} fontWeight="700" color={FB_BLUE}>Save</Text>}
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
         
         <InputField label="Job Title" value={formData.title} onChangeText={(v: string) => update('title', v)} placeholder="e.g. Senior Software Engineer" />
         <InputField label="Location" value={formData.location} onChangeText={(v: string) => update('location', v)} placeholder="e.g. Remote, UK" />

         <HStack space="md">
            <View style={{ flex: 1 }}>
               <InputField label="Salary Min ($)" value={formData.salary_min} onChangeText={(v: string) => update('salary_min', v)} placeholder="e.g. 50000" keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
               <InputField label="Salary Max ($)" value={formData.salary_max} onChangeText={(v: string) => update('salary_max', v)} placeholder="e.g. 90000" keyboardType="numeric" />
            </View>
         </HStack>

         <InputField label="Job Description" value={formData.description} onChangeText={(v: string) => update('description', v)} placeholder="Describe the role..." multiline />

         <VStack mb={24}>
            <Text fontSize={13} fontWeight="700" color={GRAY_TEXT} mb={12} ml={4}>JOB TYPE</Text>
            <HStack space="sm" flexWrap="wrap">
               {JOB_TYPES.map(type => (
                  <TouchableOpacity 
                     key={type}
                     onPress={() => update('job_type', type)}
                     style={[styles.tag, formData.job_type === type && styles.activeTag]}
                  >
                     <Text fontSize={13} fontWeight="600" color={formData.job_type === type ? 'white' : '#111827'}>{type}</Text>
                  </TouchableOpacity>
               ))}
            </HStack>
         </VStack>

         <VStack mb={32}>
            <Text fontSize={13} fontWeight="700" color={GRAY_TEXT} mb={12} ml={4}>EXPERIENCE LEVEL</Text>
            <HStack space="sm" flexWrap="wrap">
               {EXP_LEVELS.map(level => (
                  <TouchableOpacity 
                     key={level}
                     onPress={() => update('experience_level', level)}
                     style={[styles.tag, formData.experience_level === level && styles.activeTag]}
                  >
                     <Text fontSize={13} fontWeight="600" color={formData.experience_level === level ? 'white' : '#111827'}>{level}</Text>
                  </TouchableOpacity>
               ))}
            </HStack>
         </VStack>

         <Box bg="#F0F9FF" p={16} rounded={16} mb={32}>
            <HStack items="flex-start" space="sm">
               <Info size={18} color={FB_BLUE} />
               <Text fontSize={13} color="#1E3A8A" flex={1} fontWeight="600" lineHeight={18}>
                  Updates are published instantly. Applicants will be notified of significant changes if required.
               </Text>
            </HStack>
         </Box>

         <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
            <Text fontSize={16} fontWeight="700" color="white">{loading ? "Saving Changes..." : "Save Changes"}</Text>
         </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500', padding: 0 },
  tag: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F0F2F5', marginBottom: 8 },
  activeTag: { backgroundColor: FB_BLUE },
  saveBtn: { height: 50, borderRadius: 25, backgroundColor: FB_BLUE, alignItems: 'center', justifyContent: 'center' },
});
