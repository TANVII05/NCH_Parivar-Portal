import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ProfileCard from '../../components/ProfileCard';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ProfileCard
        name={user?.name || 'Employee'}
        employeeId={user?.employeeId || 'NCH-0000'}
        designation={user?.designation || 'Employee'}
        department={user?.department}
      />

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.md }]}>
        Quick Actions
      </Text>

      <View style={styles.actionsGrid}>
        {[
          { icon: 'camera', label: 'Face Punch', color: '#5B5FC7', route: '/(main)/face-punch' },
          { icon: 'calendar', label: 'Apply Leave', color: '#43A047', route: '/(main)/leave' },
          { icon: 'time', label: 'Overtime', color: '#FB8C00', route: '/(main)/overtime' },
          { icon: 'cash', label: 'Loan Request', color: '#8A3FFC', route: '/(main)/loan-request' },
          { icon: 'exit', label: 'Exit / Resignation', color: '#E53935', route: '/(main)/exit-resignation' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
            style={[
              styles.actionCard,
              { backgroundColor: colors.card, ...Shadows.sm },
              item.label === 'Exit / Resignation' && styles.fullWidthCard,
            ]}
          >
            <View style={[styles.actionIcon, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.text }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Compact Footer Support Contacts */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerHeading, { color: colors.textSecondary }]}>
          Need Assistance? Contact Support
        </Text>
        <View style={styles.footerRow}>
          {/* NCH Support Column */}
          <View style={styles.footerCol}>
            <Text style={[styles.supportTitle, { color: colors.text }]}>NCH Support</Text>
            <View style={styles.supportDetail}>
              <Ionicons name="call" size={11} color={Colors.primary} />
              <Text style={[styles.supportText, { color: colors.textSecondary }]}>+91 6356922831</Text>
            </View>
            <View style={styles.supportDetail}>
              <Ionicons name="mail" size={11} color={Colors.primary} />
              <Text style={[styles.supportText, { color: colors.textSecondary }]} numberOfLines={1}>
                hr.nchgroup@gmail.com
              </Text>
            </View>
          </View>

          {/* Vertical Divider */}
          <View style={[styles.footerDivider, { backgroundColor: colors.border }]} />

          {/* SI Support Column */}
          <View style={styles.footerCol}>
            <Text style={[styles.supportTitle, { color: colors.text }]}>SI Support</Text>
            <View style={styles.supportDetail}>
              <Ionicons name="call" size={11} color={Colors.primary} />
              <Text style={[styles.supportText, { color: colors.textSecondary }]}>+91 9081252916</Text>
            </View>
            <View style={styles.supportDetail}>
              <Ionicons name="mail" size={11} color={Colors.primary} />
              <Text style={[styles.supportText, { color: colors.textSecondary }]} numberOfLines={1}>
                hr.nchgroup1@gmail.com
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.huge },
  sectionTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.subtitle,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionCard: {
    width: '47%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fullWidthCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.small,
  },
  footer: {
    marginTop: Spacing.huge,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    paddingBottom: Spacing.sm,
  },
  footerHeading: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.caption,
    marginBottom: Spacing.md,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  footerCol: {
    flex: 1,
    gap: 4,
  },
  supportTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.small,
    marginBottom: 2,
  },
  supportDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  supportText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.caption,
  },
  footerDivider: {
    width: 1,
    height: 44,
    alignSelf: 'center',
  },
});
