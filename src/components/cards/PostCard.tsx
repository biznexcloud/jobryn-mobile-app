import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Share } from 'react-native';
import { 
  ThumbsUp, 
  MessageSquare, 
  Repeat, 
  Send,
  Bookmark,
  MoreHorizontal,
  Globe,
  Heart,
  Image as ImageIcon
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
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

const FB_BLUE = '#1877F2';
const FB_GRAY = '#65676B';
const FB_DIVIDER = '#E4E6EB';

export const PostCard = ({ post, onLike, onComment, onShare, onSave, onLikersPress }: PostCardProps) => {
  const [liked, setLiked] = useState(post.is_liked || false);
  const [saved, setSaved] = useState(post.is_saved || false);
  const { token } = useAuthStore();
  const [imageError, setImageError] = useState(false);
  const author = post.author;

  const isShortText = (post.content?.length ?? 0) < 80 && !post.image;
  const isJob = (post as any).isJob;

  const handleLike = async () => {
    if (isJob) return; // Jobs might not be likable in the same way
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
      if (newSaved) {
        await SocialService.savePost(post.id);
      }
    } catch (e) {
      console.warn('Save failed');
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: isJob 
          ? `Check out this job: ${(post as any).title} at ${(post as any).company} on Jobryn.`
          : `${post.content}\n\nCheck out this post on Jobryn.`,
      });
      if (result.action === Share.sharedAction) {
         onShare?.();
         await SocialService.sharePost(post.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApply = () => {
    const navigation = require('@react-navigation/native').useNavigation();
    navigation.navigate('JobDetail', { jobId: (post.id as string).replace('job-', '') });
  };

  return (
    <Box bg="white" mb={8} shadow={0.05} style={styles.card}>
      {/* Header */}
      <HStack p={12} items="center" justify="space-between">
        <HStack items="center" flex={1}>
          <Avatar uri={author?.avatar} name={author?.name} size={40} />
          <VStack ml={10} flex={1}>
            <HStack items="center">
               <Text fontSize={15} fontWeight="700" color="#050505">{author?.name ?? 'User'}</Text>
               {isJob && (
                 <Box bg="#E7F3FF" px={6} py={2} rounded={4} ml={8}>
                    <Text fontSize={10} fontWeight="700" color={FB_BLUE}>HIRING</Text>
                 </Box>
               )}
            </HStack>
            <HStack items="center">
               <Text fontSize={12} color={FB_GRAY}>{timeAgo(post.postedAt)} · </Text>
               <Globe size={11} color={FB_GRAY} />
            </HStack>
          </VStack>
        </HStack>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MoreHorizontal size={20} color={FB_GRAY} />
        </TouchableOpacity>
      </HStack>

      {/* Content */}
      <Box px={12} pb={post.image || isJob ? 12 : 16}>
        {isJob ? (
          <VStack space="xs">
            <Text fontSize={18} fontWeight="700" color="#050505">{(post as any).title}</Text>
            <Text fontSize={14} fontWeight="600" color={FB_BLUE}>{(post as any).company}</Text>
            <HStack items="center" space="xs" mt={4}>
               <Box bg="#F0F2F5" px={8} py={4} rounded={4}>
                  <Text fontSize={12} color="#65676B">{(post as any).location}</Text>
               </Box>
               <Box bg="#F0F2F5" px={8} py={4} rounded={4}>
                  <Text fontSize={12} color="#65676B">{(post as any).jobType}</Text>
               </Box>
               <Box bg="#EBF5EE" px={8} py={4} rounded={4}>
                  <Text fontSize={12} color="#31A24C" fontWeight="600">{(post as any).salary}</Text>
               </Box>
            </HStack>
            <Text 
              fontSize={14} 
              color="#65676B" 
              numberOfLines={3} 
              mt={8}
              lineHeight={20}
            >
              {post.content}
            </Text>
          </VStack>
        ) : (
          <Text 
            fontSize={isShortText ? 20 : 15} 
            fontWeight={isShortText ? "500" : "400"}
            color="#050505" 
            lineHeight={isShortText ? 28 : 22}
          >
            {post.content}
          </Text>
        )}
      </Box>

      {/* Image — only render if the post actually has an image or is a job with a featured image */}
      {!!post.image && !imageError && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.image }}
            style={styles.postImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        </View>
      )}

      {/* Stats Row */}
      {!isJob && (
        <HStack px={12} py={10} justify="space-between" items="center">
          <TouchableOpacity onPress={onLikersPress} activeOpacity={0.7}>
            <HStack items="center">
              <HStack>
                 <Box bg={FB_BLUE} rounded={10} p={3} border={1.5} borderColor="white">
                   <ThumbsUp size={10} color="white" fill="white" />
                 </Box>
                 <Box bg="#F3425F" rounded={10} p={3} border={1.5} borderColor="white" ml={-6}>
                   <Heart size={10} color="white" fill="white" />
                 </Box>
              </HStack>
              <Text fontSize={13} color={FB_GRAY} ml={6}>
                 {liked ? (post.likes > 0 ? `You and ${post.likes} others` : 'You') : (post.likes || 0)}
              </Text>
            </HStack>
          </TouchableOpacity>
          
          <HStack space="md">
            {post.comments > 0 && <Text fontSize={13} color={FB_GRAY}>{post.comments} comments</Text>}
            {post.reposts > 0 && <Text fontSize={13} color={FB_GRAY}>{post.reposts} shares</Text>}
          </HStack>
        </HStack>
      )}

      {isJob && <Divider color={FB_DIVIDER} mx={12} height={1} />}

      {/* Action Bar */}
      <HStack px={4} py={2} justify="space-around">
        {isJob ? (
          <TouchableOpacity style={[styles.actionBtn, styles.applyBtn]} onPress={handleApply}>
            <Text fontSize={14} fontWeight="700" color="white">Apply Now</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
              <ThumbsUp size={20} color={liked ? FB_BLUE : FB_GRAY} strokeWidth={liked ? 2.5 : 2} fill={liked ? 'transparent' : 'none'} />
              <Text fontSize={13} fontWeight="600" color={liked ? FB_BLUE : FB_GRAY} ml={6}>Like</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionBtn} onPress={onComment}>
              <MessageSquare size={20} color={FB_GRAY} strokeWidth={2} />
              <Text fontSize={13} fontWeight="600" color={FB_GRAY} ml={6}>Comment</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Repeat size={20} color={isJob ? FB_BLUE : FB_GRAY} strokeWidth={2} />
          <Text fontSize={13} fontWeight="600" color={isJob ? FB_BLUE : FB_GRAY} ml={6}>Share</Text>
        </TouchableOpacity>
      </HStack>
    </Box>

  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,
    elevation: 0,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#F0F2F5',
  },
  postImage: { 
    width: '100%', 
    height: verticalScale(300),
  },
  imageErrorContainer: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10 
  },
  applyBtn: {
    backgroundColor: FB_BLUE,
    borderRadius: 6,
    marginHorizontal: 8,
    marginVertical: 4,
  },
});

export default PostCard;
