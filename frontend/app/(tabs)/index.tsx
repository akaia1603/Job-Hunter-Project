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
import { COLORS, SPACING, TYPOGRAPHY, SHADOW, BORDER_RADIUS } from '@constants/theme';

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
    { title: 'Việc làm', img: require('../../assets/images/ViecLam.jpg') },
    { title: 'TopCV Pro', img: require('../../assets/images/TopCVpro.jpg') },
    { title: 'Tạo CV', img: require('../../assets/images/Tạo CV.jpg') },
    { title: 'Công cụ', img: require('../../assets/images/Công cụ.jpg') },
    { title: 'Blog', img: require('../../assets/images/Blog.jpg') },
  ];

  const bannerImage = require('../../assets/images/Banner trên cùng.jpg');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />}
        stickyHeaderIndices={[1]}
      >
        {/* Top Banner with Image */}
        <View style={styles.bannerSection}>
          <Banner
            backgroundImage={bannerImage}
            style={styles.topBanner}
          />
        </View>

        {/* Header with greeting */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.userName}>Bạn đang tìm việc gì?</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar - Sticky Header index 1 */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color={COLORS.text.light} style={{ marginRight: SPACING.md }} />
            <TextInput
              style={styles.searchInput}
              placeholder="thực tập sinh"
              placeholderTextColor={COLORS.text.light}
            />
          </View>
        </View>

        {/* Quick Category Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.navIconsRow}
        >
          {categories.map((cat, idx) => (
            <TouchableOpacity key={idx} style={styles.navItem} activeOpacity={0.7}>
              <View style={styles.navIconBox}>
                <Image source={cat.img} style={styles.navImage} resizeMode="cover" />
              </View>
              <Text style={styles.navText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Suitable Jobs Section Header */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Gợi ý việc làm phù hợp</Text>
            </View>
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>Vuốt trái để bỏ việc làm không phù hợp</Text>
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

        {/* Premium Recruitment Banner */}
        <View style={styles.bannerCVWrap}>
          <Banner
            title="Tuyển dụng thêm từ công ty hàng đầu"
            subtitle="Hơn 20.000 NTD đang tìm kiếm ứng viên. Tạo CV ngay để NTD tìm thấy bạn!"
            buttonText="TẠO CV NGAY"
            onButtonPress={() => router.push('/cv-builder')}
            variant="primary"
          />
        </View>

        {/* Latest Jobs Section */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Việc làm mới nhất</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {latestJobs.slice(5, 10).map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onPress={() => router.push({ pathname: '/detail', params: { jobId: job.id } })}
            />
          ))}
        </View>

        {/* Featured Companies */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Công ty tiêu biểu</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={styles.seeAll}>Tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.companyScroll}>
            {latestJobs.slice(0, 4).map(job => (
              <TouchableOpacity key={`company-${job.id}`} style={styles.companyMiniCard} activeOpacity={0.8}>
                <View style={styles.companyMiniLogo}>
                  <Text style={styles.companyLetter}>{job.company.name.charAt(0)}</Text>
                </View>
                <Text style={styles.companyMiniName} numberOfLines={1}>{job.company.name}</Text>
                <Text style={styles.companyMiniJobs}>{Math.floor(Math.random() * 10) + 1} việc làm</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background.secondary 
  },
  bannerSection: {
    paddingHorizontal: SPACING.xxxl,
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  topBanner: {
    height: 150,
  },
  topHeader: {
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  greeting: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.secondary,
  },
  userName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapper: { 
    paddingHorizontal: SPACING.xxxl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    ...SHADOW.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xl,
  },
  searchInput: { 
    flex: 1, 
    ...TYPOGRAPHY.body1,
    color: COLORS.text.primary,
  },
  navIconsRow: { 
    paddingHorizontal: SPACING.xxxl, 
    paddingVertical: SPACING.xl,
    gap: SPACING.xl,
  },
  navItem: { 
    alignItems: 'center', 
    width: 70 
  },
  navIconBox: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: COLORS.white,
    ...SHADOW.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  navImage: { 
    width: '100%', 
    height: '100%' 
  },
  navText: { 
    ...TYPOGRAPHY.captionBold,
    color: COLORS.text.secondary, 
    textAlign: 'center',
    fontSize: 11,
  },
  sectionWrap: { 
    paddingHorizontal: SPACING.xxxl, 
    marginBottom: SPACING.xxxl 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.xl 
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionTitle: { 
    ...TYPOGRAPHY.h4, 
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  seeAll: { 
    ...TYPOGRAPHY.body2,
    color: COLORS.primary, 
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info + '10',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.info,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  infoText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.info,
    flex: 1,
  },
  bannerCVWrap: { 
    paddingHorizontal: SPACING.xxxl, 
    marginBottom: SPACING['7xl'],
  },
  companyScroll: {
    gap: SPACING.md,
  },
  companyMiniCard: {
    width: 140,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  companyMiniLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  companyLetter: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  companyMiniName: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  companyMiniJobs: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.light,
  },
});