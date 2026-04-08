import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Button } from '../../components/ui';
import { ProfileService } from '../../services/api/profile';
import { useAuthStore } from '../../store/authStore';

const BLUE = '#1877F2';

export default function EditBioScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const resp = await ProfileService.getSeekerProfiles();
        const profile = resp?.results?.[0];
        if (profile) {
          setBio(profile.description || profile.about || profile.bio || '');
          setProfileId(profile.id);
          useAuthStore.getState().setSeekerId(profile.id);
        }
      } catch (e) {
        console.warn('Bio fetch error');
      }
    };
    fetchBio();
  }, []);

  const handleSave = async () => {
    if (loading) return;
    const currentSeekerId = profileId || useAuthStore.getState().seekerId;

    setLoading(true);
    try {
      if (!currentSeekerId) {
        const resp = await ProfileService.createSeekerProfile({ bio, description: bio, about: bio, headline: 'Professional' });
        setProfileId(resp.id);
        useAuthStore.getState().setSeekerId(resp.id);
      } else {
        await ProfileService.updateSeekerProfile(currentSeekerId, { bio, description: bio, about: bio });
      }
      Alert.alert('Success', 'Bio updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to update bio');
    } finally {
      setLoading(false);
    }
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
               <Text fontSize={20} fontWeight="700" color="#000000" ml={16}>Edit Bio</Text>
            </HStack>
            <TouchableOpacity onPress={handleSave} disabled={loading}>
               {loading ? (
                  <Text color="#9CA3AF">Saving...</Text>
               ) : (
                  <Check size={26} color={BLUE} strokeWidth={3} />
               )}
            </TouchableOpacity>
         </HStack>
      </Box>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.container}>
           <VStack>
              <Text fontSize={16} fontWeight="700" color="#1C1E21" mb={8}>About You</Text>
              <Text fontSize={14} color="#65676B" mb={16}>
                Introduce yourself to recruiters and the professional community. Share your expertise, achievements, and goals.
              </Text>
              
              <Box bg="#F9FAFB" rounded={12} border={1} borderColor="#E5E7EB" p={12}>
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  placeholder="e.g. Passionate software engineer with 5+ years of experience in mobile development..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.bioInput}
                  autoFocus
                />
              </Box>
              
              <Text fontSize={12} color="#9CA3AF" mt={12} textAlign="right">
                {bio.length} characters
              </Text>
           </VStack>

           <Box mt={40}>
              <Button 
                label="Save Bio" 
                loading={loading} 
                onPress={handleSave} 
                bg={BLUE} 
              />
           </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  bioInput: { 
    fontSize: 16, 
    color: '#1C1E21', 
    lineHeight: 24, 
    minHeight: 200, 
    textAlignVertical: 'top' 
  },
});
