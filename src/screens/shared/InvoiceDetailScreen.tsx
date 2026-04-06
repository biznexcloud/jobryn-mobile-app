import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Download,
  Share2,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Building2,
  Mail,
  HelpCircle,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Button } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';

const BLUE = '#4F46E5';
const SOFT_BG = '#F8FAFC';

export default function InvoiceDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { invoice } = route.params || { 
    invoice: { id: 'INV-2026-101', from: 'Tech Corp LLC', email: 'billing@techcorp.io', amount: '$450.00', status: 'unpaid', due: 'Oct 20, 2026', items: [ { name: 'UX/UI Consulting', price: '$400.00' }, { name: 'Platform Fee', price: '$50.00' } ] } 
  };

  const statusColors: any = {
    unpaid: { bg: '#FEF3C7', text: '#92400E' },
    paid: { bg: '#DCFCE7', text: '#166534' },
    overdue: { bg: '#FEE2E2', text: '#991B1B' },
  };

  const currentStatus = statusColors[invoice.status] || { bg: '#F1F5F9', text: '#475569' };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      
      <Box px={20} pt={insets.top + 20} pb={16} bg="white">
        <HStack items="center" justify="space-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#1E293B" />
          </TouchableOpacity>
          <Text fontSize={18} fontWeight="800" color="#1E293B">Invoice</Text>
          <TouchableOpacity><MoreVertical size={22} color="#64748B" /></TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Header */}
        <Box items="center" py={32} bg={SOFT_BG} rounded={32} mb={32}>
           <Box bg="white" p={16} rounded={20} shadow={0.2} mb={16}>
              <FileText size={32} color={BLUE} />
           </Box>
           <Text fontSize={32} fontWeight="900" color="#1E293B">{invoice.amount}</Text>
           <HStack items="center" mt={12} bg={currentStatus.bg} px={12} py={4} rounded={8}>
              <Text fontSize={12} fontWeight="800" color={currentStatus.text} textTransform="uppercase">{invoice.status}</Text>
           </HStack>
           <HStack items="center" mt={8} style={{ opacity: 0.6 }}>
              <Clock size={14} color="#1E293B" />
              <Text fontSize={13} color="#1E293B" ml={4} fontWeight="600">Due: {invoice.due}</Text>
           </HStack>
        </Box>

        {/* Sender Info */}
        <VStack space="md" mb={32}>
           <Text fontSize={14} fontWeight="800" color="#64748B" letterSpacing={1}>BILL FROM</Text>
           <Box bg={SOFT_BG} p={16} rounded={20} border={1} borderColor="#F1F5F9">
              <HStack items="center">
                 <Box bg="white" p={10} rounded={12}>
                    <Building2 size={24} color="#475569" />
                 </Box>
                 <VStack ml={12}>
                    <Text fontSize={16} fontWeight="700" color="#1E293B">{invoice.from}</Text>
                    <HStack items="center" mt={2} style={{ opacity: 0.6 }}>
                       <Mail size={12} color="#1E293B" />
                       <Text fontSize={13} color="#1E293B" ml={4}>{invoice.email}</Text>
                    </HStack>
                 </VStack>
              </HStack>
           </Box>
        </VStack>

        {/* Invoice Items */}
        <VStack space="md" mb={40}>
           <Text fontSize={14} fontWeight="800" color="#64748B" letterSpacing={1}>INVOICE ITEMS</Text>
           {invoice.items.map((item: any, i: number) => (
              <HStack key={i} justify="space-between" items="center" py={4}>
                 <Text fontSize={15} fontWeight="600" color="#1E293B">{item.name}</Text>
                 <Text fontSize={15} fontWeight="700" color="#1E293B">{item.price}</Text>
              </HStack>
           ))}
           <Divider color="#F1F5F9" mt={12} />
           <HStack justify="space-between" mt={4}>
              <Text fontSize={18} fontWeight="900" color="#1E293B">Total</Text>
              <Text fontSize={18} fontWeight="900" color={BLUE}>{invoice.amount}</Text>
           </HStack>
        </VStack>

        {/* Support Section */}
        <Box bg="#F0F9FF" p={16} rounded={20} mb={40} border={1} borderColor="#E0F2FE">
           <HStack items="center" space="md">
              <AlertCircle size={20} color="#0EA5E9" />
              <Text fontSize={13} color="#0369A1" flex={1} fontWeight="600">
                 Need to dispute this invoice? Please contact the recruiter directly or our support team.
              </Text>
           </HStack>
        </Box>

        <VStack space="md">
           {invoice.status !== 'paid' && (
              <Button 
                 onPress={() => {}}
                 style={styles.btnMain}
              >
                 <Text style={styles.btnText}>Pay Now</Text>
              </Button>
           )}
           <Button variant="outline" style={styles.btnSecondary}>
              <HStack space="xs" items="center">
                 <Download size={18} color="#1E293B" />
                 <Text color="#1E293B" fontWeight="800">Download PDF</Text>
              </HStack>
           </Button>
           <Button variant="ghost" style={styles.btnSecondary}>
              <Text color="#64748B" fontWeight="800">Help & Support</Text>
           </Button>
        </VStack>

        <Box py={30} items="center">
           <HStack space="xs" style={{ opacity: 0.3 }}>
              <HelpCircle size={12} color="#1E293B" />
              <Text fontSize={10} color="#1E293B" fontWeight="800" letterSpacing={1}>POWERED BY JOBRYN BILLING</Text>
           </HStack>
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  btnMain: { height: 60, borderRadius: 30, backgroundColor: BLUE, shadowColor: BLUE, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 },
  btnText: { fontSize: 18, fontWeight: '800' },
  btnSecondary: { height: 56, borderRadius: 28 },
});
