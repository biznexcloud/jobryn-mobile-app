import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { moderateScale, verticalScale } from '../../utils/responsive';

export type PipelineStatus =
  | 'All'
  | 'applied'
  | 'screening'
  | 'online_meeting'
  | 'onsite_meeting'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  dot: string;
}

const STATUS_CONFIG: Record<PipelineStatus, StatusConfig> = {
  All:            { label: 'All',          color: '#374151', bg: '#F3F4F6', dot: '#9CA3AF' },
  applied:        { label: 'New',          color: '#1D6FE8', bg: '#EFF6FF', dot: '#1D6FE8' },
  screening:      { label: 'Screening',    color: '#8B5CF6', bg: '#F5F3FF', dot: '#8B5CF6' },
  online_meeting: { label: 'Interview',    color: '#F59E0B', bg: '#FFFBEB', dot: '#F59E0B' },
  onsite_meeting: { label: 'On-site',      color: '#EF6820', bg: '#FFF7ED', dot: '#EF6820' },
  hired:          { label: 'Hired',        color: '#10B981', bg: '#ECFDF5', dot: '#10B981' },
  rejected:       { label: 'Rejected',     color: '#EF4444', bg: '#FEF2F2', dot: '#EF4444' },
  withdrawn:      { label: 'Withdrawn',    color: '#94A3B8', bg: '#F8FAFC', dot: '#94A3B8' },
};

const ALL_STATUSES: PipelineStatus[] = [
  'All', 'applied', 'screening', 'online_meeting', 'onsite_meeting', 'hired', 'rejected', 'withdrawn',
];

interface Props {
  active: PipelineStatus;
  counts?: Partial<Record<PipelineStatus, number>>;
  onSelect: (status: PipelineStatus) => void;
}

export default function PipelineStatusBar({ active, counts = {}, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {ALL_STATUSES.map((status) => {
        const cfg = STATUS_CONFIG[status];
        const isActive = status === active;
        const count = counts[status];

        return (
          <TouchableOpacity
            key={status}
            onPress={() => onSelect(status)}
            activeOpacity={0.75}
            style={[
              styles.pill,
              isActive && { backgroundColor: cfg.color, borderColor: cfg.color },
              !isActive && { borderColor: '#E5E7EB' },
            ]}
          >
            {/* Status dot */}
            {!isActive && (
              <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
            )}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {cfg.label}
            </Text>
            {count !== undefined && (
              <View style={[
                styles.badge,
                { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : cfg.bg },
              ]}>
                <Text style={[
                  styles.badgeText,
                  { color: isActive ? '#FFF' : cfg.color },
                ]}>
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(12),
    gap: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  dot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: 3,
  },
  label: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#374151',
  },
  labelActive: {
    color: '#FFFFFF',
  },
  badge: {
    paddingHorizontal: moderateScale(6),
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: moderateScale(18),
    alignItems: 'center',
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontWeight: '800',
  },
});





