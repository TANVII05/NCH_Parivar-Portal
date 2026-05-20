import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface AvatarProps {
  name: string;
  size?: number;
}

export default function Avatar({ name, size = 56 }: AvatarProps) {
  const { isDark } = useTheme();
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: Colors.primary,
        },
      ]}
    >
      <Text
        style={[
          styles.initial,
          {
            fontSize: size * 0.4,
            color: '#FFFFFF',
          },
        ]}
      >
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: Typography.fontFamily.bold,
  },
});
