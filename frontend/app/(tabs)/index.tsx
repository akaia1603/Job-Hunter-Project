import { Job } from '@/types/job.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
} from 'react-native';
import { jobService } from '@services/jobService';
import { LoadingSpinner, JobCard, Banner } from '@components/index';
import { COLORS, SHADOW } from '@constants/theme';

export default function HomeTab() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);

  const loadData = useCallback(async () => {
    try {
      const latest = await jobService.getLatestJobs(10);
      setLatestJobs(latest);
    } catch (e) {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) return <LoadingSpinner fullScreen message="Đang tải..." />;

  const categories = [
    { title: 'Việc làm', img: require('../../assets/images/ViecLam.jpg'), route: '/(tabs)' },
    { title: 'TopCV Pro', img: require('../../assets/images/TopCVpro.jpg'), route: '/premium' },
    { title: 'Tạo CV', img: require('../../assets/images/Tạo CV.jpg'), route: '/cv-builder' },
    { title: 'Công cụ', img: require('../../assets/images/Công cụ.jpg'), route: '/account-settings' },
    { title: 'Blog', img: require('../../assets/images/Blog.jpg'), route: null },
  ];

  const bannerImage = require('../../assets/images/Banner trên cùng mới.jpg');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.white]} />}
      >
        {/* Banner Wrapper - Full Cover with Rounded Corners */}
        <View style={styles.bannerWrapper}>
          <Image 
            source={bannerImage}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          
          {/* Content Overlay */}
          <View style={styles.headerOverlay}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeftContainer}>
                {/* Space for Logo */}
              </View>
              <View style={styles.headerRightContainer}>
                <TouchableOpacity style={styles.avatar}>
                  <Text style={styles.avatarText}>TJ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/(tabs)/notifications')}>
                  <Ionicons name="notifications-outline" size={18} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar nested inside Banner */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={16} color={COLORS.text.light} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInputField}
                placeholder="Tìm kiếm việc làm, công ty..."
                placeholderTextColor={COLORS.text.light}
              />
            </View>
          </View>
        </View>

        {/* Quick Category Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.navIconsRow}
        >
          {categories.map((cat, idx) => (
            <TouchableOpacity key={idx} style={styles.navItem} activeOpacity={0.7} onPress={() => cat.route && router.push(cat.route as any)}>
              <View style={styles.navIconBox}>
                <Image source={cat.img} style={styles.navImage} resizeMode="cover" />
              </View>
              <Text style={styles.navText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Suitable Jobs Section */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Gợi ý việc làm phù hợp</Text>
            </View>
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>Dựa trên hồ sơ và mong muốn của bạn</Text>
          </View>

          {/* Job Cards */}
          {latestJobs.slice(0, 5).map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onPress={() => router.push({ pathname: '/detail', params: { jobId: job.id } })}
              showMatchScore 
            />
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background.secondary 
  },
  bannerWrapper: {
    height: 100, // Chiều cao tối ưu để ảnh phủ đẹp
    position: 'relative',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden', // Quan trọng: để ảnh không tràn ra ngoài góc bo
    backgroundColor: COLORS.primary,
    ...SHADOW.sm,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerOverlay: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.05)', // Overlay cực nhẹ để ảnh thật nhất
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeftContainer: {
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  notificationBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
    ...SHADOW.sm,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInputField: { 
    flex: 1, 
    fontSize: 12,
    color: COLORS.text.primary,
  },
  navIconsRow: { 
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
    backgroundColor: COLORS.background.secondary,
  },
  navItem: { 
    alignItems: 'center', 
    width: 60 
  },
  navIconBox: { 
    width: 42, 
    height: 42, 
    borderRadius: 10, 
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    overflow: 'hidden',
    ...SHADOW.sm,
  },
  navImage: { 
    width: '100%', 
    height: '100%' 
  },
  navText: { 
    fontSize: 11,
    color: COLORS.text.primary, 
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionWrap: { 
    paddingHorizontal: 16,
    marginBottom: 16 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: { 
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: '700',
  },
  seeAll: { 
    fontSize: 12,
    color: COLORS.primary, 
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 11,
    color: COLORS.primary,
    flex: 1,
  },
  bottomSpacer: {
    height: 40,
  },
});
