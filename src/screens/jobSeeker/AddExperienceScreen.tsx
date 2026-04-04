import React from 'react';
import { X } from 'lucide-react-native';
import { View, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Input, Button } from '../../components/ui';

const BLUE = '#0A66C2';

export default function AddExperienceScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSave = () => { navigation.goBack(); };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text fontSize={18} fontWeight="700" color="#111827" ml={12}>Add Experience</Text>
        </HStack>
      </Box>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <VStack space="lg">
          <VStack><Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Title</Text><Input placeholder="e.g. Software Engineer" value={title} onChangeText={setTitle} style={styles.input} /></VStack>
          <VStack><Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Company</Text><Input placeholder="e.g. Google" value={company} onChangeText={setCompany} style={styles.input} /></VStack>
          <VStack><Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Location</Text><Input placeholder="e.g. London, UK" value={location} onChangeText={setLocation} style={styles.input} /></VStack>
          <VStack><Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Start Date</Text><Input placeholder="e.g. Jan 2022" value={startDate} onChangeText={setStartDate} style={styles.input} /></VStack>
          <VStack><Text fontSize={14} fontWeight="700" color="#111827" mb={8}>End Date</Text><Input placeholder="e.g. Present" value={endDate} onChangeText={setEndDate} style={styles.input} /></VStack>
          <VStack><Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Description</Text><Input placeholder="Describe your role..." value={description} onChangeText={setDescription} multiline style={[styles.input, { height: 120 }]} /></VStack>
          <Button label="Save" onPress={handleSave} style={{ backgroundColor: BLUE, height: 50, borderRadius: 25, marginTop: 20 }} />
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  input: { backgroundColor: '#F9FAFB', height: 52, borderRadius: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E5E7EB' },
});
