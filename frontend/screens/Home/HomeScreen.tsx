// Home Screen
import { Job, PaginationResponse } from '@/types/index';
import { Header, JobCard, LoadingSpinner } from '@components/index';
import { COLORS, SPACING } from '@constants/theme';
import { useFetch } from '@hooks/index';
import { jobService } from '@services/jobService';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { isLoading, refetch } = useFetch(
    () =>
      jobService.getJobs({
        page: 1,
        limit: 20,
        search: searchQuery,
      }),
    {
      onSuccess: (data: PaginationResponse<Job>) => {
        setJobs(data.data);
      },
    }
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleJobPress = (job: Job) => {
    router.push(`/detail?jobId=${job.id}`);
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        if (job.isSaved) {
          await jobService.unsaveJob(jobId);
        } else {
          await jobService.saveJob(jobId);
        }
        // Update UI
        setJobs(jobs.map(j => 
          j.id === jobId ? { ...j, isSaved: !j.isSaved } : j
        ));
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    searchContainer: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.lg,
    },
    searchInput: {
      backgroundColor: COLORS.white,
      borderRadius: 24,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      fontSize: 14,
      color: COLORS.text.primary,
    },
    contentContainer: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.lg,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
    },
    emptyText: {
      fontSize: 16,
      color: COLORS.text.secondary,
      marginTop: SPACING.lg,
    },
  });

  if (isLoading && jobs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner fullScreen message="Loading jobs..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Find Jobs" />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          placeholderTextColor={COLORS.text.light}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 48 }}>🔍</Text>
          <Text style={styles.emptyText}>No jobs found</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => handleJobPress(item)}
              onSavePress={() => handleSaveJob(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;