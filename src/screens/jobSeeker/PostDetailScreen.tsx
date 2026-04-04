import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreVertical,
  Send,
  Plus,
  Image as ImageIcon,
  Smile,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const BLUE = '#1877F2'; 
const GRAY_BG = '#F0F2F5';

export default function PostDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { post } = route.params || { post: { id: 1, user: { name: 'Alex Rivers', avatar: 'https://i.pravatar.cc/150?u=a1', role: 'Fullstack Dev' }, content: 'Sharing some thoughts on the future of the Nexus Grid protocol.', created_at: '2h ago', likes_count: 24, comments_count: 5 } };
  const { user } = useAuthStore();
  const [comments, setComments] = useState([
    { id: '1', author: { name: 'Sarah Mission', avatar: 'https://i.pravatar.cc/150?u=s1', role: 'Talent Acquisition' }, text: 'Great insights! This modular approach is exactly what modern teams need.', time: '1h ago', likes: 5 },
    { id: '2', author: { name: 'Dev Ops', avatar: 'https://i.pravatar.cc/150?u=d1', role: 'System Architect' }, text: 'Totally agree. The scalability here is impressive.', time: '30m ago', likes: 2 }
  ]);
  const [newComment, setNewComment] = useState('');

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now().toString(),
      author: { name: user?.name || 'You', avatar: user?.profile_picture || 'https://i.pravatar.cc/150?u=me', role: 'Operative' },
      text: newComment,
      time: 'Just now',
      likes: 0
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const PostHeader = () => (
    <Box bg="white" borderBottom={1} borderColor="#E5E7EB">
       <HStack p={16} items="center" justify="space-between">
          <HStack items="center">
             <TouchableOpacity style={{ marginRight: 12 }} onPress={() => navigation.goBack()}>
                <ChevronLeft size={24} color="#111827" />
             </TouchableOpacity>
             <Avatar source={{ uri: post.user.avatar }} size="lg" />
             <VStack ml={12}>
                <Text fontSize={16} fontWeight="700" color="#111827">{post.user.name}</Text>
                <Text fontSize={13} color="#666666">{post.user.role} • {post.created_at}</Text>
             </VStack>
          </HStack>
          <TouchableOpacity><MoreVertical size={20} color="#666666" /></TouchableOpacity>
       </HStack>
       
       <Box px={16} pb={16}>
          <Text fontSize={15} color="#111827" lineHeight={22}>{post.content}</Text>
          {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
       </Box>

       <HStack px={16} py={12} justify="space-between" borderTop={1} borderColor="#F3F2EF">
          <HStack items="center">
             <Text fontSize={13} color="#666666">{post.likes_count} reactions</Text>
             <Divider color="#E5E7EB" h={12} mx={8} />
             <Text fontSize={13} color="#666666">{comments.length} syncs</Text>
          </HStack>
       </HStack>

       <Divider color="#F3F2EF" />
       
       <HStack px={4} py={4} justify="space-around">
          <TouchableOpacity style={styles.actionBtn}><ThumbsUp size={20} color={BLUE} /><Text fontSize={14} fontWeight="700" color={BLUE} ml={8}>Like</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}><MessageSquare size={20} color="#666666" /><Text fontSize={14} fontWeight="700" color="#666666" ml={8}>Comment</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}><Share2 size={20} color="#666666" /><Text fontSize={14} fontWeight="700" color="#666666" ml={8}>Share</Text></TouchableOpacity>
       </HStack>
    </Box>
  );

  const renderComment = ({ item }: { item: any }) => (
    <Box px={16} py={12} bg="white">
       <HStack items="flex-start">
          <Avatar source={{ uri: item.author.avatar }} size="md" />
          <VStack ml={12} flex={1} bg="#F3F2EF" p={12} rounded={12}>
             <HStack justify="space-between">
                <Text fontSize={14} fontWeight="700" color="#111827">{item.author.name}</Text>
                <Text fontSize={11} color="#666666">{item.time}</Text>
             </HStack>
             <Text fontSize={13} color="#111827" mt={4}>{item.text}</Text>
          </VStack>
       </HStack>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={PostHeader}
          renderItem={renderComment}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Comment Input */}
        <Box 
          position="absolute" 
          bottom={0} 
          left={0} 
          right={0} 
          bg="white" 
          borderTop={1} 
          borderColor="#E5E7EB"
          pb={insets.bottom + 8}
          pt={8}
          px={16}
        >
          <HStack items="center">
             <Avatar source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150?u=me' }} size="md" />
             <TextInput
               style={styles.input}
               placeholder="Write a comment..."
               value={newComment}
               onChangeText={setNewComment}
               multiline
             />
             <TouchableOpacity onPress={handlePostComment}>
                <Send size={24} color={newComment.trim() ? BLUE : '#94A3B8'} />
             </TouchableOpacity>
          </HStack>
          <HStack mt={8} space="md">
             <TouchableOpacity><ImageIcon size={20} color="#666666" /></TouchableOpacity>
             <TouchableOpacity><Plus size={20} color="#666666" /></TouchableOpacity>
             <TouchableOpacity><Smile size={20} color="#666666" /></TouchableOpacity>
          </HStack>
        </Box>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  postImage: { width: '100%', height: 250, borderRadius: 12, marginTop: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  input: { flex: 1, backgroundColor: '#F3F2EF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 12, maxHeight: 100, fontSize: 14 },
});
