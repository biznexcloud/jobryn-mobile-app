import React from 'react';
import { ScrollView, TouchableOpacity, StatusBar, StyleSheet, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  Globe, 
  Shield, 
  Search, 
  Trash2,
  ChevronRight,
  UserCheck,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#0A66C2';
const GRAY_BG = '#F3F2EF';

export default function PrivacySettingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [profileHidden, setProfileHidden] = React.useState(false);

  const PrivacyRow = ({ icon: Icon, label, value, onPress, isSwitch, switchValue, onSwitchChange, destructive }: any) => (
    <TouchableOpacity 
      style={styles.row} 
      onPress={onPress}
      disabled={isSwitch}
    >
      <HStack items="center" flex={1}>
        <Box bg={destructive ? '#FEE2E2' : '#F1F5F9'} p={8} rounded={8}>
          <Icon size={20} color={destructive ? '#EF4444' : '#475569'} />
        </Box>
        <VStack ml={12} flex={1}>
          <Text fontSize={16} color={destructive ? '#EF4444' : '#1F2937'} fontWeight="600">{label}</Text>
          {value && <Text fontSize={12} color="#64748B" mt={2}>{value}</Text>}
        </VStack>
      </HStack>
      {isSwitch ? (
        <Switch 
          value={switchValue} 
          onValueChange={onSwitchChange}
          trackColor={{ false: '#D1D5DB', true: BLUE }}
          thumbColor="white"
        />
      ) : (
        <ChevronRight size={18} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />
      
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text fontSize={20} color="#1F2937" fontWeight="700" ml={16}>Privacy & Visibility</Text>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text fontSize={14} color="#64748B" fontWeight="700" ml={4} mb={10}>PROFILE VISIBILITY</Text>
        <Box bg="white" rounded={12} px={16} mb={20} border={1} borderColor="#E5E7EB">
          <PrivacyRow 
            icon={Eye} 
            label="Invisibile mode" 
            value="Hide your presence from others"
            isSwitch 
            switchValue={profileHidden} 
            onSwitchChange={setProfileHidden} 
          />
          <Divider color="#F1F5F9" />
          <PrivacyRow icon={Globe} label="Search visibility" value="Allow search engines to index your profile" onPress={() => {}} />
        </Box>

        <Text fontSize={14} color="#64748B" fontWeight="700" ml={4} mb={10}>SOCIAL PERMISSIONS</Text>
        <Box bg="white" rounded={12} px={16} mb={20} border={1} borderColor="#E5E7EB">
          <PrivacyRow icon={UserCheck} label="Who can follow you" value="Everyone" onPress={() => {}} />
          <Divider color="#F1F5F9" />
          <PrivacyRow icon={Shield} label="Manage blocked accounts" value="0 people blocked" onPress={() => {}} />
        </Box>

        <Text fontSize={14} color="#64748B" fontWeight="700" ml={4} mb={10}>DATA MANAGEMENT</Text>
        <Box bg="white" rounded={12} px={16} mb={20} border={1} borderColor="#E5E7EB">
          <PrivacyRow icon={Trash2} label="Deactivate account" destructive onPress={() => {}} />
        </Box>

        <Box bg="white" rounded={12} p={16} border={1} borderColor="#E5E7EB">
          <HStack space="md" items="center">
            <Box bg="#EFF6FF" p={10} rounded={10}>
              <Search size={20} color={BLUE} />
            </Box>
            <VStack flex={1}>
              <Text fontSize={15} fontWeight="700" color="#1F2937">Data & Activity</Text>
              <Text fontSize={13} color="#64748B" mt={2}>Review and download your account data.</Text>
            </VStack>
            <ChevronRight size={18} color="#9CA3AF" />
          </HStack>
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
});
