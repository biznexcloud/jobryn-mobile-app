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
} from 'lucide-react-native';
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

export default function ProviderDashboardScreen() {
   const insets = useSafeAreaInsets();
   const navigation: any = useNavigation();
   const { user } = useAuthStore();
   const { isSidebarOpen, setSidebarOpen } = useUIStore();
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
   const [jobs, setJobs] = useState<any[]>([]);
   const [feed, setFeed] = useState<any[]>([]);
   const [stories, setStories] = useState<any[]>([]);

   const fetchData = async () => {
      try {
         const [jobsData, feedData, storiesData] = await Promise.all([
            JobService.getRecruiterJobs(),
            SocialService.getFeed(),
            SocialService.getStories(),
         ]);
         setJobs(jobsData?.results || []);
         setFeed(feedData?.results || []);
         setStories(storiesData || []);
      } catch (e) {
         console.warn('Sync failed');
      } finally {
         setLoading(false);
         setRefreshing(false);
      }
   };

   useEffect(() => { fetchData(); }, []);
   const onRefresh = () => { setRefreshing(true); fetchData(); };

   return (
      <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
         <StatusBar barStyle="dark-content" />

         {/* FB Header: Logo Left, Icons Right */}
         <Box px={16} pt={insets.top + 4} pb={12} bg="white">
            <HStack items="center" justify="space-between">
               <Text fontSize={28} fontWeight="900" color={FB_BLUE} letterSpacing={-2}>jobryn</Text>
               <HStack space="sm">
                  <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('SearchExplore')}>
                     <Search size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('PostJob')}>
                     <Plus size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerIcon} onPress={() => setSidebarOpen(true)}>
                     <Menu size={20} color="black" />
                  </TouchableOpacity>
               </HStack>
            </HStack>
         </Box>

         <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={FB_BLUE} />}
         >
            {/* Creation Section (Top) */}
            <Box bg="white" p={12} borderBottom={1} borderColor="#E5E7EB">
               <HStack items="center" space="sm">
                  <TouchableOpacity onPress={() => navigation.navigate('ProviderProfile')}>
                     <Avatar source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150' }} size="md" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                     style={styles.postInput}
                     onPress={() => navigation.navigate('PostJob')}
                  >
                     <Text color="#65676B" fontSize={15}>Post a new job or update your team...</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('PostJob')}>
                     <PlusCircle size={28} color={FB_BLUE} />
                  </TouchableOpacity>
               </HStack>
               <Divider color="#F0F2F5" mt={12} mb={12} />
               <HStack justify="space-around">
                  <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('PostJob')}>
                     <Plus size={18} color="#F3425F" />
                     <Text fontSize={13} fontWeight="600" color="#65676B" ml={6}>Post Job</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('TalentSearch')}>
                     <Users size={18} color="#45BD62" />
                     <Text fontSize={13} fontWeight="600" color="#65676B" ml={6}>Find Talent</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Analytics')}>
                     <BarChart size={18} color="#F7B928" />
                     <Text fontSize={13} fontWeight="600" color="#65676B" ml={6}>Analytics</Text>
                  </TouchableOpacity>
               </HStack>
            </Box>

            {/* Story Section (FB Style Rectangular Cards) */}
            <Box bg="white" py={12} my={8} borderBottom={1} borderColor="#E5E7EB">
               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                  {/* Create Story Option */}
                  <TouchableOpacity 
                     style={styles.storyCard} 
                     onPress={() => navigation.navigate('CreateStory')}
                  >
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
                     <TouchableOpacity key={i} style={styles.storyCard} onPress={() => navigation.navigate('StoryViewer', { story })}>
                        <Image source={{ uri: story.content_preview || story.user_avatar }} style={styles.storyImgFull} />
                        <View style={styles.storyAvatarOverlay}>
                           <Avatar source={{ uri: story.user_avatar }} size={32} style={{ borderWidth: 2, borderColor: FB_BLUE }} />
                        </View>
                        <View style={styles.storyNameOverlay}>
                           <Text fontSize={11} fontWeight="700" color="white" numberOfLines={2}>{story.user_name}</Text>
                        </View>
                     </TouchableOpacity>
                  ))}
               </ScrollView>
            </Box>

            {/* Active Missions */}
            <Box bg="white" mb={8} p={16}>
               <HStack justify="space-between" items="center" mb={16}>
                  <Text fontSize={16} fontWeight="900" color="#111827">Operation Board</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('JobPostings')}>
                     <Text fontSize={14} fontWeight="700" color={FB_BLUE}>See All</Text>
                  </TouchableOpacity>
               </HStack>
               <VStack space="md">
                  {jobs.slice(0, 2).map((job, idx) => (
                     <TouchableOpacity key={idx} onPress={() => navigation.navigate('ApplicantDetail', { id: job.id })}>
                        <HStack items="center" p={12} bg="#F9FAFB" rounded={12}>
                           <Box bg="white" p={8} rounded={8} shadow={1}><Briefcase size={22} color={FB_BLUE} /></Box>
                           <VStack ml={12} flex={1}>
                              <Text fontSize={14} fontWeight="700" color="#111827" numberOfLines={1}>{job.title}</Text>
                              <Text fontSize={11} color="#666666">{job.applicants_count || 0} Operatives Applied</Text>
                           </VStack>
                        </HStack>
                     </TouchableOpacity>
                  ))}
               </VStack>
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
                           name: post.user?.name || 'Recruiter',
                           avatar: post.user?.avatar || `https://i.pravatar.cc/150?u=${post.id}`,
                           headline: post.user?.role || 'Hiring Manager'
                        }
                     }}
                     onComment={() => navigation.navigate('PostDetail', {
                        post: {
                           ...post,
                           user: {
                              name: post.user?.name || 'Recruiter',
                              avatar: post.user?.avatar || `https://i.pravatar.cc/150?u=${post.id}`,
                              role: post.user?.role || 'Hiring Manager'
                           }
                        }
                     })}
                  />
               ))
            )}
         </ScrollView>

         {/* Global Sidebar Overlay */}
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
});
