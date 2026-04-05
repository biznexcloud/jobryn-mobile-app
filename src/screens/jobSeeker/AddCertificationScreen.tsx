import React from 'react';
import { X } from 'lucide-react-native';
import { View, TouchableOpacity, TextInput, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Input, Button } from '../../components/ui';

const BLUE = '#1066C2';

const LabelInput = ({ label, value, onChangeText, placeholder }: any) => (
  <VStack mb={20}>
     <Text fontSize={13} fontWeight="700" color="#65676B" mb={6} textTransform="uppercase">{label}</Text>
     <Box bg="white" rounded={8} border={1} borderColor="#CED0D4" px={16} py={12}>
        <TextInput 
           value={value}
           onChangeText={onChangeText}
           placeholder={placeholder}
           placeholderTextColor="#8D949E"
           style={styles.inputField}
        />
     </Box>
  </VStack>
);

export default function AddCertificationScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { certification, edit } = route.params || {};

  const [name, setName] = React.useState(certification?.name || '');
  const [issuer, setIssuer] = React.useState(certification?.issuer || '');
  const [date, setDate] = React.useState(certification?.date || '');
  const [url, setUrl] = React.useState(certification?.url || '');

  const handleSave = () => { 
    Alert.alert('Success', edit ? 'Certification updated.' : 'Certification added to profile.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
         <HStack items="center" justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <X size={26} color="#000000" />
               </TouchableOpacity>
               <Text fontSize={18} fontWeight="700" color="#000000" ml={16}>
                  {edit ? 'Edit Certification' : 'Add Certification'}
               </Text>
            </HStack>
            <TouchableOpacity onPress={handleSave}>
               <Text fontSize={16} fontWeight="700" color={BLUE}>Save</Text>
            </TouchableOpacity>
         </HStack>
      </Box>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
           <VStack>
              <LabelInput label="Certification Name" value={name} onChangeText={setName} placeholder="e.g. Google UX Design Certificate" />
              <LabelInput label="Issuing Organization" value={issuer} onChangeText={setIssuer} placeholder="e.g. Coursera / Google" />
              <LabelInput label="Issue Date" value={date} onChangeText={setDate} placeholder="MM/YYYY" />
              <LabelInput label="Credential URL" value={url} onChangeText={setUrl} placeholder="https://..." />
           </VStack>

           <Box mb={40} mt={10}>
              <Button 
                label={edit ? "Update Credential" : "Add to Profile"} 
                onPress={handleSave} 
                bg={BLUE} 
                style={{ height: 50, borderRadius: 25 }}
              />
           </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  inputField: { fontSize: 16, color: '#1C1E21', padding: 0 },
});
