import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Avatar } from '../../components/ui';
import { ChevronLeft, Eye, Search, Info, Settings, Trash2, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

export default function ProfileManagementScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { logout, user } = useAuthStore();

  const MenuItem = ({ icon: Icon, title, subtitle, onPress, color = "#1C1E21" }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <HStack items="center" px={16} py={16}>
        <Box w={40} h={40} rounded={20} bg="#F0F2F5" items="center" justify="center">
           <Icon size={20} color={color} />
        </Box>
        <VStack ml={16} flex={1}>
           <Text fontSize={16} fontWeight="700" color={color}>{title}</Text>
           {subtitle && <Text fontSize={13} color="#65676B" mt={2}>{subtitle}</Text>}
        </VStack>
        <ChevronRight size={20} color="#65676B" />
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="#F0F2F5">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box pt={insets.top + 10} pb={12} bg="white" shadow={1}>
         <HStack items="center" px={16}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
               <ChevronLeft size={26} color="#1C1E21" />
            </TouchableOpacity>
            <Text fontSize={18} fontWeight="700" color="#1C1E21" ml={16}>Profile settings</Text>
         </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
         {/* User Info Header in Settings */}
         <Box bg="white" p={16} mb={12}>
            <HStack items="center">
               <Avatar source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150' }} size="lg" />
               <VStack ml={16}>
                  <Text fontSize={18} fontWeight="800" color="#1C1E21">{user?.name || 'User'}</Text>
                  <Text fontSize={14} color="#65676B" mt={2}>Public Profile</Text>
               </VStack>
            </HStack>
         </Box>

         <VStack bg="white" mb={12}>
            <MenuItem icon={Eye} title="View as" subtitle="See how others view your profile" />
            <Divider color="#E5E7EB" mx={16} />
            <MenuItem icon={Search} title="Search" subtitle="Find posts or sections on your profile" />
            <Divider color="#E5E7EB" mx={16} />
            <MenuItem icon={Info} title="Profile status" subtitle="Check if your profile is in good standing" />
         </VStack>

         <VStack bg="white" mb={12}>
            <MenuItem icon={Settings} title="Settings" onPress={() => navigation.navigate('Settings')} />
            <Divider color="#E5E7EB" mx={16} />
            <MenuItem icon={LogOut} title="Log out" onPress={logout} color="#F5222D" />
         </VStack>

         <VStack bg="white">
            <MenuItem icon={Trash2} title="Delete account" color="#F5222D" subtitle="Permanently delete your profile" />
         </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  menuItem: { backgroundColor: 'white' },
});
