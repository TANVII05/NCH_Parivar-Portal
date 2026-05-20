import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
  searchable?: boolean;
}

export default function Select({
  label,
  value,
  options,
  onSelect,
  placeholder,
  error,
  searchable = true,
}: SelectProps) {
  const { colors, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = searchQuery
    ? options.filter((opt) =>
        opt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={[
          styles.selectButton,
          {
            backgroundColor: colors.inputBg,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectText,
            {
              color: value ? colors.text : colors.textTertiary,
            },
          ]}
          numberOfLines={1}
        >
          {value || placeholder || `Select ${label.toLowerCase()}`}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}

      <Modal visible={isOpen} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <SafeAreaView
            style={[
              styles.modalContent,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {label}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View
                style={[
                  styles.searchWrapper,
                  { backgroundColor: colors.inputBg, borderColor: colors.border },
                ]}
              >
                <Ionicons name="search" size={18} color={colors.textTertiary} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search..."
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.searchInput, { color: colors.text }]}
                  autoFocus
                />
              </View>
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor:
                        item === value
                          ? isDark
                            ? Colors.primaryDark + '40'
                            : Colors.primary + '10'
                          : 'transparent',
                      borderBottomColor: colors.borderLight,
                    },
                  ]}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          item === value ? Colors.primary : colors.text,
                        fontFamily:
                          item === value
                            ? Typography.fontFamily.semiBold
                            : Typography.fontFamily.regular,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {item === value && (
                    <Ionicons name="checkmark" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                    No options found
                  </Text>
                </View>
              }
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.body,
    marginBottom: Spacing.sm,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 4,
  },
  selectText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.body,
    flex: 1,
    marginRight: Spacing.sm,
  },
  errorText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.small,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
    minHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.subtitle,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.body,
    paddingVertical: Spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 0.5,
  },
  optionText: {
    fontSize: Typography.sizes.body,
    flex: 1,
  },
  emptyList: {
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.body,
  },
});
