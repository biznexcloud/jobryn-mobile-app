import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { moderateScale, verticalScale } from '../../utils/responsive';
import {
  Plus,
  Search,
  Menu,
  MessageSquare,
  Bell,
  Video,
  Image as ImageIcon,
  Smile,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  useAnimatedScrollHandler
} from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { JobService } from '../../services/api/jobs';
import { SocialService } from '../../services/api/social';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider } from '../../components/ui';
import { PostCard } from '../../components/cards/PostCard';
import Sidebar from '../../components/common/Sidebar';

const { width } = Dimensions.get('window');
const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';

export default function SeekerDashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation: any = useNavigation();
  const { user, token } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);

const DUMMY_FEED = [
  {
    id: 'f1',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    content: 'Just launched my new portfolio website built with React Native and Expo! The performance on both iOS and Android is incredible. Would love some feedback from the community! 🚀📱',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    likes: 124,
    comments: 18,
    reposts: 5,
    user: { name: 'Alex Developer', avatar: 'https://i.pravatar.cc/150?img=11', role: 'Frontend Engineer' }
  },
  {
    id: 'f2',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    content: 'Looking for a Senior Backend Developer role focusing on Node.js and PostgreSQL. Over 5 years of experience! #OpenToWork',
    image: null,
    likes: 56,
    comments: 8,
    reposts: 12,
    user: { name: 'Sarah Backend', avatar: 'https://i.pravatar.cc/150?img=5', role: 'Senior Backend Developer' }
  },
  {
    id: 'f3',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    content: 'Our team at TechNova is expanding! We are hiring for 3 new positions. Check out our jobs board for more info! 💼✨',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    likes: 342,
    comments: 45,
    reposts: 89,
    user: { name: 'TechNova HR', avatar: 'https://i.pravatar.cc/150?img=33', role: 'Talent Acquisition' }
  },
  {
    id: 'f4',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    content: 'Here is a quick tip for nailing your system design interviews: Always start by clarifying requirements! Dont jump straight into drawing architecture diagrams. Take 5 minutes to gather functional and non-functional requirements. It shows seniority and structured thinking. 💡',
    image: null,
    likes: 892,
    comments: 112,
    reposts: 245,
    user: {
      name: 'Elena System',
      avatar: 'https://i.pravatar.cc/150?img=44',
      role: 'Tech Lead @ Prisma'
    }
  },
  {
    id: 'f5',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    content: 'Just finished an incredible workshop on AI integration in modern web apps. The future of user interfaces is definitely going to be driven by dynamic, context-aware LLMs. Heres a screenshot of the dashboard we built today! 🤖',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    likes: 215,
    comments: 34,
    reposts: 15,
    user: {
      name: 'James AI',
      avatar: 'https://i.pravatar.cc/150?img=55',
      role: 'Full Stack Developer'
    }
  },
  {
    id: 'f6',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    content: 'I am thrilled to announce that I have accepted an offer as a Software Engineer at Google! A huge thank you to everyone who supported me through the rigorous interview process. Looking forward to this new chapter! 🎉👨‍💻',
    image: null,
    likes: 1540,
    comments: 230,
    reposts: 42,
    user: {
      name: 'David Grad',
      avatar: 'https://i.pravatar.cc/150?img=60',
      role: 'Software Engineer @ Google'
    }
  }
];

