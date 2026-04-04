import React from 'react';
import { X } from 'lucide-react-native';
import { View, TouchableOpacity, TextInput, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Input, Button } from '../../components/ui';

const BLUE = '#0A66C2';

export default function AddCertificationScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [name, setName] = React.useState('');
  const [issuer, setIssuer] = React.useState('');
  const [date, setDate] = React.useState('');
  const [url, setUrl] = React.useState('');

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
            <Text fontSize={18} fontWeight="700" color="#111827" ml={12}>Add Certification</Text>
          </HStack>
        </HStack>
      </Box>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <VStack space="lg">
          <VStack>
            <Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Certification Name</Text>
            <Input placeholder="e.g. AWS Solutions Architect" value={name} onChangeText={setName} style={styles.input} />
          </VStack>
          <VStack>
            <Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Issuing Organization</Text>
            <Input placeholder="e.g. Amazon Web Services" value={issuer} onChangeText={setIssuer} style={styles.input} />
          </VStack>
          <VStack>
            <Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Issue Date</Text>
            <Input placeholder="e.g. Jan 2024" value={date} onChangeText={setDate} style={styles.input} />
          </VStack>
          <VStack>
            <Text fontSize={14} fontWeight="700" color="#111827" mb={8}>Credential URL</Text>
            <Input placeholder="https://..." value={url} onChangeText={setUrl} style={styles.input} />
          </VStack>
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
