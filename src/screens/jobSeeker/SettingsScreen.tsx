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
  ChevronLeft,
  User,
  Bell,
  ShieldCheck,
  FileText,
  LogOut,
  ChevronRight,
  Globe,
  CreditCard,
  Eye,
  Lock,
  Info,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider } from '../../components/ui';

const BLUE = '#0A66C2';
const GRAY_BG = '#F3F2EF';

export default function SeekerSettingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const [notifications, setNotifications] = React.useState(true);
  const [biometrics, setBiometrics] = React.useState(true);

  const SettingRow = ({ icon: Icon, label, value, onPress, isSwitch, switchValue, onSwitchChange, destructive }: any) => (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={onPress}
      disabled={isSwitch}
      activeOpacity={0.6}
    >
      <HStack items="center" flex={1}>
        <View style={[styles.iconWrap, { backgroundColor: destructive ? '#FEE2E2' : '#F1F5F9' }]}>
           <Icon size={20} color={destructive ? '#EF4444' : '#475569'} />
        </View>
        <Text fontSize={16} color={destructive ? '#EF4444' : '#1F2937'} ml={16} fontWeight="500">{label}</Text>
      </HStack>
      
      {isSwitch ? (
        <Switch 
           value={switchValue} 
           onValueChange={onSwitchChange}
           trackColor={{ false: '#D1D5DB', true: BLUE }}
           thumbColor="white"
        />
      ) : (
        <HStack items="center">
           {value && <Text fontSize={14} color="#6B7280" mr={8}>{value}</Text>}
           <ChevronRight size={18} color="#9CA3AF" />
        </HStack>
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#1F2937" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text fontSize={20} color="#1F2937" fontWeight="700" ml={16}>Settings & Privacy</Text>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Center Group */}
         <Box bg="white" rounded={12} p={16} mb={20} border={1} borderColor="#E5E7EB">
            <Text fontSize={14} color="#6B7280" fontWeight="700" mb={16}>Account Center</Text>
            <SettingRow icon={User} label="Personal details" onPress={() => navigation.navigate('SeekerAboutInfo')} />
            <Divider color="#F1F5F9" my={4} />
            <SettingRow icon={Lock} label="Password and security" onPress={() => navigation.navigate('SecuritySettings')} />
            <Divider color="#F1F5F9" my={4} />
            <SettingRow icon={CreditCard} label="Payments & Wallet" onPress={() => navigation.navigate('Wallet')} />
            <Text fontSize={12} color={BLUE} fontWeight="600" mt={12}>See more in Account Center</Text>
         </Box>

         <Text fontSize={14} color="#6B7280" fontWeight="700" ml={4} mb={10}>Preferences</Text>
         <Box bg="white" rounded={12} px={16} mb={20} border={1} borderColor="#E5E7EB">
            <SettingRow icon={Bell} label="Notifications" onPress={() => navigation.navigate('NotificationSettings')} />
            <Divider color="#F1F5F9" />
            <SettingRow icon={Globe} label="Language" value="English (US)" onPress={() => {}} />
            <Divider color="#F1F5F9" />
            <SettingRow icon={ShieldCheck} label="Privacy checkup" onPress={() => navigation.navigate('PrivacySettings')} />
         </Box>

        <Text fontSize={14} color="#6B7280" fontWeight="700" ml={4} mb={10}>Support & About</Text>
        <Box bg="white" rounded={12} px={16} mb={20} border={1} borderColor="#E5E7EB">
           <SettingRow icon={Info} label="Help center" onPress={() => {}} />
           <Divider color="#F1F5F9" />
           <SettingRow icon={FileText} label="Terms of service" onPress={() => {}} />
        </Box>

        <Box bg="white" rounded={12} px={16} mb={40} border={1} borderColor="#E5E7EB">
           <SettingRow icon={LogOut} label="Log out" destructive onPress={() => logout()} />
        </Box>

        <VStack items="center" mb={40}>
           <Text fontSize={12} color="#9CA3AF">Version 1.4.2 (20240403)</Text>
           <Text fontSize={12} color="#9CA3AF" mt={4}>Meta-Inspired Interface</Text>
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
