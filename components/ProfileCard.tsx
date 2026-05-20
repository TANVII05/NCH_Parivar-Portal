import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import Avatar from './ui/Avatar';

interface ProfileCardProps {
  name: string;
  employeeId: string;
  designation: string;
  department?: string;
}

export default function ProfileCard({
  name,
  employeeId,
  designation,
  department,
}: ProfileCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          ...Shadows.md,
        },
      ]}
    >
      {/* Clean solid primary banner */}
      <View style={styles.solidBanner} />
      
      {/* Centered Avatar and Info Row */}
      <View style={styles.content}>
        <Avatar name={name} size={72} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.employeeId, { color: Colors.primary }]}>
            {employeeId}
          </Text>
          <Text style={[styles.designation, { color: colors.textSecondary }]}>
            {designation}
            {department ? ` • ${department}` : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  solidBanner: {
    height: 70,
    backgroundColor: Colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    marginTop: -36, // Overlaps the avatar by half (72 size / 2)
    gap: Spacing.md,
  },
  info: {
    flex: 1,
    paddingTop: 36, // Pushes text down just enough to align beautifully with the avatar base
    justifyContent: 'center',
  },
  name: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.subtitle + 2, // Larger & bold
    fontWeight: 'bold',
  },
  employeeId: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.body - 1, // Slightly smaller
    color: '#333788',
    marginTop: 2,
  },
  designation: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.body - 1,
    marginTop: 2,
  },
});
