import React from 'react';
import { X, Layers, Link, AlignLeft, Tag, Calendar } from 'lucide-react-native';
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

// API StatusEnum for projects
const PROJECT_STATUSES = ['planning', 'in-progress', 'completed', 'on-hold'];

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

export default function AddProjectScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { project, edit } = route.params || {};

  // ── State aligned with Project API schema ────────────────────────────────
  // API fields: name, description, url, role, technologies, status,
  //             repository_url, start_date, end_date
  const [name, setName] = React.useState(project?.name || '');
  const [description, setDescription] = React.useState(project?.description || '');
  const [role, setRole] = React.useState(project?.role || '');
  const [technologies, setTechnologies] = React.useState(
    Array.isArray(project?.technologies) ? project.technologies.join(', ') : (project?.technologies || '')
  );
  const [status, setStatus] = React.useState(project?.status || 'completed');
  const [url, setUrl] = React.useState(project?.url || '');
  const [repositoryUrl, setRepositoryUrl] = React.useState(project?.repository_url || '');
  const [startDate, setStartDate] = React.useState(project?.start_date || '');
  const [endDate, setEndDate] = React.useState(project?.end_date || '');
  const [loading, setLoading] = React.useState(false);

  const formatDateForAPI = (dateStr: string) => {
    if (!dateStr) return null;
    const clean = dateStr.trim();
    if (clean.length === 4 && !clean.includes('-')) return `${clean}-01-01`;
    const parts = clean.split('/');
    if (parts.length === 2) return `${parts[1]}-${parts[0].padStart(2, '0')}-01`;
    return clean;
  };

  const handleSave = async () => {
    if (!name || !description || !startDate) {
      Alert.alert('Missing Info', 'Project name, description, and start date are required.');
      return;
    }

    setLoading(true);
    try {
      // technologies can be array or string per API spec
      const techValue = technologies.trim()
        ? technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];

      const data = {
        name,
        description,
        role,
        technologies: techValue,
        status,
        url: url || null,
        repository_url: repositoryUrl || null,
        start_date: formatDateForAPI(startDate),
        end_date: formatDateForAPI(endDate),
      };

      if (edit && project?.id) {
        await PortfolioService.updateProject(project.id, data);
      } else {
        await PortfolioService.addProject(data);
      }

      Alert.alert(
        'Success',
        edit ? 'Project updated.' : 'Project added to your profile.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      console.warn('Project sync failed:', e?.response?.data || e);
      Alert.alert('Sync Error', 'Could not save project. Please check your connection and try again.');
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
              {edit ? 'Edit Project' : 'Add Project'}
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
          {/* Section: Project Core */}
          <Box bg="white" rounded={16} p={16} mb={16} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Project Details</Text>
            <InputField label="Project Name *" value={name} onChangeText={setName} placeholder="e.g. Mobile Banking Application" icon={Layers} />
            <InputField label="Your Role" value={role} onChangeText={setRole} placeholder="e.g. Lead Developer, UI Designer" icon={Tag} />

            <Text fontSize={13} fontWeight="600" color="#65676B" mb={8}>Project Status</Text>
            <HStack space="xs" mb={18} flexWrap="wrap">
              {PROJECT_STATUSES.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setStatus(s)}
                  style={[styles.badge, status === s && styles.badgeActive]}
                >
                  <Text fontSize={12} fontWeight="600" color={status === s ? 'white' : '#65676B'}>
                    {s.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </HStack>

            <InputField
              label="Description *"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the project, its purpose, and your contribution…"
              multiline
              icon={AlignLeft}
            />
          </Box>

          {/* Section: Tech Stack */}
          <Box bg="white" rounded={16} p={16} mb={16} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Technology Stack</Text>
            <InputField
              label="Technologies Used"
              value={technologies}
              onChangeText={setTechnologies}
              placeholder="e.g. React Native, TypeScript, Node.js (comma separated)"
              icon={Tag}
            />
          </Box>

          {/* Section: Duration & Links */}
          <Box bg="white" rounded={16} p={16} mb={16} shadow={1}>
            <Text fontSize={14} fontWeight="700" color="#374151" mb={16}>Duration & Links</Text>
            <HStack space="md">
              <Box flex={1}>
                <InputField label="Start Date *" value={startDate} onChangeText={setStartDate} placeholder="YYYY" icon={Calendar} />
              </Box>
              <Box flex={1}>
                <InputField label="End Date" value={endDate} onChangeText={setEndDate} placeholder="YYYY or Present" icon={Calendar} />
              </Box>
            </HStack>
            <InputField label="Live URL" value={url} onChangeText={setUrl} placeholder="https://myproject.com" icon={Link} />
            <InputField label="Repository URL" value={repositoryUrl} onChangeText={setRepositoryUrl} placeholder="https://github.com/…" icon={Link} />
          </Box>

          <Button
            label={edit ? 'Update Project' : 'Add Project'}
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
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6', marginBottom: 8, marginRight: 6 },
  badgeActive: { backgroundColor: '#1877F2' },
});
