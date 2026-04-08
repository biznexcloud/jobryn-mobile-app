import React from 'react';
import { X, GraduationCap, MapPin, Calendar, AlignLeft, Star } from 'lucide-react-native';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Button } from '../../components/ui';
import { PortfolioService } from '../../services/api/portfolio';

const BLUE = '#1877F2';
const FB_GRAY = '#F0F2F5';

const InputField = ({ label, value, onChangeText, placeholder, multiline, keyboardType }: any) => (
  <VStack mb={18}>
    <Text fontSize={13} fontWeight="600" color="#65676B" mb={8}>{label}</Text>
    <Box bg="white" rounded={14} px={14} py={14} border={1} borderColor="#E5E7EB">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        keyboardType={keyboardType}
        style={[styles.inputField, multiline && { minHeight: 90, textAlignVertical: 'top' }]}
      />
    </Box>
  </VStack>
);

export default function AddEducationScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { education, edit } = route.params || {};

  // ── State aligned with Education API schema ──────────────────────────────
  // API fields: school, degree, field_of_study, start_date, end_date,
  //             grade, city, description, activities_societies, gpa_score
  const [school, setSchool] = React.useState(education?.school || '');
  const [degree, setDegree] = React.useState(education?.degree || '');
  const [fieldOfStudy, setFieldOfStudy] = React.useState(education?.field_of_study || '');
  const [city, setCity] = React.useState(education?.city || '');
  const [isCurrent, setIsCurrent] = React.useState(!(education?.end_date));
  const [startDate, setStartDate] = React.useState(education?.start_date || '');
  const [endDate, setEndDate] = React.useState(education?.end_date || '');
  const [grade, setGrade] = React.useState(education?.grade || '');
  const [gpaScore, setGpaScore] = React.useState(education?.gpa_score?.toString() || '');
  const [description, setDescription] = React.useState(education?.description || '');
  const [activities, setActivities] = React.useState(education?.activities_societies || '');
  const [loading, setLoading] = React.useState(false);

  // Format YYYY → YYYY-01-01 or pass through
  const formatDateForAPI = (dateStr: string) => {
    if (!dateStr) return null;
    const clean = dateStr.trim();
    if (clean.length === 4 && !clean.includes('-')) return `${clean}-01-01`;
    // Handle MM/YYYY
    const parts = clean.split('/');
    if (parts.length === 2) return `${parts[1]}-${parts[0].padStart(2, '0')}-01`;
    return clean;
  };

  const handleSave = async () => {
    if (!school || !startDate) {
      Alert.alert('Missing Info', 'School and start date are required.');
      return;
    }

    setLoading(true);
    try {
      const data: Record<string, any> = {
        school,
        degree,
        field_of_study: fieldOfStudy,
        city,
        start_date: formatDateForAPI(startDate),
        end_date: isCurrent ? null : formatDateForAPI(endDate),
        description,
        activities_societies: activities,
      };
      if (grade) data.grade = grade;
      if (gpaScore) data.gpa_score = parseFloat(gpaScore);

      if (edit && education?.id) {
        await PortfolioService.updateEducation(education.id, data);
      } else {
        await PortfolioService.addEducation(data);
      }

      Alert.alert(
        'Success',
        edit ? 'Education updated.' : 'Education added to your profile.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      console.warn('Education sync failed:', e?.response?.data || e);
      Alert.alert('Sync Error', 'Could not save education. Please check your connection and try again.');
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
              {edit ? 'Edit Education' : 'Add Education'}
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
          {/* Section: School Details */}
          <Box bg="white" rounded={16} p={16} mb={16} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Institution Details</Text>
            <InputField label="School / University *" value={school} onChangeText={setSchool} placeholder="e.g. Stanford University" />
            <InputField label="Degree" value={degree} onChangeText={setDegree} placeholder="e.g. Bachelor of Science" />
            <InputField label="Field of Study" value={fieldOfStudy} onChangeText={setFieldOfStudy} placeholder="e.g. Computer Science" />
            <InputField label="City" value={city} onChangeText={setCity} placeholder="e.g. San Francisco, CA" />
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
                  {isCurrent ? '✓ Currently Studying' : 'Set as Current'}
                </Text>
              </TouchableOpacity>
            </HStack>
            <HStack space="md">
              <Box flex={1}>
                <InputField label="Start Year *" value={startDate} onChangeText={setStartDate} placeholder="YYYY or MM/YYYY" />
              </Box>
              {!isCurrent && (
                <Box flex={1}>
                  <InputField label="End Year" value={endDate} onChangeText={setEndDate} placeholder="YYYY or MM/YYYY" />
                </Box>
              )}
            </HStack>
          </Box>

          {/* Section: Academic Performance */}
          <Box bg="white" rounded={16} p={16} mb={16} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Academic Performance</Text>
            <HStack space="md">
              <Box flex={1}>
                <InputField label="Grade / Result" value={grade} onChangeText={setGrade} placeholder="e.g. First Class" />
              </Box>
              <Box flex={1}>
                <InputField label="GPA Score" value={gpaScore} onChangeText={setGpaScore} placeholder="e.g. 3.8" keyboardType="decimal-pad" />
              </Box>
            </HStack>
          </Box>

          {/* Section: Description */}
          <Box bg="white" rounded={16} p={16} mb={24} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Additional Info</Text>
            <InputField label="Description" value={description} onChangeText={setDescription} placeholder="Notable coursework, thesis, or program highlights…" multiline />
            <InputField label="Activities & Societies" value={activities} onChangeText={setActivities} placeholder="e.g. Student Council, Robotics Club, Honor Society…" multiline />
          </Box>

          <Button
            label={edit ? 'Update Education' : 'Add Education'}
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
  saveBtn: { backgroundColor: '#1877F2', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  container: { padding: 16, paddingTop: 20 },
  inputField: { fontSize: 16, color: '#111827', padding: 0 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6' },
  badgeGreen: { backgroundColor: '#34A853' },
});
