import React from 'react';
import { X } from 'lucide-react-native';
import { View, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Input, Button } from '../../components/ui';

const BLUE = '#0A66C2';

export default function AddProjectScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [url, setUrl] = React.useState('');

  const handleSave = () => { navigation.goBack(); };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text fontSize={18} fontWeight="700" color="#111827" ml={12}>Add Project</Text>
        </HStack>
      </Box>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <VStack space="lg">
          <VStack><Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Project Name</Text><Input placeholder="e.g. AI Dashboard" value={name} onChangeText={setName} style={styles.input} /></VStack>
          <VStack><Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Description</Text><Input placeholder="Describe the project..." value={description} onChangeText={setDescription} multiline style={[styles.input, { height: 120 }]} /></VStack>
          <VStack><Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Project URL</Text><Input placeholder="https://..." value={url} onChangeText={setUrl} style={styles.input} /></VStack>
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
