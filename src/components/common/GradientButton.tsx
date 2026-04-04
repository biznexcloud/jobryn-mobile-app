import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '../../constants';
import { moderateScale, verticalScale } from '../../utils/responsive';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { paddingVertical: verticalScale(8), paddingHorizontal: moderateScale(20), fontSize: Fonts.sm },
  md: { paddingVertical: verticalScale(12), paddingHorizontal: moderateScale(28), fontSize: Fonts.base },
  lg: { paddingVertical: verticalScale(16), paddingHorizontal: moderateScale(36), fontSize: Fonts.md },
};

export const GradientButton = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'solid',
  size = 'md',
  fullWidth = false,
}: GradientButtonProps) => {
  const sz = sizeMap[size];

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.outline,
          {
            paddingVertical: sz.paddingVertical,
            paddingHorizontal: sz.paddingHorizontal,
            opacity: disabled ? 0.5 : 1,
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
          },
        ]}
        activeOpacity={0.75}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Text style={[styles.outlineText, { fontSize: sz.fontSize }]}>{label}</Text>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={{ opacity: disabled ? 0.5 : 1, alignSelf: fullWidth ? 'stretch' : 'flex-start' }}
        activeOpacity={0.7}
      >
        <Text style={[styles.ghostText, { fontSize: sz.fontSize }]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        { opacity: disabled ? 0.5 : 1, borderRadius: moderateScale(24), overflow: 'hidden', alignSelf: fullWidth ? 'stretch' : 'flex-start' },
      ]}
    >
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradientInner,
          {
            paddingVertical: sz.paddingVertical,
            paddingHorizontal: sz.paddingHorizontal,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <Text style={[styles.solidText, { fontSize: sz.fontSize }]}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientInner: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(24),
  },
  solidText: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  outlineText: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
  ghostText: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default GradientButton;





