import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft as ChevronLeftIcon,
  CreditCard as CreditCardIcon,
  BadgeCheck as CheckIcon,
  ChevronRight as ChevronRightIcon,
  Lock as LockClosedIcon,
  FileText as FileTextIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  AlertCircle as AlertCircleIcon,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';
import { BillingService } from '../../services/api/billing';
import { useFocusEffect } from '@react-navigation/native';

const FB_BLUE = '#1877F2';
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; Icon: any }> = {
  paid:       { color: '#16A34A', bg: '#F0FDF4', label: 'Paid',    Icon: CheckCircleIcon  },
  pending:    { color: '#D97706', bg: '#FFFBEB', label: 'Pending', Icon: ClockIcon        },
  overdue:    { color: '#DC2626', bg: '#FEF2F2', label: 'Overdue', Icon: AlertCircleIcon  },
  cancelled:  { color: '#6B7280', bg: '#F9FAFB', label: 'Cancelled', Icon: AlertCircleIcon },
};

export default function BillingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  const loadBillingData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [invRes, payRes] = await Promise.all([
        BillingService.getInvoices(),
        BillingService.getPayments(),
      ]);
      setInvoices(invRes?.results || invRes || []);
      setPayments(payRes?.results || payRes || []);
    } catch (err) {
      console.warn('Billing load failed:', err);
      setInvoices([]);
      setPayments([]);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBillingData(invoices.length === 0);
    }, [loadBillingData, invoices.length])
  );

  const onRefresh = () => { setRefreshing(true); loadBillingData(false); };

  // Derive last payment method from payments list
  const lastPayment = payments[0];

  const InvoiceRow = ({ inv }: { inv: any }) => {
    const cfg = STATUS_CONFIG[inv.status] || STATUS_CONFIG['pending'];
    const Icon = cfg.Icon;
    const formattedDate = inv.created_at
      ? new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'N/A';
    const totalAmount = inv.total_amount || inv.amount;
    const currency = inv.currency || 'USD';

    return (
      <TouchableOpacity
        style={styles.invoiceRow}
        activeOpacity={0.75}
        onPress={() => navigation.navigate('InvoiceDetail', { invoice: inv })}
      >
        <HStack items="center" bg="white" p={16} rounded={14} mb={10} border={1} borderColor="#F0F2F5">
          <Box bg="#F0F5FF" p={10} rounded={10} mr={14}>
            <FileTextIcon size={20} color={FB_BLUE} />
          </Box>
          <VStack flex={1}>
            <Text fontSize={14} fontWeight="700" color="#111827" numberOfLines={1}>
              {inv.job_title || `Invoice #${inv.invoice_no || inv.id}`}
            </Text>
            <Text fontSize={12} color={GRAY_TEXT} mt={2}>
              {inv.seeker_email ? `${inv.seeker_email} · ` : ''}{formattedDate}
            </Text>
          </VStack>
          <VStack items="flex-end" ml={8}>
            <Text fontSize={15} fontWeight="800" color="#111827">
              {currency} {parseFloat(totalAmount || '0').toFixed(2)}
            </Text>
            <Box bg={cfg.bg} px={8} py={3} rounded={12} mt={4}>
              <Text fontSize={10} fontWeight="700" color={cfg.color}>{cfg.label.toUpperCase()}</Text>
            </Box>
          </VStack>
          <ChevronRightIcon size={16} color="#D1D5DB" style={{ marginLeft: 8 }} />
        </HStack>
      </TouchableOpacity>
    );
  };

  const PaymentRow = ({ pay }: { pay: any }) => {
    const formattedDate = pay.created_at
      ? new Date(pay.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'N/A';
    return (
      <HStack items="center" bg="white" p={14} rounded={14} mb={10} border={1} borderColor="#F0F2F5">
        <Box bg="#F0FDF4" p={10} rounded={10} mr={14}>
          <CheckCircleIcon size={18} color="#16A34A" />
        </Box>
        <VStack flex={1}>
          <Text fontSize={14} fontWeight="700" color="#111827">
            {pay.payment_method
              ? pay.payment_method.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
              : 'Payment'}
          </Text>
          <Text fontSize={12} color={GRAY_TEXT} mt={2}>
            Tx: {pay.transaction_id || 'N/A'} · {formattedDate}
          </Text>
        </VStack>
        <Text fontSize={15} fontWeight="800" color="#16A34A">
          ${parseFloat(pay.amount || '0').toFixed(2)}
        </Text>
      </HStack>
    );
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box px={16} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <ChevronLeftIcon size={22} color="black" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Billing & Payments</Text>
        </HStack>
      </Box>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={FB_BLUE} />}
      >
        {/* Last Payment Method (from API payments) */}
        <Box bg="white" p={16} rounded={16} mb={20} border={1} borderColor="#F0F2F5">
          <HStack items="center" justify="space-between" mb={14}>
            <Text fontSize={13} color={GRAY_TEXT} fontWeight="700">PAYMENT METHOD</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PaymentMethod')}>
              <Text fontSize={13} fontWeight="700" color={FB_BLUE}>Manage</Text>
            </TouchableOpacity>
          </HStack>
          <HStack items="center">
            <Box w={40} h={40} rounded={8} bg={FB_GRAY} items="center" justify="center">
              <CreditCardIcon size={20} color="#4B5563" />
            </Box>
            <VStack ml={12} flex={1}>
              {lastPayment ? (
                <>
                  <Text fontSize={15} fontWeight="700" color="#111827">
                    {lastPayment.payment_method
                      ? lastPayment.payment_method.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
                      : 'Online Payment'}
                  </Text>
                  <Text fontSize={12} color={GRAY_TEXT}>
                    Last used: {new Date(lastPayment.created_at).toLocaleDateString()}
                  </Text>
                </>
              ) : (
                <>
                  <Text fontSize={15} fontWeight="700" color="#111827">No payment on file</Text>
                  <Text fontSize={12} color={GRAY_TEXT}>Add a payment method to get started</Text>
                </>
              )}
            </VStack>
            <LockClosedIcon size={16} color="#9CA3AF" />
          </HStack>
        </Box>

        {/* Invoices */}
        <Text fontSize={13} color={GRAY_TEXT} fontWeight="700" mb={12} ml={4}>INVOICES</Text>
        {loading ? (
          <ActivityIndicator size="small" color={FB_BLUE} style={{ marginTop: 20, marginBottom: 20 }} />
        ) : invoices.length > 0 ? (
          invoices.map((inv) => <InvoiceRow key={inv.id} inv={inv} />)
        ) : (
          <Box bg="white" p={20} rounded={14} items="center" mb={20}>
            <FileTextIcon size={28} color="#D1D5DB" />
            <Text fontSize={14} color={GRAY_TEXT} mt={10}>No invoices yet</Text>
          </Box>
        )}

        {/* Payments */}
        {!loading && payments.length > 0 && (
          <>
            <Text fontSize={13} color={GRAY_TEXT} fontWeight="700" mb={12} ml={4} mt={8}>PAYMENT HISTORY</Text>
            {payments.map((pay) => <PaymentRow key={pay.id} pay={pay} />)}
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  invoiceRow: { width: '100%' },
});
