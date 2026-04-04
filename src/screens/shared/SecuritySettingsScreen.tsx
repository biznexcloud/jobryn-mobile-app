import React from 'react';
import { ScrollView, TouchableOpacity, StatusBar, StyleSheet, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  ChevronRight,
  History,
  Key
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#0A66C2';
const GRAY_BG = '#F3F2EF';

export default function SecuritySettingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [twoFactor, setTwoFactor] = React.useState(false);

  const SecurityRow = ({ icon: Icon, label, value, onPress, isSwitch, switchValue, onSwitchChange }: any) => (
    <TouchableOpacity 
      style={styles.row} 
      onPress={onPress}
      disabled={isSwitch}
    >
      <HStack items="center" flex={1}>
        <Box bg="#F1F5F9" p={8} rounded={8}>
          <Icon size={20} color="#475569" />
        </Box>
        <VStack ml={12} flex={1}>
          <Text fontSize={16} color="#1F2937" fontWeight="600">{label}</Text>
          {value && <Text fontSize={13} color="#64748B" mt={2}>{value}</Text>}
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
          <Text fontSize={20} color="#1F2937" fontWeight="700" ml={16}>Password & Security</Text>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text fontSize={14} color="#64748B" fontWeight="700" ml={4} mb={10}>LOGIN & RECOVERY</Text>
        <Box bg="white" rounded={12} px={16} mb={20} border={1} borderColor="#E5E7EB">
          <SecurityRow icon={Key} label="Change password" value="Last changed 3 months ago" onPress={() => {}} />
          <Divider color="#F1F5F9" />
          <SecurityRow 
            icon={Smartphone} 
            label="Two-factor authentication" 
            value="Enhance your account security"
            isSwitch 
            switchValue={twoFactor} 
            onSwitchChange={setTwoFactor} 
          />
        </Box>

        <Text fontSize={14} color="#64748B" fontWeight="700" ml={4} mb={10}>SECURITY CHECKS</Text>
        <Box bg="white" rounded={12} px={16} mb={20} border={1} borderColor="#E5E7EB">
          <SecurityRow icon={History} label="Where you're logged in" value="2 active sessions" onPress={() => {}} />
          <Divider color="#F1F5F9" />
          <SecurityRow icon={ShieldCheck} label="Security checkup" value="Review your health score" onPress={() => {}} />
        </Box>

        <Box bg="white" rounded={12} p={16} border={1} borderColor="#E5E7EB">
          <HStack space="md">
            <Box bg={BLUE} p={10} rounded={10}>
              <Lock size={20} color="white" />
            </Box>
            <VStack flex={1}>
              <Text fontSize={15} fontWeight="700" color="#1F2937">Safe Browsing</Text>
              <Text fontSize={13} color="#64748B" mt={4}>
                Jobryn automatically protects your account from unauthorized access and phishing attempts.
              </Text>
            </VStack>
          </HStack>
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
});
