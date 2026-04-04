import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewProps } from 'react-native';
import { Colors, Fonts } from '../../constants';
import { moderateScale, verticalScale } from '../../utils/responsive';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  bg?: string;
}

export function Input({ label, error, rightIcon, leftIcon, bg, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer, 
        error ? styles.errorBorder : null,
        bg ? { backgroundColor: bg } : null
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16),
    width: '100%',
  },
  label: {
    fontFamily: Fonts.bold,
    fontSize: moderateScale(14),
    color: Colors.textPrimary,
    marginBottom: verticalScale(6),
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: moderateScale(8),
    backgroundColor: Colors.white,
    paddingHorizontal: moderateScale(12),
    height: verticalScale(48),
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: moderateScale(16),
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: moderateScale(12),
    color: Colors.error,
    marginTop: verticalScale(4),
  },
  leftIcon: {
    marginRight: moderateScale(8),
  },
  rightIcon: {
    marginLeft: moderateScale(8),
  },
});





