import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

interface OvertimeRecord {
  id: string;
  date: string;
  duration: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const OVERTIME_DURATIONS = [
  '30 mins',
  '1 hr',
  '1.5 hrs',
  '2 hrs',
  '2.5 hrs',
  '3 hrs',
  '3.5 hrs',
  'More than 3.5 hrs',
  'Sunday Overtime',
];

export default function OvertimeScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'apply' | 'history'>('apply');
  
  // Form fields
  const [date, setDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  // History data
  const [history, setHistory] = useState<OvertimeRecord[]>([
    {
      id: '1',
      date: '2026-05-15',
      duration: '2 hrs',
      reason: 'Support release deployment tasks',
      status: 'Approved',
    },
    {
      id: '2',
      date: '2026-05-19',
      duration: 'Sunday Overtime',
      reason: 'Urgent server maintenance and upgrades',
      status: 'Pending',
    },
  ]);

  const handleApply = () => {
    if (!date) {
      Alert.alert('Error', 'Please select a Date');
      return;
    }
    if (!duration) {
      Alert.alert('Error', 'Please select Overtime Duration');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason / work description');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newOT: OvertimeRecord = {
        id: Date.now().toString(),
        date,
        duration,
        reason,
        status: 'Pending',
      };
      
      setHistory([newOT, ...history]);
      Alert.alert(
        'Overtime Submitted',
        `Your Overtime request for ${duration} on ${date} has been submitted.`
      );
      
      // Reset form
      setDate('');
      setDuration('');
      setReason('');
      setActiveTab('history');
      
      // Simulate status update in-app notification after 5 seconds
      setTimeout(() => {
        Alert.alert(
          '🔔 Overtime Status Updated',
          `Your overtime request for ${duration} on ${date} has been APPROVED by the Director.`
        );
        // Update local item status
        setHistory(prev =>
          prev.map(item =>
            item.id === newOT.id ? { ...item, status: 'Approved' } : item
          )
        );
      }, 5000);

    }, 1200);
  };

  const renderHistoryItem = ({ item }: { item: OvertimeRecord }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Approved': return colors.success;
        case 'Rejected': return colors.error;
        default: return colors.warning;
      }
    };

    const getStatusBg = (status: string) => {
      switch (status) {
        case 'Approved': return colors.successLight;
        case 'Rejected': return colors.errorLight;
        default: return colors.warningLight;
      }
    };

    return (
      <Card style={styles.historyCard}>
        <View style={styles.cardHeader}>
          <Text style={[styles.durationTitle, { color: colors.text }]}>{item.duration}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBg(item.status) }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.cardInfoRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
            <Text style={[styles.cardDateText, { color: colors.textSecondary }]}>
              {item.date}
            </Text>
          </View>
          
          <Text style={[styles.reasonText, { color: colors.textSecondary }]}>
            <Text style={styles.boldTextLabel}>Reason: </Text>
            {item.reason}
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tab Selector */}
      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('apply')}
          style={[styles.tabButton, activeTab === 'apply' && { borderBottomColor: Colors.primary }]}
        >
          <Text style={[styles.tabText, activeTab === 'apply' ? { color: Colors.primary, fontFamily: Typography.fontFamily.semiBold } : { color: colors.textSecondary }]}>
            Apply Overtime
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('history')}
          style={[styles.tabButton, activeTab === 'history' && { borderBottomColor: Colors.primary }]}
        >
          <Text style={[styles.tabText, activeTab === 'history' ? { color: Colors.primary, fontFamily: Typography.fontFamily.semiBold } : { color: colors.textSecondary }]}>
            Overtime History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'apply' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Apply for Overtime</Text>
          
          <Card style={styles.formCard}>
            <Input
              label="Department"
              value={user?.department || 'Core Team'}
              onChangeText={() => {}}
              editable={false}
            />

            {/* Date Picker Button */}
            <TouchableOpacity 
              onPress={() => setShowCalendar(!showCalendar)}
              style={styles.dateSelector}
            >
              <Input
                label="Date"
                value={date}
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
                    setDate(day.dateString);
                    setShowCalendar(false);
                  }}
                  markedDates={date ? { [date]: { selected: true, selectedColor: Colors.primary } } : {}}
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

            <Select
              label="Duration"
              value={duration}
              options={OVERTIME_DURATIONS}
              onSelect={setDuration}
              searchable={false}
            />

            <Input
              label="Reason / Work Description"
              value={reason}
              onChangeText={setReason}
              placeholder="Detail what tasks were completed during overtime"
              multiline
              numberOfLines={4}
            />

            <Button
              title="Submit Overtime"
              onPress={handleApply}
              loading={loading}
              style={{ marginTop: Spacing.xl }}
            />
          </Card>
        </ScrollView>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="time-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>No overtime records found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.body,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  listContent: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.title,
    marginBottom: Spacing.lg,
  },
  formCard: {
    padding: Spacing.xl,
  },
  dateSelector: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  calendarIcon: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.md + 4,
  },
  calendarContainer: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  historyCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: Spacing.md,
    marginBottom: Spacing.md,
  },
  durationTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.bodyLarge,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
  },
  statusText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.caption,
  },
  cardBody: {
    gap: Spacing.sm,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardDateText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.body,
  },
  reasonText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.body,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  boldTextLabel: {
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.huge,
  },
  emptyText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.body,
    marginTop: Spacing.md,
  },
});
