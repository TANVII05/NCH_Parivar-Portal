import React, { useState, useEffect } from 'react';
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

interface LeaveRecord {
  id: string;
  appliedDate: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function LeaveScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'apply' | 'history'>('apply');
  
  // Form fields
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [totalDays, setTotalDays] = useState(0);
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);

  // History data
  const [history, setHistory] = useState<LeaveRecord[]>([
    {
      id: '1',
      appliedDate: '2026-05-10',
      type: 'Casual Leave',
      startDate: '2026-05-25',
      endDate: '2026-05-26',
      days: 2,
      status: 'Approved',
    },
    {
      id: '2',
      appliedDate: '2026-05-18',
      type: 'Medical',
      startDate: '2026-05-20',
      endDate: '2026-05-20',
      days: 1,
      status: 'Pending',
    },
  ]);

  // Calculate total days and validation warning
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      if (diffDays > 0) {
        setTotalDays(diffDays);
      } else {
        setTotalDays(0);
      }

      // 3 days advance warning check
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const limitDate = new Date(today);
      limitDate.setDate(today.getDate() + 3);

      if (start < limitDate) {
        setWarning('Leave must be applied at least 3 days prior to be approved.');
      } else {
        setWarning('');
      }
    } else {
      setTotalDays(0);
      setWarning('');
    }
  }, [startDate, endDate]);

  const handleApply = () => {
    if (!leaveType) {
      Alert.alert('Error', 'Please select a Leave Type');
      return;
    }
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select both start and end dates');
      return;
    }
    if (totalDays <= 0) {
      Alert.alert('Error', 'End date must be on or after start date');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newLeave: LeaveRecord = {
        id: Date.now().toString(),
        appliedDate: new Date().toISOString().split('T')[0],
        type: leaveType,
        startDate,
        endDate,
        days: totalDays,
        status: 'Pending',
      };
      
      setHistory([newLeave, ...history]);
      Alert.alert(
        'Leave Applied',
        `Your request for ${totalDays} day(s) of ${leaveType} has been submitted successfully.`
      );
      
      // Reset form
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setActiveTab('history');
      
      // Simulate status update in-app notification after 5 seconds
      setTimeout(() => {
        Alert.alert(
          '🔔 Leave Status Updated',
          `Your leave request for ${leaveType} starting on ${startDate} has been APPROVED by HR.`
        );
        // Update local item status
        setHistory(prev =>
          prev.map(item =>
            item.id === newLeave.id ? { ...item, status: 'Approved' } : item
          )
        );
      }, 5000);

    }, 1200);
  };

  const renderHistoryItem = ({ item }: { item: LeaveRecord }) => {
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
          <Text style={[styles.leaveTypeTitle, { color: colors.text }]}>{item.type}</Text>
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
              {item.startDate} to {item.endDate}
            </Text>
          </View>
          
          <View style={styles.cardInfoFooter}>
            <Text style={[styles.cardDays, { color: colors.text }]}>
              Duration: <Text style={styles.boldText}>{item.days} {item.days === 1 ? 'Day' : 'Days'}</Text>
            </Text>
            <Text style={[styles.appliedDate, { color: colors.textTertiary }]}>
              Applied: {item.appliedDate}
            </Text>
          </View>
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
            Apply Leave
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('history')}
          style={[styles.tabButton, activeTab === 'history' && { borderBottomColor: Colors.primary }]}
        >
          <Text style={[styles.tabText, activeTab === 'history' ? { color: Colors.primary, fontFamily: Typography.fontFamily.semiBold } : { color: colors.textSecondary }]}>
            Leave History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'apply' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Request Time Off</Text>
          
          <Card style={styles.formCard}>
            <Select
              label="Leave Type"
              value={leaveType}
              options={['Casual Leave', 'Emergency Leave', 'Medical', 'Half-Day Early Going', 'Half-Day Late Coming']}
              onSelect={setLeaveType}
              searchable={false}
            />

            {/* Start Date Picker Button */}
            <TouchableOpacity 
              onPress={() => {
                setShowStartCalendar(!showStartCalendar);
                setShowEndCalendar(false);
              }}
              style={styles.dateSelector}
            >
              <Input
                label="Start Date"
                value={startDate}
                onChangeText={() => {}}
                placeholder="YYYY-MM-DD"
                editable={false}
                style={{ marginBottom: 0 }}
              />
              <Ionicons name="calendar" size={20} color={Colors.primary} style={styles.calendarIcon} />
            </TouchableOpacity>

            {showStartCalendar && (
              <View style={[styles.calendarContainer, { borderColor: colors.border }]}>
                <Calendar
                  onDayPress={(day) => {
                    setStartDate(day.dateString);
                    setShowStartCalendar(false);
                  }}
                  markedDates={startDate ? { [startDate]: { selected: true, selectedColor: Colors.primary } } : {}}
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

            {/* End Date Picker Button */}
            <TouchableOpacity 
              onPress={() => {
                setShowEndCalendar(!showEndCalendar);
                setShowStartCalendar(false);
              }}
              style={[styles.dateSelector, { marginTop: Spacing.lg }]}
            >
              <Input
                label="End Date"
                value={endDate}
                onChangeText={() => {}}
                placeholder="YYYY-MM-DD"
                editable={false}
                style={{ marginBottom: 0 }}
              />
              <Ionicons name="calendar" size={20} color={Colors.primary} style={styles.calendarIcon} />
            </TouchableOpacity>

            {showEndCalendar && (
              <View style={[styles.calendarContainer, { borderColor: colors.border }]}>
                <Calendar
                  onDayPress={(day) => {
                    setEndDate(day.dateString);
                    setShowEndCalendar(false);
                  }}
                  markedDates={endDate ? { [endDate]: { selected: true, selectedColor: Colors.primary } } : {}}
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

            {totalDays > 0 && (
              <View style={[styles.infoBanner, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={[styles.infoBannerText, { color: colors.text }]}>
                  Total Days: <Text style={styles.boldText}>{totalDays}</Text>
                </Text>
              </View>
            )}

            {warning ? (
              <View style={[styles.warningBanner, { backgroundColor: colors.warningLight, borderColor: colors.warning }]}>
                <Ionicons name="warning" size={18} color={colors.warning} />
                <Text style={[styles.warningText, { color: colors.warning }]}>{warning}</Text>
              </View>
            ) : null}

            <Button
              title="Submit Leave"
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
              <Ionicons name="clipboard-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>No leave records found</Text>
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
  },
  calendarIcon: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.md + 4,
  },
  calendarContainer: {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  infoBanner: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  infoBannerText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.body,
  },
  boldText: {
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  warningText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.caption + 1,
    flex: 1,
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
  leaveTypeTitle: {
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
  cardInfoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  cardDays: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.small,
  },
  appliedDate: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.caption,
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
