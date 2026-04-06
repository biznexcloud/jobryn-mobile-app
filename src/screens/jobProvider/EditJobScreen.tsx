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
  CircleDollarSign,
  FileText,
  Tag,
  ChevronDown,
  Info,
  Save,
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Button, Divider, Heading } from '../../components/ui';

const BLUE = '#0A66C2'; 
const GRAY_TEXT = '#666666';
const SOFT_BG = '#F3F2EF';

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
      Alert.alert('Incomplete Data', 'Please provide at least a mission title and description.');
      return;
    }
    setLoading(true);
    try {
      // Simulate API update
      await new Promise(r => setTimeout(r, 1500));
      Alert.alert('Changes Persisted', 'Your job posting has been successfully updated.', [
        { text: 'Great', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      setLoading(false);
    }
  };

  const InputLabel = ({ label, required = false }: { label: string, required?: boolean }) => (
     <HStack items="center" mb={10} space="xs">
        <Text fontSize={12} fontWeight="700" color={GRAY_TEXT} letterSpacing={0.5}>{label.toUpperCase()}</Text>
        {required && <Text color="#D22D2D">*</Text>}
     </HStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <Box pt={insets.top + 10} pb={12} bg="white" borderBottom={1} borderColor="#E0E0E0">
        <HStack items="center" justify="space-between" px={16}>
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation?.goBack()}>
              <ChevronLeft size={24} color="#000000" />
            </TouchableOpacity>
            <Heading fontSize={18} fontWeight="700" color="#000000" ml={16}>Edit Mission</Heading>
          </HStack>
          <TouchableOpacity onPress={handleSave}>
             <Text fontSize={16} fontWeight="700" color={BLUE}>Update</Text>
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
         
         <VStack mb={24}>
            <InputLabel label="Role Title" required />
            <Box h={48} border={1} borderColor="#E0E0E0" rounded={12} px={12} justify="center">
               <HStack items="center" space="sm">
                  <Briefcase size={18} color={GRAY_TEXT} />
                  <TextInput 
                     placeholder="e.g. Senior Protocol Engineer"
                     value={formData.title}
                     onChangeText={(v) => update('title', v)}
                     style={styles.input}
                  />
               </HStack>
            </Box>
         </VStack>

         <VStack mb={24}>
            <InputLabel label="Work Location" required />
            <Box h={48} border={1} borderColor="#E0E0E0" rounded={12} px={12} justify="center">
               <HStack items="center" space="sm">
                  <MapPin size={18} color={GRAY_TEXT} />
                  <TextInput 
                     placeholder="e.g. Remote (Global)"
                     value={formData.location}
                     onChangeText={(v) => update('location', v)}
                     style={styles.input}
                  />
               </HStack>
            </Box>
         </VStack>

         <HStack space="md" mb={24}>
            <VStack flex={1}>
               <InputLabel label="Min Salary ($)" />
               <Box h={48} border={1} borderColor="#E0E0E0" rounded={12} px={12} justify="center">
                  <HStack items="center" space="sm">
                     <CircleDollarSign size={18} color={GRAY_TEXT} />
                     <TextInput 
                        placeholder="80k"
                        keyboardType="numeric"
                        value={formData.salary_min}
                        onChangeText={(v) => update('salary_min', v)}
                        style={styles.input}
                     />
                  </HStack>
               </Box>
            </VStack>
            <VStack flex={1}>
               <InputLabel label="Max Salary ($)" />
               <Box h={48} border={1} borderColor="#E0E0E0" rounded={12} px={12} justify="center">
                  <HStack items="center" space="sm">
                     <CircleDollarSign size={18} color={GRAY_TEXT} />
                     <TextInput 
                        placeholder="160k"
                        keyboardType="numeric"
                        value={formData.salary_max}
                        onChangeText={(v) => update('salary_max', v)}
                        style={styles.input}
                     />
                  </HStack>
               </Box>
            </VStack>
         </HStack>

         <VStack mb={24}>
            <InputLabel label="Mission Description" required />
            <Box border={1} borderColor="#E0E0E0" rounded={12} p={12} bg="white">
               <HStack items="flex-start" space="sm">
                  <FileText size={18} color={GRAY_TEXT} style={{ marginTop: 4 }} />
                  <TextInput 
                     placeholder="Describe the responsibilities and impact..."
                     multiline
                     value={formData.description}
                     onChangeText={(v) => update('description', v)}
                     style={[styles.input, { minHeight: 120, textAlignVertical: 'top' }]}
                  />
               </HStack>
            </Box>
         </VStack>

         {/* Classification */}
         <VStack mb={24}>
            <InputLabel label="Mission Identity" />
            <Text fontSize={13} color={GRAY_TEXT} mb={10}>Select the most accurate tags for candidates.</Text>
            <HStack space="sm" flexWrap="wrap">
               {JOB_TYPES.map(type => (
                  <TouchableOpacity 
                     key={type}
                     onPress={() => update('job_type', type)}
                     style={[styles.chip, formData.job_type === type && styles.activeChip]}
                  >
                     <Text fontSize={13} fontWeight="700" color={formData.job_type === type ? 'white' : '#000000'}>{type}</Text>
                  </TouchableOpacity>
               ))}
            </HStack>
         </VStack>

         {/* Safety Banner */}
         <Box bg={SOFT_BG} p={16} rounded={12} mb={40}>
            <HStack items="flex-start" space="md">
               <Info size={18} color={BLUE} />
               <Text fontSize={12} color={BLUE} flex={1} fontWeight="700" lineHeight={18}>
                  Your updates will be reflected in searches instantly. All previous applicants will be notified if requested.
               </Text>
            </HStack>
         </Box>

         <Button 
            title={loading ? "Saving Changes..." : "Apply Updates"} 
            onPress={handleSave} 
            disabled={loading}
            style={{ backgroundColor: BLUE, height: 50, borderRadius: 25 }}
            textStyle={{ fontWeight: '800' }}
         />

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  input: { flex: 1, fontSize: 15, color: '#000000', padding: 0 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F2EF', marginBottom: 8 },
  activeChip: { backgroundColor: BLUE }
});
