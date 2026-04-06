import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button, Input } from '../../components/ui';
import { ChevronLeft, Search, MessageSquare, UserMinus, UserPlus, MoreVertical } from 'lucide-react-native';

const BLUE = '#1066C2';
const FB_GRAY = '#F0F2F5';

import { MOCK_NETWORK_SUGGESTIONS } from '../../constants/MockData';

export default function ConnectionsListScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [connections, setConnections] = useState(MOCK_NETWORK_SUGGESTIONS);

  const filteredConnections = connections.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  const ConnectionItem = ({ item }: any) => (
    <Box bg="white" px={16} py={12}>
       <HStack items="center" justify="space-between">
          <HStack flex={1} items="center">
             <Avatar source={{ uri: item.avatar }} size="lg" />
             <VStack ml={12} flex={1}>
                <Text fontSize={16} fontWeight="700" color="#1C1E21">{item.name}</Text>
                <Text fontSize={13} color="#65676B" mt={2} numberOfLines={2}>{item.role}</Text>
             </VStack>
          </HStack>
          <HStack space="sm" ml={8}>
             <TouchableOpacity 
                onPress={() => navigation.navigate('ChatDetail', { name: item.name })}
                style={styles.msgBtn}
             >
                <MessageSquare size={18} color={BLUE} />
             </TouchableOpacity>
             <TouchableOpacity style={styles.moreBtn}>
                <MoreVertical size={18} color="#65676B" />
             </TouchableOpacity>
          </HStack>
       </HStack>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box pt={insets.top + 10} pb={12} bg="white" borderBottom={1} borderColor="#CED0D4">
         <HStack items="center" px={16}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
               <ChevronLeft size={26} color="#1C1E21" />
            </TouchableOpacity>
            <Text fontSize={18} fontWeight="700" color="#1C1E21" ml={16}>Connections</Text>
         </HStack>
      </Box>

      {/* Search Bar */}
      <Box px={16} py={12} bg="white">
         <HStack bg={FB_GRAY} rounded={8} px={12} items="center" style={{ height: 44 }}>
            <Search size={18} color="#65676B" />
            <TextInput 
               placeholder="Search connections..." 
               value={search}
               onChangeText={setSearch}
               placeholderTextColor="#8D949E"
               style={styles.searchInput} 
            />
         </HStack>
      </Box>

      <Divider color="#E5E7EB" />

      <FlatList 
         data={filteredConnections}
         keyExtractor={item => item.id}
         renderItem={({ item }) => <ConnectionItem item={item} />}
         ItemSeparatorComponent={() => <Divider color="#F0F2F5" mx={16} />}
         contentContainerStyle={{ paddingBottom: 40 }}
         ListEmptyComponent={
            <Box p={40} items="center">
               <Text color="#65676B" textAlign="center">No connections found.</Text>
            </Box>
         }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 15, color: '#1C1E21' },
  msgBtn: { 
     width: 36, 
     height: 36, 
     borderRadius: 18, 
     backgroundColor: '#E7F3FF', 
     alignItems: 'center', 
     justifyContent: 'center' 
  },
  moreBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
