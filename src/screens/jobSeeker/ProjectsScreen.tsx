import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper, Text, Box, VStack, HStack } from '../../components/ui';
import { 
  Plus, 
  ExternalLink, 
  Code, 
  Cpu, 
  ChevronLeft 
} from 'lucide-react-native';
import { Colors } from '../../constants';

const ProjectsScreen = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Jobryn Mobile App',
      description: 'A professional networking and job search application built with React Native and Expo.',
      tech: ['React Native', 'TypeScript', 'Zustand'],
      links: 1
    },
    {
      id: 2,
      title: 'E-commerce Dashboard',
      description: 'Real-time analytics dashboard for e-commerce platforms with inventory management.',
      tech: ['React', 'D3.js', 'Firebase'],
      links: 1
    }
  ]);

  return (
    <Box flex={1} bg={Colors.white}>
      <HStack p={20} pt={50} justify="space-between" items="center">
        <HStack items="center">
           <TouchableOpacity onPress={() => {}} style={{ padding: 4 }}>
              <ChevronLeft size={24} color="#111827" />
           </TouchableOpacity>
           <Text fontSize={20} fontWeight="bold" ml={12}>My Projects</Text>
        </HStack>
        <TouchableOpacity style={{ padding: 8, backgroundColor: '#F0F9FF', borderRadius: 20 }}>
          <Plus size={20} color={Colors.primary} />
        </TouchableOpacity>
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 0 }}>
        {projects.map((project) => (
          <Box key={project.id} bg="white" border={1} borderColor="#F1F5F9" p={20} rounded={16} mb={15}>
            <HStack justify="space-between" items="center">
              <Box bg="#F0F9FF" p={12} rounded={12}>
                <Code size={24} color={Colors.primary} />
              </Box>
              <TouchableOpacity>
                <ExternalLink size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </HStack>

            <VStack space="xs" mt={15}>
                <Text fontWeight="bold" fontSize={18}>{project.title}</Text>
                <Text color={Colors.textSecondary} style={{ lineHeight: 20 }}>{project.description}</Text>
            </VStack>

            <HStack style={{ flexWrap: 'wrap', gap: 8, marginTop: 15 }}>
              {project.tech.map((t, i) => (
                <Box key={i} bg="#F8FAFC" px={12} py={4} rounded={6}>
                  <Text fontSize={12} color={Colors.textSecondary}>{t}</Text>
                </Box>
              ))}
            </HStack>
          </Box>
        ))}

        <TouchableOpacity style={{ borderStyle: 'dashed', borderWidth: 2, borderColor: '#E2E8F0', padding: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
           <Plus size={32} color={Colors.border} />
           <Text color={Colors.textSecondary} mt={10}>Add New Project</Text>
        </TouchableOpacity>
      </ScrollView>
    </Box>
  );
};

export default ProjectsScreen;
