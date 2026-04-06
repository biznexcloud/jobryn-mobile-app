import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text,
  Avatar,
} from '../ui';
import { 
  MapPin, 
  Bookmark, 
  CircleDollarSign, 
  Clock,
  Briefcase,
} from 'lucide-react-native';
import { Job } from '../../types';
import { timeAgo } from '../../utils';

const BLUE = '#3B82F6'; // Modern Vibrant Blue
const GRAY_TEXT = '#6B7280';
const DARK_TEXT = '#111827';
const BG_SECONDARY = '#F9FAFB';

interface JobCardProps {
  job: Job;
  onApply?: () => void;
  onSave?: () => void;
  onPress?: () => void;
  applied?: boolean;
}

export const JobCard = ({ job, onApply, onSave, onPress, applied = false }: JobCardProps) => {
  const [saved, setSaved] = useState(false);

  const salaryDisplay = job.salary_min && job.salary_max 
    ? `$${job.salary_min} – $${job.salary_max}`
    : job.salary_min ? `From $${job.salary_min}` : null;

  const jobTypeLabel = job.job_type
    ? job.job_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : null;

  const handleSave = () => {
    setSaved(s => !s);
    onSave?.();
  };

  // Fallback featured image if none exists
  const featuredImage = job.featured_image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      {/* ── Featured Image & Location Overlay ── */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: featuredImage }}
          style={styles.featuredImage}
        />
        <Box style={styles.locationBadge}>
          <HStack items="center" space="xs">
            <MapPin size={12} color="white" fill="white" />
            <Text fontSize={12} fontWeight="700" color="white">{job.location}</Text>
          </HStack>
        </Box>
        
        {/* Bookmark Button Overlay */}
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.bookmarkBtn, saved && styles.bookmarkBtnActive]}
        >
          <Bookmark
            size={18}
            color={saved ? 'white' : DARK_TEXT}
            fill={saved ? 'white' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* ── Content ── */}
      <VStack mt={16} px={4}>
        {/* Header: Title & Time */}
        <HStack items="flex-start" justify="space-between" mb={6}>
          <Text 
            fontSize={18} 
            fontWeight="800" 
            color={DARK_TEXT} 
            flex={1}
            numberOfLines={1}
          >
            {job.title}
          </Text>
          <Text fontSize={13} color={GRAY_TEXT} ml={8}>
            {timeAgo(job.created_at)}
          </Text>
        </HStack>

        {/* Subtitle: Salary & Type */}
        <HStack items="center" space="xs" mb={10}>
          {salaryDisplay && (
            <Text fontSize={14} fontWeight="600" color={DARK_TEXT}>
              {salaryDisplay}
            </Text>
          )}
          {salaryDisplay && jobTypeLabel && (
            <Text fontSize={14} color={GRAY_TEXT}>•</Text>
          )}
          {jobTypeLabel && (
            <Text fontSize={14} color={GRAY_TEXT}>
              {jobTypeLabel}
            </Text>
          )}
        </HStack>

        {/* Description Excerpt */}
        <Text 
          fontSize={14} 
          color={GRAY_TEXT} 
          numberOfLines={2} 
          lineHeight={20}
          mb={16}
        >
          {job.description}
        </Text>

        {/* Tags Row */}
        <HStack space="xs" flexWrap="wrap">
          <View style={[styles.pillBadge, { backgroundColor: '#DBEAFE' }]}>
            <Text fontSize={12} fontWeight="700" color={BLUE}>New</Text>
          </View>
          <View style={styles.pillBadge}>
            <Text fontSize={12} fontWeight="700" color={DARK_TEXT}>Remote</Text>
          </View>
          <View style={styles.pillBadge}>
            <Text fontSize={12} fontWeight="700" color={DARK_TEXT}>Top Rated</Text>
          </View>
        </HStack>
        
        {/* Company Info Row */}
        <HStack items="center" space="sm" mt={16} pt={12} style={styles.borderTop}>
           <Avatar source={{ uri: job.company_logo }} size="xs" rounded={6} />
           <VStack flex={1}>
              <Text fontSize={13} fontWeight="700" color={DARK_TEXT}>{job.company_name}</Text>
           </VStack>
           <TouchableOpacity 
             onPress={onApply}
             disabled={applied}
             style={[styles.applyMiniBtn, applied && styles.applyBtnApplied]}
           >
              <Text fontSize={12} fontWeight="800" color={applied ? GRAY_TEXT : BLUE}>
                {applied ? 'Applied' : 'Apply Now'}
              </Text>
           </TouchableOpacity>
        </HStack>
      </VStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imageContainer: {
    height: 180,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backdropFilter: 'blur(10px)',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'white',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookmarkBtnActive: {
    backgroundColor: BLUE,
  },
  pillBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  applyMiniBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
  },
  applyBtnApplied: {
    backgroundColor: '#F3F4F6',
  },
});

export default JobCard;
