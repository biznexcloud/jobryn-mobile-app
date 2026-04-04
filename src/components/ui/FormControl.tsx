import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { Colors, Fonts } from '../../constants';
import { moderateScale, verticalScale } from '../../utils/responsive';

interface FormControlProps extends ViewProps {
  label?: string;
  error?: string;
  isInvalid?: boolean;
}

export function FormControl({ label, error, isInvalid, children, style, ...props }: FormControlProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {label && <Text style={[styles.label, isInvalid && styles.errorText]}>{label}</Text>}
      {children}
      {isInvalid && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: verticalScale(16),
  },
  label: {
    fontFamily: Fonts.bold,
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: verticalScale(6),
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: moderateScale(12),
    color: Colors.error,
    marginTop: verticalScale(4),
  },
});





