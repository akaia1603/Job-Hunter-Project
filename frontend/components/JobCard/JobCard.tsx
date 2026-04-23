// JobCard component — Refined minimalist design
import { Job } from '@/types/job.types';
import { BORDER_RADIUS, COLORS, SHADOW, SPACING, TYPOGRAPHY } from '@constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import MatchScore from '../MatchScore/MatchScore';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onSavePress?: () => void;
  showMatchScore?: boolean;
  style?: ViewStyle;
}

const formatSalary = (salary: number): string => {
  if (salary >= 1000000) return (salary / 1000000).toFixed(0) + ' triệu';
  return new Intl.NumberFormat('vi-VN').format(salary);
};

const formatRelativeTime = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hôm nay';
  if (days === 1) return 'Hôm qua';
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  return `${Math.floor(days / 30)} tháng trước`;
};

const JobCard: React.FC<JobCardProps> = ({ job, onPress, onSavePress, showMatchScore = false, style }) => {
  return (
    <TouchableOpacity
      style={[styles.container, job.isPremium && styles.premiumContainer, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoPlaceholder, { backgroundColor: job.isPremium ? COLORS.goldLight : COLORS.primaryLight }]}>
            <Text style={[styles.logoLetter, { color: job.isPremium ? COLORS.goldDark : COLORS.primary }]}>
              {job.company.name?.charAt(0) || 'C'}
            </Text>
          </View>
          {job.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>★</Text>
            </View>
          )}
        </View>

        <View style={styles.jobInfo}>
          <View style={styles.companyRow}>
            <Text style={styles.companyName} numberOfLines={1}>{job.company.name}</Text>
            {job.isPremium && <Text style={styles.priorityLabel}>Ưu tiên</Text>}
          </View>
          <Text style={styles.jobTitle} numberOfLines={2}>{job.name}</Text>
        </View>

        <View style={styles.rightSection}>
          {showMatchScore && job.matchScore !== undefined ? (
            <MatchScore score={job.matchScore} size={38} showLabel={false} />
          ) : (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={onSavePress}
              activeOpacity={0.6}
            >
              <Text style={[styles.saveIcon, job.isSaved && styles.savedIcon]}>
                {job.isSaved ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Info Row */}
      <View style={styles.infoRow}>
        <Text style={styles.salary}>{formatSalary(job.salary)} VND</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.location}>{job.location}</Text>
      </View>

      {/* Tags Row */}
      <View style={styles.tagsRow}>
        {job.isUrgent && (
          <View style={styles.urgentTag}>
            <Text style={styles.urgentText}>Tuyển gấp</Text>
          </View>
        )}
        <View style={styles.tag}>
          <Text style={styles.tagText}>{job.level}</Text>
        </View>
        {job.skills.slice(0, 1).map(skill => (
          <View key={skill.id} style={styles.tag}>
            <Text style={styles.tagText}>{skill.name}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.time}>{formatRelativeTime(job.createdAt)}</Text>
        {job.isPremium && (
          <View style={styles.premiumIndicator}>
            <Text style={styles.premiumText}>Ưu tiên</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  premiumContainer: {
    borderColor: COLORS.gold + '30',
    backgroundColor: '#FFFCF5', // Very subtle gold tint
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  logoContainer: {
    marginRight: SPACING.md,
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.gold,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  premiumBadgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priorityLabel: {
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.gold + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gold,
    textTransform: 'uppercase',
  },
  logoPlaceholder: {
    width: 48, 
    height: 48, 
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  logoLetter: { 
    fontSize: 20, 
    fontWeight: '700',
  },
  jobInfo: { 
    flex: 1, 
    marginRight: SPACING.sm,
  },
  companyName: { 
    ...TYPOGRAPHY.label,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  jobTitle: { 
    ...TYPOGRAPHY.h4, 
    color: COLORS.text.primary,
  },
  rightSection: { 
    alignItems: 'flex-end',
  },
  saveButton: { 
    width: 32, 
    height: 32, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  saveIcon: { 
    fontSize: 22, 
    color: COLORS.text.light 
  },
  savedIcon: { 
    color: COLORS.gold 
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  salary: { 
    ...TYPOGRAPHY.body2,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dot: {
    marginHorizontal: SPACING.sm,
    color: COLORS.text.light,
  },
  location: { 
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
  },
  tagsRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  urgentTag: {
    backgroundColor: COLORS.error + '10',
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: BORDER_RADIUS.sm,
  },
  urgentText: { 
    fontSize: 10, 
    fontWeight: '700', 
    color: COLORS.error,
    textTransform: 'uppercase',
  },
  tag: {
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: { 
    fontSize: 10, 
    fontWeight: '600', 
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  time: { 
    ...TYPOGRAPHY.caption, 
    color: COLORS.text.light 
  },
  premiumIndicator: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
});

export default JobCard;