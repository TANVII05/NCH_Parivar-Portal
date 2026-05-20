import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { BRANCHES } from '../../constants/branches';
import { SHIFT_TIMINGS } from '../../constants/shifts';
import { LUNCH_TIMINGS } from '../../constants/lunchTimings';

export default function SignupScreen() {
  const { colors } = useTheme();
  const { signup } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [shiftTiming, setShiftTiming] = useState('');
  const [lunchTiming, setLunchTiming] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const employeeName = useMemo(() => {
    if (!email || !email.includes('@')) return '';
    const local = email.split('@')[0] || '';
    return local
      .replace(/[._]/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }, [email]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password.trim()) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Min 6 characters';
    if (!confirmEmail.trim()) e.confirmEmail = 'Confirm email is required';
    else if (confirmEmail.toLowerCase() !== email.toLowerCase()) e.confirmEmail = 'Emails do not match';
    if (!branch) e.branch = 'Select a branch';
    if (!shiftTiming) e.shiftTiming = 'Select shift timing';
    if (!lunchTiming) e.lunchTiming = 'Select lunch timing';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const success = await signup({ email: email.trim(), password, branch, shiftTiming, lunchTiming });
      if (success) {
        router.replace('/(main)/dashboard');
      } else {
        Alert.alert('Error', 'Account creation failed.');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={[styles.iconBadge, { backgroundColor: Colors.primary }]}>
              <Ionicons name="person-add" size={24} color="#FFF" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Create New Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join NCH Parivar Portal</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, ...Shadows.md }]}>
            <Input label="Username (Email ID)" value={email} onChangeText={(t) => { setEmail(t); if (errors.email) setErrors(e => ({ ...e, email: '' })); }}
              placeholder="name@nchgroup.com" keyboardType="email-address" error={errors.email} />
            <Input label="Password" value={password} onChangeText={(t) => { setPassword(t); if (errors.password) setErrors(e => ({ ...e, password: '' })); }}
              secureTextEntry error={errors.password} />
            <Input label="Confirm Email ID" value={confirmEmail} onChangeText={(t) => { setConfirmEmail(t); if (errors.confirmEmail) setErrors(e => ({ ...e, confirmEmail: '' })); }}
              placeholder="Re-enter your email" keyboardType="email-address" error={errors.confirmEmail} />
            <Select label="Select Branch" value={branch} options={BRANCHES} onSelect={(v) => { setBranch(v); if (errors.branch) setErrors(e => ({ ...e, branch: '' })); }} error={errors.branch} />
            <Input label="Employee Name" value={employeeName} onChangeText={() => {}} editable={false} placeholder="Auto-populated from email" />
            <Select label="Select Shift Timing" value={shiftTiming} options={SHIFT_TIMINGS} onSelect={(v) => { setShiftTiming(v); if (errors.shiftTiming) setErrors(e => ({ ...e, shiftTiming: '' })); }} error={errors.shiftTiming} />
            <Select label="Select Lunch Timing" value={lunchTiming} options={LUNCH_TIMINGS} onSelect={(v) => { setLunchTiming(v); if (errors.lunchTiming) setErrors(e => ({ ...e, lunchTiming: '' })); }} error={errors.lunchTiming} />
            <View style={{ gap: Spacing.md, marginTop: Spacing.lg }}>
              <Button title="Create Account" onPress={handleSignup} loading={loading} />
              <Button title="Cancel" onPress={() => router.back()} variant="outlined" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.xxxl },
  header: { alignItems: 'center', marginTop: Spacing.xxl, marginBottom: Spacing.xxl },
  iconBadge: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  title: { fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes.heading, marginBottom: Spacing.xs },
  subtitle: { fontFamily: Typography.fontFamily.regular, fontSize: Typography.sizes.body },
  card: { borderRadius: BorderRadius.xl, padding: Spacing.xxl },
});
