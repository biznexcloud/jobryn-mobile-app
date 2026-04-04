import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Pencil,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

export default function SeekerAboutInfoScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const InfoRow = ({ icon: Icon, label, value }: any) => (
    <VStack mb={20}>
       <HStack items="center" mb={6}>
          <Icon size={18} color="#666666" />
          <Text fontSize={14} fontWeight="700" color="#666666" ml={10}>{label}</Text>
       </HStack>
       <Text fontSize={16} color="#000000" ml={28}>{value || 'Not provided'}</Text>
    </VStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
         <HStack items="center" justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                  <ChevronLeft size={24} color="#1F2937" strokeWidth={2.5} />
               </TouchableOpacity>
               <Text fontSize={20} color="#1F2937" fontWeight="700" ml={16}>Personal Information</Text>
            </HStack>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
               <Pencil size={22} color="#666666" />
            </TouchableOpacity>
         </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
         <VStack mb={30}>
            <Text fontSize={14} fontWeight="700" color="#6B7280" mb={20}>CONTACT INFORMATION</Text>
            <InfoRow icon={User} label="Full Legal Name" value={user?.name || 'Jhonson King'} />
            <InfoRow icon={Mail} label="Primary Email" value={user?.email || 'jhonson@domain.com'} />
            <InfoRow icon={Phone} label="Phone Number" value="+977-9800000000" />
            <InfoRow icon={Globe} label="Personal Website" value="https://jhonson.dev" />
         </VStack>

         <Divider color="#F1F5F9" mb={30} />

         <VStack mb={30}>
            <Text fontSize={14} fontWeight="700" color="#6B7280" mb={20}>LOCATION & DEMOGRAPHICS</Text>
            <InfoRow icon={MapPin} label="Current Location" value="Kathmandu, Nepal (NP)" />
            <InfoRow icon={Calendar} label="Date of Birth" value="January 12, 1995" />
         </VStack>

         <Box bg="#F9FAFB" p={16} rounded={12} border={1} borderColor="#E5E7EB" mb={40}>
            <Text fontSize={13} color="#666666" lineHeight={18}>
               Your personal information is kept secure and only visible to you. Recruiters will only see what you've enabled in your professional profile settings.
            </Text>
         </Box>

         <Button 
            label="Edit Identity Details" 
            variant="outline"
            onPress={() => navigation.navigate('EditProfile')}
            style={{ borderColor: BLUE, height: 50, borderRadius: 25 }}
            textStyle={{ color: BLUE, fontWeight: '700' }}
         />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 24 },
});
