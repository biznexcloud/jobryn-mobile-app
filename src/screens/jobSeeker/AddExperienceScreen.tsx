import React from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  AlignLeft,
  Star,
  X,
} from 'lucide-react-native';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Button } from '../../components/ui';
import { PortfolioService } from '../../services/api/portfolio';

const BLUE = '#1877F2';
const FB_GRAY = '#F0F2F5';

// EMPLOYMENT_TYPES must match API EmploymentTypeEnum exactly
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'freelance', 'internship'];
const LOCATION_TYPES = ['on-site', 'remote', 'hybrid'];

const InputField = ({ label, value, onChangeText, placeholder, multiline, icon: Icon }: any) => (
  <VStack mb={18}>
    <Text fontSize={13} fontWeight="600" color="#65676B" mb={8}>{label}</Text>
    <HStack
      bg="white"
      rounded={14}
      px={14}
      py={14}
      border={1}
      borderColor="#E5E7EB"
      items={multiline ? 'flex-start' : 'center'}
    >
      {Icon && (
        <Box mt={multiline ? 2 : 0} mr={12}>
          <Icon size={20} color="#9CA3AF" />
        </Box>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        style={[styles.inputField, multiline && { minHeight: 90, textAlignVertical: 'top' }]}
      />
    </HStack>
  </VStack>
);

export default function AddExperienceScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { experience, edit } = route.params || {};

  // ── State aligned with Experience API schema ─────────────────────────────
  const [title, setTitle] = React.useState(experience?.title || '');
  const [company, setCompany] = React.useState(experience?.company_name || '');
  const [location, setLocation] = React.useState(experience?.location || '');
  const [employmentType, setEmploymentType] = React.useState(experience?.employment_type || 'full-time');
  const [locationType, setLocationType] = React.useState(experience?.location_type || 'on-site');
  const [isCurrent, setIsCurrent] = React.useState(experience?.is_current ?? false);
  const [startDate, setStartDate] = React.useState(experience?.start_date || '');
  const [endDate, setEndDate] = React.useState(experience?.end_date || '');
  const [description, setDescription] = React.useState(experience?.description || '');
  const [responsibilities, setResponsibilities] = React.useState(experience?.responsibilities || '');
  const [achievements, setAchievements] = React.useState(experience?.achievements || '');
  const [skillsUsed, setSkillsUsed] = React.useState(experience?.skills_used || '');
  const [loading, setLoading] = React.useState(false);

  // Format MM/YYYY → YYYY-MM-DD for backend (required date format)
  const formatDateForAPI = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.trim().split('/');
    if (parts.length === 2) return `${parts[1]}-${parts[0].padStart(2, '0')}-01`;
    return dateStr;
  };

  const handleSave = async () => {
    if (!title || !company || !startDate) {
      Alert.alert('Missing Info', 'Job position, company name, and start date are required.');
      return;
    }

    setLoading(true);
    try {
      const data = {
        title,
        company_name: company,
        location,
        employment_type: employmentType,
        location_type: locationType,
        start_date: formatDateForAPI(startDate),
        end_date: isCurrent ? null : formatDateForAPI(endDate),
        is_current: isCurrent,
        description,
        responsibilities,
        achievements,
        skills_used: skillsUsed,
      };

      if (edit && experience?.id) {
        await PortfolioService.updateExperience(experience.id, data);
      } else {
        await PortfolioService.addExperience(data);
      }

      Alert.alert(
        'Success',
        edit ? 'Experience updated successfully.' : 'Work experience added to your profile.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      console.warn('Experience sync failed:', e?.response?.data || e);
      Alert.alert('Sync Error', 'Could not save experience. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box px={16} pt={insets.top + 10} pb={14} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <X size={24} color="#050505" />
            </TouchableOpacity>
            <Text fontSize={18} fontWeight="700" color="#050505" ml={12}>
              {edit ? 'Edit Experience' : 'Add Experience'}
            </Text>
          </HStack>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={loading}>
            <Text fontSize={15} fontWeight="700" color="white">{loading ? 'Saving…' : 'Save'}</Text>
          </TouchableOpacity>
        </HStack>
      </Box>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section: Position Details */}
          <Box bg="white" rounded={16} p={16} mb={16} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Position Details</Text>
            <InputField label="Job Title *" value={title} onChangeText={setTitle} placeholder="e.g. Lead Software Engineer" icon={Briefcase} />
            <InputField label="Company Name *" value={company} onChangeText={setCompany} placeholder="e.g. Acme Tech Solutions" icon={Building2} />

            <Text fontSize={13} fontWeight="600" color="#65676B" mb={8}>Employment Type</Text>
            <HStack space="xs" mb={18} flexWrap="wrap">
              {EMPLOYMENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setEmploymentType(type)}
                  style={[styles.badge, employmentType === type && styles.badgeActive]}
                >
                  <Text fontSize={12} fontWeight="600" color={employmentType === type ? 'white' : '#65676B'}>
                    {type.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </HStack>

            <Text fontSize={13} fontWeight="600" color="#65676B" mb={8}>Work Location</Text>
            <HStack space="xs" mb={18}>
              {LOCATION_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setLocationType(type)}
                  style={[styles.badge, locationType === type && styles.badgeActive]}
                >
                  <Text fontSize={12} fontWeight="600" color={locationType === type ? 'white' : '#65676B'}>
                    {type.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </HStack>

            <InputField label="Location" value={location} onChangeText={setLocation} placeholder="e.g. New York, USA" icon={MapPin} />
          </Box>

          {/* Section: Duration */}
          <Box bg="white" rounded={16} p={16} mb={16} shadow={1}>
            <HStack justify="space-between" items="center" mb={16}>
              <Text fontSize={14} fontWeight="700" color="#374151">Duration</Text>
              <TouchableOpacity
                onPress={() => setIsCurrent(!isCurrent)}
                style={[styles.badge, isCurrent && styles.badgeGreen]}
              >
                <Text fontSize={11} fontWeight="700" color={isCurrent ? 'white' : '#65676B'}>
                  {isCurrent ? '✓ Current Role' : 'Set as Current'}
                </Text>
              </TouchableOpacity>
            </HStack>
            <HStack space="md">
              <Box flex={1}>
                <InputField label="Start Date *" value={startDate} onChangeText={setStartDate} placeholder="MM/YYYY" icon={Calendar} />
              </Box>
              {!isCurrent && (
                <Box flex={1}>
                  <InputField label="End Date" value={endDate} onChangeText={setEndDate} placeholder="MM/YYYY" icon={Calendar} />
                </Box>
              )}
            </HStack>
          </Box>

          {/* Section: Description & Achievements */}
          <Box bg="white" rounded={16} p={16} mb={24} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Details & Accomplishments</Text>
            <InputField label="Description" value={description} onChangeText={setDescription} placeholder="Describe your role and responsibilities…" multiline icon={AlignLeft} />
            <InputField label="Key Responsibilities" value={responsibilities} onChangeText={setResponsibilities} placeholder="List your main duties and responsibilities…" multiline icon={AlignLeft} />
            <InputField label="Achievements" value={achievements} onChangeText={setAchievements} placeholder="Quantify your wins (e.g. Increased revenue by 30%)…" multiline icon={Star} />
            <InputField label="Skills Used" value={skillsUsed} onChangeText={setSkillsUsed} placeholder="e.g. React Native, TypeScript, Node.js" icon={Briefcase} />
          </Box>

          <Button
            label={edit ? 'Update Experience' : 'Add to Profile'}
            onPress={handleSave}
            loading={loading}
            bg={BLUE}
            style={{ height: 54, borderRadius: 27 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  saveBtn: {
    backgroundColor: '#1877F2',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  container: { padding: 16, paddingTop: 20 },
  inputField: { flex: 1, fontSize: 16, color: '#111827', padding: 0 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
    marginRight: 6,
  },
  badgeActive: { backgroundColor: '#1877F2' },
  badgeGreen: { backgroundColor: '#34A853' },
});
