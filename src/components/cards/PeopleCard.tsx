import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../constants';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import GradientButton from '../common/GradientButton';
import { User } from '../../types';
import { moderateScale, verticalScale } from '../../utils/responsive';

interface PeopleCardProps {
  user: User;
  mutualConnections?: number;
  onConnect?: () => void;
  onDismiss?: () => void;
}

export const PeopleCard = ({ user, mutualConnections, onConnect, onDismiss }: PeopleCardProps) => (
  <View style={styles.card}>
    <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
      <Text style={styles.dismissIcon}>✕</Text>
    </TouchableOpacity>
    <Avatar uri={user.avatar} name={user.name} size={moderateScale(60)} />
    <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
    <Text style={styles.headline} numberOfLines={2}>{user.headline ?? ''}</Text>
    {mutualConnections !== undefined && (
      <Text style={styles.mutual}>{mutualConnections} mutual connections</Text>
    )}
    <GradientButton label="Connect" onPress={onConnect ?? (() => {})} size="sm" fullWidth />
  </View>
);

interface ApplicantCardProps {
  user: User;
  status: string;
  appliedAt: string;
  onReview?: () => void;
}

export const ApplicantCard = ({ user, status, appliedAt, onReview }: ApplicantCardProps) => {
  const statusVariant =
    status === 'Hired' ? 'success' :
    status === 'Rejected' ? 'error' :
    status === 'Shortlisted' ? 'primary' : 'neutral';

  return (
    <View style={styles.applicantCard}>
      <Avatar uri={user.avatar} name={user.name} size={moderateScale(44)} />
      <View style={styles.applicantInfo}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.headline}>{user.headline ?? user.email}</Text>
        <Text style={styles.mutual}>{appliedAt}</Text>
      </View>
      <View style={styles.applicantRight}>
        <Badge label={status} variant={statusVariant as any} />
        <TouchableOpacity style={styles.reviewBtn} onPress={onReview}>
          <Text style={styles.reviewText}>Review →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.border,
    padding: moderateScale(16),
    alignItems: 'center',
    width: moderateScale(168),
    marginRight: moderateScale(12),
  },
  dismissBtn: {
    position: 'absolute',
    top: verticalScale(8),
    right: moderateScale(8),
    padding: moderateScale(4),
  },
  dismissIcon: { fontSize: moderateScale(12), color: Colors.textMuted },
  name: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
  headline: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: verticalScale(4),
    minHeight: verticalScale(34),
  },
  mutual: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.xs,
    color: Colors.textMuted,
    marginBottom: verticalScale(12),
  },
  applicantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.border,
    padding: moderateScale(14),
    marginBottom: verticalScale(10),
  },
  applicantInfo: { flex: 1, marginLeft: moderateScale(12) },
  applicantRight: { alignItems: 'flex-end', gap: moderateScale(6) },
  reviewBtn: { marginTop: verticalScale(6) },
  reviewText: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
});





