import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Switch,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft as ChevronLeftIcon,
  User as UserIcon,
  Bell as BellIcon,
  ShieldCheck as ShieldCheckIcon,
  FileText as DocumentTextIcon,
  LogOut as LogoutIcon,
  ChevronRight as ChevronRightIcon,
  Globe as GlobeAltIcon,
  CreditCard as CreditCardIcon,
  Eye as EyeIcon,
  Lock as LockClosedIcon,
  Building as OfficeIcon,
  Key as KeyIcon,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider } from '../../components/ui';

const FB_BLUE = '#1877F2';
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

export default function ProviderSettingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  const SettingRow = ({ icon: Icon, label, value, onPress, destructive }: any) => (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <HStack items="center" flex={1}>
        <Box w={36} h={36} rounded={18} bg="#F0F2F5" items="center" justify="center">
           <Icon size={18} color={destructive ? '#EF4444' : '#1F2937'} />
        </Box>
        <Text fontSize={16} color={destructive ? '#EF4444' : '#1F2937'} ml={12} fontWeight="500">{label}</Text>
      </HStack>
      
      <HStack items="center">
         {value && <Text fontSize={14} color={GRAY_TEXT} mr={8}>{value}</Text>}
         <ChevronRightIcon size={16} color="#D1D5DB" />
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box px={16} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeftIcon size={22} color="black" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Settings</Text>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box mt={16} px={16}>
           <Text fontSize={14} fontWeight="700" color={GRAY_TEXT} ml={4} mb={8}>ACCOUNT</Text>
           <Box bg="white" rounded={16} px={16} border={1} borderColor="#F0F2F5">
              <SettingRow 
                 icon={OfficeIcon} 
                 label="Company Profile" 
                 onPress={() => navigation.navigate('ProviderProfile')} 
              />
              <Divider color="#F9FAFB" />
              <SettingRow 
                 icon={KeyIcon} 
                 label="Login & Security" 
                 onPress={() => navigation.navigate('SecuritySettings')} 
              />
              <Divider color="#F9FAFB" />
              <SettingRow 
                 icon={CreditCardIcon} 
                 label="Billing & Payouts" 
                 onPress={() => navigation.navigate('Billing')} 
              />
           </Box>

           <Text fontSize={14} fontWeight="700" color={GRAY_TEXT} ml={4} mt={24} mb={8}>PREFERENCES</Text>
           <Box bg="white" rounded={16} px={16} border={1} borderColor="#F0F2F5">
              <SettingRow 
                 icon={BellIcon} 
                 label="Notifications" 
                 onPress={() => navigation.navigate('NotificationSettings')} 
              />
              <Divider color="#F9FAFB" />
              <SettingRow 
                 icon={GlobeAltIcon} 
                 label="Privacy" 
                 onPress={() => navigation.navigate('PrivacySettings')} 
              />
           </Box>

           <Box bg="white" rounded={16} px={16} mt={24} mb={40} border={1} borderColor="#F0F2F5">
              <SettingRow 
                 icon={LogoutIcon} 
                 label="Sign Out" 
                 destructive 
                 onPress={() => logout()} 
              />
           </Box>

           <VStack items="center" mb={40}>
              <Text fontSize={12} color="#D1D5DB" fontWeight="600">Jobryn Provider v1.8.0</Text>
           </VStack>
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
});





