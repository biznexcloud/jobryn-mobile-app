import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, View, ViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  /** If true, uses KeyboardAvoidingView to push content up */
  withKeyboard?: boolean;
  /** Sets a background color, defaults to white */
  backgroundColor?: string;
  /** If true, adds top padding avoiding notch */
  safeAreaTop?: boolean;
  /** If true, adds bottom padding avoiding home indicator */
  safeAreaBottom?: boolean;
  justify?: any;
  items?: any;
  px?: number;
}

export function ScreenWrapper({
  children,
  withKeyboard = false,
  backgroundColor = Colors.white,
  safeAreaTop = true,
  safeAreaBottom = true,
  style,
  ...props
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { backgroundColor },
    safeAreaTop && { paddingTop: insets.top },
    safeAreaBottom && { paddingBottom: insets.bottom },
    style,
  ];

  const content = <View style={containerStyle} {...props}>{children}</View>;

  if (withKeyboard) {
    return (
      <KeyboardAvoidingView 
        style={styles.keyboardWrap} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardWrap: {
    flex: 1,
  }
});





