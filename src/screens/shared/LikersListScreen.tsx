import React from 'react';
import { ScrollView, TouchableOpacity, StatusBar, StyleSheet, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Search, 
  UserPlus, 
  MessageCircle, 
  MoreHorizontal,
  ThumbsUp,
  Heart,
  Smile,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Button, Divider } from '../../components/ui';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#0A66C2';
const GRAY_BG = '#FFFFFF';

export default function LikersListScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  
  const LIKERS = [
    { id: '1', name: 'Arun Kushwaha', role: 'Full Stack Developer @ Jobryn', reaction: 'like', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Sita Sharma', role: 'UI/UX Designer', reaction: 'heart', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Ram Bahadur', role: 'Talent Acquisition', reaction: 'like', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'Gita Adhikari', role: 'Product Manager', reaction: 'smile', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', name: 'Kiran KC', role: 'Software Engineer', reaction: 'like', avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: '6', name: 'Sunil Thapa', role: 'Marketing Specialist', reaction: 'heart', avatar: 'https://i.pravatar.cc/150?u=6' },
  ];

  const ReactionIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'heart': return <Box bg="#FEE2E2" p={4} rounded={10} style={styles.miniReaction}><Heart size={10} color="#EF4444" fill="#EF4444" /></Box>;
      case 'smile': return <Box bg="#FEF3C7" p={4} rounded={10} style={styles.miniReaction}><Smile size={10} color="#D97706" fill="#D97706" /></Box>;
      default: return <Box bg="#DBEAFE" p={4} rounded={10} style={styles.miniReaction}><ThumbsUp size={10} color={BLUE} fill={BLUE} /></Box>;
    }
  };

  const LikerItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.likerRow}
      onPress={() => navigation.navigate('PublicProfile', { userId: item.id })}
    >
      <HStack items="center">
        <View>
          <Avatar source={{ uri: item.avatar }} size="md" />
          <View style={styles.reactionBadge}>
            <ReactionIcon type={item.reaction} />
          </View>
        </View>
        <VStack ml={12} flex={1}>
          <Text fontSize={15} fontWeight="700" color="#000000">{item.name}</Text>
          <Text fontSize={13} color="#666666" numberOfLines={1}>{item.role}</Text>
        </VStack>
        <Button 
          title="Connect" 
          variant="outline" 
          size="sm" 
          onPress={() => {}}
          style={{ borderColor: BLUE, height: 32, borderRadius: 16 }}
          textStyle={{ color: BLUE, fontSize: 13, fontWeight: '700' }}
        />
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />
      
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#000000" />
            </TouchableOpacity>
            <Text fontSize={18} color="#000000" fontWeight="700" ml={16}>Reactions</Text>
          </HStack>
        </HStack>
      </Box>

      <HStack px={16} py={12} borderBottom={1} borderColor="#F3F2EF">
        <HStack space="md">
          <TouchableOpacity style={styles.tabActive}><Text fontSize={14} fontWeight="800" color={BLUE}>All (12)</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><HStack items="center"><ThumbsUp size={14} color="#666666" /><Text fontSize={14} color="#666666" ml={4}>8</Text></HStack></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><HStack items="center"><Heart size={14} color="#666666" /><Text fontSize={14} color="#666666" ml={4}>4</Text></HStack></TouchableOpacity>
        </HStack>
      </HStack>

      <FlatList 
        data={LIKERS}
        renderItem={LikerItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  likerRow: { paddingHorizontal: 16, paddingVertical: 12 },
  reactionBadge: { position: 'absolute', bottom: -2, right: -2 },
  miniReaction: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'white' },
  tabActive: { paddingBottom: 12, borderBottomWidth: 3, borderBottomColor: BLUE },
  tab: { paddingBottom: 12 },
});
