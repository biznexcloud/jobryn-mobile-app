import React from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  AlignLeft,
  X,
} from 'lucide-react-native';
import {
  View,
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

const BLUE = '#1877F2';
const FB_GRAY = '#F0F2F5';

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
      style={multiline ? { alignItems: 'flex-start' } : {}}
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

  const [title, setTitle] = React.useState(experience?.position || '');
  const [company, setCompany] = React.useState(experience?.company_name || '');
  const [location, setLocation] = React.useState(experience?.location || '');
  const [startDate, setStartDate] = React.useState(experience?.start_date || '');
  const [endDate, setEndDate] = React.useState(experience?.end_date || '');
  const [description, setDescription] = React.useState(experience?.description || '');

  const handleSave = () => {
    Alert.alert('Success', edit ? 'Changes saved successfully.' : 'Work experience added to profile.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
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
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text fontSize={15} fontWeight="700" color="white">Save</Text>
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
            <InputField
              label="Job Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Lead Software Engineer"
              icon={Briefcase}
            />
            <InputField
              label="Company Name"
              value={company}
              onChangeText={setCompany}
              placeholder="e.g. Acme Tech Solutions"
              icon={Building2}
            />
            <InputField
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. New York, USA (Remote)"
              icon={MapPin}
            />
          </Box>

          {/* Section: Duration */}
          <Box bg="white" rounded={16} p={16} mb={16} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Duration</Text>
            <HStack space="md">
              <Box flex={1}>
                <InputField
                  label="Start Date"
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="MM/YYYY"
                  icon={Calendar}
                />
              </Box>
              <Box flex={1}>
                <InputField
                  label="End Date"
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="Present"
                  icon={Calendar}
                />
              </Box>
            </HStack>
          </Box>

          {/* Section: Description */}
          <Box bg="white" rounded={16} p={16} mb={24} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Description</Text>
            <InputField
              label="Key Accomplishments"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your role, responsibilities and key achievements..."
              multiline
              icon={AlignLeft}
            />
          </Box>

          <Button
            label={edit ? 'Update Experience' : 'Add to Profile'}
            onPress={handleSave}
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
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
  },
});
