import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Colors, BorderRadius, Typography, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outlined' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const { colors, isDark } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xxl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: disabled ? Colors.primaryLight : Colors.primary,
          opacity: disabled ? 0.6 : 1,
        };
      case 'outlined':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: Colors.primary,
          opacity: disabled ? 0.6 : 1,
        };
      case 'danger':
        return {
          ...base,
          backgroundColor: colors.error,
          opacity: disabled ? 0.6 : 1,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
          opacity: disabled ? 0.6 : 1,
        };
      default:
        return base;
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontFamily: Typography.fontFamily.semiBold,
      fontSize: Typography.sizes.bodyLarge,
      letterSpacing: 0.3,
    };

    switch (variant) {
      case 'primary':
        return { ...base, color: '#FFFFFF' };
      case 'outlined':
        return { ...base, color: Colors.primary };
      case 'danger':
        return { ...base, color: '#FFFFFF' };
      case 'ghost':
        return { ...base, color: Colors.primary };
      default:
        return base;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[getButtonStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outlined' || variant === 'ghost' ? Colors.primary : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
