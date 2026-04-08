import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  MoreVertical,
  Flag,
  RotateCcw,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import { LearningService } from '../../services/api/learning';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const BLUE = '#0A66C2'; 
const DARK_TEXT = '#1F2937';
const GRAY_TEXT = '#666666';

export default function LessonScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { courseId } = route.params || {};
  
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeEpisode, setActiveEpisode] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      const [courseData, enrollmentsData] = await Promise.all([
        LearningService.getCourseById(courseId),
        LearningService.getEnrollments()
      ]);
      setCourse(courseData);
      
      const enrolls = enrollmentsData.results || enrollmentsData;
      const myEnroll = enrolls.find((e: any) => e.course === courseId);
      setEnrollment(myEnroll);
    } catch (e) {
      console.warn('Lesson load failed:', e);
      Toast.show({ type: 'error', text1: 'Session failed to load' });
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!enrollment) return;
    setUpdating(true);
    try {
      const newProgress = Math.min(100, (enrollment.progress || 0) + 10);
      const isFinished = newProgress === 100;
      
      await LearningService.updateProgress(enrollment.id, {
         progress_percentage: newProgress,
         completed: isFinished
      });
      
      setEnrollment({ ...enrollment, progress: newProgress, completed: isFinished });
      Toast.show({ type: 'success', text1: 'Progress saved!' });
      
      if (activeEpisode < 5) setActiveEpisode(v => v + 1);
    } catch (e) {
       Toast.show({ type: 'error', text1: 'Failed to update progress' });
    } finally {
       setUpdating(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper justify="center" items="center" backgroundColor="white">
        <ActivityIndicator size="large" color={BLUE} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="light-content" />

      {/* Video Player Placeholder Area */}
      <Box style={[styles.playerArea, { paddingTop: insets.top }]}>
         <HStack px={20} items="center" justify="space-between">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
               <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
               <MoreVertical size={24} color="white" />
            </TouchableOpacity>
         </HStack>
         
         <Box flex={1} justify="center" items="center">
            <TouchableOpacity style={styles.mainPlayBtn}>
               <Play size={32} color={BLUE} fill={BLUE} />
            </TouchableOpacity>
            <Text color="rgba(255,255,255,0.6)" fontSize={12} mt={16}>Episode {activeEpisode + 1}: Core Protocols</Text>
         </Box>

         <Box px={20} pb={16}>
            <HStack items="center" justify="space-between" mb={8}>
               <Text color="white" fontSize={12} fontWeight="700">Course Progress</Text>
               <Text color="white" fontSize={12} fontWeight="700">{enrollment?.progress || 0}%</Text>
            </HStack>
            <Box h={4} w="100%" bg="rgba(255,255,255,0.2)" rounded={2}>
               <Box h={4} w={`${enrollment?.progress || 0}%`} bg="#10B981" rounded={2} />
            </Box>
         </Box>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
         <VStack p={20}>
            <Text fontSize={20} fontWeight="900" color={DARK_TEXT}>
               {course?.title || 'Learning Module'}
            </Text>
            <Text fontSize={14} color={GRAY_TEXT} mt={8} lineHeight={20}>
               Current Lesson: Deep dive into the architecture and state management of modern Jobryn modules.
            </Text>

            <HStack mt={24} space="lg">
               <TouchableOpacity style={styles.actionItem}>
                  <RotateCcw size={20} color={GRAY_TEXT} />
                  <Text fontSize={12} color={GRAY_TEXT} mt={4}>Notes</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.actionItem}>
                  <Flag size={20} color={GRAY_TEXT} />
                  <Text fontSize={12} color={GRAY_TEXT} mt={4}>Report</Text>
               </TouchableOpacity>
            </HStack>

            <Divider color="#F3F4F6" style={{ marginVertical: 24 }} />

            <Text fontSize={18} fontWeight="800" color={DARK_TEXT} mb={16}>Course Content</Text>
            
            <VStack space="sm">
               {[0, 1, 2, 3, 4, 5].map((i) => {
                  const isActive = activeEpisode === i;
                  return (
                     <TouchableOpacity 
                        key={i} 
                        style={[styles.lessonRow, isActive && styles.activeLessonRow]}
                        onPress={() => setActiveEpisode(i)}
                     >
                        <HStack space="md" items="center">
                           <Box 
                              w={32} 
                              h={32} 
                              rounded={16} 
                              bg={isActive ? BLUE : '#F3F4F6'} 
                              items="center" 
                              justify="center"
                           >
                              {isActive ? <Play size={14} color="white" fill="white" /> : <Text fontSize={13} fontWeight="700">{i+1}</Text>}
                           </Box>
                           <VStack flex={1}>
                              <Text fontSize={14} fontWeight="700" color={isActive ? BLUE : DARK_TEXT}>Module 0{i+1}: Advanced Concepts</Text>
                              <Text fontSize={12} color={GRAY_TEXT} mt={2}>12:45 • Video</Text>
                           </VStack>
                           {i < (enrollment?.progress / 15) && <CheckCircle2 size={18} color="#059669" />}
                        </HStack>
                     </TouchableOpacity>
                  );
               })}
            </VStack>
         </VStack>
      </ScrollView>

      {/* Complete Step Button */}
      <Box px={20} pb={insets.bottom + 16} pt={16}>
         <Button 
            label={updating ? "Updating..." : "Mark Lesson as Complete"} 
            onPress={handleComplete} 
            loading={updating}
            disabled={updating}
            variant="outline"
            style={{ height: 56, borderRadius: 12, borderColor: BLUE }}
            textStyle={{ color: BLUE, fontWeight: '900' }}
         />
      </Box>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  playerArea: { height: width * 0.65, backgroundColor: '#000', justifyContent: 'space-between' },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  mainPlayBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  actionItem: { alignItems: 'center', width: 60 },
  lessonRow: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  activeLessonRow: { borderColor: BLUE, backgroundColor: '#EFF6FF' },
});
