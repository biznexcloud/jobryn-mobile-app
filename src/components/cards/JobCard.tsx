import React from 'react';
import { TouchableOpacity, StyleSheet, Image, View } from 'react-native';
import { moderateScale } from '../../utils/responsive';
import { timeAgo } from '../../utils';
import { Job } from '../../types';
import { Box, VStack, HStack, Text, Divider } from '../ui';
import {
  BriefcaseIcon,
  LocationMarkerIcon as LocationIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
  SparklesIcon,
} from 'react-native-heroicons/outline';

const BLUE = '#1D6FE8'; 
const GREEN = '#10B981';

interface JobCardProps {
  job: Job;
  onApply?: () => void;
  onSave?: () => void;
  onPress?: () => void;
  applied?: boolean;
}

export const JobCard = ({ job, onPress, applied = false }: JobCardProps) => {
  const salaryDisplay = job.salary_min && job.salary_max 
    ? `$${job.salary_min} - $${job.salary_max}`
    : job.salary_min ? `$${job.salary_min}+` : 'Salary Not Disclosed';

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress}
      style={[styles.card, styles.premiumShadow]}
    >
      <Box p={20}>
        <HStack items="center" mb={16}>
           <Box w={52} h={52} rounded={16} bg="#F8FAFC" items="center" justify="center" border={1} borderColor="#F1F5F9">
              {job.company_name ? (
                <Text fontSize={20} fontWeight="900" color={BLUE}>{job.company_name[0]}</Text>
              ) : (
                <BriefcaseIcon size={24} color={BLUE} />
              )}
           </Box>
           <VStack flex={1} ml={16}>
              <HStack justify="space-between" items="center">
                 <Text fontSize={16} fontWeight="900" color="#0F172A" numberOfLines={1} flex={1}>{job.title}</Text>
                 <Box px={10} py={4} rounded={8} bg={applied ? '#ECFDF5' : '#EBF3FF'}>
                    <Text fontSize={10} fontWeight="900" color={applied ? GREEN : BLUE}>
                       {applied ? 'APPLIED' : 'ACTIVE'}
                    </Text>
                 </Box>
              </HStack>
              <Text fontSize={13} fontWeight="700" color="#64748B" mt={2}>{job.company_name}</Text>
           </VStack>
        </HStack>

        <HStack space="md" mb={16} flexWrap="wrap">
           <HStack items="center" bg="#F1F5F9" px={10} py={6} rounded={10}>
              <LocationIcon size={14} color="#64748B" />
              <Text fontSize={11} fontWeight="800" color="#475569" ml={6}>{job.location}</Text>
           </HStack>
           <HStack items="center" bg="#F1F5F9" px={10} py={6} rounded={10}>
              <CurrencyDollarIcon size={14} color="#64748B" />
              <Text fontSize={11} fontWeight="800" color="#475569" ml={6}>{salaryDisplay}</Text>
           </HStack>
        </HStack>

        <HStack justify="space-between" items="center">
           <Text fontSize={11} fontWeight="700" color="#94A3B8">Posted {timeAgo(job.created_at)}</Text>
           <HStack items="center">
              <Text fontSize={13} fontWeight="900" color={BLUE} mr={6}>View Details</Text>
              <Box w={24} h={24} rounded={12} bg="#EBF3FF" items="center" justify="center">
                 <ChevronRightIcon size={14} color={BLUE} strokeWidth={3} />
              </Box>
           </HStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white', borderRadius: 24, marginBottom: 16,
    borderWidth: 1.5, borderColor: '#F8FAFC',
  },
  premiumShadow: {
    shadowColor: '#0A1628', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 4
  },
});

export default JobCard;





