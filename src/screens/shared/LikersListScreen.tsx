import React from 'react';
import { ScrollView, TouchableOpacity, StatusBar, StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
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
import { SocialService } from '../../services/api/social';

const BLUE = '#0A66C2';
const GRAY_BG = '#FFFFFF';

export default function LikersListScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { postId } = route.params || {};
  
  const [likers, setLikers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadLikers = async () => {
      if (!postId) {
        setLoading(false);
        return;
      }
      try {
        const data = await SocialService.getPostLikers(postId);
        setLikers(data);
      } catch (e) {
        console.warn('Failed to load likers');
      } finally {
        setLoading(false);
      }
    };
    loadLikers();
  }, [postId]);

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
      onPress={() => navigation.navigate('PublicProfile', { userId: item.user?.id })}
    >
      <HStack items="center">
        <View>
          <Avatar source={{ uri: item.user?.avatar }} size="md" />
          <View style={styles.reactionBadge}>
            <ReactionIcon type={item.reaction || 'like'} />
          </View>
        </View>
        <VStack ml={12} flex={1}>
          <Text fontSize={15} fontWeight="700" color="#000000">{item.user?.name}</Text>
          <Text fontSize={13} color="#666666" numberOfLines={1}>{item.user?.headline || 'Member'}</Text>
        </VStack>
        <Button 
          title="Profile" 
          variant="outline" 
          size="sm" 
          onPress={() => navigation.navigate('PublicProfile', { userId: item.user?.id })}
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

      {loading ? (
        <Box flex={1} justify="center" items="center">
          <ActivityIndicator color={BLUE} />
        </Box>
      ) : (
        <>
          <HStack px={16} py={12} borderBottom={1} borderColor="#F3F2EF">
            <HStack space="md">
              <TouchableOpacity style={styles.tabActive}>
                <Text fontSize={14} fontWeight="800" color={BLUE}>All ({likers.length})</Text>
              </TouchableOpacity>
            </HStack>
          </HStack>

          <FlatList 
            data={likers}
            renderItem={LikerItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Box mt={40} items="center">
                <Text color="#666666">No reactions yet.</Text>
              </Box>
            }
          />
        </>
      )}
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
