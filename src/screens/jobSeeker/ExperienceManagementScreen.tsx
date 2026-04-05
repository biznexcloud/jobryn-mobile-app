import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Button } from '../../components/ui';
import { ChevronLeft, Plus, Briefcase, Pencil, Trash2, Calendar, MapPin } from 'lucide-react-native';

const BLUE = '#1066C2';
const FB_GRAY = '#F0F2F5';

const ExperienceCard = ({ exp, onEdit, onDelete }: any) => (
  <Box bg="white" p={16} mb={12} rounded={8} border={1} borderColor="#CED0D4">
     <HStack justify="space-between" items="flex-start">
        <HStack flex={1} items="flex-start">
           <Box w={48} h={48} bg="#F2F3F5" rounded={4} items="center" justify="center">
              <Briefcase size={26} color="#65676B" />
           </Box>
           <VStack ml={12} flex={1}>
              <Text fontSize={17} fontWeight="700" color="#1C1E21">{exp.position}</Text>
              <Text fontSize={15} color="#1C1E21" mt={1}>{exp.company_name}</Text>
              <Text fontSize={13} color="#65676B" mt={4}>
                 {exp.start_date} - {exp.end_date}
              </Text>
              <Text fontSize={13} color="#65676B" mt={1}>{exp.location}</Text>
           </VStack>
        </HStack>
        <HStack space="md">
           <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
              <Pencil size={20} color="#65676B" />
           </TouchableOpacity>
           <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
              <Trash2 size={20} color="#F5222D" />
           </TouchableOpacity>
        </HStack>
     </HStack>
  </Box>
);

export default function ExperienceManagementScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [experiences, setExperiences] = useState([
    { id: 1, position: 'Senior Software Engineer', company_name: 'TechCorp Solutions', start_date: 'Jan 2022', end_date: 'Present', location: 'London, UK', description: 'Leading the frontend team...' },
    { id: 2, position: 'Mobile Developer', company_name: 'Innovate Mobile', start_date: 'Jun 2018', end_date: 'Dec 2021', location: 'Remote', description: 'Developed React Native apps...' },
  ]);

  const handleDelete = (id: number) => {
    Alert.alert('Delete Experience', 'Are you sure you want to remove this work history entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setExperiences(experiences.filter(e => e.id !== id)) }
    ]);
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#CED0D4">
         <HStack items="center" px={16} justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ChevronLeft size={28} color="#1C1E21" />
               </TouchableOpacity>
               <Text fontSize={18} fontWeight="700" color="#1C1E21" ml={16}>Work Experience</Text>
            </HStack>
            <TouchableOpacity onPress={() => navigation.navigate('AddExperience')}>
               <Plus size={26} color={BLUE} strokeWidth={2.5} />
            </TouchableOpacity>
         </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
         <VStack mb={20}>
            {experiences.map(exp => (
               <ExperienceCard 
                  key={exp.id} 
                  exp={exp} 
                  onEdit={() => navigation.navigate('AddExperience', { edit: true, experience: exp })}
                  onDelete={() => handleDelete(exp.id)}
               />
            ))}
         </VStack>

         <Button 
            label="Add Position" 
            variant="outline"
            onPress={() => navigation.navigate('AddExperience')}
            style={{ height: 44, borderRadius: 22, borderColor: BLUE }}
            textStyle={{ color: BLUE, fontWeight: '700' }}
         />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, paddingBottom: 40 },
  actionBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F2F5', borderRadius: 18 },
});
