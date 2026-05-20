import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({ children, style, variant = 'default' }: CardProps) {
  const { colors } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xl,
    };

    switch (variant) {
      case 'elevated':
        return { ...base, ...Shadows.md };
      case 'outlined':
        return { ...base, borderWidth: 1, borderColor: colors.border };
      default:
        return { ...base, ...Shadows.sm };
    }
  };

  return <View style={[getCardStyle(), style]}>{children}</View>;
}
