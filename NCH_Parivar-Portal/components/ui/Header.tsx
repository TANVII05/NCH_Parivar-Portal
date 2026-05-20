import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

interface HeaderProps {
  onMenuPress?: () => void;
}

export default function Header({ onMenuPress }: HeaderProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const isFeatureScreen = pathname !== '/dashboard' && pathname !== '/(main)/dashboard' && pathname !== '/';

  const getHeaderTitle = () => {
    if (pathname.includes('face-punch')) return 'Face Punch';
    if (pathname.includes('leave')) return 'Apply Leave';
    if (pathname.includes('overtime')) return 'Overtime';
    if (pathname.includes('loan-request')) return 'Loan Request';
    if (pathname.includes('exit-resignation')) return 'Exit / Resignation';
    return `Hello, ${user?.name?.split(' ')[0] || 'User'} 👋`;
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: Colors.primary,
        paddingTop: Math.max(insets.top, Spacing.sm),
      }
    ]}>
      {/* Left button: Back Arrow for features, Hamburger Menu for Home */}
      <View style={styles.logoArea}>
        {isFeatureScreen ? (
          <TouchableOpacity
            onPress={() => router.replace('/(main)/dashboard')}
            style={styles.menuButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.menuButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.greeting} numberOfLines={1}>
          {getHeaderTitle()}
        </Text>
      </View>

      {/* Right button: Close Cross for features, Settings/Logout for Home */}
      <View style={styles.actions}>
        {isFeatureScreen ? (
          <TouchableOpacity
            onPress={() => router.replace('/(main)/dashboard')}
            style={styles.closeButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={toggleTheme}
              style={styles.iconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.body,
    color: '#FFFFFF',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    backgroundColor: 'rgba(229,57,53,0.9)',
  },
  logoutText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.small,
    color: '#FFFFFF',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
