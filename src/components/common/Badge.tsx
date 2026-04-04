import React from 'react';
import { View, Text } from 'react-native';
import { Box } from '../ui/Box';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-blue-50 text-blue-600',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  error: 'bg-rose-50 text-rose-600',
  info: 'bg-sky-50 text-sky-600',
  neutral: 'bg-slate-100 text-slate-500',
};

export const Badge = ({ label, variant = 'primary', dot = false }: BadgeProps) => {
  const classes = variantClasses[variant].split(' ');
  const bg = classes[0];
  const text = classes[1];

  return (
    <Box className={`flex-row items-center px-2.5 py-0.5 rounded-full ${bg}`}>
      {dot && <Box className={`w-1.5 h-1.5 rounded-full mr-1.5 ${text.replace('text-', 'bg-')}`} />}
      <Text className={`text-[10px] font-black uppercase tracking-tight ${text}`}>{label}</Text>
    </Box>
  );
};

export default Badge;





