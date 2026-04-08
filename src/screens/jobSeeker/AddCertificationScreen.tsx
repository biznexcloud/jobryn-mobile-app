import React from 'react';
import { X, Award, Building2, Calendar, Link, Hash, AlignLeft } from 'lucide-react-native';
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

const InputField = ({ label, value, onChangeText, placeholder, multiline, icon: Icon, keyboardType }: any) => (
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
        keyboardType={keyboardType}
        style={[styles.inputField, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
      />
    </HStack>
  </VStack>
);

export default function AddCertificationScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { certification, edit } = route.params || {};

  // ── State aligned with Certification API schema ──────────────────────────
  // Required: name, issuing_organization, issue_date
  // Optional: description, score, field_of_study, expiration_date,
  //           credential_id, credential_url, is_expired
  const [name, setName] = React.useState(certification?.name || '');
  const [issuingOrg, setIssuingOrg] = React.useState(certification?.issuing_organization || '');
  const [issueDate, setIssueDate] = React.useState(certification?.issue_date || '');
  const [expirationDate, setExpirationDate] = React.useState(certification?.expiration_date || '');
  const [fieldOfStudy, setFieldOfStudy] = React.useState(certification?.field_of_study || '');
  const [credentialId, setCredentialId] = React.useState(certification?.credential_id || '');
  const [credentialUrl, setCredentialUrl] = React.useState(certification?.credential_url || '');
  const [description, setDescription] = React.useState(certification?.description || '');
  const [score, setScore] = React.useState(certification?.score?.toString() || '');
  const [loading, setLoading] = React.useState(false);

  const formatDateForAPI = (dateStr: string) => {
    if (!dateStr) return null;
    const clean = dateStr.trim();
    // Handle MM/YYYY
    const parts = clean.split('/');
    if (parts.length === 2) return `${parts[1]}-${parts[0].padStart(2, '0')}-01`;
    // Handle YYYY
    if (clean.length === 4) return `${clean}-01-01`;
    return clean;
  };

  const handleSave = async () => {
    if (!name || !issuingOrg || !issueDate) {
      Alert.alert('Missing Info', 'Certification name, issuing organization, and issue date are required.');
      return;
    }

    setLoading(true);
    try {
      const data: Record<string, any> = {
        name,
        issuing_organization: issuingOrg,
        issue_date: formatDateForAPI(issueDate),
        expiration_date: formatDateForAPI(expirationDate),
        field_of_study: fieldOfStudy || null,
        credential_id: credentialId || null,
        credential_url: credentialUrl || null,
        description: description || null,
      };
      if (score) data.score = parseInt(score, 10);

      if (edit && certification?.id) {
        await PortfolioService.updateCertification(certification.id, data);
      } else {
        await PortfolioService.addCertification(data);
      }

      Alert.alert(
        'Success',
        edit ? 'Certification updated.' : 'Certification added to your profile.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      console.warn('Certification sync failed:', e?.response?.data || e);
      Alert.alert('Sync Error', 'Could not save certification. Please check your connection and try again.');
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
              {edit ? 'Edit Certification' : 'Add Certification'}
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
          {/* Section: Certificate Details */}
          <Box bg="white" rounded={16} p={16} mb={16} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Certificate Details</Text>
            <InputField label="Certification Name *" value={name} onChangeText={setName} placeholder="e.g. AWS Solutions Architect" icon={Award} />
            <InputField label="Issuing Organization *" value={issuingOrg} onChangeText={setIssuingOrg} placeholder="e.g. Amazon Web Services" icon={Building2} />
            <InputField label="Field of Study" value={fieldOfStudy} onChangeText={setFieldOfStudy} placeholder="e.g. Cloud Computing, AI, Management" icon={Award} />
          </Box>

          {/* Section: Dates */}
          <Box bg="white" rounded={16} p={16} mb={16} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Validity Period</Text>
            <HStack space="md">
              <Box flex={1}>
                <InputField label="Issue Date *" value={issueDate} onChangeText={setIssueDate} placeholder="MM/YYYY" icon={Calendar} />
              </Box>
              <Box flex={1}>
                <InputField label="Expiry Date" value={expirationDate} onChangeText={setExpirationDate} placeholder="MM/YYYY" icon={Calendar} />
              </Box>
            </HStack>
            <InputField
              label="Score / Mark (optional)"
              value={score}
              onChangeText={setScore}
              placeholder="e.g. 920"
              icon={Hash}
              keyboardType="numeric"
            />
          </Box>

          {/* Section: Credential */}
          <Box bg="white" rounded={16} p={16} mb={16} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Credential Verification</Text>
            <InputField label="Credential ID" value={credentialId} onChangeText={setCredentialId} placeholder="e.g. ABC123XYZ" icon={Hash} />
            <InputField label="Credential URL" value={credentialUrl} onChangeText={setCredentialUrl} placeholder="https://credential.net/…" icon={Link} />
          </Box>

          {/* Section: Description */}
          <Box bg="white" rounded={16} p={16} mb={24} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Description</Text>
            <InputField label="What You Learned" value={description} onChangeText={setDescription} placeholder="Briefly describe the skills and knowledge covered…" multiline icon={AlignLeft} />
          </Box>

          <Button
            label={edit ? 'Update Credential' : 'Add to Profile'}
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
  inputField: { flex: 1, fontSize: 16, color: '#111827', padding: 0 },
});
