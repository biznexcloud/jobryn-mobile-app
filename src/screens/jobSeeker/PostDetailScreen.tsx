import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  Keyboard,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  MoreVertical,
  Heart,
  Bookmark,
  Send,
  CornerDownRight,
  Globe,
  Image as ImageIcon,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider } from '../../components/ui';
import { moderateScale, verticalScale } from '../../utils/responsive';
import { SocialService } from '../../services/api/social';

const FB_BLUE = '#1877F2';
const FB_GRAY = '#F0F2F5';
const SOFT_GRAY = '#65676B';
const FB_DIVIDER = '#E4E6EB';

const QUICK_REACTIONS = ['❤️', '🙌', '🔥', '👏', '😍', '😂', '💡', '😮'];

type Comment = {
  id: string;
  author: { name: string; avatar: string; role: string };
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
  isPinned?: boolean;
  repliesCount?: number;
  replies?: Comment[];
  showReplies?: boolean;
};

export default function PostDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const initialPost = route.params?.post || {};
  
  const [post, setPost] = useState(initialPost);
  const { user, token } = useAuthStore();
  const [imageError, setImageError] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [comments, setComments] = useState<Comment[]>([]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [isSaved, setIsSaved] = useState(post.is_saved || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const isShortText = (post.content?.length ?? 0) < 80 && !post.image;
  const [expandedContent, setExpandedContent] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const refreshPost = async () => {
      if (!post.id) return;
      setLoading(true);
      try {
        const freshPost = await SocialService.getPostDetail(post.id);
        setPost(freshPost);
        setIsLiked(freshPost.is_liked);
        setIsSaved(freshPost.is_saved);
        setLikesCount(freshPost.likes);
        // Sync comments from API (normalized by SocialService)
        if (Array.isArray(freshPost.comments)) {
          setComments(freshPost.comments);
        }
      } catch (e) {
        console.warn('Failed to refresh post detail');
      } finally {
        setLoading(false);
      }
    };
    refreshPost();
  }, [post.id]);

  const animateLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleToggleLike = async () => {
    animateLike();
    const prev = isLiked;
    setIsLiked(!prev);
    setLikesCount(prev ? likesCount - 1 : likesCount + 1);
    try {
      await SocialService.likePost(post.id);
    } catch {
      // revert on error
      setIsLiked(prev);
      setLikesCount(likesCount);
    }
  };

  const handleToggleSave = async () => {
    const prev = isSaved;
    setIsSaved(!prev);
    try {
      await SocialService.savePost(post.id);
    } catch {
      setIsSaved(prev);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({ message: `${post.content}\n\nShared via Jobryn` });
      if (result.action === Share.sharedAction) {
        await SocialService.sharePost(post.id);
      }
    } catch {
      /* no-op */
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setSendingComment(true);
    Keyboard.dismiss();

    const optimistic: Comment = {
      id: `temp-${Date.now()}`,
      author: {
        name: user?.name || 'You',
        avatar: user?.profile_picture || 'https://i.pravatar.cc/150?u=me',
        role: 'Member',
      },
      text: newComment.trim(),
      time: 'Just now',
      likes: 0,
      isLiked: false,
      isPinned: false,
      repliesCount: 0,
    };

    setComments(prev => [...prev, optimistic]);
    setNewComment('');
    setReplyingTo(null);

    try {
      const realComment = await SocialService.addComment(post.id, newComment.trim());
      // Normalize if needed, though SocialService.addComment might already return raw
      // Let's assume we need to update our list with the server-assigned ID
      setComments(prev => prev.map(c => c.id === optimistic.id ? { ...c, id: String(realComment.id) } : c));
    } catch (e) {
      console.error('Comment posting failed:', e);
      // Optional: remove optimistic comment if it failed definitively
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
    } finally {
      setSendingComment(false);
    }
  };

  const handleEmojiReaction = async (emoji: string) => {
    await handlePostComment();
    // Also send emoji as comment
    if (!newComment.trim()) {
      const optimistic: Comment = {
        id: `temp-emoji-${Date.now()}`,
        author: {
          name: user?.name || 'You',
          avatar: user?.profile_picture || 'https://i.pravatar.cc/150?u=me',
          role: 'Member',
        },
        text: emoji,
        time: 'Just now',
        likes: 0,
      };
      setComments(prev => [...prev, optimistic]);
      try {
        await SocialService.addComment(post.id, emoji);
      } catch {/* no-op */}
    }
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const handleReply = (commentId: string, name: string) => {
    setReplyingTo({ id: commentId, name });
    setNewComment(`@${name} `);
    inputRef.current?.focus();
  };

  const toggleReplies = (commentId: string) => {
    setComments(prev =>
      prev.map(c => (c.id === commentId ? { ...c, showReplies: !c.showReplies } : c))
    );
  };

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
    return n.toString();
  };

  // ─── Comment Bubble ─────────────────────────────────────────────────────────
  const renderComment = useCallback(({ item, isReply = false }: { item: Comment; isReply?: boolean }) => (
    <View style={[styles.commentRow, isReply && styles.replyRow]}>
      {isReply && <CornerDownRight size={14} color="#BCC0C4" style={{ marginTop: 6, marginRight: 6 }} />}
      <Image source={{ uri: item.author.avatar }} style={isReply ? styles.replyAvatar : styles.commentAvatar} />
      <VStack flex={1}>
        {/* Bubble */}
        <View style={styles.commentBubble}>
          <HStack items="center" mb={2}>
            <Text fontSize={moderateScale(13)} fontWeight="800" color="#111827">{item.author.name}</Text>
            {item.isPinned && (
              <Box ml={6} px={6} py={1} bg="#EEF2FF" rounded={6}>
                <Text fontSize={moderateScale(10)} color={FB_BLUE} fontWeight="700">📌 Pinned</Text>
              </Box>
            )}
          </HStack>
          <Text fontSize={moderateScale(14)} color="#1C1E21" lineHeight={20}>{item.text}</Text>
        </View>

        {/* Meta Row */}
        <HStack items="center" mt={4} ml={4} space="md">
          <Text fontSize={moderateScale(11)} color={SOFT_GRAY}>{item.time}</Text>
          <TouchableOpacity onPress={() => handleCommentLike(item.id)}>
            <Text
              fontSize={moderateScale(12)}
              fontWeight="800"
              color={item.isLiked ? FB_BLUE : SOFT_GRAY}
            >
              Like{item.likes > 0 ? ` · ${item.likes}` : ''}
            </Text>
          </TouchableOpacity>
          {!isReply && (
            <TouchableOpacity onPress={() => handleReply(item.id, item.author.name)}>
              <Text fontSize={moderateScale(12)} fontWeight="800" color={SOFT_GRAY}>Reply</Text>
            </TouchableOpacity>
          )}
        </HStack>

        {/* View / Collapse Replies */}
        {!isReply && (item.repliesCount || 0) > 0 && (
          <TouchableOpacity style={styles.viewRepliesBtn} onPress={() => toggleReplies(item.id)}>
            <View style={styles.replyLine} />
            <Text fontSize={moderateScale(12)} fontWeight="700" color={SOFT_GRAY}>
              {item.showReplies ? 'Hide' : `View ${item.repliesCount}`} {item.repliesCount === 1 ? 'reply' : 'replies'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Inline Replies */}
        {item.showReplies && item.replies?.map(reply => (
          <View key={reply.id}>
            {renderComment({ item: reply, isReply: true })}
          </View>
        ))}
      </VStack>
    </View>
  ), []);

  // ─── Post Header (ListHeaderComponent) ──────────────────────────────────────
  const PostHeader = () => (
    <Box bg="white" mb={8}>
      {/* Nav bar */}
      <HStack px={14} pt={insets.top + 4} pb={10} items="center" justify="space-between" borderBottom={1} borderColor={FB_DIVIDER}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ChevronLeft size={26} color="#050505" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text fontSize={16} fontWeight="700" color="#050505">Post</Text>
        <TouchableOpacity onPress={handleToggleSave}>
          <Bookmark size={22} color={isSaved ? FB_BLUE : '#050505'} fill={isSaved ? FB_BLUE : 'transparent'} />
        </TouchableOpacity>
      </HStack>

      {/* Author */}
      <HStack px={14} pt={14} pb={10} items="center" justify="space-between">
        <HStack items="center" flex={1}>
          <Image source={{ uri: post.author?.avatar }} style={styles.authorAvatar} />
          <VStack ml={10} flex={1}>
            <Text fontSize={15} fontWeight="700" color="#050505">{post.author?.name}</Text>
            <HStack items="center">
               <Text fontSize={12} color={SOFT_GRAY}>{post.postedAt} · </Text>
               <Globe size={11} color={SOFT_GRAY} />
            </HStack>
          </VStack>
        </HStack>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MoreVertical size={20} color={SOFT_GRAY} />
        </TouchableOpacity>
      </HStack>

      {/* Content */}
      <Box px={14} pb={post.image ? 12 : 16}>
        <Text 
          fontSize={isShortText ? 20 : 15} 
          fontWeight={isShortText ? "500" : "400"}
          color="#050505" 
          lineHeight={isShortText ? 28 : 22}
        >
          {post.content}
        </Text>
      </Box>

        {/* Post Image with Dummy Fallback */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: (post.image && !imageError) 
                ? post.image 
                : `https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop`
            }} 
            style={styles.postImage} 
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        </View>

      {/* Stats */}
      <HStack px={14} py={10} justify="space-between" items="center">
          <HStack items="center">
            <HStack>
               <Box bg={FB_BLUE} rounded={10} p={3} border={1.5} borderColor="white">
                 <ThumbsUp size={10} color="white" fill="white" />
               </Box>
               <Box bg="#F3425F" rounded={10} p={3} border={1.5} borderColor="white" ml={-6}>
                 <Heart size={10} color="white" fill="white" />
               </Box>
            </HStack>
            <Text fontSize={13} color={SOFT_GRAY} ml={6}>
               {isLiked ? (likesCount > 1 ? `You and ${likesCount - 1} others` : 'You') : (likesCount || 0)}
            </Text>
          </HStack>
        <HStack>
          <Text fontSize={13} color={SOFT_GRAY}>{formatCount(post.comments || 0)} comments</Text>
          <Text fontSize={13} color={SOFT_GRAY} mx={4}>·</Text>
          <Text fontSize={13} color={SOFT_GRAY}>{formatCount(post.reposts || 0)} reposts</Text>
        </HStack>
      </HStack>

      <Divider color="#E4E6EB" />

      {/* Action Bar */}
      <HStack px={4} py={2} justify="space-around">
        <TouchableOpacity style={styles.actionBtn} onPress={handleToggleLike}>
          <ThumbsUp size={20} color={isLiked ? FB_BLUE : SOFT_GRAY} strokeWidth={isLiked ? 2.5 : 2} />
          <Text fontSize={13} fontWeight="600" color={isLiked ? FB_BLUE : SOFT_GRAY} ml={6}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => inputRef.current?.focus()}>
          <MessageSquare size={20} color={SOFT_GRAY} strokeWidth={2} />
          <Text fontSize={13} fontWeight="600" color={SOFT_GRAY} ml={6}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Repeat2 size={20} color={SOFT_GRAY} strokeWidth={2} />
          <Text fontSize={13} fontWeight="600" color={SOFT_GRAY} ml={6}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleToggleSave}>
          <Bookmark size={20} color={isSaved ? FB_BLUE : SOFT_GRAY} />
          <Text fontSize={13} fontWeight="600" color={isSaved ? FB_BLUE : SOFT_GRAY} ml={6}>Save</Text>
        </TouchableOpacity>
      </HStack>

      <Divider color="#E4E6EB" />

      {/* Comments Header */}
      <HStack px={14} py={12} items="center" justify="space-between">
        <Text fontSize={15} fontWeight="700" color="#050505">Most relevant</Text>
        <TouchableOpacity>
          <Text fontSize={13} fontWeight="700" color={FB_BLUE}>All comments ▾</Text>
        </TouchableOpacity>
      </HStack>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<PostHeader />}
          renderItem={({ item }) => renderComment({ item })}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: moderateScale(160) }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Bottom Input Area */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="white"
          borderTop={1}
          borderColor="#E4E6EB"
          style={{ paddingBottom: Math.max(insets.bottom, 8) }}
        >
          {/* Replying To Banner */}
          {replyingTo && (
            <HStack px={14} pt={8} pb={4} items="center" justify="space-between">
              <Text fontSize={12} color={SOFT_GRAY}>
                Replying to <Text fontWeight="700" color={FB_BLUE}>{replyingTo.name}</Text>
              </Text>
              <TouchableOpacity onPress={() => { setReplyingTo(null); setNewComment(''); }}>
                <Text fontSize={12} color="#E53E3E" fontWeight="700">✕ Cancel</Text>
              </TouchableOpacity>
            </HStack>
          )}

          {/* Quick emoji bar */}
          <HStack px={14} pt={8} pb={6} style={{ gap: moderateScale(8) }}>
            {QUICK_REACTIONS.map((emoji, i) => (
              <TouchableOpacity
                key={i}
                style={styles.emojiBtn}
                onPress={() => {
                  setNewComment(emoji);
                  setTimeout(handleEmojiReaction, 100);
                }}
              >
                <Text fontSize={moderateScale(22)}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </HStack>

          <Divider color="#E4E6EB" />

          {/* Input */}
          <HStack px={12} pt={8} pb={4} items="flex-end">
            <Image
              source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150?u=me' }}
              style={styles.inputAvatar}
            />
            <HStack flex={1} items="flex-end" style={styles.inputWrap} ml={10}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={replyingTo ? `Reply to ${replyingTo.name}…` : `Comment as ${user?.name || 'You'}…`}
                placeholderTextColor="#8A8D91"
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendBtn, !newComment.trim() && { opacity: 0.4 }]}
                onPress={handlePostComment}
                disabled={!newComment.trim() || sendingComment}
              >
                {sendingComment ? (
                  <ActivityIndicator size="small" color={FB_BLUE} />
                ) : (
                  <Send size={18} color={FB_BLUE} />
                )}
              </TouchableOpacity>
            </HStack>
          </HStack>
        </Box>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  imageContainer: { width: '100%', height: verticalScale(300), backgroundColor: '#F0F2F5' },
  postImage: { width: '100%', height: '100%' },
  imageErrorContainer: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#F0F2F5',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(10),
  },
  reactionBubbles: { flexDirection: 'row', alignItems: 'center' },
  reactionBadge: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  // ─── Comment styles ────────────────────────────────────────────────────────
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(10),
    backgroundColor: 'white',
  },
  replyRow: {
    paddingLeft: moderateScale(14),
    paddingTop: moderateScale(6),
  },
  commentAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: '#E4E6EB',
    marginRight: moderateScale(8),
  },
  replyAvatar: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: '#E4E6EB',
    marginRight: moderateScale(8),
  },
  commentBubble: {
    backgroundColor: '#F0F2F5',
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(10),
    alignSelf: 'flex-start',
    maxWidth: '95%',
  },
  viewRepliesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(6),
    marginLeft: moderateScale(4),
  },
  replyLine: {
    width: moderateScale(24),
    height: 1.5,
    backgroundColor: '#BCC0C4',
    marginRight: moderateScale(6),
  },
  separator: { height: 1, backgroundColor: '#F0F2F5' },
  // ─── Input styles ──────────────────────────────────────────────────────────
  inputAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: '#E4E6EB',
  },
  inputWrap: {
    backgroundColor: '#F0F2F5',
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(6),
    minHeight: moderateScale(42),
    maxHeight: moderateScale(120),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#1C1E21',
    maxHeight: moderateScale(100),
    paddingTop: moderateScale(4),
  },
  sendBtn: {
    paddingLeft: moderateScale(8),
    paddingBottom: moderateScale(4),
    alignSelf: 'flex-end',
  },
  emojiBtn: { alignItems: 'center', justifyContent: 'center' },
});
