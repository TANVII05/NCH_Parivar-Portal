import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const BACKEND_URL = 'http://192.168.1.52:5000';

  const handleSendOtp = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Enter a valid email' });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        if (data.previewUrl) {
          Alert.alert(
            'OTP Sent (Test Mode)',
            `OTP generated and sent to ${email}.\n\nPreview Ethereal Link:\n${data.previewUrl}\n\nCheck terminal console output for the code!`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('OTP Sent', `A 6-digit OTP has been sent to ${email}`);
        }
      } else {
        Alert.alert('Error', data.error || 'Failed to send OTP email.');
      }
    } catch (e: any) {
      console.log('Error sending OTP:', e);
      Alert.alert('Network Error', 'Could not connect to the backend server. Make sure it is running on port 5000 and matches your local Wi-Fi IP!');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const e: Record<string, string> = {};
    if (!otp.trim() || otp.length !== 6) e.otp = 'Enter valid 6-digit OTP';
    if (!newPassword.trim() || newPassword.length < 6) e.newPassword = 'Min 6 characters';
    if (newPassword !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Verification Failed', data.error || 'Incorrect OTP or it has expired.');
        setLoading(false);
        return;
      }

      // OTP verified! Update AsyncStorage account password
      const storedAccounts = await AsyncStorage.getItem('@nch_parivar_accounts');
      const accounts = storedAccounts ? JSON.parse(storedAccounts) : {};
      const userKey = email.toLowerCase().trim();

      if (accounts[userKey]) {
        accounts[userKey].password = newPassword;
        await AsyncStorage.setItem('@nch_parivar_accounts', JSON.stringify(accounts));
      } else {
        // Fallback profile seed
        accounts[userKey] = {
          id: Date.now().toString(),
          name: email.split('@')[0].toUpperCase(),
          email: userKey,
          password: newPassword,
          branch: 'Core Team',
          department: 'Engineering',
          designation: 'Employee',
          shiftTiming: '09:00 AM to 06:00 PM',
          lunchTiming: '01:00 PM to 01:30 PM',
          employeeId: 'NCH-' + Math.floor(1000 + Math.random() * 9000),
          joiningDate: new Date().toISOString().split('T')[0],
        };
        await AsyncStorage.setItem('@nch_parivar_accounts', JSON.stringify(accounts));
      }

      Alert.alert('Success', 'Password updated successfully!', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (err) {
      console.log('Error verifying OTP:', err);
      Alert.alert('Network Error', 'Could not connect to the backend server. Make sure it is running on port 5000!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={[styles.iconBadge, { backgroundColor: Colors.primary }]}>
              <Ionicons name="lock-closed" size={24} color="#FFF" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Forgot Password</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Reset your account password</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, ...Shadows.md }]}>
            <Input label="Registered Email ID" value={email} onChangeText={setEmail}
              placeholder="name@nchgroup.com" keyboardType="email-address" error={errors.email} />
            {!otpSent ? (
              <Button title="Send OTP" onPress={handleSendOtp} loading={loading} />
            ) : (
              <>
                <Input label="OTP" value={otp} onChangeText={setOtp}
                  placeholder="Enter 6-digit OTP" keyboardType="number-pad" error={errors.otp} />
                <Input label="New Password" value={newPassword} onChangeText={setNewPassword}
                  secureTextEntry error={errors.newPassword} />
                <Input label="Confirm New Password" value={confirmPassword}
                  onChangeText={setConfirmPassword} secureTextEntry error={errors.confirmPassword} />
                <Button title="Update Password" onPress={handleUpdate} loading={loading} style={{ marginTop: Spacing.md }} />
              </>
            )}
            <Button title="Cancel" onPress={() => router.back()} variant="outlined" style={{ marginTop: Spacing.md }} />
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
