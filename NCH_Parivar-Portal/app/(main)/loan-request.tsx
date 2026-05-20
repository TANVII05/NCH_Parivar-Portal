import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TermsBox from '../../components/TermsBox';
import { LOAN_PURPOSES } from '../../constants/loanTerms';
import { Ionicons } from '@expo/vector-icons';

export default function LoanRequestScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  // Form fields
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [description, setDescription] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!loanPurpose) {
      Alert.alert('Error', 'Please select a Loan Purpose');
      return;
    }
    if (!loanAmount.trim() || isNaN(Number(loanAmount)) || Number(loanAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid Loan Amount');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description / justification');
      return;
    }
    if (!agreed) {
      Alert.alert('Error', 'You must agree to the Terms & Conditions');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Loan Request Submitted',
        `Your request for an interest-free loan of ₹${Number(loanAmount).toLocaleString('en-IN')} for "${loanPurpose}" has been submitted for Director approval.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setLoanPurpose('');
              setLoanAmount('');
              setDescription('');
              setAgreed(false);
            },
          },
        ]
      );
    }, 1500);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Apply for Loan</Text>

      <Card style={styles.formCard}>
        <Input
          label="Employee Name"
          value={user?.name || 'Employee'}
          onChangeText={() => {}}
          editable={false}
        />

        <Input
          label="Department"
          value={user?.department || 'Core Team'}
          onChangeText={() => {}}
          editable={false}
        />

        <Select
          label="Loan Purpose"
          value={loanPurpose}
          options={LOAN_PURPOSES}
          onSelect={setLoanPurpose}
          searchable={false}
        />

        <Input
          label="Loan Amount (INR)"
          value={loanAmount}
          onChangeText={setLoanAmount}
          placeholder="Enter loan amount"
          keyboardType="numeric"
        />

        <Input
          label="Description / Reason"
          value={description}
          onChangeText={setDescription}
          placeholder="Please explain the necessity of this loan request"
          multiline
          numberOfLines={4}
        />

        {/* Scrollable Terms & Conditions Box */}
        <TermsBox />

        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => setAgreed(!agreed)}
          style={styles.checkboxRow}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: Colors.primary,
                backgroundColor: agreed ? Colors.primary : 'transparent',
              },
            ]}
          >
            {agreed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <Text style={[styles.checkboxLabel, { color: colors.text }]}>
            I have read and agree to the Terms & Conditions
          </Text>
        </TouchableOpacity>

        <Button
          title="Submit Loan Request"
          onPress={handleSubmit}
          loading={loading}
          disabled={!agreed || !loanPurpose || !loanAmount || !description}
          style={{ marginTop: Spacing.xl }}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.heading,
    marginBottom: Spacing.xl,
  },
  formCard: {
    padding: Spacing.xl,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.sm - 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.body,
    flex: 1,
  },
});
