import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Button } from '../../components/ui';
import { ChevronLeft, Plus, GraduationCap, Pencil, Trash2 } from 'lucide-react-native';
import { PortfolioService } from '../../services/api/portfolio';
import { useFocusEffect } from '@react-navigation/native';

const BLUE = '#1066C2';
const FB_GRAY = '#F0F2F5';

const EducationCard = ({ edu, onEdit, onDelete }: any) => (
  <Box bg="white" p={16} mb={12} rounded={8} border={1} borderColor="#CED0D4">
     <HStack justify="space-between" items="flex-start">
        <HStack flex={1} items="flex-start">
           <Box w={48} h={48} bg="#F2F3F5" rounded={4} items="center" justify="center">
              <GraduationCap size={26} color="#65676B" />
           </Box>
           <VStack ml={12} flex={1}>
              <Text fontSize={17} fontWeight="700" color="#1C1E21">{edu.school}</Text>
              <Text fontSize={15} color="#1C1E21" mt={1}>{edu.degree}, {edu.field}</Text>
              <Text fontSize={13} color="#65676B" mt={4}>
                 {edu.start_date} - {edu.current ? 'Present' : edu.end_date}
              </Text>
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

export default function EducationManagementScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const resp = await PortfolioService.getEducation();
      setEducation(resp?.results || []);
    } catch (e) {
      console.warn('Failed to fetch education:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEducation();
    }, [])
  );

  const handleDelete = (id: any) => {
    Alert.alert('Delete Education', 'Are you sure you want to remove this education entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await PortfolioService.deleteEducation(id);
          fetchEducation();
        } catch (e) {
          Alert.alert('Error', 'Failed to delete education.');
        }
      }}
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
               <Text fontSize={18} fontWeight="700" color="#1C1E21" ml={16}>Education</Text>
            </HStack>
            <TouchableOpacity onPress={() => navigation.navigate('AddEducation')}>
               <Plus size={26} color={BLUE} strokeWidth={2.5} />
            </TouchableOpacity>
         </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
         {loading ? (
            <Box py={40} items="center">
               <ActivityIndicator color={BLUE} />
            </Box>
         ) : (
            <VStack mb={20}>
               {education.map(edu => (
                  <EducationCard 
                     key={edu.id} 
                     edu={edu} 
                     onEdit={() => navigation.navigate('AddEducation', { edit: true, education: edu })}
                     onDelete={() => handleDelete(edu.id)}
                  />
               ))}
               {education.length === 0 && (
                  <Box py={40} items="center">
                     <Text color="#65676B">No education history found.</Text>
                  </Box>
               )}
            </VStack>
         )}

         <Button 
            label="Add Education" 
            variant="outline"
            onPress={() => navigation.navigate('AddEducation')}
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
