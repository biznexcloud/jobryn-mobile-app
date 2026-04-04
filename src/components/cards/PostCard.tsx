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

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onLikersPress?: () => void;
}

const FB_BLUE = '#1877F2';

export const PostCard = ({ post, onLike, onComment, onShare, onSave, onLikersPress }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const author = post.author;

  const handleLike = () => {
    setLiked(!liked);
    onLike?.();
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave?.();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.content}\n\nCheck out this post on Jobryn.`,
      });
      onShare?.();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box bg="white" mb={8} borderBottom={1} borderColor="#E5E7EB">
      {/* Header */}
      <HStack p={12} items="center" justify="space-between">
        <HStack items="center" flex={1}>
          <Avatar uri={author?.avatar} name={author?.name} size={40} />
          <VStack ml={10} flex={1}>
            <Text fontSize={15} fontWeight="700" color="#111827">{author?.name ?? 'User'}</Text>
            <HStack items="center">
               <Text fontSize={12} color="#65676B">{timeAgo(post.postedAt)} · </Text>
               <Globe size={12} color="#65676B" />
            </HStack>
          </VStack>
        </HStack>
        <TouchableOpacity style={{ padding: 4 }}>
          <MoreHorizontal size={20} color="#65676B" />
        </TouchableOpacity>
      </HStack>

      {/* Content */}
      <Box px={12} pb={12}>
        <Text fontSize={14} color="#1C1E21" lineHeight={20}>{post.content}</Text>
      </Box>

      {/* Image */}
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
      )}

      {/* Stats Row */}
      <HStack px={12} py={10} justify="space-between" items="center">
        <TouchableOpacity onPress={onLikersPress}>
          <HStack items="center">
            <Box bg={FB_BLUE} rounded={10} p={3}>
              <ThumbsUp size={10} color="white" />
            </Box>
            <Text fontSize={13} color="#65676B" ml={6}>{liked ? post.likes + 1 : post.likes}</Text>
          </HStack>
        </TouchableOpacity>
        <HStack space="md">
          <Text fontSize={13} color="#65676B">{post.comments} comments</Text>
          <Text fontSize={13} color="#65676B">·</Text>
          <Text fontSize={13} color="#65676B">{post.reposts} shares</Text>
        </HStack>
      </HStack>

      <Divider color="#CED0D4" mx={12} />

      {/* Action Bar */}
      <HStack px={4} py={2} justify="space-around">
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <ThumbsUp size={20} color={liked ? FB_BLUE : "#65676B"} fill={liked ? FB_BLUE : 'transparent'} />
          <Text fontSize={13} fontWeight="600" color={liked ? FB_BLUE : "#65676B"} ml={6}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn} onPress={onComment}>
          <MessageSquare size={20} color="#65676B" />
          <Text fontSize={13} fontWeight="600" color="#65676B" ml={6}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Repeat size={20} color="#65676B" />
          <Text fontSize={13} fontWeight="600" color="#65676B" ml={6}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleSave}>
          <Bookmark size={20} color={saved ? FB_BLUE : "#65676B"} fill={saved ? FB_BLUE : 'transparent'} />
          <Text fontSize={13} fontWeight="600" color={saved ? FB_BLUE : "#65676B"} ml={6}>Save</Text>
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  postImage: { width: '100%', height: 320, backgroundColor: '#F0F2F5' },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
});

export default PostCard;
