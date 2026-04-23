// Job Detail Screen
import { Button, LoadingSpinner } from '@components/index';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/theme';
import { useFetch } from '@hooks/index';
import { jobService } from '@services/jobService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const JobDetailScreen: React.FC = () => {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const [isApplying, setIsApplying] = useState(false);

  const { data: job, isLoading, error } = useFetch(
    () => jobService.getJobById(jobId!),
    {
      enabled: !!jobId,
    }
  );

  const handleApply = async () => {
    if (!job) return;

    setIsApplying(true);
    try {
      await jobService.applyToJob(job.id);
      Alert.alert('Success', 'Application submitted successfully!');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to apply');
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
      // Refresh the job data
      // In a real app, you might want to update the local state or refetch
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner fullScreen message="Loading job details..." />
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Job not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company.name}</Text>
          <Text style={styles.location}>{job.location}</Text>
        </View>

        {/* Job Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Salary:</Text>
            <Text style={styles.value}>
              ${job.salary.min} - ${job.salary.max} {job.salary.currency}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{job.jobType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Level:</Text>
            <Text style={styles.value}>{job.level}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Posted:</Text>
            <Text style={styles.value}>{new Date(job.postedDate).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {job.requirements.map((req, idx) => (
              <Text key={idx} style={styles.description}>• {req}</Text>
            ))}
          </View>
        )}

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            {job.benefits.map((benefit, idx) => (
              <Text key={idx} style={styles.description}>• {benefit}</Text>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title={job.isSaved ? 'Unsave' : 'Save'}
          onPress={handleSaveJob}
          variant="outline"
          style={styles.saveButton}
        />
        <Button
          title={job.isApplied ? 'Applied' : 'Apply Now'}
          onPress={handleApply}
          isLoading={isApplying}
          disabled={job.isApplied}
          style={styles.applyButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
  },
  jobTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  companyName: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.xs,
  },
  location: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    opacity: 0.8,
  },
  section: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    width: 80,
  },
  value: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    flex: 1,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  saveButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  applyButton: {
    flex: 2,
    marginLeft: SPACING.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.error,
    marginBottom: SPACING.lg,
  },
});

export default JobDetailScreen;