import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { companyService } from '@/services/companyService';
import { Company } from '@/types/job.types';
import { COLORS } from '@/constants/theme';
import { SPACING } from '@/constants/spacing';

export default function AdminCompanyApproval() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyService.getCompanies(1, 100);
      setCompanies(data.result);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách công ty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await companyService.updateStatus(id, newStatus);
      Alert.alert('Thành công', `Đã ${newStatus ? 'kích hoạt' : 'khóa'} công ty`);
      loadCompanies(); // Reload list
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
    }
  };

  const renderItem = ({ item }: { item: Company }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>{item.industry} • {item.address}</Text>
        <View style={[styles.badge, { backgroundColor: item.active ? '#DEF7EC' : '#FDE8E8' }]}>
          <Text style={{ color: item.active ? '#03543F' : '#9B1C1C', fontSize: 12 }}>
            {item.active ? 'Đang hoạt động' : 'Chờ phê duyệt'}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: item.active ? COLORS.error : COLORS.primary }]}
        onPress={() => handleToggleStatus(item.id, !!item.active)}
      >
        <Text style={styles.buttonText}>{item.active ? 'Khóa' : 'Duyệt'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Quản lý Công ty', headerShadowVisible: false }} />
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={companies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Không có công ty nào</Text>}
          onRefresh={loadCompanies}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  list: { padding: SPACING.md },
  card: {
    backgroundColor: '#FFF',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  detail: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: SPACING.sm,
  },
  buttonText: { color: '#FFF', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 50, color: '#6B7280' }
});
