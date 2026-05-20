import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

export default function ExitResignationScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  // Form fields
  const [resignationDate, setResignationDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [lastWorkingDate, setLastWorkingDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [tenureWarning, setTenureWarning] = useState(false);

  // Auto-calculate last working date (Resignation + 45 days)
  useEffect(() => {
    if (resignationDate) {
      const resDate = new Date(resignationDate);
      const lastDate = new Date(resDate);
      lastDate.setDate(resDate.getDate() + 45);
      
      setLastWorkingDate(lastDate.toISOString().split('T')[0]);
    } else {
      setLastWorkingDate('');
    }
  }, [resignationDate]);

  // Check if employee has completed 1 year of service
  useEffect(() => {
    if (user?.joiningDate) {
      const joinDate = new Date(user.joiningDate);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (joinDate > oneYearAgo) {
        setTenureWarning(true);
      } else {
        setTenureWarning(false);
      }
    }
  }, [user]);

  const handleSubmit = () => {
    if (!resignationDate) {
      Alert.alert('Error', 'Please select a Resignation Date');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter a reason for leaving');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Resignation Submitted',
        `Your exit/resignation request has been registered. Your auto-calculated last working day is ${lastWorkingDate}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setResignationDate('');
              setReason('');
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
      <Text style={[styles.title, { color: colors.text }]}>Exit / Resignation</Text>

      {tenureWarning && (
        <Card style={[styles.warningBanner, { backgroundColor: colors.errorLight, borderColor: colors.error }]}>
          <View style={styles.warningHeader}>
            <Ionicons name="warning" size={24} color={colors.error} />
            <Text style={[styles.warningTitle, { color: colors.error }]}>Service Warning</Text>
          </View>
          <Text style={[styles.warningText, { color: colors.text }]}>
            ⚠️ You have not completed 1 year of service. This may affect your eligibility for an experience/relieving certificate.
          </Text>
        </Card>
      )}

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

        {/* Resignation Date Picker Button */}
        <TouchableOpacity 
          onPress={() => setShowCalendar(!showCalendar)}
          style={styles.dateSelector}
        >
          <Input
            label="Resignation Date"
            value={resignationDate}
            onChangeText={() => {}}
            placeholder="YYYY-MM-DD"
            editable={false}
            style={{ marginBottom: 0 }}
          />
          <Ionicons name="calendar" size={20} color={Colors.primary} style={styles.calendarIcon} />
        </TouchableOpacity>

        {showCalendar && (
          <View style={[styles.calendarContainer, { borderColor: colors.border }]}>
            <Calendar
              onDayPress={(day) => {
                setResignationDate(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={resignationDate ? { [resignationDate]: { selected: true, selectedColor: Colors.primary } } : {}}
              theme={{
                calendarBackground: colors.card,
                textSectionTitleColor: colors.textSecondary,
                selectedDayBackgroundColor: Colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: Colors.primary,
                dayTextColor: colors.text,
                textDisabledColor: colors.textTertiary,
                arrowColor: Colors.primary,
                monthTextColor: colors.text,
              }}
            />
          </View>
        )}

        <Input
          label="Last Working Date"
          value={lastWorkingDate}
          onChangeText={() => {}}
          placeholder="Calculated automatically (+45 days)"
          editable={false}
          style={{ marginTop: Spacing.lg }}
        />

        <Input
          label="Reason for Leaving"
          value={reason}
          onChangeText={setReason}
          placeholder="Please explain the reason for your resignation"
          multiline
          numberOfLines={4}
        />

        <Button
          title="Submit Resignation"
          onPress={handleSubmit}
          loading={loading}
          disabled={!resignationDate || !reason}
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
  warningBanner: {
    marginBottom: Spacing.xl,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  warningTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.bodyLarge,
  },
  warningText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.body,
    lineHeight: 20,
  },
  formCard: {
    padding: Spacing.xl,
  },
  dateSelector: {
    position: 'relative',
    justifyContent: 'center',
  },
  calendarIcon: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.md + 4,
  },
  calendarContainer: {
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
});
