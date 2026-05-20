import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const success = await login(email.trim(), password);
      if (success) {
        router.replace('/(main)/dashboard');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Theme toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeToggle, { backgroundColor: colors.surfaceVariant }]}
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={18}
              color={colors.text}
            />
          </TouchableOpacity>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoOuter}>
                <Ionicons name="diamond" size={40} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.logoText}>nch</Text>
            <Text style={[styles.appName, { color: colors.text }]}>
              NCH Parivar Portal
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Employee Self-Service Portal
            </Text>
          </View>

          {/* Login Form */}
          <View
            style={[
              styles.formCard,
              {
                backgroundColor: colors.card,
                ...Shadows.md,
              },
            ]}
          >
            <Text style={[styles.formTitle, { color: colors.text }]}>
              Welcome Back
            </Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
              Sign in with your corporate email
            </Text>

            <View style={styles.formFields}>
              <Input
                label="Corporate Email ID"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                }}
                placeholder="name@nchgroup.com"
                keyboardType="email-address"
                error={errors.email}
              />

              <Input
                label="Password"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                }}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
              />

              <Button
                title="Login"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
              />
            </View>
          </View>

          {/* Links */}
          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={styles.linkHighlight}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.linkHighlight}>
                Create New Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
  },
  themeToggle: {
    alignSelf: 'flex-end',
    marginTop: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xxxl,
  },
  logoContainer: {
    marginBottom: Spacing.lg,
  },
  logoOuter: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.heading,
    color: Colors.primary,
    letterSpacing: 2,
    textTransform: 'lowercase',
    marginBottom: Spacing.sm,
  },
  appName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.title,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.body,
  },
  formCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
  },
  formTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.title,
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.body,
    marginBottom: Spacing.xxl,
  },
  formFields: {
    gap: Spacing.xs,
  },
  loginButton: {
    marginTop: Spacing.md,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  linkHighlight: {
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primary,
  },
});