const DUMMY_STORIES = [
  {
    id: 's1',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=800&q=80',
    user: { name: 'TechNova HR', avatar: 'https://i.pravatar.cc/150?img=33' }
  },
  {
    id: 's2',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=800&q=80',
    user: { name: 'Alex Dev', avatar: 'https://i.pravatar.cc/150?img=11' }
  },
  {
    id: 's3',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=800&q=80',
    user: { name: 'Sarah Tech', avatar: 'https://i.pravatar.cc/150?img=5' }
  },
  {
    id: 's4',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=800&q=80',
    user: { name: 'Elena Code', avatar: 'https://i.pravatar.cc/150?img=44' }
  },
  {
    id: 's5',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=800&q=80',
    user: { name: 'James AI', avatar: 'https://i.pravatar.cc/150?img=55' }
  },
];

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

  const fetchData = async () => {
    try {
      const [jobsData, feedData, storiesData] = await Promise.all([
        JobService.getJobs(),
        SocialService.getFeed(),
        SocialService.getStories(),
      ]);
      setJobs(jobsData?.results || []);
      setFeed(DUMMY_FEED);
      setStories(DUMMY_STORIES);
    } catch (e) {
      if (!token?.startsWith('demo_') && token !== 'demo-token') {
        console.warn('Sync failed');
      }
      setFeed(DUMMY_FEED);
      setStories(DUMMY_STORIES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const lastScrollY = useSharedValue(0);
  const fabTranslateY = useSharedValue(0);
  const fabOpacity = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      if (currentY > lastScrollY.value && currentY > 50) {
        // Scrolling down
        fabTranslateY.value = withTiming(100);
        fabOpacity.value = withTiming(0);
      } else {
        // Scrolling up
        fabTranslateY.value = withTiming(0);
        fabOpacity.value = withTiming(1);
      }
      lastScrollY.value = currentY;
    },
  });

  const animatedFabStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: fabTranslateY.value }],
      opacity: fabOpacity.value,
    };
  });

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* FB Header: Logo Left, Icons Right */}
      <Box px={16} pt={insets.top + 4} pb={12} bg="white">
         <HStack items="center" justify="space-between">
            <Text fontSize={28} fontWeight="900" color={FB_BLUE} letterSpacing={-2}>jobryn</Text>
            <HStack space="xs">
               <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Learning')}>
                  <Plus size={20} color="black" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('SearchExplore')}>
                  <Search size={20} color="black" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Messages')}>
                  <MessageSquare size={20} color="black" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('SeekerNotifications')}>
                  <Bell size={20} color="black" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.headerIcon} onPress={() => setSidebarOpen(true)}>
                  <Menu size={20} color="black" />
               </TouchableOpacity>
            </HStack>
         </HStack>
      </Box>

      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={FB_BLUE} />}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Creation Section (Top) */}
        <Box bg="white" p={12} borderBottom={1} borderColor="#E5E7EB">
           <HStack items="center" space="sm">
              <TouchableOpacity onPress={() => navigation.navigate('SeekerProfile')}>
                 <Avatar source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150' }} size="md" />
              </TouchableOpacity>
              <TouchableOpacity 
                 style={styles.postInput}
                 onPress={() => navigation.navigate('CreateSocialPost')}
              >
                 <Text color="#666666" fontSize={15}>What's on your mind?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('CreateSocialPost')}>
                 <ImageIcon size={24} color="#45BD62" />
              </TouchableOpacity>
           </HStack>
           <Divider color="#F0F2F5" mt={12} mb={12} />
           <HStack justify="space-around">
              <TouchableOpacity style={styles.shortcut}>
                 <Video size={18} color="#F3425F" />
                 <Text fontSize={13} fontWeight="600" color="#65676B" ml={6}>Live Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcut}>
                 <ImageIcon size={18} color="#45BD62" />
                 <Text fontSize={13} fontWeight="600" color="#65676B" ml={6}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcut}>
                 <Smile size={18} color="#F7B928" />
                 <Text fontSize={13} fontWeight="600" color="#65676B" ml={6}>Feeling</Text>
              </TouchableOpacity>
           </HStack>
        </Box>

        {/* Story Section (FB Style Rectangular Cards) */}
        <Box bg="white" py={12} my={8} borderBottom={1} borderColor="#E5E7EB">
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {/* Add Story */}
              <TouchableOpacity style={styles.storyCard} onPress={() => navigation.navigate('CreateStory')}>
                 <View style={styles.storyThumb}>
                    <Image source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150' }} style={styles.storyImg} />
                    <View style={styles.addStoryBtn}>
                       <Plus size={20} color="white" />
                    </View>
                 </View>
                 <View style={styles.storyFooter}>
                    <Text fontSize={11} fontWeight="700" color="black" textAlign="center">Create Story</Text>
                 </View>
              </TouchableOpacity>

              {stories.map((story, i) => (
                 <TouchableOpacity key={i} style={styles.storyCard} onPress={() => navigation.navigate('StoryViewer', { stories: stories, initialIndex: i })}>
                    <Image source={{ uri: story.image }} style={styles.storyImgFull} />
                    <View style={styles.storyAvatarOverlay}>
                       <Avatar source={{ uri: story.user?.avatar }} size={32} style={{ borderWidth: 2, borderColor: FB_BLUE }} />
                    </View>
                    <View style={styles.storyNameOverlay}>
                       <Text fontSize={11} fontWeight="700" color="white" numberOfLines={2}>{story.user?.name}</Text>
                    </View>
                 </TouchableOpacity>
              ))}
           </ScrollView>
        </Box>

        {/* Feed Section */}
        {loading ? (
          <ActivityIndicator color={FB_BLUE} style={{ marginTop: 40 }} />
        ) : (
          feed.map((post) => (
            <PostCard 
              key={post.id} 
              post={{
                ...post,
                postedAt: post.created_at,
                author: {
                   name: post.user?.name || 'User',
                   avatar: post.user?.avatar || `https://i.pravatar.cc/150?u=${post.id}`,
                   headline: post.user?.role || 'Member'
                }
              }} 
              onLikersPress={() => navigation.navigate('LikersList', { postId: post.id })}
              onComment={() => navigation.navigate('PostDetail', { 
                post: {
                  ...post,
                  user: {
                    name: post.user?.name || 'User',
                    avatar: post.user?.avatar || `https://i.pravatar.cc/150?u=${post.id}`,
                    role: post.user?.role || 'Member'
                  }
                }
              })}
            />
          ))
        )}
      </AnimatedScrollView>

      {/* AI Chat FAB */}
      <Animated.View style={[styles.fabContainer, animatedFabStyle]}>
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('AIChat')}
          activeOpacity={0.8}
        >
          <Sparkles size={20} color="white" />
          <Text color="white" fontWeight="700" ml={8}>Ask AI</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Global Sidebar Overlay */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        navigation={navigation}
        role="jobSeeker"
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { backgroundColor: '#F0F2F5', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  postInput: { flex: 1, height: 40, backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, justifyContent: 'center', paddingHorizontal: 16, marginHorizontal: 12 },
  shortcut: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center', paddingVertical: 4 },
  storyCard: { width: moderateScale(106), height: verticalScale(170), marginRight: 8, backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  storyThumb: { width: '100%', height: '70%', backgroundColor: '#F0F2F5' },
  storyImg: { width: '100%', height: '100%', opacity: 0.8 },
  storyImgFull: { width: '100%', height: '100%' },
  addStoryBtn: { position: 'absolute', bottom: -16, alignSelf: 'center', width: 32, height: 32, borderRadius: 16, backgroundColor: FB_BLUE, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'white', zIndex: 10 },
  storyFooter: { height: '30%', justifyContent: 'flex-end', paddingBottom: 8, backgroundColor: 'white' },
  storyAvatarOverlay: { position: 'absolute', top: 8, left: 8, padding: 2, borderRadius: 20, backgroundColor: FB_BLUE },
  storyNameOverlay: { position: 'absolute', bottom: 8, left: 8, right: 8 },
  fabContainer: {
    position: 'absolute',
    bottom: 65,
    right: 16,
    zIndex: 100,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A66C2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
