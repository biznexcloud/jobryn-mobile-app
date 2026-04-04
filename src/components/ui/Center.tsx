import React from 'react';
import { View } from 'react-native';

interface CenterProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
}

export const Center = ({ children, className, style }: CenterProps) => (
  <View 
    className={`items-center justify-center ${className}`}
    style={style}
  >
    {children}
  </View>
);





