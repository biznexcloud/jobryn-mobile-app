import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  TextInput,
  Alert,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Tag,
  ChevronDown,
  Info,
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Button, Divider } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';

const BLUE = '#0A66C2';
const GRAY_BG = '#F3F2EF';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const EXP_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive'];

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
    job_type: job?.job_type || 'Full-time',
    experience_level: job?.experience_level || 'Mid Level',
  });

  const update = (key: string, val: string) => setFormData(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      Alert.alert('Missing Info', 'Please fill in at least a title and description.');
      return;
    }
    setLoading(true);
    try {
      await JobService.updateJob?.(job?.id, {
        title: formData.title,
        location: formData.location,
        description: formData.description,
        salary_min: formData.salary_min || null,
        salary_max: formData.salary_max || null,
        job_type: formData.job_type?.toLowerCase().replace('-', '_').replace(' ', '_'),
        experience_level: formData.experience_level?.toLowerCase().replace(' ', '_'),
      });
      Alert.alert('Updated!', 'Your job posting has been updated successfully.', [
        { text: 'Done', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to update job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, icon: Icon, placeholder, value, onChangeText, multiline = false, keyboardType = 'default' }: any) => (
    <VStack mb={16}>
      <Text fontSize={13} fontWeight="700" color="#6B7280" mb={6}>{label}</Text>
      <HStack bg="white" rounded={10} px={12} py={multiline ? 12 : 0} border={1} borderColor="#E5E7EB" items={multiline ? 'flex-start' : 'center'}>
        {Icon && <Icon size={18} color="#9CA3AF" style={{ marginTop: multiline ? 2 : 0 }} />}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          keyboardType={keyboardType}
          style={[styles.input, { marginLeft: Icon ? 10 : 0, minHeight: multiline ? 100 : 44 }]}
          placeholderTextColor="#9CA3AF"
        />
      </HStack>
    </VStack>
  );

  const PickerRow = ({ label, options, value, onSelect }: any) => (
    <VStack mb={16}>
      <Text fontSize={13} fontWeight="700" color="#6B7280" mb={8}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((opt: string) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, value === opt && styles.activeChip]}
            onPress={() => onSelect(opt)}
          >
            <Text fontSize={13} fontWeight="700" color={value === opt ? 'white' : '#6B7280'}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </VStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />

      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
              <ChevronLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text fontSize={18} fontWeight="700" color="#111827" ml={12}>Edit Job Posting</Text>
          </HStack>
          <TouchableOpacity onPress={handleSave}>
            <Text fontSize={16} fontWeight="700" color={BLUE}>Save</Text>
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Box bg="white" p={16} rounded={12} mb={16}>
          <Text fontSize={16} fontWeight="700" color="#111827" mb={16}>Job Details</Text>
          <Field label="Job Title" icon={Briefcase} placeholder="e.g. Senior Engineer" value={formData.title} onChangeText={(v: string) => update('title', v)} />
          <Field label="Location" icon={MapPin} placeholder="e.g. Remote or Kathmandu" value={formData.location} onChangeText={(v: string) => update('location', v)} />
          <HStack space="md">
            <View style={{ flex: 1 }}>
              <Field label="Min Salary ($)" icon={DollarSign} placeholder="80000" value={formData.salary_min} onChangeText={(v: string) => update('salary_min', v)} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Max Salary ($)" icon={DollarSign} placeholder="120000" value={formData.salary_max} onChangeText={(v: string) => update('salary_max', v)} keyboardType="numeric" />
            </View>
          </HStack>
          <Field label="Job Description" icon={FileText} placeholder="Describe the role, responsibilities, and requirements..." value={formData.description} onChangeText={(v: string) => update('description', v)} multiline />
        </Box>

        <Box bg="white" p={16} rounded={12} mb={16}>
          <Text fontSize={16} fontWeight="700" color="#111827" mb={16}>Classification</Text>
          <PickerRow label="Job Type" options={JOB_TYPES} value={formData.job_type} onSelect={(v: string) => update('job_type', v)} />
          <PickerRow label="Experience Level" options={EXP_LEVELS} value={formData.experience_level} onSelect={(v: string) => update('experience_level', v)} />
        </Box>

        <Box bg="#EDF3F8" p={16} rounded={12} mb={32}>
          <HStack items="flex-start">
            <Info size={18} color={BLUE} />
            <Text fontSize={12} color="#0A66C2" ml={10} flex={1} lineHeight={18}>
              Changes will go live immediately. Candidates who already applied will still be visible.
            </Text>
          </HStack>
        </Box>

        <Button
          label="Save Changes"
          loading={loading}
          onPress={handleSave}
          style={{ backgroundColor: BLUE, height: 52, borderRadius: 26 }}
          textStyle={{ fontSize: 16, fontWeight: '800' }}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  input: { flex: 1, fontSize: 15, color: '#111827', padding: 0 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F2EF', borderWidth: 1, borderColor: '#E5E7EB' },
  activeChip: { backgroundColor: BLUE, borderColor: BLUE },
});
