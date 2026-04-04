import React from 'react';
import { Image, ImageProps, StyleSheet } from 'react-native';
import { getShorthandStyles, ShorthandProps } from './shorthand';
import { moderateScale } from '../../utils/responsive';

// Omit height and width from ImageProps to avoid conflict with ShorthandProps
export interface AvatarProps extends Omit<ImageProps, 'height' | 'width'>, ShorthandProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
}

const sizes = {
  xs: moderateScale(24),
  sm: moderateScale(32),
  md: moderateScale(40),
  lg: moderateScale(48),
  xl: moderateScale(64),
};

export function Avatar({ size = 'md', style, ...props }: AvatarProps) {
  const shorthand = getShorthandStyles(props);
  
  // Resolve dimension: if size is a string, use sizes map; if number, use it directly.
  const dimension = typeof size === 'string' ? sizes[size] : moderateScale(size);
  
  const { 
    p, px, py, pt, pb, pl, pr, m, mx, my, mt, mb, ml, mr, 
    bg, rounded, border, borderBottom, borderTop, borderLeft, borderRight, borderColor, 
    flex, width, height, minWidth, maxWidth, minHeight, maxHeight, 
    position, top, bottom, left, right, items, justify, zIndex, overflow, 
    fontSize, fontWeight, color, textAlign, textTransform, lineHeight,
    ...imageProps 
  } = props;

  return (
    <Image 
      style={[
        { width: dimension, height: dimension, borderRadius: dimension / 2 } as any,
        shorthand,
        style
      ]} 
      {...imageProps} 
    />
  );
}
