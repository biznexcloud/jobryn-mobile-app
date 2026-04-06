import React from 'react';
import { ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Users,
  ChevronRight,
  ChevronLeft,
  Share2,
  MoreVertical,
  ExternalLink
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Avatar, Heading, Button } from '../../components/ui';

const BLUE = '#0A66C2'; 
const GRAY_TEXT = '#666666';
const SOFT_BG = '#F3F2EF';

const CompanyDetailScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  
  const company = {
    name: 'TechFlow Systems',
    industry: 'Information Technology',
    location: 'San Francisco, CA',
    employees: '500-1000',
    website: 'www.techflow.io',
    logo: 'https://logo.clearbit.com/techflow.io',
    banner: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'TechFlow is a leading provider of innovative cloud solutions and digital transformation services. We empower businesses to scale more efficiently through our cutting-edge AI-driven platform. Our mission is to accelerate the world\'s transition to intelligent digital infrastructure.',
    openJobs: 12
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Section */}
        <Box h={140} bg="#E1E4E8">
           <Image source={{ uri: company.banner }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
           <TouchableOpacity 
             onPress={() => navigation?.goBack()} 
             style={{ position: 'absolute', top: insets.top + 10, left: 16, zIndex: 10, padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 }}
           >
              <ChevronLeft size={20} color="white" />
           </TouchableOpacity>
           <HStack 
             style={{ position: 'absolute', top: insets.top + 10, right: 16, zIndex: 10 }} 
             space="md"
           >
              <TouchableOpacity style={{ padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 }}>
                 <Share2 size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 }}>
                 <MoreVertical size={20} color="white" />
              </TouchableOpacity>
           </HStack>
        </Box>
        
        <VStack px={20} mt={-40} space="lg">
          {/* Logo & Follow Action */}
          <HStack items="flex-end" justify="space-between">
            <Box bg="white" p={4} rounded={12} border={1} borderColor="#E0E0E0" shadow={2}>
               <Avatar source={{ uri: company.logo }} size="xl" rounded={8} />
            </Box>
            <HStack space="sm">
               <Button 
                 label="Follow" 
                 onPress={() => {}} 
                 style={{ backgroundColor: BLUE, height: 40, borderRadius: 20, paddingHorizontal: 24 }}
                 textStyle={{ fontWeight: '700', fontSize: 14 }}
               />
               <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: BLUE, alignItems: 'center', justifyContent: 'center' }}>
                  <ExternalLink size={18} color={BLUE} />
               </TouchableOpacity>
            </HStack>
          </HStack>

          {/* Company Title */}
          <VStack mt={4}>
            <Heading fontSize={24} fontWeight="800" color="#000000">{company.name}</Heading>
            <Text fontSize={15} color="#000000" mt={2}>{company.industry} • {company.location}</Text>
            <Text fontSize={14} color={GRAY_TEXT} mt={4}>{company.employees} employees</Text>
          </VStack>

          <Divider color="#E0E0E0" my={4} />

          {/* Quick Info Grid */}
          <VStack space="md">
             <Text fontSize={18} fontWeight="800" color="#000000">About</Text>
             <Text fontSize={15} color="#000000" lineHeight={24}>
                {company.description}
             </Text>
             <TouchableOpacity style={{ marginTop: 4 }}>
                <Text fontSize={14} fontWeight="700" color={BLUE}>See more</Text>
             </TouchableOpacity>
          </VStack>

          {/* Website Link */}
          <Box p={16} bg={SOFT_BG} rounded={12} border={1} borderColor="#E0E0E0">
             <HStack space="md" items="center">
                <Globe size={18} color={GRAY_TEXT} />
                <VStack flex={1}>
                   <Text fontSize={14} fontWeight="700" color="#000000">Website</Text>
                   <Text fontSize={14} color={BLUE} mt={2}>{company.website}</Text>
                </VStack>
                <ChevronRight size={18} color={GRAY_TEXT} />
             </HStack>
          </Box>

          {/* Open Jobs Action Card */}
          <TouchableOpacity 
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: 20, 
              backgroundColor: '#EDF3F8', 
              borderRadius: 12, 
              borderWidth: 1, 
              borderColor: BLUE,
              marginBottom: 40 
            }}
          >
            <VStack>
              <Text fontSize={16} fontWeight="800" color={BLUE}>Active Opportunities</Text>
              <Text fontSize={14} color={BLUE} mt={2}>{company.openJobs} missions matching your profile</Text>
            </VStack>
            <Box bg={BLUE} p={8} rounded={20}>
               <ChevronRight size={20} color="white" />
            </Box>
          </TouchableOpacity>
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default CompanyDetailScreen;
