import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text } from '../../components/ui/Text';
import { Box } from '../../components/ui/Box';
import { VStack } from '../../components/ui/VStack';
import { HStack } from '../../components/ui/HStack';
import { BookmarkIcon, BriefcaseIcon } from 'react-native-heroicons/solid';
import { LocationMarkerIcon } from 'react-native-heroicons/outline';
import { Colors } from '../../constants';
import { JobService } from '../../services/api/jobs';

const SavedItemsScreen = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await JobService.getSavedJobs();
      setSavedJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <HStack justify="space-between">
        <VStack flex={1}>
          <Text fontWeight="bold" fontSize={16}>{item.job_title}</Text>
          <HStack mt={4} items="center">
            <BriefcaseIcon size={14} color={Colors.textSecondary} />
            <Text fontSize={14} color={Colors.textSecondary} ml={4}>{item.company_name}</Text>
          </HStack>
          <HStack mt={2} items="center">
            <LocationMarkerIcon size={14} color={Colors.textSecondary} />
            <Text fontSize={14} color={Colors.textSecondary} ml={4}>{item.location}</Text>
          </HStack>
        </VStack>
        <TouchableOpacity>
          <BookmarkIcon size={24} color={Colors.primary} />
        </TouchableOpacity>
      </HStack>
    </TouchableOpacity>
  );

  return (
    <Box flex={1} bg={Colors.white} pt={10}>
      <FlatList
        data={savedJobs}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchSavedJobs} />
        }
        ListEmptyComponent={
          loading ? null : (
            <VStack flex={1} items="center" justify="center" p={40}>
              <BookmarkIcon size={60} color="#E5E7EB" />
              <Text fontWeight="bold" fontSize={18} mt={16}>No Saved Jobs</Text>
              <Text textAlign="center" color={Colors.textSecondary} mt={8}>Jobs you save will appear here for easy access later.</Text>
            </VStack>
          )
        }
      />
    </Box>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  }
};

export default SavedItemsScreen;
