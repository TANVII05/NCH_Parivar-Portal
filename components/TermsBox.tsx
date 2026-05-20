import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, BorderRadius, Typography, Spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { LOAN_TERMS } from '../constants/loanTerms';

export default function TermsBox() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Terms & Conditions
      </Text>
      <ScrollView
        style={[styles.scrollBox, { backgroundColor: colors.surfaceVariant }]}
        nestedScrollEnabled
        showsVerticalScrollIndicator
      >
        {LOAN_TERMS.map((term, index) => (
          <View key={index} style={styles.termItem}>
            <Text style={[styles.termNumber, { color: Colors.primary }]}>
              {index + 1}.
            </Text>
            <View style={styles.termTexts}>
              <Text style={[styles.termText, { color: colors.text }]}>
                {term.en}
              </Text>
              <Text style={[styles.termTextAlt, { color: colors.textSecondary }]}>
                {term.gu}
              </Text>
              <Text style={[styles.termTextAlt, { color: colors.textSecondary }]}>
                {term.hi}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  heading: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.bodyLarge,
    padding: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  scrollBox: {
    maxHeight: 300,
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  termNumber: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.body,
    minWidth: 20,
  },
  termTexts: {
    flex: 1,
    gap: 4,
  },
  termText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.small,
    lineHeight: 18,
  },
  termTextAlt: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.caption,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});
