// Job Detail Screen — Matching the "beautiful" TopCV-like aesthetic
import { Button, LoadingSpinner, MatchScore, PremiumBadge } from '@components/index';
import { BORDER_RADIUS, COLORS, SHADOW, SPACING, TYPOGRAPHY } from '@constants/theme';
import { useAuth, useFetch } from '@hooks/index';
import { jobService } from '@services/jobService';
import { recommendationService } from '@services/recommendationService';
import { Job } from '@/types/job.types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const formatSalary = (salary: number): string => {
  if (salary === 0) return 'Thoả thuận';
  if (salary >= 1000000) return (salary / 1000000).toFixed(0) + ' triệu';
  return new Intl.NumberFormat('vi-VN').format(salary);
};

const JobDetailScreen: React.FC = () => {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { state } = useAuth();
  
  const [job, setJob] = useState<Job | null>(null);
  const [matchInfo, setMatchInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadData();
    }
  }, [jobId]);

  const loadData = async () => {
    try {
      const id = parseInt(jobId as string, 10);
      const [jobData, matchData] = await Promise.all([
        jobService.getJobDetail(id),
        recommendationService.getMatchScore(id).catch(() => null),
      ]);
      setJob(jobData);
      setMatchInfo(matchData);
    } catch (error) {
      console.error('Error loading job detail:', error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết công việc');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;
    if (!state.isAuthenticated) {
      router.push('/signup'); // Or login
      return;
    }

    setIsApplying(true);
    try {
      await jobService.applyJob({
        jobId: job.id,
        email: state.user?.email || 'user@example.com',
        url: '/uploads/cv_demo.pdf',
      });
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
      if (job.isSaved) {
        await jobService.unsaveJob(job.id);
      } else {
        await jobService.saveJob(job.id);
      }
      setJob(prev => prev ? { ...prev, isSaved: !prev.isSaved } : null);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  if (isLoading || !job) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LoadingSpinner fullScreen message="Đang tải chi tiết..." />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Custom Header Nav */}
      <SafeAreaView edges={['top']} style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>Chi tiết công việc</Text>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="share-social-outline" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.jobTitle}>{job.name}</Text>
          <View style={styles.salaryRow}>
            <Text style={styles.salary}>{formatSalary(job.salary)} VND</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{job.level}</Text>
            </View>
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.text.secondary} />
            <Text style={styles.locationText}>{job.location}</Text>
          </View>

          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={16} color={COLORS.text.light} />
            <Text style={styles.timeText}>Hạn nộp: 30 ngày tới</Text>
          </View>
        </View>

        {/* AI Analysis Card */}
        {matchInfo && (
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <View>
                <Text style={styles.aiTitle}>AI Analysis</Text>
                <Text style={styles.aiSubtitle}>Mức độ phù hợp với hồ sơ</Text>
              </View>
              <MatchScore score={matchInfo.matchScore} size={48} />
            </View>
            <View style={styles.aiStats}>
              <View style={styles.aiStatItem}>
                <Text style={styles.aiStatValue}>{matchInfo.matchedSkills.length}</Text>
                <Text style={styles.aiStatLabel}>Kỹ năng khớp</Text>
              </View>
              <View style={styles.aiStatDivider} />
              <View style={styles.aiStatItem}>
                <Text style={styles.aiStatValue}>{matchInfo.missingSkills.length}</Text>
                <Text style={styles.aiStatLabel}>Kỹ năng thiếu</Text>
              </View>
            </View>
          </View>
        )}

        {/* Company Card */}
        <TouchableOpacity 
          style={styles.companyCard}
          onPress={() => router.push(`/company-detail?companyId=${job.company.id}`)}
        >
          <View style={styles.logoContainer}>
            {job.company.logo ? (
              <Image source={{ uri: job.company.logo }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoLetter}>{job.company.name.charAt(0)}</Text>
              </View>
            )}
          </View>
          <View style={styles.companyInfo}>
            <View style={styles.companyHeader}>
              <Text style={styles.companyName} numberOfLines={1}>{job.company.name}</Text>
              {job.company.isPremium && <PremiumBadge tier={job.company.premiumTier} size="small" />}
            </View>
            <Text style={styles.viewCompany}>Xem trang công ty ›</Text>
          </View>
        </TouchableOpacity>

        {/* Job Content Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả công việc</Text>
          <Text style={styles.sectionContent}>{job.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yêu cầu kỹ năng</Text>
          <View style={styles.skillsRow}>
            {job.skills.map(skill => (
              <View key={skill.id} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quyền lợi</Text>
          <Text style={styles.sectionContent}>
            • Môi trường làm việc chuyên nghiệp, năng động.{'\n'}
            • Được đào tạo bài bản và cơ hội thăng tiến.{'\n'}
            • Chế độ đãi ngộ tốt theo quy định công ty.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveBtn, job.isSaved && styles.saveBtnActive]} 
          onPress={handleSaveJob}
        >
          <Ionicons 
            name={job.isSaved ? "heart" : "heart-outline"} 
            size={28} 
            color={job.isSaved ? COLORS.primary : COLORS.text.secondary} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.applyBtn, job.isApplied && styles.appliedBtn]} 
          onPress={handleApply}
          disabled={job.isApplied || isApplying}
        >
          <Text style={styles.applyBtnText}>
            {job.isApplied ? 'ĐÃ ỨNG TUYỂN' : 'ỨNG TUYỂN NGAY'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    ...SHADOW.sm,
    zIndex: 10,
  },
  navBtn: {
    padding: SPACING.sm,
  },
  navTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
  },
  jobTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  salary: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    fontWeight: '700',
  },
  tag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.light,
  },
  aiCard: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  aiTitle: {
    ...TYPOGRAPHY.h4,
    color: '#2E7D32',
  },
  aiSubtitle: {
    ...TYPOGRAPHY.caption,
    color: '#43A047',
  },
  aiStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  aiStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
  },
  aiStatLabel: {
    fontSize: 12,
    color: '#43A047',
  },
  aiStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#C8E6C9',
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  logoContainer: {
    marginRight: SPACING.lg,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  companyInfo: {
    flex: 1,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  companyName: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.text.primary,
    flexShrink: 1,
  },
  viewCompany: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    paddingLeft: SPACING.md,
  },
  sectionContent: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  skillTag: {
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  skillText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    gap: SPACING.md,
    ...SHADOW.md,
  },
  saveBtn: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  applyBtn: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appliedBtn: {
    backgroundColor: COLORS.text.light,
  },
  applyBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default JobDetailScreen;
