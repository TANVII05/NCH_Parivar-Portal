import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Animated } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.78;

export default function MainLayout() {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleNavigate = (route: string) => {
    setIsDrawerOpen(false);
    router.push(route as any);
  };

  const handleLogout = async () => {
    setIsDrawerOpen(false);
    await logout();
    router.replace('/(auth)/login');
  };

  const employeeName = user?.name || 'Employee';
  const firstLetter = employeeName.charAt(0).toUpperCase();

  const navigationItems = [
    { label: 'Home', route: '/(main)/dashboard', icon: 'home-outline', activeIcon: 'home' },
    { label: 'Face Punch', route: '/(main)/face-punch', icon: 'camera-outline', activeIcon: 'camera' },
    { label: 'Apply Leave', route: '/(main)/leave', icon: 'calendar-outline', activeIcon: 'calendar' },
    { label: 'Overtime', route: '/(main)/overtime', icon: 'time-outline', activeIcon: 'time' },
    { label: 'Loan Request', route: '/(main)/loan-request', icon: 'cash-outline', activeIcon: 'cash' },
    { label: 'Exit / Resignation', route: '/(main)/exit-resignation', icon: 'exit-outline', activeIcon: 'exit' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header onMenuPress={() => setIsDrawerOpen(true)} />
      
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
            height: 65,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarLabelStyle: {
            fontFamily: Typography.fontFamily.medium,
            fontSize: 10,
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Home',
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name="face-punch"
          options={{
            title: 'Punch',
            tabBarIcon: ({ color }) => (
              <Ionicons name="camera" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="leave"
          options={{
            title: 'Leave',
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="overtime"
          options={{
            title: 'Overtime',
            tabBarIcon: ({ color }) => (
              <Ionicons name="time" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="loan-request"
          options={{
            title: 'Loan',
            tabBarIcon: ({ color }) => (
              <Ionicons name="cash" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="exit-resignation"
          options={{
            title: 'Exit',
            tabBarIcon: ({ color }) => (
              <Ionicons name="exit" size={22} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Side Drawer Overlay Modal */}
      {isDrawerOpen && (
        <View style={StyleSheet.absoluteFillObject}>
          {/* Backdrop (Tapping closes drawer) */}
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setIsDrawerOpen(false)}
          />

          {/* Side Drawer Container */}
          <View style={[styles.drawer, { backgroundColor: colors.card, borderRightColor: colors.border }]}>
            
            {/* Employee Profile Header Section */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{firstLetter}</Text>
              </View>
              <Text style={styles.profileName} numberOfLines={1}>
                {employeeName}
              </Text>
              <Text style={styles.profileMeta}>
                ID: {user?.employeeId || 'NCH-0000'}
              </Text>
              <Text style={styles.profileMeta}>
                Dept: {user?.department || 'Core Team'}
              </Text>
            </View>

            {/* Divider Line */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Navigation Links */}
            <View style={styles.drawerLinks}>
              {navigationItems.map((item, idx) => {
                const isActive = pathname === item.route;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleNavigate(item.route)}
                    style={[
                      styles.drawerItem,
                      isActive && { backgroundColor: Colors.primary + '12' },
                    ]}
                  >
                    <Ionicons
                      name={(isActive ? item.activeIcon : item.icon) as any}
                      size={20}
                      color={isActive ? Colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.drawerLabel,
                        { color: isActive ? Colors.primary : colors.text },
                        isActive && { fontFamily: Typography.fontFamily.semiBold },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: Spacing.md }]} />

              {/* Logout Link */}
              <TouchableOpacity onPress={handleLogout} style={styles.drawerItem}>
                <Ionicons name="log-out-outline" size={20} color={colors.error || '#E53935'} />
                <Text style={[styles.drawerLabel, { color: colors.error || '#E53935' }]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    borderRightWidth: 1,
    paddingTop: 45, // Account for status bar spacing
    ...Shadows.lg,
  },
  profileHeader: {
    backgroundColor: Colors.primary,
    padding: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.xs,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    ...Shadows.sm,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 24,
    color: Colors.primary,
  },
  profileName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.bodyLarge,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  profileMeta: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.small,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  drawerLinks: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  drawerLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.body,
  },
});
