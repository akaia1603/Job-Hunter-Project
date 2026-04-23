// Saved Jobs Screen
import { JobCard, LoadingSpinner } from '@components/index';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/theme';
import { jobService } from '@services/jobService';
import { Job } from '@/types/job.types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SavedJobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const savedJobs = await jobService.getSavedJobs();
      setJobs(savedJobs);
    } catch (error) {
      console.error('Error fetching saved jobs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveJob = async (job: Job) => {
    try {
      await jobService.unsaveJob(job.id);
      loadData();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Việc làm đã lưu</Text>
        <Text style={styles.headerSubtitle}>Bạn đã lưu {jobs.length} việc làm</Text>
      </View>

      <View style={styles.list}>
        {jobs.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyIconText}>0</Text>
            </View>
            <Text style={styles.emptyText}>Bạn chưa lưu việc làm nào.</Text>
          </View>
        ) : (
          jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => router.push(`/detail?jobId=${job.id}`)}
              onSavePress={() => handleSaveJob(job)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.secondary },
  header: { padding: SPACING.lg, backgroundColor: COLORS.white, paddingBottom: SPACING.xl },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.text.primary, marginBottom: 4 },
  headerSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.text.secondary },
  list: { padding: SPACING.lg },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emptyIconText: { fontSize: 24, fontWeight: '700', color: COLORS.text.light },
  emptyText: { ...TYPOGRAPHY.body2, color: COLORS.text.secondary },
});
