import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface SupportCardProps {
  title: string;
  email: string;
  phone: string;
}

export default function SupportCard({ title, email, phone }: SupportCardProps) {
  const { colors } = useTheme();

  const handleEmail = () => {
    Linking.openURL(`mailto:${email}`);
  };

  const handlePhone = () => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          ...Shadows.sm,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: Colors.primary + '15' }]}>
          <Ionicons name="headset" size={20} color={Colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>

      <View style={styles.contactRow}>
        <TouchableOpacity
          onPress={handleEmail}
          style={[styles.contactItem, { backgroundColor: colors.surfaceVariant }]}
          activeOpacity={0.7}
        >
          <Ionicons name="mail-outline" size={16} color={Colors.primary} />
          <Text
            style={[styles.contactText, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {email}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePhone}
          style={[styles.contactItem, { backgroundColor: colors.surfaceVariant }]}
          activeOpacity={0.7}
        >
          <Ionicons name="call-outline" size={16} color={Colors.primary} />
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            {phone}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.bodyLarge,
  },
  contactRow: {
    gap: Spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sm,
  },
  contactText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.small,
    flex: 1,
  },
});
