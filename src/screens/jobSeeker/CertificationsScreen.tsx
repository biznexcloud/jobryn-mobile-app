import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  FlatList,
  StatusBar,
  StyleSheet,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Plus,
  Pencil,
  GraduationCap,
  Trash2,
  ChevronLeft,
} from 'lucide-react-native';
import { PortfolioService } from '../../services/api/portfolio';
import { moderateScale, verticalScale } from '../../utils/responsive';
import { ScreenWrapper, Box, HStack, Text } from '../../components/ui';

const BLUE = '#4F46E5';

export default function CertificationsScreen({ navigation }: { navigation?: any }) {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const resp = await PortfolioService.getCertifications();
      setCerts(resp?.results || []);
    } catch (e) {
      console.warn('Load certs error:', e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCerts();
    setRefreshing(false);
  };

  const removeCert = async (id: string) => {
    try {
      await PortfolioService.deleteCertification(id);
      setCerts(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.warn('Delete cert error:', e);
      alert('Failed to delete certification');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Box style={styles.card}>
      <Box style={styles.certIconWrap}>
        <GraduationCap size={moderateScale(24)} color={BLUE} />
      </Box>
      <Box style={styles.certInfo}>
        <Text style={styles.certName}>{item.name}</Text>
        <Text style={styles.certIssuer}>{item.issuing_organization}</Text>
        <Text style={styles.certDate}>
          Issued {item.issue_date} {item.expiration_date ? `· Expires ${item.expiration_date}` : ''}
        </Text>
      </Box>
      <Box style={styles.certActions}>
        <TouchableOpacity
          style={styles.actionIconBtn}
          onPress={() => navigation?.navigate('AddCertification', { certification: item })}
        >
          <Pencil size={moderateScale(16)} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIconBtn} onPress={() => removeCert(item.id)}>
          <Trash2 size={moderateScale(16)} color="#EF4444" />
        </TouchableOpacity>
      </Box>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop safeAreaBottom backgroundColor="#FFFFFF">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <Box px={16} pt={moderateScale(12)} pb={16} bg="white" borderBottom={1} borderColor="#F3F4F6">
        <HStack items="center" justify="space-between">
           <HStack items="center">
              <TouchableOpacity onPress={() => navigation?.goBack()} style={{ padding: 4 }}>
                 <ChevronLeft size={28} color="#111827" />
              </TouchableOpacity>
              <Text fontSize={22} fontWeight="800" color="#111827" ml={16}>Certifications</Text>
           </HStack>
           <TouchableOpacity
             style={styles.addBtn}
             onPress={() => navigation?.navigate('AddCertification')}
           >
             <Plus size={moderateScale(18)} color="#FFFFFF" strokeWidth={2.5} />
             <Text style={styles.addBtnText}>Add</Text>
           </TouchableOpacity>
        </HStack>
      </Box>

      {loading && certs.length === 0 ? (
        <Box style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={BLUE} />
        </Box>
      ) : (
        <FlatList
          data={certs}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Box style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />
          }
          ListEmptyComponent={
            <Box style={styles.emptyWrap}>
              <GraduationCap size={moderateScale(40)} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No certifications yet</Text>
              <Text style={styles.emptySub}>Add your certificates to stand out to recruiters.</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation?.navigate('AddCertification')}
              >
                <Text style={styles.emptyBtnText}>+ Add Certification</Text>
              </TouchableOpacity>
            </Box>
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16), paddingTop: verticalScale(16), paddingBottom: verticalScale(14),
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: moderateScale(22), fontWeight: '800', color: '#111827' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: BLUE, borderRadius: moderateScale(22), paddingHorizontal: moderateScale(16), paddingVertical: verticalScale(9) },
  addBtnText: { color: '#FFFFFF', fontSize: moderateScale(13), fontWeight: '700', marginLeft: moderateScale(6) },
  listContent: { paddingHorizontal: moderateScale(16), paddingTop: verticalScale(8), paddingBottom: verticalScale(40) },
  separator: { height: 1, backgroundColor: '#F3F4F6' },
  card: { flexDirection: 'row', alignItems: 'center', paddingVertical: verticalScale(18), backgroundColor: '#FFFFFF' },
  certIconWrap: { width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(12), backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  certInfo: { flex: 1, marginLeft: moderateScale(14) },
  certName: { fontSize: moderateScale(15), fontWeight: '700', color: '#111827', marginBottom: verticalScale(2) },
  certIssuer: { fontSize: moderateScale(13), color: '#374151', marginBottom: verticalScale(2) },
  certDate: { fontSize: moderateScale(11), color: '#9CA3AF' },
  certActions: { flexDirection: 'row', gap: moderateScale(4) },
  actionIconBtn: { width: moderateScale(34), height: moderateScale(34), borderRadius: moderateScale(17), backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyWrap: { paddingTop: verticalScale(80), alignItems: 'center', paddingHorizontal: moderateScale(40) },
  emptyTitle: { fontSize: moderateScale(17), fontWeight: '700', color: '#111827', marginTop: verticalScale(16), marginBottom: verticalScale(6) },
  emptySub: { fontSize: moderateScale(13), color: '#9CA3AF', textAlign: 'center', lineHeight: moderateScale(20), marginBottom: verticalScale(20) },
  emptyBtn: { borderWidth: 1.5, borderColor: BLUE, paddingHorizontal: moderateScale(24), paddingVertical: verticalScale(11), borderRadius: moderateScale(22) },
  emptyBtnText: { color: BLUE, fontSize: moderateScale(14), fontWeight: '700' },
});





