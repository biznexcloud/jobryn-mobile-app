import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors, Fonts } from '../../constants';
import { moderateScale, verticalScale } from '../../utils/responsive';
import { getShorthandStyles, ShorthandProps } from './shorthand';

export interface ButtonProps extends TouchableOpacityProps, ShorthandProps {
  label?: string;
  title?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  outline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  textStyle?: any;
}

export function Button({ 
  label, 
  title,
  variant = 'solid', 
  outline,
  size = 'md', 
  loading = false, 
  fullWidth = false, 
  style, 
  textStyle,
  disabled, 
  children,
  ...props 
}: ButtonProps) {
  const shorthand = getShorthandStyles(props);
  
  const getVariantStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outline;
      case 'ghost':
        return styles.ghost;
      default:
        return styles.solid;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return { color: Colors.primary };
      default:
        return { color: Colors.white };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: verticalScale(6), paddingHorizontal: moderateScale(12) };
      case 'lg':
        return { paddingVertical: verticalScale(14), paddingHorizontal: moderateScale(24) };
      default:
        return { paddingVertical: verticalScale(12), paddingHorizontal: moderateScale(20) };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.base,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && { width: '100%' },
        (disabled || loading) && { opacity: 0.6 },
        shorthand,
        style
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'solid' && !outline ? Colors.white : Colors.primary} />
      ) : (
        children || <Text style={[styles.text, getTextStyle(), textStyle]}>{label || title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: Colors.primary,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: {
    fontFamily: Fonts.bold,
    fontSize: moderateScale(16),
    fontWeight: '700',
  }
});





