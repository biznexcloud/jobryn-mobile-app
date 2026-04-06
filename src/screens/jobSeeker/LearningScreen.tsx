import React, { useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Image,
  Dimensions,
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

const { width } = Dimensions.get('window');

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

export default function SeekerLearningScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Explore');

  const CourseCard = ({ title, category, duration, image }: any) => (
    <TouchableOpacity style={styles.courseCard}>
       <Image source={{ uri: image }} style={styles.courseImg} />
       <VStack p={12}>
          <Text fontSize={12} fontWeight="700" color={BLUE}>{category.toUpperCase()}</Text>
          <Text fontSize={15} fontWeight="700" color="#111827" mt={4} numberOfLines={2}>{title}</Text>
          <HStack mt={8} items="center" justify="space-between">
             <Text fontSize={12} color="#666666">{duration}</Text>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
         {/* Hero Promo */}
         <Box bg={BLUE} p={24} m={16} rounded={16}>
            <HStack items="center" justify="space-between">
               <VStack flex={1}>
                  <Text fontSize={18} fontWeight="900" color="white">Master Python for Data Science</Text>
                  <Text fontSize={14} color="white" mt={4} opacity={0.8}>Recommended for your role</Text>
                  <Button label="Start Academy" onPress={() => {}} style={{ backgroundColor: 'white', marginTop: 16, height: 40 }} textStyle={{ color: BLUE, fontSize: 13, fontWeight: '800' }} />
               </VStack>
               <GraduationCap size={64} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', right: -20, bottom: -20 }} />
            </HStack>
         </Box>

         <Box px={16} mt={8}>
            <Text fontSize={18} fontWeight="700" color="#111827" mb={16}>Popular missions in Technology</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
               <CourseCard 
                  title="Advanced React Testing: Nexus Flow" 
                  category="Architecture" 
                  duration="2h 15m" 
                  image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2940&auto=format&fit=crop" 
               />
               <CourseCard 
                  title="UI Design Fundamentals for JobSeekers" 
                  category="Design" 
                  duration="4h 30m" 
                  image="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2864&auto=format&fit=crop" 
               />
            </ScrollView>
         </Box>

         <Box px={16} mt={24}>
            <Text fontSize={18} fontWeight="700" color="#111827" mb={16}>In-progress intellect sync</Text>
            <Box bg="#F9FAFB" p={16} rounded={12} border={1} borderColor="#E5E7EB">
               <HStack items="center">
                  <Box bg={BLUE} p={8} rounded={8}><PlayCircle size={24} color="white" /></Box>
                  <VStack ml={12} flex={1}>
                     <Text fontSize={15} fontWeight="700" color="#111827">Nexus Core Protocols v4</Text>
                     <Text fontSize={12} color="#666666" mt={2}>42% Complete • 12m left</Text>
                  </VStack>
                  <ChevronRight size={20} color="#999999" />
               </HStack>
            </Box>
         </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  courseCard: { width: 220, backgroundColor: 'white', borderRadius: 12, marginRight: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  courseImg: { width: '100%', height: 110, backgroundColor: '#CCD3D9' },
});
