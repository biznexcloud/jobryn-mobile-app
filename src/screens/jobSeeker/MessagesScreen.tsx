import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  PenSquare,
  SlidersHorizontal,
  ChevronLeft,
  MoreHorizontal,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';

import { MOCK_CONVERSATIONS } from '../../constants/MockData';

export default function MessagesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ChatDetail', { chat: item })} style={[styles.chatRow, item.unread && styles.unreadRow]}>
       <HStack p={16} items="center">
          <Box position="relative">
             <Avatar source={{ uri: item.avatar }} size="lg" />
             {item.online && <Box position="absolute" bottom={2} right={2} style={styles.onlineBadge} />}
          </Box>
          <VStack ml={12} flex={1}>
             <HStack justify="space-between" items="center">
                <Text fontSize={16} fontWeight="700" color="#050505">{item.name}</Text>
                <Text fontSize={12} color="#65676B">{item.time}</Text>
             </HStack>
             <Text fontSize={14} color={item.unread ? "#050505" : "#65676B"} fontWeight={item.unread ? "700" : "400"} numberOfLines={1} mt={2}>{item.last_msg}</Text>
          </VStack>
       </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* FB Style Messaging Header */}
      <Box px={16} pt={insets.top + 10} pb={12} bg="white" borderBottom={1} borderColor="#E5E7EB">
         <HStack items="center" justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                  <ChevronLeft size={28} color="#050505" />
               </TouchableOpacity>
               <Text fontSize={20} fontWeight="900" color="#050505" ml={12}>Chats</Text>
            </HStack>
            <HStack space="md">
               <TouchableOpacity style={styles.headerIcon}><MoreHorizontal size={22} color="black" /></TouchableOpacity>
               <TouchableOpacity style={styles.headerIcon}><PenSquare size={22} color="black" /></TouchableOpacity>
            </HStack>
         </HStack>
      </Box>

      {/* Modern Search */}
      <Box px={16} py={12} bg="white">
         <Box bg={FB_GRAY} rounded={20} px={12} py={10}>
            <HStack items="center">
               <Search size={18} color="#65676B" />
               <TextInput 
                  placeholder="Search Messenger"
                  placeholderTextColor="#65676B"
                  value={search}
                  onChangeText={setSearch}
                  style={{ flex: 1, marginLeft: 10, fontSize: 15, color: '#050505', padding: 0 }}
               />
            </HStack>
         </Box>
      </Box>

      <FlatList 
         data={MOCK_CONVERSATIONS}
         renderItem={renderChatItem}
         keyExtractor={(item) => item.id}
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{ paddingBottom: 100 }}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerIcon: { backgroundColor: '#F0F2F5', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  chatRow: { backgroundColor: 'white' },
  unreadRow: { backgroundColor: '#EBF5FF' },
  onlineBadge: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#31A24C', borderWidth: 2, borderColor: 'white' },
});
