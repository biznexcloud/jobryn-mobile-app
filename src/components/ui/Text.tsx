import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { getShorthandStyles, ShorthandProps } from './shorthand';

export interface TextProps extends RNTextProps, ShorthandProps {
  opacity?: any;
}

export function Text({ style, ...props }: TextProps) {
  const shorthand = getShorthandStyles(props);
  return <RNText style={[shorthand, style]} {...props} />;
}





