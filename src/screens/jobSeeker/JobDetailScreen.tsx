import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Share,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Bookmark,
  Share2,
  BadgeCheck,
  Building2,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const BLUE = '#0A66C2'; 
const GRAY_BG = '#F3F2EF';

export default function JobDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { id } = route.params || {};
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await JobService.getJobById(id);
        setJob(data || { id: 1, title: 'Senior Protocol Engineer', company_name: 'Nexus Corp', location: 'Remote', salary_min: 120000, salary_max: 150000, description: 'Directly contribute to the optimization of the global Nexus Grid protocol. We are looking for mission-driven engineers with expert knowledge in decentralized systems and high-throughput communication infrastructure.' });
      } catch (e) {
        setJob({ id: 1, title: 'Senior Protocol Engineer', company_name: 'Nexus Corp', location: 'Remote', salary_min: 120000, salary_max: 150000, description: 'Directly contribute to the optimization of the global Nexus Grid protocol.' });
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const onShare = async () => {
    try {
      await Share.share({ message: `Check out this mission: ${job.title} at ${job.company_name}` });
    } catch (e) {}
  };

  if (loading) return (
     <ScreenWrapper backgroundColor="white" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={BLUE} />
     </ScreenWrapper>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
         <HStack justify="space-between" items="center">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
               <ChevronLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <HStack space="md">
               <TouchableOpacity onPress={() => setIsSaved(!isSaved)}>
                  <Bookmark size={24} color={isSaved ? BLUE : "#666666"} fill={isSaved ? BLUE : "transparent"} />
               </TouchableOpacity>
               <TouchableOpacity onPress={onShare}>
                  <Share2 size={24} color="#666666" />
               </TouchableOpacity>
            </HStack>
         </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
         {/* Job Title Section */}
         <Box p={16}>
            <Text fontSize={22} fontWeight="900" color="#000000">{job.title}</Text>
            <HStack items="center" mt={8}>
               <Text fontSize={16} fontWeight="700" color="#000000">{job.company_name}</Text>
               <Box bg="#EDF3F8" px={8} py={4} rounded={4} ml={12}>
                  <Text fontSize={11} fontWeight="700" color={BLUE}>FOLLOWING</Text>
               </Box>
            </HStack>
            <VStack mt={12} space="sm">
               <HStack items="center">
                  <MapPin size={18} color="#666666" />
                  <Text fontSize={14} color="#666666" ml={10}>{job.location} • Applied 1 week ago</Text>
               </HStack>
               <HStack items="center">
                  <Briefcase size={18} color="#666666" />
                  <Text fontSize={14} color="#666666" ml={10}>Full-time • Mid-Senior level</Text>
               </HStack>
               <HStack items="center">
                  <BadgeCheck size={18} color="#057642" />
                  <Text fontSize={14} color="#057642" ml={10} fontWeight="700">92% Match • Your skills align perfectly</Text>
               </HStack>
            </VStack>
         </Box>

         <Divider color="#F1F5F9" />

         {/* Job Description */}
         <Box p={16}>
            <Text fontSize={18} fontWeight="700" color="#000000" mb={12}>About the mission</Text>
            <Text fontSize={15} color="#000000" lineHeight={24}>
               {job.description}
            </Text>
            <TouchableOpacity style={{ marginTop: 20 }}>
               <Text fontSize={14} fontWeight="700" color={BLUE}>Show more</Text>
            </TouchableOpacity>
         </Box>

         <Divider color="#F1F5F9" />

         {/* Company Section */}
         <Box p={16}>
            <HStack justify="space-between" items="center" mb={16}>
               <Text fontSize={18} fontWeight="700" color="#000000">About the company</Text>
            </HStack>
            <HStack items="center">
               <Box bg="#F3F2EF" p={12} rounded={8}><Building2 size={32} color="#666666" /></Box>
               <VStack ml={12} flex={1}>
                  <Text fontSize={16} fontWeight="700" color="#000000">{job.company_name}</Text>
                  <Text fontSize={13} color="#666666">Information Services • 10,240 employees</Text>
               </VStack>
               <ChevronRight size={20} color="#999999" />
            </HStack>
         </Box>
      </ScrollView>

      {/* Modern Footer Action */}
      <Box p={16} bg="white" borderTop={1} borderColor="#E5E7EB" pb={insets.bottom + 16}>
         <Button 
            label="Apply to this Mission" 
            onPress={() => navigation.navigate('ApplyForm', { job })} 
            style={{ backgroundColor: BLUE, height: 50, borderRadius: 25 }}
         />
      </Box>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
