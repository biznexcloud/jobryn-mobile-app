import React from 'react';
import { X } from 'lucide-react-native';
import { View, TouchableOpacity, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Alert, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Button } from '../../components/ui';

const BLUE = '#1066C2';

const LabelInput = ({ label, value, onChangeText, placeholder, multiline }: any) => (
  <VStack mb={20}>
     <Text fontSize={13} fontWeight="700" color="#65676B" mb={6} textTransform="uppercase">{label}</Text>
     <Box bg="white" rounded={8} border={1} borderColor="#CED0D4" px={16} py={12}>
        <TextInput 
           value={value}
           onChangeText={onChangeText}
           placeholder={placeholder}
           placeholderTextColor="#8D949E"
           multiline={multiline}
           style={[styles.inputField, multiline && { minHeight: 120, textAlignVertical: 'top' }]}
        />
     </Box>
  </VStack>
);

export default function AddServiceScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { service, edit } = route.params || {};

  const [title, setTitle] = React.useState(service?.title || '');
  const [price, setPrice] = React.useState(service?.price || '');
  const [description, setDescription] = React.useState(service?.description || '');

  const handleSave = () => { 
    Alert.alert('Success', edit ? 'Service updated.' : 'Service added to your showcase.', [
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
                  {edit ? 'Edit Service' : 'Add Service'}
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
              <LabelInput label="Service Title" value={title} onChangeText={setTitle} placeholder="e.g. Full-stack Web Development" />
              <LabelInput label="Pricing Model" value={price} onChangeText={setPrice} placeholder="e.g. Starting from $50/hr" />
              <LabelInput 
                label="Service Description" 
                value={description} 
                onChangeText={setDescription} 
                placeholder="What exactly do you offer to your clients?" 
                multiline 
              />
           </VStack>

           <Box mb={40} mt={10}>
              <Button 
                label={edit ? "Update Service" : "Add to Showcase"} 
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
