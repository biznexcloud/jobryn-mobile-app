import React from 'react';
import { ScrollView, TouchableOpacity, StatusBar, StyleSheet, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Bell, 
  Briefcase, 
  MessageSquare, 
  Users, 
  Search, 
  Info,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#0A66C2';
const GRAY_BG = '#F3F2EF';

export default function NotificationSettingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const [toggles, setToggles] = React.useState({
    jobs: true,
    messages: true,
    network: true,
    news: false,
    marketing: false,
    mentions: true,
  });

  const ToggleRow = ({ icon: Icon, label, value, keyName }: any) => (
    <HStack items="center" style={styles.row}>
      <Box bg="#F1F5F9" p={8} rounded={8}>
        <Icon size={20} color="#475569" />
      </Box>
      <VStack ml={12} flex={1}>
        <Text fontSize={16} color="#1F2937" fontWeight="600">{label}</Text>
        <Text fontSize={12} color="#64748B" mt={2}>{value}</Text>
      </VStack>
      <Switch 
        value={(toggles as any)[keyName]} 
        onValueChange={(val) => setToggles({...toggles, [keyName]: val})}
        trackColor={{ false: '#D1D5DB', true: BLUE }}
        thumbColor="white"
      />
    </HStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />
      
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text fontSize={20} color="#1F2937" fontWeight="700" ml={16}>Notifications</Text>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text fontSize={14} color="#64748B" fontWeight="700" ml={4} mb={10}>ON JOBRYN</Text>
        <Box bg="white" rounded={12} px={16} mb={20} border={1} borderColor="#E5E7EB">
          <ToggleRow icon={Briefcase} label="Jobs & Career" value="Job recommendations and alerts" keyName="jobs" />
          <Divider color="#F1F5F9" />
          <ToggleRow icon={MessageSquare} label="Messaging" value="Direct messages and group chats" keyName="messages" />
          <Divider color="#F1F5F9" />
          <ToggleRow icon={Users} label="Network Updates" value="Connection requests and invites" keyName="network" />
          <Divider color="#F1F5F9" />
          <ToggleRow icon={TrendingUp} label="Trending News" value="Social feed highlights" keyName="news" />
        </Box>

        <Text fontSize={14} color="#64748B" fontWeight="700" ml={4} mb={10}>EXTERNAL</Text>
        <Box bg="white" rounded={12} px={16} mb={20} border={1} borderColor="#E5E7EB">
          <ToggleRow icon={Bell} label="Push notifications" value="Receive pings on your lockscreen" keyName="mentions" />
          <Divider color="#F1F5F9" />
          <ToggleRow icon={Info} label="Email & Marketing" value="Product updates and offers" keyName="marketing" />
        </Box>

        <Box bg="white" rounded={12} p={16} border={1} borderColor="#E5E7EB">
          <HStack space="md" items="center">
            <Box bg="#EFF6FF" p={10} rounded={10}>
              <Search size={20} color={BLUE} />
            </Box>
            <VStack flex={1}>
              <Text fontSize={15} fontWeight="700" color="#1F2937">Notification History</Text>
              <Text fontSize={13} color="#64748B" mt={2}>View all alerts from the last 30 days.</Text>
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
