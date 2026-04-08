import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  PlayCircle,
  Bookmark,
  ChevronRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import { LearningService } from '../../services/api/learning';

const { width } = Dimensions.get('window');

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

export default function SeekerLearningScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Explore');
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [coursesData, enrollsData] = await Promise.all([
        LearningService.getCourses(),
        LearningService.getEnrollments()
      ]);
      setCourses(coursesData.results || coursesData);
      setEnrollments(enrollsData.results || enrollsData);
    } catch (e) {
       console.warn('Learning fetch failed:', e);
    } finally {
       setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const CourseCard = ({ id, title, level, duration_hours, thumbnail, isEnrolled }: any) => (
    <TouchableOpacity 
      style={styles.courseCard} 
      onPress={() => navigation.navigate('CourseDetail', { courseId: id, isEnrolled })}
    >
       <Image 
         source={{ uri: thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2940' }} 
         style={styles.courseImg} 
       />
       <VStack p={12}>
          <Text fontSize={12} fontWeight="700" color={BLUE}>{level?.toUpperCase() || 'BEGINNER'}</Text>
          <Text fontSize={15} fontWeight="700" color="#111827" mt={4} numberOfLines={2}>{title}</Text>
          <HStack mt={8} items="center" justify="space-between">
             <Text fontSize={12} color="#666666">{duration_hours}h total</Text>
             <PlayCircle size={20} color={BLUE} />
          </HStack>
       </VStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
         <HStack items="center" justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                  <ChevronLeft size={24} color="#1F2937" strokeWidth={2.5} />
               </TouchableOpacity>
               <Text fontSize={20} color="#1F2937" fontWeight="700" ml={16}>Learning</Text>
            </HStack>
            <TouchableOpacity><Search size={24} color="#666666" /></TouchableOpacity>
         </HStack>
      </Box>

       {/* Tabs */}
       <HStack px={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
          {['Explore', 'My Learning'].map(tab => (
             <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
             >
                <Text fontSize={14} fontWeight="700" color={activeTab === tab ? BLUE : '#666666'}>{tab}</Text>
             </TouchableOpacity>
          ))}
       </HStack>

       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {activeTab === 'Explore' ? (
             <>
                {/* Hero Promo */}
                <Box bg={BLUE} p={24} m={16} rounded={16}>
                   <HStack items="center" justify="space-between">
                      <VStack flex={1}>
                         <Text fontSize={18} fontWeight="900" color="white">Upgrade Your Tech Stack</Text>
                         <Text fontSize={14} color="white" mt={4} opacity={0.8}>Recommended Missions</Text>
                         <Button label="Explore Courses" onPress={() => {}} style={{ backgroundColor: 'white', marginTop: 16, height: 40 }} textStyle={{ color: BLUE, fontSize: 13, fontWeight: '800' }} />
                      </VStack>
                      <GraduationCap size={64} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', right: -20, bottom: -20 }} />
                   </HStack>
                </Box>

                <Box px={16} mt={8}>
                   <Text fontSize={18} fontWeight="700" color="#111827" mb={16}>Popular Missions</Text>
                   {loading ? (
                      <ActivityIndicator color={BLUE} />
                   ) : (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                         {courses.map(course => (
                            <CourseCard 
                               key={course.id}
                               id={course.id}
                               title={course.title}
                               level={course.level}
                               duration_hours={course.duration_hours}
                               thumbnail={course.thumbnail}
                               isEnrolled={enrollments.some(e => e.course === course.id)}
                            />
                         ))}
                      </ScrollView>
                   )}
                </Box>
             </>
          ) : (
             <Box px={16} mt={24}>
                <Text fontSize={18} fontWeight="700" color="#111827" mb={16}>In-progress Sync</Text>
                {loading ? (
                   <ActivityIndicator color={BLUE} />
                ) : enrollments.length === 0 ? (
                   <VStack items="center" py={40}>
                      <Text color="#666666">No active enrollments found.</Text>
                   </VStack>
                ) : (
                   <VStack space="md">
                      {enrollments.map(enroll => {
                         const course = courses.find(c => c.id === enroll.course);
                         return (
                            <TouchableOpacity 
                               key={enroll.id} 
                               onPress={() => navigation.navigate('Lesson', { courseId: enroll.course })}
                            >
                               <Box bg="#F9FAFB" p={16} rounded={12} border={1} borderColor="#E5E7EB">
                                  <HStack items="center">
                                     <Box bg={BLUE} p={8} rounded={8}><PlayCircle size={24} color="white" /></Box>
                                     <VStack ml={12} flex={1}>
                                        <Text fontSize={15} fontWeight="700" color="#111827">{course?.title || 'Unknown Course'}</Text>
                                        <Box h={4} w="100%" bg="#E5E7EB" rounded={2} mt={8}>
                                           <Box h={4} w={`${enroll.progress || 0}%`} bg={BLUE} rounded={2} />
                                        </Box>
                                        <Text fontSize={11} color="#666666" mt={4}>{enroll.progress || 0}% Complete</Text>
                                     </VStack>
                                     <ChevronRight size={20} color="#999999" />
                                  </HStack>
                               </Box>
                            </TouchableOpacity>
                         );
                      })}
                   </VStack>
                )}
             </Box>
          )}
       </ScrollView>
    </ScreenWrapper>
  );
}

const StyleSheetCreate = StyleSheet.create;
const styles = StyleSheetCreate({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  courseCard: { width: 220, backgroundColor: 'white', borderRadius: 12, marginRight: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  courseImg: { width: '100%', height: 110, backgroundColor: '#CCD3D9' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderColor: 'transparent' },
  activeTab: { borderColor: BLUE },
});
