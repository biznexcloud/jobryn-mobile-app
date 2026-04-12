import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, HStack, VStack, Box, Divider, Avatar } from '../../components/ui';
import {
  ChevronLeft,
  MoreVertical,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Heart,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { SocialService } from '../../services/api/social';
import Toast from 'react-native-toast-message';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';
const QUICK_REACTIONS = ['❤️', '🙌', '🔥', '👏', '😍', '😐', '😂', '😡'];

export default function PostDetailScreen({ navigation, route }: { navigation: any; route: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const postFromParams = route.params?.post || {};
  const [post, setPost] = useState(postFromParams);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(postFromParams.is_liked || false);
  const [likesCount, setLikesCount] = useState(postFromParams.likes_count || postFromParams.likes || 0);
  const [expandedContent, setExpandedContent] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleRepost = async () => {
    try {
      await SocialService.sharePost(post.id);
      Toast.show({ type: 'success', text1: 'Post shared to your timeline' });
    } catch {
      Toast.show({ type: 'error', text1: 'Sharing unavailable right now' });
    }
  };

  useEffect(() => {
    loadPostData();
  }, []);

  const loadPostData = async () => {
    setLoading(true);
    try {
      const data = await SocialService.getPostDetail(post.id || route.params?.id);
      setPost(data);
      setComments(data.comments || []);
      setIsLiked(data.is_liked || false);
      setLikesCount(data.likes_count || data.likes || 0);
    } catch (e) {
      console.warn('Failed to load post details:', e);
    } finally {
      setLoading(false);
    }
  };

  const myAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Recruiter')}&background=EEF2FF&color=4F46E5&size=96`;

  const sendComment = async () => {
    if (!newComment.trim()) return;
    const commentText = newComment;
    setNewComment('');
    try {
      const result = await SocialService.addComment(post.id, commentText);
      setComments(prev => [{
        ...result,
        author: { name: user?.name || 'You', avatar: myAvatar, role: 'Recruiter' },
        time: 'Just now',
        likes: 0,
        isPinned: false,
        repliesCount: 0,
      }, ...prev]);
      Toast.show({ type: 'success', text1: 'Comment posted' });
    } catch (e) {
      console.warn('Failed to send comment');
    }
  };

  const handleToggleLike = async () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev: number) => newLiked ? prev + 1 : prev - 1);
    try {
      await SocialService.toggleLike(post.id);
    } catch (e) {
      setIsLiked(!newLiked);
      setLikesCount((prev: number) => !newLiked ? prev + 1 : prev - 1);
    }
  };

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
    return String(n);
  };

  const authorName = post.author?.name || post.user?.name || 'Company';
  const authorAvatar = post.author?.avatar || post.user?.avatar || 'https://i.pravatar.cc/150';
  const authorRole = post.author?.role || post.user?.role || 'Professional';
  const postTimestamp = post.timestamp || post.created_at || '1h';
  const postContent = post.content || post.description || '';
  const postImage = post.image || post.media_url || null;
  const commentsCount = post.comments_count || post.comments || 0;
  const repostsCount = post.reposts_count || post.reposts || 0;

  const PostHeader = () => (
    <Box bg="white">
      {/* Header */}
      <Box pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack px={16} items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <ChevronLeft size={22} color="black" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Post</Text>
        </HStack>
      </Box>

      {/* Author Info */}
      <HStack px={16} py={14} items="center" justify="space-between">
        <HStack items="center" flex={1}>
          <Image source={{ uri: authorAvatar }} style={styles.avatar} />
          <VStack ml={12} flex={1}>
            <Text fontSize={16} fontWeight="700" color="#111827" numberOfLines={1}>{authorName}</Text>
            <Text fontSize={12} color={GRAY_TEXT} numberOfLines={1}>{authorRole} • {postTimestamp}</Text>
          </VStack>
        </HStack>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MoreVertical size={20} color={GRAY_TEXT} />
        </TouchableOpacity>
      </HStack>

      {/* Post Content */}
      <Box px={16} pb={12}>
        <Text fontSize={15} color="#1C1E21" lineHeight={22}>
          {expandedContent ? postContent : postContent?.substring(0, 160)}
          {!expandedContent && postContent?.length > 160 && (
            <Text
              fontSize={15}
              fontWeight="700"
              color={FB_BLUE}
              onPress={() => setExpandedContent(true)}
            > ...see more</Text>
          )}
        </Text>
      </Box>

      {/* Post Image */}
      {postImage && (
        <Image source={{ uri: postImage }} style={styles.contentImage} resizeMode="cover" />
      )}

      {/* Stats Row */}
      <HStack px={16} py={12} justify="space-between" items="center">
        <HStack items="center">
          <Box bg={FB_BLUE} w={18} h={18} rounded={9} items="center" justify="center" border={1.5} borderColor="white">
            <ThumbsUp size={10} color="white" fill="white" />
          </Box>
          <Box bg="#EF4444" w={18} h={18} rounded={9} items="center" justify="center" border={1.5} borderColor="white" ml={-6}>
            <Heart size={10} color="white" fill="white" />
          </Box>
          <Text fontSize={13} color={GRAY_TEXT} ml={6}>
            {formatCount(likesCount)}
          </Text>
        </HStack>
        <HStack space="xs">
          <Text fontSize={13} color={GRAY_TEXT}>{formatCount(commentsCount)} comments</Text>
          <Text fontSize={13} color={GRAY_TEXT}>•</Text>
          <Text fontSize={13} color={GRAY_TEXT}>{formatCount(repostsCount)} reposts</Text>
        </HStack>
      </HStack>

      <Divider color="#F0F2F5" mx={16} />

      {/* Action Bar */}
      <HStack px={8} py={4} justify="space-around">
        <TouchableOpacity style={styles.actionBtn} onPress={handleToggleLike}>
          <ThumbsUp size={20} color={isLiked ? FB_BLUE : GRAY_TEXT} strokeWidth={isLiked ? 2.5 : 2} fill={isLiked ? FB_BLUE : 'transparent'} />
          <Text fontSize={14} fontWeight="700" color={isLiked ? FB_BLUE : GRAY_TEXT} ml={6}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => inputRef.current?.focus()}>
          <MessageSquare size={20} color={GRAY_TEXT} strokeWidth={2} />
          <Text fontSize={14} fontWeight="700" color={GRAY_TEXT} ml={6}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleRepost}>
          <Repeat2 size={20} color={GRAY_TEXT} strokeWidth={2} />
          <Text fontSize={14} fontWeight="700" color={GRAY_TEXT} ml={6}>Repost</Text>
        </TouchableOpacity>
      </HStack>

      <Divider color={FB_GRAY} h={8} />
    </Box>
  );

  const renderComment = ({ item }: { item: any }) => {
    const author = item.author || item.user || {};
    const avatarUri = author.avatar || author.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name || 'User')}&background=F3F4F6&color=4F46E5`;

    return (
      <Box px={16} py={16} bg="white">
        <HStack items="flex-start">
          <Image source={{ uri: avatarUri }} style={styles.commentAvatar} />
          <VStack flex={1} ml={12} bg={FB_GRAY} p={12} rounded={16}>
            <HStack items="center" justify="space-between" mb={2}>
              <Text fontSize={14} fontWeight="700" color="#111827">{author.name || 'Jobryn User'}</Text>
              <Text fontSize={11} color={GRAY_TEXT}>{item.created_at || item.time || 'now'}</Text>
            </HStack>
            <Text fontSize={14} color="#1F2937" lineHeight={20}>
              {item.content || item.text}
            </Text>
          </VStack>
        </HStack>
        <HStack ml={64} mt={6} items="center" space="md">
          <TouchableOpacity><Text fontSize={12} fontWeight="700" color={GRAY_TEXT}>Like</Text></TouchableOpacity>
          <TouchableOpacity><Text fontSize={12} fontWeight="700" color={GRAY_TEXT}>Reply</Text></TouchableOpacity>
        </HStack>
      </Box>
    );
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={comments}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderComment}
          ListHeaderComponent={<PostHeader />}
          contentContainerStyle={{ paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Sticky Bottom Input */}
        <Box 
          position="absolute" 
          bottom={0} 
          left={0} 
          right={0} 
          bg="white" 
          borderTop={1} 
          borderColor="#F0F2F5"
          pb={Math.max(insets.bottom, 12)}
        >
          <HStack px={16} py={10} space="md">
            {QUICK_REACTIONS.slice(0, 6).map((emoji, idx) => (
              <TouchableOpacity key={idx} onPress={() => setNewComment(prev => prev + emoji)}>
                <Text fontSize={24}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </HStack>
          
          <HStack px={16} py={8} items="center" space="md">
            <Image source={{ uri: myAvatar }} style={styles.smallAvatar} />
            <Box flex={1} bg={FB_GRAY} rounded={24} px={16} py={8} flexDirection="row" items="center">
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity onPress={sendComment} disabled={!newComment.trim()}>
                <Text fontSize={14} fontWeight="700" color={newComment.trim() ? FB_BLUE : '#9CA3AF'}>Post</Text>
              </TouchableOpacity>
            </Box>
          </HStack>
        </Box>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F2F5' },
  contentImage: { width: '100%', height: 260, backgroundColor: '#F0F2F5' },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  commentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F2F5' },
  smallAvatar: { width: 32, height: 32, borderRadius: 16 },
  input: { flex: 1, fontSize: 15, color: '#111827', maxHeight: 80, padding: 0 },
});
