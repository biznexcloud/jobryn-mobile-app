import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from '../../utils/responsive';
import { ScreenWrapper, Text, Heading, Box, VStack, HStack } from '../../components/ui';
import {
  CreditCard,
  ArrowUp,
  ArrowDown,
  BarChart3,
  ShieldCheck,
  MoreHorizontal,
  ChevronLeft,
} from 'lucide-react-native';
import { BillingService } from '../../services/api/billing';
import { LinearGradient } from 'expo-linear-gradient';

const BLUE = '#4F46E5';

export default function WalletScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => { loadWallet(); }, []);

  const loadWallet = async () => {
    setRefreshing(true);
    try {
      const resp = await BillingService.getWallet();
      setWallet(resp);
    } catch (err) {
      console.warn('Wallet fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const DUMMY_TRANSACTIONS = [
     { id: 1, type: 'outgoing', label: 'Premium Subscription', date: 'Oct 12, 2026', amount: '$29.00' },
     { id: 2, type: 'incoming', label: 'Wallet Topup', date: 'Oct 05, 2026', amount: '$50.00' },
     { id: 3, type: 'outgoing', label: 'Course Enrollment', date: 'Sep 28, 2026', amount: '$15.00' },
  ];

  if (loading) {
    return (
      <ScreenWrapper style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={BLUE} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="#F9FAFB">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadWallet} tintColor={BLUE} />}
      >
        <LinearGradient colors={['#1E293B', '#111827']} style={[styles.header, { paddingTop: insets.top + verticalScale(20) }]}>
          <View style={styles.headerTop}>
             <HStack items="center">
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnHeader}>
                   <ChevronLeft size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Heading style={[styles.headerTitle, { marginLeft: 12 }]}>My Wallet</Heading>
             </HStack>
             <TouchableOpacity style={styles.moreBtn}>
                <MoreHorizontal size={24} color="#FFFFFF" />
             </TouchableOpacity>
          </View>
          
          {/* Balance Card */}
          <LinearGradient colors={[BLUE, '#1D4ED8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
               <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
               <CreditCard size={24} color="rgba(255,255,255,0.8)" strokeWidth={2} />
            </View>
            <Text style={styles.balanceAmount}>{wallet?.balance || '$145.00'}</Text>
            <View style={styles.balanceFooter}>
               <Text style={styles.cardNumber}>**** **** **** 4210</Text>
               <View style={styles.chip} />
            </View>
          </LinearGradient>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.actionRow}>
             <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('TopUp')}>
                <View style={[styles.actionIcon, { backgroundColor: '#F0FDFA' }]}><ArrowDown size={24} color="#14B8A6" /></View>
                <Text style={styles.actionLabel}>Top Up</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.actionItem}>
                <View style={[styles.actionIcon, { backgroundColor: '#FEF2F2' }]}><ArrowUp size={24} color="#EF4444" /></View>
                <Text style={styles.actionLabel}>Transfer</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.actionItem}>
                <View style={[styles.actionIcon, { backgroundColor: '#F0F9FF' }]}><BarChart3 size={24} color="#0EA5E9" /></View>
                <Text style={styles.actionLabel}>Analytics</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.actionItem}>
                <View style={[styles.actionIcon, { backgroundColor: '#F5F3FF' }]}><ShieldCheck size={24} color="#8B5CF6" /></View>
                <Text style={styles.actionLabel}>Plans</Text>
             </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
          </View>

          {DUMMY_TRANSACTIONS.map((tx) => (
             <TouchableOpacity key={tx.id} style={styles.txRow} activeOpacity={0.7}>
                <View style={[styles.txIconWrap, { backgroundColor: tx.type === 'incoming' ? '#F0FDFA' : '#FEF2F2' }]}>
                   {tx.type === 'incoming' ? <ArrowDown size={20} color="#14B8A6" /> : <ArrowUp size={20} color="#EF4444" />}
                </View>
                <View style={styles.txInfo}>
                   <Text style={styles.txTitle}>{tx.label}</Text>
                   <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === 'incoming' ? '#14B8A6' : '#EF4444' }]}>
                   {tx.type === 'incoming' ? '+' : '-'}{tx.amount}
                </Text>
             </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(60),
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { color: '#FFFFFF', fontSize: moderateScale(24), fontWeight: '900' },
  backBtnHeader: { padding: 4 },
  moreBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  balanceCard: {
    height: verticalScale(186), borderRadius: 24, padding: 24,
    shadowColor: BLUE, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 15,
  },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  balanceLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  balanceAmount: { color: '#FFFFFF', fontSize: moderateScale(36), fontWeight: '900', letterSpacing: -1 },
  balanceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  cardNumber: { color: '#FFFFFF', opacity: 0.8, fontSize: 14, fontWeight: '600', letterSpacing: 2 },
  chip: { width: 44, height: 32, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  content: { paddingHorizontal: moderateScale(16), paddingTop: verticalScale(40), paddingBottom: verticalScale(100) },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  actionItem: { alignItems: 'center', gap: 10 },
  actionIcon: { width: moderateScale(56), height: moderateScale(56), borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { color: '#1E293B', fontSize: 12, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sectionTitle: { fontSize: moderateScale(18), fontWeight: '800', color: '#1E293B' },
  seeAllText: { fontSize: 13, color: BLUE, fontWeight: '700' },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, marginBottom: 12, elevation: 1 },
  txIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, marginLeft: 16 },
  txTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  txDate: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '800' },
});
