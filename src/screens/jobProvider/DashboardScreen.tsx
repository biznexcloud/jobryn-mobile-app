import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
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
  Sparkles,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
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
const GRAY_TEXT = '#65676B';

export default function ProviderDashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation: any = useNavigation();
  const { user } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [stats, setStats] = useState({ activeJobs: 0, newApplicants: 0 });

  const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feedData, storiesData, jobsData, appsData] = await Promise.all([
        SocialService.getFeed().catch(() => ({ results: [] })),
        SocialService.getStories().catch(() => ({ results: [] })),
        JobService.getRecruiterJobs().catch(() => ({ results: [] })),
        JobService.getRecruiterApplications().catch(() => ({ results: [] })),
      ]);

      setFeed(Array.isArray(feedData) ? feedData : (feedData as any)?.results || []);
      setStories(Array.isArray(storiesData) ? storiesData : (storiesData as any)?.results || []);
      
      const activeJobsCount = (jobsData as any)?.results?.filter((j: any) => j.status === 'active').length || 0;
      const totalJobs = (jobsData as any)?.results?.length || 0;
      setStats({
        activeJobs: activeJobsCount || totalJobs,
        newApplicants: (appsData as any)?.results?.length || 0,
      });
    } catch (e: any) {
      console.error('[ProviderDashboard] Global sync failed:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  // Removed redundant local FAB scroll animations

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* FB-Style Header: Logo Left, Icons Right */}
      <Box px={16} pt={insets.top + 4} pb={12} bg="white">
        <HStack items="center" justify="space-between">
          <Text fontSize={28} fontWeight="900" color={FB_BLUE} letterSpacing={-2}>jobryn</Text>
          <HStack space="xs">
            <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('PostJob')}>
              <Plus size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('SearchExplore')}>
              <Search size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Messages')}>
              <MessageSquare size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Notifications')}>
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
        scrollEventThrottle={16}
      >
        {/* Hiring Insights Section */}
        <Box bg="white" px={16} py={20} borderBottom={1} borderColor="#E5E7EB">
          <HStack justify="space-between" items="center" mb={16}>
             <VStack>
                <Text fontSize={18} fontWeight="800" color="#111827">Hiring Overview</Text>
                <Text fontSize={13} color={GRAY_TEXT} mt={2}>Real-time performance metrics</Text>
             </VStack>
             <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
                <HStack items="center" bg={FB_GRAY} px={10} py={6} rounded={15}>
                   <Sparkles size={14} color={FB_BLUE} />
                   <Text fontSize={12} fontWeight="700" color={FB_BLUE} ml={6}>Details</Text>
                </HStack>
             </TouchableOpacity>
          </HStack>

          <HStack space="md">
             <TouchableOpacity 
               style={[styles.insightCard, { backgroundColor: '#EBF5FF' }]}
               onPress={() => navigation.navigate('ProviderRoot', { screen: 'Managed' })}
             >
                <Text fontSize={22} fontWeight="800" color={FB_BLUE}>{stats.activeJobs}</Text>
                <Text fontSize={12} fontWeight="700" color="#1E40AF" mt={4}>Active Postings</Text>
             </TouchableOpacity>
             
             <TouchableOpacity 
               style={[styles.insightCard, { backgroundColor: '#F0FDF4' }]}
               onPress={() => navigation.navigate('ProviderRoot', { screen: 'Pipeline' })}
             >
                <Text fontSize={22} fontWeight="800" color="#16A34A">{stats.newApplicants}</Text>
                <Text fontSize={12} fontWeight="700" color="#166534" mt={4}>New Candidates</Text>
             </TouchableOpacity>
          </HStack>

          <HStack mt={16} justify="space-around" pt={16} borderTop={1} borderColor="#F3F4F6">
             <TouchableOpacity style={styles.dashboardAction} onPress={() => navigation.navigate('PostJob')}>
                <Plus size={18} color={FB_BLUE} />
                <Text fontSize={13} fontWeight="600" color={GRAY_TEXT} ml={6}>Post a Job</Text>
             </TouchableOpacity>
             <Box w={1} h={16} bg="#E5E7EB" />
             <TouchableOpacity style={styles.dashboardAction} onPress={() => navigation.navigate('TalentSearch')}>
                <Search size={18} color="#16A34A" />
                <Text fontSize={13} fontWeight="600" color={GRAY_TEXT} ml={6}>Find Talent</Text>
             </TouchableOpacity>
          </HStack>
        </Box>

        {/* Story Section (FB-Style Rectangular Cards) */}
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
              <TouchableOpacity
                key={story.id || i}
                style={styles.storyCard}
                onPress={() => navigation.navigate('StoryViewer', { stories, initialIndex: i })}
              >
                <Image source={{ uri: story.image || story.images }} style={styles.storyImgFull} />
                <View style={styles.storyAvatarOverlay}>
                  <Avatar
                    source={{ uri: story.user?.avatar || story.user_avatar || `https://i.pravatar.cc/150?u=${story.id}` }}
                    size={32}
                    style={{ borderWidth: 2, borderColor: FB_BLUE }}
                  />
                </View>
                <View style={styles.storyNameOverlay}>
                  <Text fontSize={11} fontWeight="700" color="white" numberOfLines={2}>
                    {story.user?.name || story.user_name || story.author_email || 'User'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Box>

        {/* Feed Section */}
        {feed.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLikersPress={() => navigation.navigate('LikersList', { postId: post.id })}
            onComment={() => navigation.navigate('PostDetail', { post })}
          />
        ))}
        {loading && <ActivityIndicator color={FB_BLUE} style={{ marginVertical: 20 }} />}
      </AnimatedScrollView>


      {/* Global Sidebar Overlay — Job Provider menus */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
        role="jobProvider"
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
  insightCard: { flex: 1, padding: 16, borderRadius: 16, elevation: 0 },
  dashboardAction: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
});
