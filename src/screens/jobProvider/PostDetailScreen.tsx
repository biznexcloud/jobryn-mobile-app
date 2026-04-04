// UI_VERSION_1.1
import React, { useState, useEffect } from 'react';
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
import { ScreenWrapper, Text, HStack, VStack } from '../../components/ui';
import {
  ChevronLeftIcon, DotsHorizontalIcon, ThumbUpIcon, ChatAlt2Icon, ShareIcon, PaperAirplaneIcon,
} from 'react-native-heroicons/outline';
import { useAuthStore } from '../../store/authStore';
import { SocialService } from '../../services/api/social';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#4F46E5';

const MOCK_COMMENTS = [
  {
    id: 'c1',
    author: { name: 'Priya K.', avatar: 'https://i.pravatar.cc/150?img=5', role: 'Job Seeker' },
    text: 'Sounds like a great opportunity! Do you have remote options?',
    time: '30m',
    likes: 3,
  },
  {
    id: 'c2',
    author: { name: 'Anish Shrestha', avatar: 'https://i.pravatar.cc/150?u=anish', role: 'Backend Developer' },
    text: 'I applied just now! Looking forward to the process.',
    time: '20m',
    likes: 1,
  },
];

export default function PostDetailScreen({ navigation, route }: { navigation: any; route: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const postFromParams = route.params?.post || {};
  const [post, setPost] = useState(postFromParams);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPostData();
  }, []);

  const loadPostData = async () => {
    setLoading(true);
    try {
      const data = await SocialService.getPostDetail(post.id || route.params?.id);
      setPost(data);
      setComments(data.comments || []);
    } catch (e) {
      console.warn('Failed to load post details');
      // Fallback for Demo Mode
      if (useAuthStore.getState().token === 'demo-token') {
        if (!post.content) setPost({ ...postFromParams, content: 'Fallback update for recruiters.' });
        setComments(MOCK_COMMENTS);
      }
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
      setComments(prev => [...prev, {
        ...result,
        author: { name: user?.name || 'You', avatar: myAvatar, role: 'Recruiter' },
        time: 'Just now',
        likes: 0,
      }]);
    } catch (e) {
      console.warn('Failed to send comment');
    }
  };

  const handleToggleLike = async () => {
    try {
      await SocialService.toggleLike(post.id);
      setPost((prev: any) => ({
        ...prev,
        is_liked: !prev.is_liked,
        likes_count: (prev.likes_count || prev.likes || 0) + (prev.is_liked ? -1 : 1)
      }));
    } catch (e) {
      console.warn('Failed to toggle like');
    }
  };

  const PostHeader = () => (
    <View>
      <View style={styles.postSection}>
        <HStack items="center" justify="space-between" mb={moderateScale(14)}>
          <HStack items="center" flex={1}>
            <Image source={{ uri: post.author?.avatar || 'https://i.pravatar.cc/150' }} style={styles.postAvatar} />
            <VStack ml={moderateScale(10)} flex={1}>
              <Text fontSize={moderateScale(15)} fontWeight="700" color="#111827" numberOfLines={1}>{post.author?.name || 'User'}</Text>
              <Text fontSize={moderateScale(12)} color="#9CA3AF">{post.author?.role || 'Professional'} • {post.timestamp || '1h'}</Text>
            </VStack>
          </HStack>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <DotsHorizontalIcon size={moderateScale(20)} color="#9CA3AF" />
          </TouchableOpacity>
        </HStack>

        <Text fontSize={moderateScale(15)} color="#374151" lineHeight={moderateScale(22)} mb={moderateScale(14)}>
          {post.content || post.description || 'We are actively hiring — tag a friend or apply directly!'}
        </Text>

        <View style={styles.divider} />
        <HStack py={moderateScale(10)} style={{ gap: moderateScale(20) }}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleToggleLike}>
            <ThumbUpIcon size={moderateScale(20)} color={post.is_liked ? BLUE : "#6B7280"} strokeWidth={post.is_liked ? 2 : 1.5} />
            <Text fontSize={moderateScale(13)} color={post.is_liked ? BLUE : "#6B7280"} ml={moderateScale(5)} fontWeight={post.is_liked ? '700' : '500'}>
              {post.likes_count ?? post.likes ?? 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <ChatAlt2Icon size={moderateScale(20)} color={BLUE} strokeWidth={2} />
            <Text fontSize={moderateScale(13)} color={BLUE} ml={moderateScale(5)} fontWeight="700">
              {comments.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <ShareIcon size={moderateScale(20)} color="#6B7280" strokeWidth={1.5} />
            <Text fontSize={moderateScale(13)} color="#6B7280" ml={moderateScale(5)} fontWeight="500">Share</Text>
          </TouchableOpacity>
        </HStack>
      </View>

      <View style={styles.sectionDivider} />
      <View style={styles.commentsLabel}>
        <Text fontSize={moderateScale(15)} fontWeight="800" color="#111827">Comments ({comments.length})</Text>
      </View>
    </View>
  );

  const renderComment = ({ item }: { item: any }) => {
    // Robust data access for varied response structures (Demo vs Prod)
    const author = item.author || item.user || {};
    const avatarUri = author.avatar || author.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name || 'User')}&background=F3F4F6&color=4F46E5`;

    return (
      <HStack px={moderateScale(16)} mb={moderateScale(20)} items="flex-start">
        <Image source={{ uri: avatarUri }} style={styles.commentAvatar} />
        <VStack flex={1} ml={moderateScale(10)}>
          <View style={styles.bubble}>
            <HStack justify="space-between" mb={2}>
              <Text fontSize={moderateScale(13)} fontWeight="700" color="#111827">{author.name || 'Jobryn User'}</Text>
              <Text fontSize={moderateScale(11)} color="#9CA3AF">{item.created_at || item.time || 'now'}</Text>
            </HStack>
            <Text fontSize={moderateScale(11)} color="#9CA3AF" mb={moderateScale(6)}>{author.role || 'Member'}</Text>
            <Text fontSize={moderateScale(14)} color="#374151" lineHeight={moderateScale(20)}>{item.content || item.text}</Text>
          </View>
          <HStack mt={moderateScale(6)} px={moderateScale(4)} style={{ gap: moderateScale(12) }}>
            <Text fontSize={moderateScale(12)} fontWeight="600" color="#6B7280">Like ({item.likes ?? 0})</Text>
            <Text fontSize={moderateScale(12)} fontWeight="600" color="#6B7280">Reply</Text>
          </HStack>
        </VStack>
      </HStack>
    );
  };

  return (
    <ScreenWrapper safeAreaTop safeAreaBottom={false} backgroundColor="#FFFFFF">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HStack items="center" px={moderateScale(16)} style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeftIcon size={moderateScale(22)} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text fontSize={moderateScale(16)} fontWeight="800" color="#111827" ml={moderateScale(8)}>Post</Text>
      </HStack>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          data={comments}
          keyExtractor={item => item.id}
          renderItem={renderComment}
          ListHeaderComponent={<PostHeader />}
          contentContainerStyle={{ paddingBottom: moderateScale(40) }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, moderateScale(12)) }]}>
          <Image source={{ uri: myAvatar }} style={styles.myAvatar} />
          <HStack flex={1} items="center" style={styles.inputWrap} ml={moderateScale(10)}>
            <TextInput
              style={styles.textInput}
              placeholder="Reply to this post..."
              placeholderTextColor="#9CA3AF"
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, newComment.trim() && styles.sendBtnActive]}
              onPress={sendComment}
              disabled={!newComment.trim()}
            >
              <PaperAirplaneIcon size={moderateScale(16)} color={newComment.trim() ? '#FFFFFF' : '#9CA3AF'} />
            </TouchableOpacity>
          </HStack>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  navHeader: { height: verticalScale(52), borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: {
    width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18),
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  postSection: { padding: moderateScale(16) },
  postAvatar: { width: moderateScale(44), height: moderateScale(44), borderRadius: moderateScale(22), backgroundColor: '#F3F4F6' },
  divider: { height: 1, backgroundColor: '#F3F4F6' },
  sectionDivider: { height: moderateScale(8), backgroundColor: '#F9FAFB' },
  commentsLabel: { padding: moderateScale(16), paddingBottom: moderateScale(8) },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  commentAvatar: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18), backgroundColor: '#F3F4F6' },
  bubble: { backgroundColor: '#F3F4F6', borderRadius: moderateScale(14), padding: moderateScale(12) },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: moderateScale(16), paddingTop: moderateScale(10),
    borderTopWidth: 1, borderTopColor: '#F3F4F6', backgroundColor: '#FFFFFF',
  },
  myAvatar: { width: moderateScale(34), height: moderateScale(34), borderRadius: moderateScale(17), marginBottom: moderateScale(4) },
  inputWrap: {
    backgroundColor: '#F3F4F6', borderRadius: moderateScale(20),
    paddingLeft: moderateScale(14), paddingRight: moderateScale(6), paddingVertical: moderateScale(6),
    minHeight: moderateScale(40), maxHeight: moderateScale(100),
  },
  textInput: { flex: 1, fontSize: moderateScale(14), color: '#111827', maxHeight: moderateScale(80) },
  sendBtn: {
    width: moderateScale(30), height: moderateScale(30), borderRadius: moderateScale(15),
    backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginLeft: moderateScale(6),
  },
  sendBtnActive: { backgroundColor: BLUE },
});





