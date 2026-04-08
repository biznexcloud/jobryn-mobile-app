import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Button } from '../../components/ui';
import { ChevronLeft, Plus, Image as ImageIcon, Pencil, Trash2, Link, Calendar } from 'lucide-react-native';
import { PortfolioService } from '../../services/api/portfolio';
import { useFocusEffect } from '@react-navigation/native';

const BLUE = '#1066C2';
const FB_GRAY = '#F0F2F5';

const ProjectCard = ({ project, onEdit, onDelete }: any) => (
  <Box bg="white" p={16} mb={12} rounded={8} border={1} borderColor="#CED0D4">
     <HStack justify="space-between" items="flex-start">
        <HStack flex={1} items="flex-start">
           <Box w={48} h={48} bg="#F2F3F5" rounded={4} items="center" justify="center">
              <ImageIcon size={26} color="#65676B" />
           </Box>
           <VStack ml={12} flex={1}>
              <Text fontSize={17} fontWeight="700" color="#1C1E21">{project.name}</Text>
              <Text fontSize={14} color="#65676B" mt={2} numberOfLines={2}>{project.description}</Text>
              
              <HStack mt={8} items="center" space="md">
                 {(project.start_date || project.end_date) && (
                   <HStack items="center">
                      <Calendar size={12} color="#65676B" />
                      <Text fontSize={12} color="#65676B" ml={4}>
                         {project.start_date || 'N/A'} - {project.end_date || 'Present'}
                      </Text>
                   </HStack>
                 )}
                 {project.url && (
                   <HStack items="center">
                      <Link size={12} color={BLUE} />
                      <Text fontSize={12} color={BLUE} ml={4} numberOfLines={1}>Link</Text>
                   </HStack>
                 )}
              </HStack>
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

export default function ProjectManagementScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const resp = await PortfolioService.getProjects();
      setProjects(resp?.results || []);
    } catch (e) {
      console.warn('Failed to fetch projects:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProjects();
    }, [])
  );

  const handleDelete = (id: any) => {
    Alert.alert('Delete Project', 'Are you sure you want to remove this project?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await PortfolioService.deleteProject(id);
          fetchProjects();
        } catch (e) {
          Alert.alert('Error', 'Failed to delete project.');
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
               <Text fontSize={18} fontWeight="700" color="#1C1E21" ml={16}>Your Projects</Text>
            </HStack>
            <TouchableOpacity onPress={() => navigation.navigate('AddProject')}>
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
               {projects.map(proj => (
                  <ProjectCard 
                     key={proj.id} 
                     project={proj} 
                     onEdit={() => navigation.navigate('AddProject', { edit: true, project: proj })}
                     onDelete={() => handleDelete(proj.id)}
                  />
               ))}
               {projects.length === 0 && (
                  <Box py={40} items="center">
                     <Text color="#65676B">No projects found.</Text>
                  </Box>
               )}
            </VStack>
         )}

         <Button 
            label="Add New Project" 
            variant="outline"
            onPress={() => navigation.navigate('AddProject')}
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
