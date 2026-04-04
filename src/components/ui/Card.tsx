import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { getShorthandStyles, ShorthandProps } from './shorthand';

export interface CardProps extends ViewProps, ShorthandProps {}

export function Card({ style, children, ...props }: CardProps) {
  const shorthand = getShorthandStyles(props);
  return (
    <View style={[styles.card, shorthand, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    marginVertical: 4,
  }
});





