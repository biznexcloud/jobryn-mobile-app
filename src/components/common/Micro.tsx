import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../constants';
import Avatar from './Avatar';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader = ({ title, actionLabel, onAction }: SectionHeaderProps) => (
  <View style={styles.row}>
    <Text style={styles.title}>{title}</Text>
    {actionLabel && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

interface StatChipProps {
  label: string;
  value: string | number;
  color?: string;
}

export const StatChip = ({ label, value, color = Colors.primary }: StatChipProps) => (
  <View style={styles.statChip}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface UserInfoRowProps {
  avatar?: string;
  name: string;
  subtitle?: string;
  size?: number;
  right?: React.ReactNode;
}

export const UserInfoRow = ({ avatar, name, subtitle, size = 44, right }: UserInfoRowProps) => (
  <View style={styles.userRow}>
    <Avatar uri={avatar} name={name} size={size} />
    <View style={styles.userText}>
      <Text style={styles.userName}>{name}</Text>
      {subtitle && <Text style={styles.userSubtitle} numberOfLines={1}>{subtitle}</Text>}
    </View>
    {right && <View>{right}</View>}
  </View>
);

interface DividerProps {
  spacing?: number;
}

export const Divider = ({ spacing = 8 }: DividerProps) => (
  <View style={[styles.divider, { marginVertical: spacing }]} />
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.md,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  action: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  statChip: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    minWidth: 80,
  },
  statValue: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  userSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
});





