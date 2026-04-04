import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { Colors } from '../../constants';
import { ChatAlt2Icon, SearchIcon, BellIcon, MenuIcon, DotsHorizontalIcon } from 'react-native-heroicons/outline';
import { Avatar } from '../ui/Avatar';
import { Box } from '../ui/Box';
import { HStack } from '../ui/HStack';
import { useAuthStore } from '../../store/authStore';
import { verticalScale } from '../../utils/responsive';

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onAvatarPress?: () => void;
  onMenuPress?: () => void; // Legacy alias for onAvatarPress
  onNotificationsPress?: () => void;
  onMessagesPress?: () => void;
  notificationCount?: number;
  avatarName?: string;
}

export const TopBar = ({
  title = '',
  showSearch = true,
  searchValue = '',
  onSearchChange,
  onAvatarPress,
  onMenuPress,
  onNotificationsPress,
  onMessagesPress,
  notificationCount = 0,
}: TopBarProps) => {
  const { user } = useAuthStore();
  const triggerAvatar = onAvatarPress || onMenuPress;
  
  return (
    <View className="flex-row items-center bg-white px-3 py-1.5 border-b border-slate-200 shadow-sm" style={{ height: verticalScale(62) }}>
      {/* Profile Avatar (Acts as Sidebar trigger like LinkedIn) */}
      <TouchableOpacity onPress={triggerAvatar} activeOpacity={0.8} className="p-1">
         <Avatar size="sm" className="border-2 border-slate-50 w-8 h-8 rounded-full overflow-hidden" />
      </TouchableOpacity>

      {/* Main Search Bar - Same to Same LinkedIn */}
      <View className="flex-1 flex-row items-center bg-[#EEF3F8] rounded-md px-3 h-10 ml-2">
        <SearchIcon size={16} color="#666666" strokeWidth={2.5} />
        <TextInput
          className="flex-1 ml-2 text-slate-800 text-[13px] font-medium py-0"
          placeholder="Search Jobryn"
          placeholderTextColor="#666666"
          value={searchValue}
          onChangeText={onSearchChange}
        />
        <TouchableOpacity className="p-1">
           <DotsHorizontalIcon size={18} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* Messaging / Notifications Icons */}
      <HStack space="md" className="ml-3 items-center">
        <TouchableOpacity onPress={onMessagesPress} className="p-1">
           <ChatAlt2Icon size={26} color="#666666" strokeWidth={2} />
        </TouchableOpacity>
      </HStack>
    </View>
  );
};

export default TopBar;
