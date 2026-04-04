import React from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '../../constants';
import { moderateScale, verticalScale } from '../../utils/responsive';

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
}

export const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  icon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
}: InputFieldProps) => {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        {icon && <View style={styles.leftIcon}>{icon}</View>}
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
        {rightIcon && (
          <TouchableOpacity style={styles.rightIcon} onPress={onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: verticalScale(16) },
  label: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
    marginBottom: verticalScale(6),
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: moderateScale(8),
    backgroundColor: Colors.white,
    paddingHorizontal: moderateScale(14),
    minHeight: verticalScale(48),
  },
  inputError: {
    borderColor: Colors.error,
  },
  leftIcon: { marginRight: moderateScale(10) },
  rightIcon: { marginLeft: moderateScale(10) },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  multiline: {
    minHeight: verticalScale(88),
    textAlignVertical: 'top',
    paddingTop: verticalScale(10),
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.xs,
    color: Colors.error,
    marginTop: verticalScale(4),
  },
});

export default InputField;





