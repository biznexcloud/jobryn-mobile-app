import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text } from '../../components/ui/Text';
import { Box } from '../../components/ui/Box';
import { VStack } from '../../components/ui/VStack';
import { HStack } from '../../components/ui/HStack';
import { Avatar } from '../../components/ui/Avatar';
import { 
  ChevronLeft,
  Briefcase,
  MapPin,
  Mail,
} from 'lucide-react-native';
import { Colors } from '../../constants';

const PublicUserProfileScreen = ({ route, navigation }: any) => {
  const userData = {
    name: 'Sarah Connor',
    role: 'Senior Product Designer',
    location: 'Berlin, Germany',
    bio: 'Passionate UI/UX designer with 8+ years of experience in building scalable digital products.',
    skills: ['Figma', 'React Native', 'Design Systems', 'User Research'],
    experience: [
      { id: 1, role: 'Lead Designer', company: 'DesignLink', period: '2020 - Present' },
      { id: 2, role: 'Senior UX Designer', company: 'TechFlow', period: '2017 - 2020' },
    ]
  };

  return (
    <Box flex={1} bg={Colors.white}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Background */}
        <Box h={140} bg={Colors.primary} style={{ opacity: 0.1 }}>
           <TouchableOpacity 
             onPress={() => navigation?.goBack()} 
             style={{ position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 4, backgroundColor: 'white', borderRadius: 20 }}
           >
              <ChevronLeft size={24} color="#000000" />
           </TouchableOpacity>
        </Box>
        
        <VStack px={20} mt={-50} space="xl">
          {/* Profile Basic Info */}
          <VStack items="center" space="sm">
            <Avatar size="xl" style={{ borderWidth: 4, borderColor: 'white' }} />
            <Text fontSize={24} fontWeight="bold" mt={10}>{userData.name}</Text>
            <Text color={Colors.textSecondary} fontSize={16}>{userData.role}</Text>
            <HStack space="xs" items="center">
              <MapPin size={16} color={Colors.textSecondary} />
              <Text fontSize={14} color={Colors.textSecondary}>{userData.location}</Text>
            </HStack>
          </VStack>

          {/* Action Buttons */}
          <HStack space="md">
            <TouchableOpacity style={{ flex: 1, backgroundColor: Colors.primary, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Mail size={18} color={Colors.white} />
              <Text color={Colors.white} fontWeight="bold" ml={8}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, borderWidth: 1, borderColor: Colors.primary, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
              <Text color={Colors.primary} fontWeight="bold">Connect</Text>
            </TouchableOpacity>
          </HStack>

          {/* About Section */}
          <VStack space="sm">
            <Text fontSize={18} fontWeight="bold">About</Text>
            <Text color={Colors.textPrimary} style={{ lineHeight: 22 }}>{userData.bio}</Text>
          </VStack>

          {/* Skills Section */}
          <VStack space="sm">
            <Text fontSize={18} fontWeight="bold">Skills</Text>
            <HStack style={{ flexWrap: 'wrap', gap: 8 }}>
              {userData.skills.map((skill, idx) => (
                <Box key={idx} bg="#F1F5F9" px={12} py={6} rounded={20}>
                  <Text fontSize={12} color={Colors.textPrimary}>{skill}</Text>
                </Box>
              ))}
            </HStack>
          </VStack>

          {/* Experience Section */}
          <VStack space="md" mb={30}>
            <Text fontSize={18} fontWeight="bold">Experience</Text>
            {userData.experience.map((exp) => (
              <HStack key={exp.id} space="md" items="center">
                <Box bg="#F1F5F9" p={10} rounded={12}>
                  <Briefcase size={24} color={Colors.primary} />
                </Box>
                <VStack flex={1} space="xs">
                  <Text fontWeight="bold">{exp.role}</Text>
                  <Text color={Colors.textSecondary} fontSize={14}>{exp.company} • {exp.period}</Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default PublicUserProfileScreen;
