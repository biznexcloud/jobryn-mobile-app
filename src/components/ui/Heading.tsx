import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../constants';
import { moderateScale } from '../../utils/responsive';
import { getShorthandStyles, ShorthandProps } from './shorthand';

export interface HeadingProps extends TextProps, ShorthandProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  children: React.ReactNode;
}

const sizes = {
  xs: moderateScale(14),
  sm: moderateScale(16),
  md: moderateScale(18),
  lg: moderateScale(20),
  xl: moderateScale(24),
  '2xl': moderateScale(30),
  '3xl': moderateScale(36),
};

export function Heading({ size = 'lg', children, style, ...props }: HeadingProps) {
  const shorthand = getShorthandStyles(props);
  return (
    <Text 
      style={[
        styles.base, 
        { fontSize: sizes[size] }, 
        shorthand,
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: moderateScale(8),
  }
});





