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
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  LockKeyhole,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Button } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';

const BLUE = '#4F46E5';
const SOFT_BG = '#F8FAFC';

export default function TransactionDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { transaction } = route.params || { 
    transaction: { id: 'TX-998124', title: 'Wallet Topup', amount: '$50.00', date: 'Oct 12, 2026', time: '14:20', type: 'credit', status: 'completed', method: 'Visa Card (**** 4210)' } 
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Transaction Receipt: ${transaction.title} - ${transaction.amount} on ${transaction.date}`,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={SOFT_BG}>
      <StatusBar barStyle="dark-content" />
      
      <Box px={20} pt={insets.top + 20} pb={16} bg="white">
        <HStack items="center" justify="space-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#1E293B" />
          </TouchableOpacity>
          <Text fontSize={18} fontWeight="800" color="#1E293B">Receipt</Text>
          <TouchableOpacity onPress={onShare}><Share2 size={22} color="#64748B" /></TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Box items="center" mt={20} mb={40}>
           <Box bg={transaction.type === 'credit' ? '#DCFCE7' : '#F1F5F9'} p={20} rounded={24} mb={20}>
              {transaction.type === 'credit' ? <ArrowDownLeft size={36} color="#16A34A" /> : <ArrowUpRight size={36} color="#475569" />}
           </Box>
           <Text fontSize={36} fontWeight="900" color="#1E293B">{transaction.type === 'credit' ? '+' : '-'}{transaction.amount}</Text>
           <Text fontSize={16} color="#64748B" mt={4} fontWeight="600">{transaction.title}</Text>
           <Box bg={transaction.status === 'completed' ? '#ECFDF5' : '#FFF7ED'} px={12} py={4} rounded={8} mt={12}>
              <HStack items="center" space="xs">
                 {transaction.status === 'completed' && <CheckCircle2 size={12} color="#059669" />}
                 <Text fontSize={12} fontWeight="800" color={transaction.status === 'completed' ? '#059669' : '#D97706'} textTransform="uppercase">
                    {transaction.status}
                 </Text>
              </HStack>
           </Box>
        </Box>

        <Box bg="white" p={20} rounded={24} shadow={0.5} border={1} borderColor="#F1F5F9">
           <VStack space="lg">
              <HStack justify="space-between" items="center">
                 <Text color="#64748B" fontWeight="600">Transaction ID</Text>
                 <HStack items="center" space="xs">
                    <Text color="#1E293B" fontWeight="700">{transaction.id}</Text>
                    <TouchableOpacity><Copy size={14} color={BLUE} /></TouchableOpacity>
                 </HStack>
              </HStack>
              <Divider color="#F1F5F9" />
              <HStack justify="space-between" items="center">
                 <Text color="#64748B" fontWeight="600">Payment Date</Text>
                 <Text color="#1E293B" fontWeight="700">{transaction.date} • {transaction.time}</Text>
              </HStack>
              <Divider color="#F1F5F9" />
              <HStack justify="space-between" items="center">
                 <Text color="#64748B" fontWeight="600">Method</Text>
                 <Text color="#1E293B" fontWeight="700">{transaction.method || 'Credit/Debit Card'}</Text>
              </HStack>
              <Divider color="#F1F5F9" />
              <HStack justify="space-between" items="center">
                 <Text color="#64748B" fontWeight="600">Currency</Text>
                 <Text color="#1E293B" fontWeight="700">USD</Text>
              </HStack>
              <Divider color="#F1F5F9" />
              <HStack justify="space-between" items="center">
                 <Text color="#64748B" fontWeight="600">Category</Text>
                 <Text color="#1E293B" fontWeight="700">Financial Service</Text>
              </HStack>
           </VStack>
        </Box>

        <VStack mt={32} space="md">
           <Button variant="outline" style={styles.btnStyle}>
              <HStack space="xs" items="center">
                 <Download size={18} color={BLUE} />
                 <Text color={BLUE} fontWeight="700">Download Receipt</Text>
              </HStack>
           </Button>
           <Button title="Contact Support" variant="ghost" style={styles.btnStyle} />
        </VStack>

        <HStack justify="center" mt={40} mb={20} style={{ opacity: 0.5 }}>
           <LockKeyhole size={12} color="#64748B" />
           <Text fontSize={10} color="#64748B" ml={4} fontWeight="800" letterSpacing={0.5}>SECURE TRANSACTION LOG</Text>
        </HStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },
  btnStyle: { height: 56, borderRadius: 16 },
});
