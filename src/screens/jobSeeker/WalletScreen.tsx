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
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';
import { BillingService } from '../../services/api/billing';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_TRANSACTIONS, MOCK_INVOICES } from '../../constants/MockData';

const BLUE = '#4F46E5';
const SOFT_BG = '#F8FAFC';

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



  if (loading) {
    return (
      <ScreenWrapper style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={BLUE} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={SOFT_BG}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadWallet} tintColor={BLUE} />}
      >
        <Box px={20} pt={insets.top + 20} pb={20} bg="white">
           <HStack items="center" justify="space-between">
              <HStack items="center">
                 <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft size={28} color="#1E293B" />
                 </TouchableOpacity>
                 <Heading style={styles.headerTitle}>Finance</Heading>
              </HStack>
              <TouchableOpacity style={styles.profileBtn}>
                 <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.profileImg} />
              </TouchableOpacity>
           </HStack>

           <Box mt={24}>
              <LinearGradient 
                colors={[BLUE, '#4338CA']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.balanceCard}
              >
                <VStack justify="space-between" h="100%">
                   <HStack justify="space-between" items="center">
                      <Text color="rgba(255,255,255,0.7)" fontSize={12} fontWeight="700">BALANCE</Text>
                      <CreditCard size={20} color="white" opacity={0.6} />
                   </HStack>
                   <Text color="white" fontSize={32} fontWeight="900" mt={4}>{wallet?.balance || '$1,245.00'}</Text>
                   <HStack justify="space-between" items="center" mt={20}>
                      <Text color="white" opacity={0.8} fontSize={14} fontWeight="600" letterSpacing={1}>**** 4210</Text>
                      <Text color="white" opacity={0.8} fontSize={12} fontWeight="700">VISA</Text>
                   </HStack>
                </VStack>
              </LinearGradient>
           </Box>
        </Box>

        <View style={styles.content}>
          {/* Quick Actions */}
          <HStack justify="space-between" mb={32}>
             <VStack items="center" space="xs">
                <TouchableOpacity style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]} onPress={() => navigation.navigate('TopUp')}>
                   <ArrowDown size={24} color={BLUE} />
                </TouchableOpacity>
                <Text style={styles.actionLabel}>Top Up</Text>
             </VStack>
             <VStack items="center" space="xs">
                <TouchableOpacity 
                  style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]} 
                  onPress={() => navigation.navigate('Payout')}
                >
                   <ArrowUp size={24} color="#16A34A" />
                </TouchableOpacity>
                <Text style={styles.actionLabel}>Payout</Text>
             </VStack>
             <VStack items="center" space="xs">
                <TouchableOpacity style={[styles.actionIcon, { backgroundColor: '#F8FAFC' }]}>
                   <BarChart3 size={24} color="#64748B" />
                </TouchableOpacity>
                <Text style={styles.actionLabel}>Stats</Text>
             </VStack>
             <VStack items="center" space="xs">
                <TouchableOpacity style={[styles.actionIcon, { backgroundColor: '#FFF7ED' }]}>
                   <ShieldCheck size={24} color="#EA580C" />
                </TouchableOpacity>
                <Text style={styles.actionLabel}>Plans</Text>
             </VStack>
          </HStack>

          {/* Pending Invoices Section (Role-based Addition) */}
          <View style={styles.section}>
            <HStack justify="space-between" items="center" mb={16}>
               <Text style={styles.sectionTitle}>Invoices from Recruiters</Text>
               <TouchableOpacity><Text style={styles.seeAllText}>Manage</Text></TouchableOpacity>
            </HStack>
            {MOCK_INVOICES.map((inv) => (
              <TouchableOpacity 
                key={inv.id} 
                onPress={() => navigation.navigate('InvoiceDetail', { invoice: inv })}
                activeOpacity={0.7}
              >
                <Box bg="white" p={16} rounded={20} border={1} borderColor="#E2E8F0" shadow={0.5} mb={12}>
                  <HStack items="center" justify="space-between">
                     <HStack items="center">
                        <Box bg="#F1F5F9" p={10} rounded={12}>
                           <FileText size={20} color="#475569" />
                        </Box>
                        <VStack ml={12}>
                           <Text fontSize={15} fontWeight="700" color="#1E293B">{inv.from}</Text>
                           <HStack items="center" mt={2}>
                              <Clock size={12} color="#94A3B8" />
                              <Text fontSize={12} color="#94A3B8" ml={4}>Due: {inv.due}</Text>
                           </HStack>
                        </VStack>
                     </HStack>
                     <VStack items="flex-end">
                        <Text fontSize={16} fontWeight="800" color="#1E293B">{inv.amount}</Text>
                        <Box bg="#FEF3C7" px={8} py={2} rounded={6} mt={4}>
                           <Text fontSize={10} fontWeight="800" color="#92400E" textTransform="uppercase">{inv.status}</Text>
                        </Box>
                     </VStack>
                  </HStack>
                </Box>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Activity */}
          <View style={[styles.section, { marginTop: 24 }]}>
             <HStack justify="space-between" items="center" mb={16}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
             </HStack>

             {MOCK_TRANSACTIONS.map((tx) => (
                <TouchableOpacity 
                   key={tx.id} 
                   style={styles.txRow} 
                   activeOpacity={0.7}
                   onPress={() => navigation.navigate('TransactionDetail', { 
                     transaction: { ...tx, title: tx.label, status: 'completed' } 
                   })}
                >
                   <View style={[styles.txIconWrap, { backgroundColor: tx.type === 'incoming' ? '#DCFCE7' : '#F1F5F9' }]}>
                      {tx.type === 'incoming' ? <ArrowDown size={18} color="#16A34A" /> : <ArrowUp size={18} color="#475569" />}
                   </View>
                   <View style={styles.txInfo}>
                      <Text style={styles.txTitle}>{tx.label}</Text>
                      <Text style={styles.txDate}>{tx.date}</Text>
                   </View>
                   <Text style={[styles.txAmount, { color: tx.type === 'incoming' ? '#16A34A' : '#1E293B' }]}>
                      {tx.type === 'incoming' ? '+' : '-'}{tx.amount}
                   </Text>
                </TouchableOpacity>
             ))}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#1E293B', fontSize: moderateScale(22), fontWeight: '800', marginLeft: 12 },
  profileBtn: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  profileImg: { width: '100%', height: '100%' },
  balanceCard: {
    height: verticalScale(160), borderRadius: 24, padding: 24,
  },
  content: { padding: 20, paddingBottom: 100 },
  actionIcon: { width: moderateScale(56), height: moderateScale(56), borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { color: '#64748B', fontSize: 13, fontWeight: '700' },
  section: {},
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  seeAllText: { fontSize: 13, color: BLUE, fontWeight: '700' },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', paddingVertical: 12, marginBottom: 4 },
  txIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, marginLeft: 16 },
  txTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  txDate: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '800' },
});
