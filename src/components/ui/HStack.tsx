import React from 'react';
import { View, ViewProps } from 'react-native';
import { getShorthandStyles, ShorthandProps } from './shorthand';

export interface HStackProps extends ViewProps, ShorthandProps {
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

export function HStack({ 
  space, style, children,
  p, px, py, pt, pb, pl, pr,
  m, mx, my, mt, mb, ml, mr,
  bg, rounded, border, borderBottom, borderTop, borderLeft, borderRight, borderColor, borderStyle,
  flex, width, height, minWidth, maxWidth, minHeight, maxHeight,
  position, top, bottom, left, right,
  items, justify, zIndex, overflow,
  fontSize, fontWeight, color, textAlign, textTransform, lineHeight, letterSpacing,
  alignSelf, flexDirection, flexWrap,
  w, h, roundedTop, roundedBottom,
  borderTopLeft, borderTopRight, borderBottomLeft, borderBottomRight,
  maxW, maxH, minW, minH, flexDir,
  ...props 
}: HStackProps) {
  const shorthand = getShorthandStyles({
    p, px, py, pt, pb, pl, pr,
    m, mx, my, mt, mb, ml, mr,
    bg, rounded, border, borderBottom, borderTop, borderLeft, borderRight, borderColor, borderStyle,
    flex, width, height, minWidth, maxWidth, minHeight, maxHeight,
    position, top, bottom, left, right,
    items, justify, zIndex, overflow,
    fontSize, fontWeight, color, textAlign, textTransform, lineHeight, letterSpacing,
    alignSelf, flexDirection, flexWrap,
    w, h, roundedTop, roundedBottom,
    borderTopLeft, borderTopRight, borderBottomLeft, borderBottomRight,
    maxW, maxH, minW, minH, flexDir,
  });
  
  return (
    <View 
      style={[{ gap: space ? spacing[space] : 0, flexDirection: 'row' }, shorthand, style]} 
      {...props}
    >
      {children}
    </View>
  );
}





