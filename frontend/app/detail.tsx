// Job Detail Screen - Refined minimalist design
import { Button, LoadingSpinner, MatchScore, PremiumBadge, SkillTag } from '@components/index';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOW } from '@constants/theme';
import { useAuth } from '@hooks/index';
import { jobService } from '@services/jobService';
import { recommendationService } from '@services/recommendationService';
import { Job } from '@/types/job.types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const formatSalary = (salary: number) => {
  if (salary >= 1000000) return (salary / 1000000).toFixed(0) + ' triệu';
  return new Intl.NumberFormat('vi-VN').format(salary);
};

export default function JobDetailScreen() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { state } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [matchInfo, setMatchInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => { if (jobId) loadData(); }, [jobId]);

  const loadData = async () => {
    try {
      const id = parseInt(jobId as string, 10);
      const [jobData, matchData] = await Promise.all([
        jobService.getJobDetail(id),
        recommendationService.getMatchScore(id),
      ]);
      setJob(jobData);
      setMatchInfo(matchData);
    } catch (error) {
      console.error('Error loading job detail:', error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết công việc');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;
    if (!state.isAuthenticated) { router.push('/'); return; }
    setIsApplying(true);
    try {
      await jobService.applyJob({ jobId: job.id, email: state.user?.email || 'demo@topjob.vn', url: '/uploads/cv_demo.pdf' });
      Alert.alert('Thành công', 'Đã nộp đơn ứng tuyển thành công!');
      loadData();
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể ứng tuyển');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!job) return;
    try {
      if (job.isSaved) { await jobService.unsaveJob(job.id); } else { await jobService.saveJob(job.id); }
      setJob(prev => prev ? { ...prev, isSaved: !prev.isSaved } : null);
    } catch (error) { console.error('Error saving job:', error); }
  };

  if (loading || !job) return <LoadingSpinner fullScreen message="Đang tải..." />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Custom Header Nav */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn}>
          <Ionicons name="share-outline" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>{job.company.name?.charAt(0) || 'C'}</Text>
            </View>
            <View style={styles.companyMeta}>
              <Text style={styles.companyName}>{job.company.name}</Text>
              {job.company.isPremium && <PremiumBadge tier={job.company.premiumTier} size="small" />}
            </View>
          </View>
          
          <Text style={styles.title}>{job.name}</Text>
          <View style={styles.salaryRow}>
            <Text style={styles.salary}>{formatSalary(job.salary)} VND</Text>
            <View style={styles.locationBadge}>
              <Ionicons name="location-outline" size={14} color={COLORS.text.secondary} />
              <Text style={styles.locationText}>{job.location.split(',')[0]}</Text>
            </View>
          </View>
        </View>

        {/* AI Analysis Card - Minimalist & Elegant */}
        {matchInfo && (
          <View style={styles.aiSection}>
            <View style={styles.aiHeader}>
              <View>
                <Text style={styles.aiTitle}>Phân tích mức độ phù hợp</Text>
                <Text style={styles.aiSubtitle}>Dựa trên hồ sơ của bạn</Text>
              </View>
              <MatchScore score={matchInfo.matchScore} size={44} />
            </View>
            <View style={styles.skillsRow}>
              {matchInfo.matchedSkills.slice(0, 3).map((s: string, idx: number) => (
                <View key={`matched-${idx}`} style={styles.skillMatchTag}>
                  <Ionicons name="checkmark-circle" size={12} color={COLORS.primary} />
                  <Text style={styles.skillMatchText}>{s}</Text>
                </View>
              ))}
              {matchInfo.missingSkills.length > 0 && (
                <View style={styles.skillMissingTag}>
                  <Text style={styles.skillMissingText}>+{matchInfo.missingSkills.length} kỹ năng khác</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>CẤP BẬC</Text>
            <Text style={styles.statValue}>{job.level}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>SỐ LƯỢNG</Text>
            <Text style={styles.statValue}>{job.quantity} người</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>HẾT HẠN</Text>
            <Text style={styles.statValue}>30 ngày</Text>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeading}>Mô tả công việc</Text>
          <Text style={styles.descriptionText}>{job.description}</Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionHeading}>Về công ty</Text>
          <TouchableOpacity 
            style={styles.companyCard} 
            onPress={() => router.push(`/company-detail?companyId=${job.company.id}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.companyCardTitle}>{job.company.name}</Text>
            <Text style={styles.companyCardDesc} numberOfLines={3}>{job.company.description}</Text>
            <View style={styles.companyCardFooter}>
              <Text style={styles.readMoreText}>Xem chi tiết công ty</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.saveBtn, job.isSaved && styles.saveBtnActive]} 
          onPress={handleSaveJob}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={job.isSaved ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={job.isSaved ? COLORS.primary : COLORS.text.secondary} 
          />
        </TouchableOpacity>
        <Button
          title={job.isApplied ? 'ĐÃ ỨNG TUYỂN' : 'ỨNG TUYỂN NGAY'}
          onPress={handleApply}
          isLoading={isApplying}
          disabled={job.isApplied}
          style={styles.applyBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background.primary 
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    height: Platform.OS === 'ios' ? 100 : 70,
    backgroundColor: COLORS.background.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.xxxl,
  },
  header: { 
    paddingVertical: SPACING.xxl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    width: 52, 
    height: 52, 
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  logoText: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: COLORS.primary 
  },
  companyMeta: {
    flex: 1,
  },
  companyName: { 
    ...TYPOGRAPHY.body1, 
    color: COLORS.text.secondary, 
    fontWeight: '600',
    marginBottom: 4,
  },
  title: { 
    ...TYPOGRAPHY.h1, 
    color: COLORS.text.primary, 
    marginBottom: SPACING.lg,
    lineHeight: 40,
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salary: { 
    ...TYPOGRAPHY.h3, 
    color: COLORS.primary,
    fontWeight: '700',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
  },
  locationText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.text.secondary,
  },
  aiSection: {
    marginVertical: SPACING.xl,
    padding: SPACING.xl,
    backgroundColor: '#F7FCF9',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + '10',
  },
  aiHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.xl 
  },
  aiTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  aiSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  skillsRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  skillMatchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
    gap: 4,
  },
  skillMatchText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
    fontSize: 11,
  },
  skillMissingTag: {
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  skillMissingText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.light,
    fontSize: 11,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.xl,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.xxxl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.divider,
  },
  statLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.text.light,
    fontSize: 10,
    marginBottom: 4,
  },
  statValue: {
    ...TYPOGRAPHY.body2,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  contentSection: {
    marginBottom: SPACING.xxxl,
  },
  sectionHeading: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  descriptionText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.secondary,
    lineHeight: 28,
  },
  companyCard: {
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  companyCardTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  companyCardDesc: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  companyCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    ...TYPOGRAPHY.interactiveSmall,
    color: COLORS.primary,
  },
  bottomBar: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0,
    flexDirection: 'row', 
    paddingHorizontal: SPACING.xxxl,
    paddingTop: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: COLORS.white, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.border,
  },
  saveBtn: {
    width: 56, 
    height: 56, 
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.secondary,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: SPACING.lg,
  },
  saveBtnActive: { 
    backgroundColor: COLORS.primaryLight,
  },
  applyBtn: { 
    flex: 1, 
    height: 56 
  },
});