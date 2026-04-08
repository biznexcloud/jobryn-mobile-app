import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Share } from 'react-native';
import { 
  ThumbsUp, 
  MessageSquare, 
  Repeat, 
  Send,
  Bookmark,
  MoreHorizontal,
  Globe
} from 'lucide-react-native';
import { Colors, Fonts } from '../../constants';
import { timeAgo } from '../../utils';
import { Post } from '../../types';
import Avatar from '../common/Avatar';
import { Text, Box, HStack, VStack, Divider } from '../ui';
import { moderateScale, verticalScale } from '../../utils/responsive';
import { SocialService } from '../../services/api/social';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onLikersPress?: () => void;
}

const INDIGO = '#4F46E5';
const SOFT_GRAY = '#65676B';

export const PostCard = ({ post, onLike, onComment, onShare, onSave, onLikersPress }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const author = post.author;

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    onLike?.();
    try {
      await SocialService.likePost(post.id);
    } catch (e) {
      console.warn('Like failed');
    }
  };

  const handleSave = async () => {
    const newSaved = !saved;
    setSaved(newSaved);
    onSave?.();
    try {
      await SocialService.savePost(post.id);
    } catch (e) {
      console.warn('Save failed');
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${post.content}\n\nCheck out this post on Jobryn.`,
      });
      if (result.action === Share.sharedAction) {
         onShare?.();
         await SocialService.sharePost(post.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box bg="white" mb={8} borderBottom={0.5} borderColor="#E5E7EB" shadow={0.1}>
      {/* Header */}
      <HStack p={12} items="center" justify="space-between">
        <HStack items="center" flex={1}>
          <Avatar uri={author?.avatar} name={author?.name} size={42} />
          <VStack ml={12} flex={1}>
            <Text fontSize={15} fontWeight="800" color="#111827">{author?.name ?? 'User'}</Text>
            <HStack items="center">
               <Text fontSize={12} fontWeight="600" color={SOFT_GRAY}>{timeAgo(post.postedAt)} · </Text>
               <Globe size={11} color={SOFT_GRAY} />
            </HStack>
          </VStack>
        </HStack>
        <TouchableOpacity style={{ padding: 8 }}>
          <MoreHorizontal size={20} color={SOFT_GRAY} />
        </TouchableOpacity>
      </HStack>

      {/* Content */}
      <Box px={12} pb={12}>
        <Text fontSize={15} color="#111827" lineHeight={22}>{post.content}</Text>
      </Box>

      {/* Image */}
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
      )}

      {/* Stats Row */}
      <HStack px={12} py={10} justify="space-between" items="center">
        <TouchableOpacity onPress={onLikersPress}>
          <HStack items="center">
            <Box bg={INDIGO} rounded={10} p={3}>
              <ThumbsUp size={10} color="white" />
            </Box>
            <Text fontSize={12} fontWeight="600" color={SOFT_GRAY} ml={6}>{liked ? post.likes + 1 : post.likes}</Text>
          </HStack>
        </TouchableOpacity>
        <HStack space="md">
          <Text fontSize={12} fontWeight="600" color={SOFT_GRAY}>{post.comments} comments</Text>
          <Text fontSize={12} color={SOFT_GRAY}>·</Text>
          <Text fontSize={12} fontWeight="600" color={SOFT_GRAY}>{post.reposts} shares</Text>
        </HStack>
      </HStack>

      <Divider color="#E5E7EB" mx={12} height={0.5} />

      {/* Action Bar */}
      <HStack px={4} py={2} justify="space-around">
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <ThumbsUp size={20} color={liked ? INDIGO : SOFT_GRAY} fill={liked ? INDIGO : 'transparent'} />
          <Text fontSize={13} fontWeight="800" color={liked ? INDIGO : SOFT_GRAY} ml={8}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn} onPress={onComment}>
          <MessageSquare size={20} color={SOFT_GRAY} />
          <Text fontSize={13} fontWeight="800" color={SOFT_GRAY} ml={8}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Repeat size={20} color={SOFT_GRAY} />
          <Text fontSize={13} fontWeight="800" color={SOFT_GRAY} ml={8}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleSave}>
          <Bookmark size={20} color={saved ? INDIGO : SOFT_GRAY} fill={saved ? INDIGO : 'transparent'} />
          <Text fontSize={13} fontWeight="800" color={saved ? INDIGO : SOFT_GRAY} ml={8}>Save</Text>
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  postImage: { width: '100%', height: 320, backgroundColor: '#F8FAFC' },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
});

export default PostCard;
