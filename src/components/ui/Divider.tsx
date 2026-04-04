import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { getShorthandStyles, ShorthandProps } from './shorthand';

export interface DividerProps extends ViewProps, ShorthandProps {}

export function Divider({ style, ...props }: DividerProps) {
  const shorthand = getShorthandStyles(props);
  return <View style={[styles.divider, shorthand, style]} {...props} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
});





