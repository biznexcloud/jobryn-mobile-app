import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Button } from '../../components/ui';
import { ChevronLeft, X, Plus, MapPin, Briefcase, Calendar, Info } from 'lucide-react-native';

const BLUE = '#1066C2';

const ChipGroup = ({ data, onRemove }: any) => (
  <HStack flexWrap="wrap" space="xs" mb={16}>
    {data.map((item: string, idx: number) => (
      <Box 
        key={idx} 
        bg="#F0F2F5" 
        px={14} 
        py={8} 
        rounded={20} 
        items="center" 
        justify="center" 
        border={1}
        borderColor="#CED0D4"
        style={{ flexDirection: 'row' }}
      >
        <Text fontSize={15} color="#1C1E21" fontWeight="600">{item}</Text>
        <TouchableOpacity onPress={() => onRemove(item)} style={{ marginLeft: 8 }}>
          <X size={16} color="#65676B" />
        </TouchableOpacity>
      </Box>
    ))}
  </HStack>
);

const PreferenceSection = ({ title, subtitle, children }: any) => (
  <Box bg="white" p={16} mb={8}>
     <Text fontSize={18} fontWeight="700" color="#1C1E21">{title}</Text>
     <Text fontSize={14} color="#65676B" mb={16} mt={2}>{subtitle}</Text>
     {children}
  </Box>
);

export default function JobPreferencesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [titles, setTitles] = useState(['Software Engineer', 'Frontend Developer']);
  const [locations, setLocations] = useState(['London, UK', 'Remote']);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleAddTitle = () => {
    if (newTitle.trim()) {
      setTitles([...titles, newTitle.trim()]);
      setNewTitle('');
    }
  };

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="#F0F2F5">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box pt={insets.top + 10} pb={12} bg="white" borderBottom={1} borderColor="#CED0D4">
         <HStack items="center" px={16} justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <X size={26} color="#1C1E21" />
               </TouchableOpacity>
               <Text fontSize={18} fontWeight="700" color="#1C1E21" ml={16}>Job preferences</Text>
            </HStack>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Text fontSize={16} fontWeight="700" color={BLUE}>Done</Text>
            </TouchableOpacity>
         </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
         <Box p={16}>
            <Text fontSize={15} color="#65676B">Recruiters will see these preferences when searching for candidates.</Text>
         </Box>

         <PreferenceSection title="Job titles" subtitle="Add the roles you're interested in (Up to 5)">
            <ChipGroup data={titles} onRemove={(t: string) => setTitles(titles.filter(i => i !== t))} />
            <HStack bg="#F0F2F5" rounded={8} px={12} items="center">
               <Briefcase size={18} color="#65676B" />
               <TextInput 
                  placeholder="Add a title..." 
                  value={newTitle}
                  onChangeText={setNewTitle}
                  onSubmitEditing={handleAddTitle}
                  style={styles.inlineInput} 
               />
               <TouchableOpacity onPress={handleAddTitle}><Plus size={22} color={BLUE} /></TouchableOpacity>
            </HStack>
         </PreferenceSection>

         <PreferenceSection title="Job locations" subtitle="Cities or countries you're open to working in">
            <ChipGroup data={locations} onRemove={(l: string) => setLocations(locations.filter(i => i !== l))} />
            <HStack bg="#F0F2F5" rounded={8} px={12} items="center">
               <MapPin size={18} color="#65676B" />
               <TextInput 
                  placeholder="Add a location..." 
                  value={newLocation}
                  onChangeText={setNewLocation}
                  onSubmitEditing={handleAddLocation}
                  style={styles.inlineInput} 
               />
               <TouchableOpacity onPress={handleAddLocation}><Plus size={22} color={BLUE} /></TouchableOpacity>
            </HStack>
         </PreferenceSection>

         <PreferenceSection title="Start date" subtitle="When are you available to start?">
            <HStack space="md">
               <TouchableOpacity style={[styles.choiceBtn, styles.activeChoice]}>
                  <Text color="white" fontWeight="700">Immediately</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.choiceBtn}>
                  <Text color="#65676B" fontWeight="700">Flexible</Text>
               </TouchableOpacity>
            </HStack>
         </PreferenceSection>

         <PreferenceSection title="Job types" subtitle="Select your preferred categories">
            <VStack space="xs">
               {['Full-time', 'Contract', 'Part-time', 'Internship', 'Temporary'].map((type, i) => (
                  <HStack key={i} items="center" justify="space-between" py={12} borderBottom={i < 4 ? 1 : 0} borderColor="#F0F2F5">
                     <Text fontSize={16} color="#1C1E21">{type}</Text>
                     <Box w={22} h={22} rounded={11} border={2} borderColor={i === 0 ? BLUE : '#CED0D4'} items="center" justify="center">
                        {i === 0 && <Box w={12} h={12} rounded={6} bg={BLUE} />}
                     </Box>
                  </HStack>
               ))}
            </VStack>
         </PreferenceSection>

         <Box px={16} mt={20}>
            <Button 
               label="Update preferences" 
               bg={BLUE} 
               onPress={() => {
                  Alert.alert('Preferences Saved', 'Your career interests have been updated.');
                  navigation.goBack();
               }} 
               style={{ height: 50, borderRadius: 25 }}
            />
         </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  inlineInput: { flex: 1, height: 48, paddingHorizontal: 12, fontSize: 15, color: '#1C1E21' },
  choiceBtn: { flex: 1, height: 46, borderRadius: 23, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  activeChoice: { backgroundColor: BLUE },
});
