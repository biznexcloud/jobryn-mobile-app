import React, { useState, useEffect } from 'react';
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
  Clock,
  BookOpen,
  Award,
  Globe,
  PlayCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import { LearningService } from '../../services/api/learning';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const BLUE = '#0A66C2'; 
const DARK_TEXT = '#1F2937';
const GRAY_TEXT = '#666666';

export default function CourseDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { courseId, isEnrolled: initialEnrolled } = route.params || {};
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(initialEnrolled || false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollmentStatus();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const data = await LearningService.getCourseById(courseId);
      setCourse(data);
    } catch (e) {
      console.warn('Failed to fetch course detail:', e);
      Toast.show({ type: 'error', text1: 'Loading failed' });
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const enrollments = await LearningService.getEnrollments();
      const results = enrollments.results || enrollments;
      const found = results.find((e: any) => e.course === courseId);
      if (found) setIsEnrolled(true);
    } catch (e) {
      // Slient fail
    }
  };

  const handleEnroll = async () => {
    if (isEnrolled) {
      navigation.navigate('Lesson', { courseId });
      return;
    }

    setEnrolling(true);
    try {
      await LearningService.enroll(courseId);
      setIsEnrolled(true);
      Toast.show({ type: 'success', text1: 'Enrolled successfully!' });
      navigation.navigate('Lesson', { courseId });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Enrollment failed', text2: e?.response?.data?.detail });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper justify="center" items="center" backgroundColor="white">
        <ActivityIndicator size="large" color={BLUE} />
      </ScreenWrapper>
    );
  }

  if (!course) return null;

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Course Hero */}
        <Box style={styles.heroContainer}>
           <Image source={{ uri: course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2940' }} style={styles.heroImg} />
           <Box style={[styles.overlay, { paddingTop: insets.top + 10 }]}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                 <ChevronLeft size={24} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
           </Box>
           <Box style={styles.playOverlay}>
              <PlayCircle size={64} color="white" />
           </Box>
        </Box>

        <VStack p={20}>
           <Text fontSize={12} fontWeight="800" color={BLUE} textTransform="uppercase" mb={8}>{course.level || 'Intermediate'}</Text>
           <Text fontSize={24} fontWeight="900" color={DARK_TEXT} lineHeight={32}>{course.title}</Text>
           
           <HStack mt={16} space="md">
              <HStack items="center" space="xs">
                 <Clock size={16} color={GRAY_TEXT} />
                 <Text fontSize={13} color={GRAY_TEXT}>{course.duration_hours}h total</Text>
              </HStack>
              <HStack items="center" space="xs">
                 <BookOpen size={16} color={GRAY_TEXT} />
                 <Text fontSize={13} color={GRAY_TEXT}>{course.total_lectures || 12} lessons</Text>
              </HStack>
              <HStack items="center" space="xs">
                 <Globe size={16} color={GRAY_TEXT} />
                 <Text fontSize={13} color={GRAY_TEXT}>{course.language || 'English'}</Text>
              </HStack>
           </HStack>

           <Divider color="#F3F4F6" style={{ marginVertical: 24 }} />

           <Text fontSize={18} fontWeight="800" color={DARK_TEXT} mb={12}>Description</Text>
           <Text fontSize={15} color={GRAY_TEXT} lineHeight={24}>
              {course.description || 'No description provided.'}
           </Text>

           <Box mt={32}>
              <Text fontSize={18} fontWeight="800" color={DARK_TEXT} mb={16}>What you'll learn</Text>
              <VStack space="md">
                 {(Array.isArray(course.what_you_learn) ? course.what_you_learn : ['Master core protocols', 'Build scalable interfaces', 'Optimize data flows']).map((item: string, i: number) => (
                    <HStack key={i} items="flex-start" space="sm">
                       <CheckCircle2 size={18} color="#059669" style={{ marginTop: 2 }} />
                       <Text fontSize={14} color="#374151" flex={1}>{item}</Text>
                    </HStack>
                 ))}
              </VStack>
           </Box>

           <Box mt={32}>
              <HStack items="center" justify="space-between" mb={16}>
                 <Text fontSize={18} fontWeight="800" color={DARK_TEXT}>Syllabus</Text>
                 <Text fontSize={13} fontWeight="700" color={BLUE}>{course.total_lectures || 12} Items</Text>
              </HStack>
              <VStack space="sm">
                 {[1, 2, 3].map((_, i) => (
                    <Box key={i} bg="#F9FAFB" p={16} rounded={12} border={1} borderColor="#E5E7EB">
                       <HStack items="center" justify="space-between">
                          <HStack space="md" items="center">
                             <Text fontSize={14} fontWeight="800" color={BLUE}>0{i+1}</Text>
                             <Text fontSize={14} fontWeight="700" color="#374151">Introduction to the Course</Text>
                          </HStack>
                          <Lock size={16} color="#9CA3AF" />
                       </HStack>
                    </Box>
                 ))}
                 <TouchableOpacity style={{ alignItems: 'center', marginTop: 12 }}>
                    <Text fontSize={14} fontWeight="700" color={BLUE}>Show all lessons</Text>
                 </TouchableOpacity>
              </VStack>
           </Box>
        </VStack>
      </ScrollView>

      {/* Sticky Bottom Enroll Bar */}
      <Box px={20} pb={insets.bottom + 16} pt={16} bg="white" style={styles.footer}>
         <HStack items="center" justify="space-between">
            <VStack>
               <Text fontSize={14} color={GRAY_TEXT}>Full Course Access</Text>
               <Text fontSize={20} fontWeight="900" color={DARK_TEXT}>
                  {parseFloat(course.price) > 0 ? `$${course.price}` : 'Free'}
               </Text>
            </VStack>
            <Button 
               label={isEnrolled ? "Continue Learning" : "Enroll Now"} 
               onPress={handleEnroll} 
               loading={enrolling}
               style={{ width: 180, height: 52, borderRadius: 12 }} 
               textStyle={{ fontWeight: '900' }}
            />
         </HStack>
      </Box>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  heroContainer: { height: 280, width: '100%', position: 'relative' },
  heroImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  playOverlay: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -32 }, { translateY: -32 }] },
  footer: { borderTopWidth: 1, borderTopColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 15 },
});
