import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft as ChevronLeftIcon,
  CreditCard as CreditCardIcon,
  BadgeCheck as CheckIcon,
  ChevronRight as ChevronRightIcon,
  RefreshCw as RefreshIcon,
  Lock as LockClosedIcon,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import { BillingService } from '../../services/api/billing';
import { RefreshControl } from 'react-native';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

export default function BillingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [payments, setPayments] = React.useState<any[]>([]);

  const loadBillingData = async () => {
    try {
      const [invRes, payRes] = await Promise.all([
        BillingService.getInvoices(),
        BillingService.getPayments(),
      ]);
      setInvoices(invRes.results || invRes);
      setPayments(payRes.results || payRes);
    } catch (err) {
      console.warn('Billing load failed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => { loadBillingData(); }, []);

  const PlanOption = ({ title, price, features, isCurrent }: any) => (
    <Box bg="white" p={20} rounded={16} mb={16} border={1.5} borderColor={isCurrent ? FB_BLUE : '#F0F2F5'}>
       <HStack justify="space-between" items="center" mb={12}>
          <Text fontSize={17} fontWeight="700" color="#111827">{title}</Text>
          {isCurrent && (
             <Box bg={FB_BLUE} px={10} py={4} rounded={20}>
                <Text fontSize={10} fontWeight="800" color="white">CURRENT</Text>
             </Box>
          )}
       </HStack>
       <Text fontSize={26} fontWeight="800" color="#111827" mb={16}>{price}</Text>
       <VStack space="sm" mb={20}>
          {features.map((f: string, i: number) => (
             <HStack items="center" key={i}>
                <CheckIcon size={16} color="#10B981" strokeWidth={3} />
                <Text fontSize={14} color={GRAY_TEXT} ml={10}>{f}</Text>
             </HStack>
          ))}
       </VStack>
       <TouchableOpacity 
          style={[styles.planBtn, isCurrent ? styles.outlineBtn : styles.solidBtn]}
          onPress={() => {}}
       >
          <Text fontSize={15} fontWeight="700" color={isCurrent ? FB_BLUE : 'white'}>
             {isCurrent ? "Manage Subscription" : "Upgrade Plan"}
          </Text>
       </TouchableOpacity>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box px={16} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <ChevronLeftIcon size={22} color="black" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Billing & Plans</Text>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
         <Box bg="white" p={16} rounded={16} mb={20} border={1} borderColor="#F0F2F5">
            <HStack items="center" justify="space-between" mb={14}>
               <Text fontSize={13} color={GRAY_TEXT} fontWeight="700">PAYMENT METHOD</Text>
               <TouchableOpacity onPress={() => navigation.navigate('PaymentMethod')}>
                  <Text fontSize={13} fontWeight="700" color={FB_BLUE}>Edit</Text>
               </TouchableOpacity>
            </HStack>
            <HStack items="center">
               <Box w={40} h={40} rounded={8} bg={FB_GRAY} items="center" justify="center">
                  <CreditCardIcon size={20} color="#4B5563" />
               </Box>
               <VStack ml={12}>
                  <Text fontSize={15} fontWeight="700" color="#111827">Visa ending in 4412</Text>
                  <Text fontSize={12} color={GRAY_TEXT}>Expires 12/26</Text>
               </VStack>
               <HStack flex={1} justify="flex-end">
                  <LockClosedIcon size={16} color="#9CA3AF" />
               </HStack>
            </HStack>
         </Box>

          <Text fontSize={13} color={GRAY_TEXT} fontWeight="700" mb={12} ml={4}>RECENT INVOICES</Text>
          {loading ? (
             <ActivityIndicator size="small" color={FB_BLUE} style={{ marginTop: 20 }} />
          ) : (
             invoices.map((inv) => (
                <TouchableOpacity key={inv.id} style={styles.invoiceRow}>
                   <HStack justify="space-between" items="center" bg="white" p={16} rounded={12} mb={10} border={1} borderColor="#F0F2F5">
                      <VStack>
                         <Text fontSize={14} fontWeight="700" color="#111827">Invoice #{inv.invoice_no || inv.id}</Text>
                         <Text fontSize={12} color={GRAY_TEXT} mt={2}>{new Date(inv.created_at).toLocaleDateString()}</Text>
                      </VStack>
                      <Text fontSize={15} fontWeight="800" color="#111827">
                        {inv.amount_display || `$${inv.amount}`}
                      </Text>
                   </HStack>
                </TouchableOpacity>
             ))
          )}

          {invoices.length === 0 && !loading && (
             <Box bg="white" p={20} rounded={12} items="center">
                <Text fontSize={14} color={GRAY_TEXT}>No invoices found</Text>
             </Box>
          )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  planBtn: { height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  solidBtn: { backgroundColor: FB_BLUE },
  outlineBtn: { borderWidth: 1.5, borderColor: FB_BLUE },
  invoiceRow: { width: '100%' },
});





