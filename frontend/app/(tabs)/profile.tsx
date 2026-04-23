import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, StatusBar, Platform } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOW } from '@constants/theme';

export default function ProfileTab() {
  const [isLookingForJob, setIsLookingForJob] = useState(false);
  const [allowSearch, setAllowSearch] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      {/* Dynamic Header with Color */}
      <View style={styles.topBg}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Profile Card Floating */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={COLORS.text.light} />
              </View>
              <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.7}>
                <Ionicons name="camera" size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.userName}>Minh Quân Bùi</Text>
              <Text style={styles.userEmail}>minhquan.bui@example.com</Text>
              <View style={styles.idBadge}>
                <Text style={styles.idText}>ID: 8209039</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.premiumBanner} activeOpacity={0.9}>
            <View style={styles.premiumInfo}>
              <View style={styles.goldBadge}>
                <Ionicons name="star" size={10} color={COLORS.goldDark} />
                <Text style={styles.goldBadgeText}>PREMIUM</Text>
              </View>
              <Text style={styles.premiumTitle}>Nâng cấp để bứt phá sự nghiệp</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.goldDark} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statBox} activeOpacity={0.7}>
            <Text style={styles.statCount}>12</Text>
            <Text style={styles.statName}>Ứng tuyển</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statBox} activeOpacity={0.7}>
            <Text style={styles.statCount}>45</Text>
            <Text style={styles.statName}>Lượt xem</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statBox} activeOpacity={0.7}>
            <Text style={styles.statCount}>08</Text>
            <Text style={styles.statName}>Đã lưu</Text>
          </TouchableOpacity>
        </View>

        {/* Action Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CÀI ĐẶT TÌM VIỆC</Text>
          <View style={styles.menuGroup}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconWrap}>
                <Ionicons name="search" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabelText}>Đang tìm việc</Text>
                <Text style={styles.settingSub}>Cho phép NTD thấy hồ sơ của bạn</Text>
              </View>
              <Switch
                value={isLookingForJob}
                onValueChange={setIsLookingForJob}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={isLookingForJob ? COLORS.primary : COLORS.gray[200]}
              />
            </View>
            <View style={styles.dividerLine} />
            <View style={styles.settingRow}>
              <View style={styles.settingIconWrap}>
                <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabelText}>Cho phép tìm kiếm</Text>
                <Text style={styles.settingSub}>Hiển thị hồ sơ trong kết quả tìm kiếm</Text>
              </View>
              <Switch
                value={allowSearch}
                onValueChange={setAllowSearch}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={allowSearch ? COLORS.primary : COLORS.gray[200]}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TIỆN ÍCH HỒ SƠ</Text>
          <View style={styles.menuGroup}>
            {[
              { icon: 'document-text', label: 'CV đã tạo trên TopCV', count: '2' },
              { icon: 'cloud-upload', label: 'CV đã tải lên', count: '1' },
              { icon: 'create', label: 'Mẫu thư giới thiệu' },
            ].map((item, idx, arr) => (
              <React.Fragment key={idx}>
                <TouchableOpacity style={styles.menuRow} activeOpacity={0.6}>
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon as any} size={20} color={COLORS.text.secondary} />
                  </View>
                  <Text style={styles.menuRowLabel}>{item.label}</Text>
                  {item.count && <Text style={styles.menuCount}>{item.count}</Text>}
                  <Ionicons name="chevron-forward" size={16} color={COLORS.text.light} />
                </TouchableOpacity>
                {idx < arr.length - 1 && <View style={styles.dividerLine} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.secondary },
  topBg: { 
    backgroundColor: COLORS.primary, 
    height: 180, 
    paddingTop: StatusBar.currentHeight || 50,
    paddingHorizontal: SPACING.xxxl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.xxxl },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginTop: -60,
    ...SHADOW.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.xl,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  userMeta: { flex: 1 },
  userName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: 6,
  },
  idBadge: {
    backgroundColor: COLORS.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  idText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text.light,
  },
  premiumBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  premiumInfo: { flex: 1 },
  goldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 4,
  },
  goldBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.goldDark,
  },
  premiumTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxxl,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statCount: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginBottom: 2,
  },
  statName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.divider,
  },
  section: { marginBottom: SPACING.xxxl },
  sectionLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.text.light,
    fontSize: 10,
    marginBottom: SPACING.md,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  settingIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  settingText: { flex: 1 },
  settingLabelText: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  settingSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  dividerLine: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: SPACING.xl,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuRowLabel: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    color: COLORS.text.primary,
  },
  menuCount: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.error + '20',
    gap: 8,
  },
  logoutText: {
    ...TYPOGRAPHY.button,
    color: COLORS.error,
  },
});