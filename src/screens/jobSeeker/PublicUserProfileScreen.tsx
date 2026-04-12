import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
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
  UserPlus,
  RefreshCw,
} from 'lucide-react-native';
import { Colors } from '../../constants';
import { ProfileService } from '../../services/api/profile';
import { ConnectionService } from '../../services/api/connections';
import Toast from 'react-native-toast-message';

const PublicUserProfileScreen = ({ route, navigation }: any) => {
  const { userId, role } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    } else {
      setLoading(false);
      Alert.alert('Error', 'User ID not provided');
    }
  }, [userId]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      let data;
      // If role is provided, use the specific endpoint
      if (role === 'recruiter' || role === 'job_provider') {
        data = await ProfileService.getRecruiterProfile(userId);
      } else if (role === 'seeker') {
        data = await ProfileService.getSeekerProfile(userId);
      } else {
        // Unknown role: Try Seeker first (most common in network), then fallback
        try {
          data = await ProfileService.getSeekerProfile(userId);
        } catch {
          data = await ProfileService.getRecruiterProfile(userId);
        }
      }
      setProfile(data);
    } catch (err) {
      console.error('[PublicProfile] Fetch error:', err);
      Alert.alert('Profile Not Found', 'Could not load the requested user details.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!profile?.id) return;
    try {
      await ConnectionService.follow(profile.id);
      setIsFollowing(true);
      Toast.show({ type: 'success', text1: 'Request Sent', text2: `Sent a connection request to ${profile.full_name || 'user'}.` });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Connection failed' });
    }
  };

  if (loading) {
    return (
      <Box flex={1} bg={Colors.white} justify="center" items="center">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text mt={10} color={Colors.textSecondary}>Fetching profile...</Text>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box flex={1} bg={Colors.white} justify="center" items="center" p={20}>
        <RefreshCw size={48} color={Colors.textSecondary} />
        <Text mt={20} textAlign="center">Profile could not be loaded.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text color={Colors.primary} fontWeight="bold">Go Back</Text>
        </TouchableOpacity>
      </Box>
    );
  }

  const name = profile.full_name || profile.name || profile.user_name || 'Anonymous User';
  const roleTitle = profile.role || profile.job_title || profile.headline || 'Member';
  const location = profile.location || profile.address || 'Remote';
  const bio = profile.bio || profile.about || profile.description || 'No bio provided yet.';
  const avatar = profile.profile_image || profile.avatar || profile.image_url;

  return (
    <Box flex={1} bg={Colors.white}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Background */}
        <Box h={140} bg={Colors.primary} style={{ opacity: 0.1 }}>
           <TouchableOpacity 
             onPress={() => navigation?.goBack()} 
             style={{ position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8, backgroundColor: 'white', borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
           >
              <ChevronLeft size={24} color="#000000" />
           </TouchableOpacity>
        </Box>
        
        <VStack px={20} mt={-50} space="xl">
          {/* Profile Basic Info */}
          <VStack items="center" space="sm">
            <Avatar size="xl" source={avatar ? { uri: avatar } : undefined} style={{ borderWidth: 4, borderColor: 'white' }} />
            <Text fontSize={24} fontWeight="bold" mt={10} textAlign="center">{name}</Text>
            <Text color={Colors.textSecondary} fontSize={16}>{roleTitle}</Text>
            <HStack space="xs" items="center">
              <MapPin size={16} color={Colors.textSecondary} />
              <Text fontSize={14} color={Colors.textSecondary}>{location}</Text>
            </HStack>
          </VStack>

          {/* Action Buttons */}
          <HStack space="md">
            <TouchableOpacity 
              disabled={isFollowing}
              onPress={handleConnect}
              style={{ flex: 1, backgroundColor: isFollowing ? '#F1F5F9' : Colors.primary, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
            >
              <UserPlus size={18} color={isFollowing ? Colors.textSecondary : Colors.white} />
              <Text color={isFollowing ? Colors.textSecondary : Colors.white} fontWeight="bold" ml={8}>
                {isFollowing ? 'Requested' : 'Connect'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate('ChatDetail', { receiverId: userId, receiverName: name, receiverAvatar: avatar })}
              style={{ flex: 1, borderWidth: 1, borderColor: '#CBD5E1', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
            >
              <Mail size={18} color={Colors.textPrimary} />
              <Text color={Colors.textPrimary} fontWeight="bold" ml={8}>Message</Text>
            </TouchableOpacity>
          </HStack>

          {/* About Section */}
          <VStack space="sm">
            <Text fontSize={18} fontWeight="bold">About</Text>
            <Text color={Colors.textPrimary} style={{ lineHeight: 22 }}>{bio}</Text>
          </VStack>

          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <VStack space="sm">
              <Text fontSize={18} fontWeight="bold">Skills</Text>
              <HStack style={{ flexWrap: 'wrap', gap: 8 }}>
                {profile.skills.map((skill: any, idx: number) => (
                  <Box key={idx} bg="#F1F5F9" px={14} py={8} rounded={20}>
                    <Text fontSize={13} color={Colors.textPrimary}>{typeof skill === 'string' ? skill : (skill.name || skill.title)}</Text>
                  </Box>
                ))}
              </HStack>
            </VStack>
          )}

          {/* Experience Section */}
          {profile.experience && profile.experience.length > 0 && (
            <VStack space="md" mb={30}>
              <Text fontSize={18} fontWeight="bold">Experience</Text>
              {profile.experience.map((exp: any, idx: number) => (
                <HStack key={idx} space="md" items="center">
                  <Box bg="#F8FAFC" p={12} rounded={12} border={1} borderColor="#F1F5F9">
                    <Briefcase size={22} color={Colors.primary} />
                  </Box>
                  <VStack flex={1} space="xs">
                    <Text fontWeight="bold" fontSize={15}>{exp.role || exp.title}</Text>
                    <Text color={Colors.textSecondary} fontSize={13}>{exp.company || exp.organization} • {exp.period || exp.duration || 'N/A'}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default PublicUserProfileScreen;
