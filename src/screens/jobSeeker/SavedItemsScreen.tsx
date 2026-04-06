import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Box, VStack, HStack, ScreenWrapper } from '../../components/ui';
import { Bookmark, Briefcase, ChevronLeft } from 'lucide-react-native';
import { JobService } from '../../services/api/jobs';
import { JobCard } from '../../components/cards/JobCard';
import { useNavigation } from '@react-navigation/native';
import { Job } from '../../types';

import { MOCK_SAVED_JOBS } from '../../constants/MockData';

const BLUE = '#0A66C2';
const SOFT_BG = '#F3F2EF';

const SavedItemsScreen = () => {
  const navigation = useNavigation<any>();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const response = await JobService.getSavedJobs();
      setSavedJobs(response.data?.length > 0 ? response.data : MOCK_SAVED_JOBS);
    } catch (error) {
      // Fallback for demo
      setSavedJobs(MOCK_SAVED_JOBS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={SOFT_BG}>
      <Box px={16} pt={60} pb={16} bg="white" borderBottom={1} borderColor="#E0E0E0">
         <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <ChevronLeft size={24} color="#000000" />
            </TouchableOpacity>
            <VStack ml={16}>
               <Text fontSize={22} fontWeight="800" color="#000000">Saved Jobs</Text>
               <Text fontSize={13} color="#666666" mt={2}>Easily access your favorite opportunities</Text>
            </VStack>
         </HStack>
      </Box>

      <FlatList
        data={savedJobs}
        renderItem={({ item }) => (
          <Box px={12} pt={8}>
            <JobCard 
              job={item as any} 
              onPress={() => navigation.navigate('JobDetail', { id: item.id })}
              onApply={() => navigation.navigate('ApplyForm', { job: item })}
              onSave={() => console.log('Unsaved', item.id)}
            />
          </Box>
        )}
        keyExtractor={(item: any) => item.id?.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchSavedJobs} tintColor={BLUE} />
        }
        ListEmptyComponent={
          loading ? null : (
            <VStack flex={1} items="center" justify="center" p={60} mt={40}>
              <Box bg="white" p={24} rounded={999} mb={20} border={1} borderColor="#E0E0E0">
                <Bookmark size={40} color="#CBD5E1" />
              </Box>
              <Text fontWeight="800" fontSize={18} color="#000000">No Saved Jobs</Text>
              <Text textAlign="center" color="#666666" mt={8} fontSize={14}>
                Found a mission you like? Save it here for quick access later.
              </Text>
            </VStack>
          )
        }
      />
    </ScreenWrapper>
  );
};

export default SavedItemsScreen;
