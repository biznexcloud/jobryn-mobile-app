import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper, Text, Box, VStack, HStack } from '../../components/ui';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Users,
  ChevronRight,
  ChevronLeft
} from 'lucide-react-native';
import { Colors } from '../../constants';

const CompanyDetailScreen = ({ route }: any) => {
  const company = {
    name: 'TechFlow Systems',
    industry: 'Information Technology',
    location: 'San Francisco, CA',
    employees: '500-1000',
    website: 'www.techflow.io',
    description: 'TechFlow is a leading provider of innovative cloud solutions and digital transformation services. We empower businesses to scale more efficiently through our cutting-edge AI-driven platform.',
    openJobs: 12
  };

  return (
    <Box flex={1} bg={Colors.white}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box h={150} bg={Colors.border}>
           <TouchableOpacity 
             onPress={() => {}} 
             style={{ position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8, backgroundColor: 'white', borderRadius: 20 }}
           >
              <ChevronLeft size={24} color="#000000" />
           </TouchableOpacity>
        </Box>
        
        <VStack px={20} mt={-40} space="xl">
          <HStack items="flex-end" justify="space-between">
            <Box bg="white" p={4} rounded={16} border={1} borderColor="#F1F5F9">
              <Box bg="#F8FAFC" w={80} h={80} rounded={12} items="center" justify="center">
                 <Building2 size={40} color={Colors.primary} />
              </Box>
            </Box>
            <TouchableOpacity style={{ backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 }}>
              <Text color={Colors.white} fontWeight="bold">Follow</Text>
            </TouchableOpacity>
          </HStack>

          <VStack space="xs">
            <Text fontSize={24} fontWeight="bold">{company.name}</Text>
            <Text color={Colors.primary} fontWeight="600">{company.industry}</Text>
          </VStack>

          <VStack space="md" p={16} rounded={16} border={1} borderColor="#F1F5F9" bg="#F9FAFB">
             <HStack space="md" items="center">
                <MapPin size={20} color={Colors.textSecondary} />
                <Text color={Colors.textPrimary}>{company.location}</Text>
             </HStack>
             <HStack space="md" items="center">
                <Users size={20} color={Colors.textSecondary} />
                <Text color={Colors.textPrimary}>{company.employees} employees</Text>
             </HStack>
             <HStack space="md" items="center">
                <Globe size={20} color={Colors.textSecondary} />
                <Text color={Colors.primary}>{company.website}</Text>
             </HStack>
          </VStack>

          <VStack space="sm">
            <Text fontSize={18} fontWeight="bold">About Us</Text>
            <Text color={Colors.textPrimary} style={{ lineHeight: 24 }}>{company.description}</Text>
          </VStack>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#F0F9FF', borderRadius: 16, marginBottom: 30 }}>
            <VStack>
              <Text fontWeight="bold" color={Colors.primary}>Open Positions</Text>
              <Text fontSize={14} color={Colors.primary} style={{ opacity: 0.8 }}>{company.openJobs} active listings</Text>
            </VStack>
            <ChevronRight size={24} color={Colors.primary} />
          </TouchableOpacity>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default CompanyDetailScreen;
