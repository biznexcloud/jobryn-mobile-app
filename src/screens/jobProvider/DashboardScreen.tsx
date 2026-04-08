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
   PlusCircle,
   Users,
   BarChart,
   Briefcase,
   Sparkles,
   Bell,
   ChevronRight,
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
const GRAY_TEXT = '#65676B';

export default function ProviderDashboardScreen() {
   const insets = useSafeAreaInsets();
   const navigation: any = useNavigation();
   const { user, token } = useAuthStore();
   const { isSidebarOpen, setSidebarOpen } = useUIStore();
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [jobs, setJobs] = useState<any[]>([]);
   const [feed, setFeed] = useState<any[]>([]);
   const [stories, setStories] = useState<any[]>([]);
   const [applications, setApplications] = useState<any[]>([
      { name: 'Sarah Jenkins', role: 'Fullstack Developer', status: 'Reviewing', time: '2h ago', avatar: '15' },
      { name: 'Marcus Chen', role: 'UI/UX Designer', status: 'Interview', time: '5h ago', avatar: '16' },
   ]);

   const fetchData = async () => {
      try {
         const [jobsData, feedData, storiesData, appsData] = await Promise.all([
            JobService.getRecruiterJobs().catch(() => ({ results: [] })),
            SocialService.getFeed().catch(() => ({ results: [] })),
            SocialService.getStories().catch(() => ({ results: [] })),
            JobService.getRecruiterApplications().catch(() => ({ results: [] })),
         ]);
         setJobs(Array.isArray(jobsData) ? jobsData : (jobsData as any)?.results || []);
         setFeed(Array.isArray(feedData) ? feedData : (feedData as any)?.results || []);
         setStories(Array.isArray(storiesData) ? storiesData : (storiesData as any)?.results || []);
         if (appsData && (Array.isArray(appsData) ? appsData : (appsData as any)?.results)?.length > 0) {
            setApplications(Array.isArray(appsData) ? appsData : (appsData as any)?.results);
         }
      } catch (e) {
         console.warn('Sync failed:', e);
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
            fabTranslateY.value = withTiming(100);
            fabOpacity.value = withTiming(0);
         } else {
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

   const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

   return (
      <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
         <StatusBar barStyle="dark-content" />

         {/* Clean Header: Branding Left, Icons Right */}
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
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={FB_BLUE} />}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
         >
            {/* Recruitment Insights (Simplified Cards) */}
            <Box py={12} bg="white" borderBottom={1} borderColor="#E5E7EB">
               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                  <HStack space="md">
                     {[
                        { label: 'Active Jobs', value: jobs.length, icon: Briefcase, color: '#EBF5FF', iconColor: FB_BLUE },
                        { label: 'Applications', value: '24', icon: Users, color: '#E6FFFA', iconColor: '#319795' },
                        { label: 'Interviews', value: '5', icon: Bell, color: '#FFF5F5', iconColor: '#E53E3E' },
                        { label: 'Hire Rate', value: '78%', icon: BarChart, color: '#FAF5FF', iconColor: '#805AD5' },
                     ].map((item, i) => (
                        <Box key={i} bg="white" p={16} rounded={16} minWidth={130} border={1} borderColor="#F0F2F5">
                           <HStack justify="space-between" items="center">
                              <Box bg={item.color} p={8} rounded={12}>
                                 <item.icon size={18} color={item.iconColor} />
                              </Box>
                              <Text fontSize={20} fontWeight="800" color="#111827">{item.value}</Text>
                           </HStack>
                           <Text fontSize={12} fontWeight="600" color={GRAY_TEXT} mt={12}>{item.label}</Text>
                        </Box>
                     ))}
                  </HStack>
               </ScrollView>
            </Box>

            {/* Creation Shortcut (Post Job) */}
            <Box bg="white" p={12} borderBottom={1} borderColor="#E5E7EB">
               <HStack items="center" space="sm">
                  <Avatar source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150' }} size="md" />
                  <TouchableOpacity 
                     style={styles.postInput}
                     onPress={() => navigation.navigate('PostJob')}
                  >
                     <Text color="#666666" fontSize={15}>Post a new job opening...</Text>
                  </TouchableOpacity>
               </HStack>
            </Box>

            {/* Management Board (Active Jobs) */}
            <Box mt={8} pt={16} pb={8} bg="white" borderBottom={1} borderColor="#E5E7EB">
               <HStack px={16} justify="space-between" items="center" mb={12}>
                  <Text fontSize={17} fontWeight="800" color="#111827">Active Job Postings</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('JobPostings')}>
                     <Text fontSize={13} fontWeight="700" color={FB_BLUE}>Manage</Text>
                  </TouchableOpacity>
               </HStack>
               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                  <HStack space="sm">
                     {jobs.length > 0 ? jobs.map((job, idx) => (
                        <TouchableOpacity key={idx} style={styles.jobCardMini} activeOpacity={0.9} onPress={() => navigation.navigate('JobPostings')}>
                           <VStack justify="space-between" h="100%">
                              <Box>
                                 <Text fontSize={14} fontWeight="800" color="#111827" numberOfLines={2}>{job.title}</Text>
                                 <Text fontSize={12} color={GRAY_TEXT} mt={2}>{job.location || 'Remote'}</Text>
                              </Box>
                              <HStack items="center" justify="space-between">
                                 <Text fontSize={11} fontWeight="700" color={FB_BLUE}>{job.applicants_count || 0} applicants</Text>
                                 <ChevronRight size={14} color="#D1D5DB" />
                              </HStack>
                           </VStack>
                        </TouchableOpacity>
                     )) : (
                        <Box w={width - 32} p={20} rounded={16} bg="#F9FAFB" items="center">
                           <PlusCircle size={32} color="#D1D5DB" />
                           <Text mt={8} fontSize={13} color={GRAY_TEXT}>No active jobs. Start hiring today.</Text>
                        </Box>
                     )}
                  </HStack>
               </ScrollView>
            </Box>

            {/* Candidate Pipeline */}
            <Box mt={8} p={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
               <HStack justify="space-between" items="center" mb={16}>
                  <Text fontSize={17} fontWeight="800" color="#111827">Recent Applications</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Applicants')}>
                     <ChevronRight size={20} color="#D1D5DB" />
                  </TouchableOpacity>
               </HStack>
               <VStack space="md">
                  {applications.slice(0, 3).map((item, i) => (
                     <TouchableOpacity key={item.id || i} onPress={() => navigation.navigate('Applicants')}>
                        <HStack items="center" justify="space-between">
                           <HStack items="center">
                              <Avatar source={{ uri: item.seeker_avatar || item.avatar || `https://i.pravatar.cc/150?u=${i + 15}` }} size={48} />
                              <VStack ml={12}>
                                 <Text fontSize={15} fontWeight="700" color="#111827">{item.seeker_name || item.name}</Text>
                                 <Text fontSize={13} color={GRAY_TEXT}>{item.job_title || item.role} · {item.applied_at || item.time}</Text>
                              </VStack>
                           </HStack>
                           <Box bg="#F0F2F5" px={10} py={4} rounded={8}>
                              <Text fontSize={11} fontWeight="700" color="#111827" textTransform="capitalize">{item.status}</Text>
                           </Box>
                        </HStack>
                     </TouchableOpacity>
                  ))}
               </VStack>
            </Box>

            {/* Recruiter Feed */}
            <Box mt={8} pt={16} bg="white">
               <Text px={16} fontSize={17} fontWeight="800" color="#111827" mb={12}>Recruiter Network Feed</Text>
               {loading ? (
                  <ActivityIndicator color={FB_BLUE} style={{ marginTop: 20 }} />
               ) : (
                  feed.map((post) => (
                     <PostCard
                        key={post.id}
                        post={{
                           ...post,
                           likes: post.likes_count ?? post.likes,
                           comments: post.comments_count ?? post.comments,
                           postedAt: post.created_at,
                           author: {
                              name: post.user?.name || post.author_email || 'Recruiter',
                              avatar: post.user?.avatar || `https://i.pravatar.cc/150?u=${post.id}`,
                              headline: post.user?.role || 'Hiring Manager'
                           }
                        }}
                     />
                  ))
               )}
            </Box>
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
   headerIcon: { backgroundColor: '#F0F2F5', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
   postInput: { flex: 1, height: 40, backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, justifyContent: 'center', paddingHorizontal: 16, marginLeft: 12 },
   jobCardMini: { width: 160, height: 110, backgroundColor: 'white', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#F0F2F5' },
   fabContainer: { position: 'absolute', bottom: 30, right: 16, zIndex: 100 },
   fab: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0A66C2', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65 },
});
