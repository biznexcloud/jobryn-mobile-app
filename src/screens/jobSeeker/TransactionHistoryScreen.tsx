import React from 'react';
import { ScrollView, TouchableOpacity, StatusBar, StyleSheet, View, FlatList, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Calendar, 
  Filter, 
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Input } from '../../components/ui';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#4F46E5';
const GRAY_BG = '#F9FAFB';

export default function TransactionHistoryScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const TRANSACTIONS = [
    { id: '1', title: 'Premium Subscription', date: 'Oct 12, 2026', time: '14:20', amount: '$29.00', type: 'debit', status: 'completed' },
    { id: '2', title: 'Wallet Topup (Visa)', date: 'Oct 05, 2026', time: '09:15', amount: '$50.00', type: 'credit', status: 'completed' },
    { id: '3', title: 'Course Enrollment', date: 'Sep 28, 2026', time: '11:45', amount: '$15.00', type: 'debit', status: 'completed' },
    { id: '4', title: 'Job Boost Service', date: 'Sep 25, 2026', time: '18:30', amount: '$5.00', type: 'debit', status: 'completed' },
    { id: '5', title: 'Wallet Topup (ACH)', date: 'Sep 15, 2026', time: '10:00', amount: '$100.00', type: 'credit', status: 'pending' },
    { id: '6', title: 'Refund: Duplicate Charge', date: 'Sep 10, 2026', time: '14:00', amount: '$29.00', type: 'credit', status: 'completed' },
  ];

  const TransactionItem = ({ item }: { item: any }) => (
    <Box bg="white" p={16} rounded={16} mb={10} border={1} borderColor="#E5E7EB">
      <HStack items="center">
        <Box bg={item.type === 'credit' ? '#F0FDFA' : '#FEF2F2'} p={10} rounded={12}>
          {item.type === 'credit' ? (
            <ArrowDownLeft size={20} color="#14B8A6" />
          ) : (
            <ArrowUpRight size={20} color="#EF4444" />
          )}
        </Box>
        <VStack ml={12} flex={1}>
          <Text fontSize={15} fontWeight="700" color="#1E293B">{item.title}</Text>
          <HStack items="center" mt={4}>
            <Clock size={12} color="#94A3B8" />
            <Text fontSize={12} color="#94A3B8" ml={4}>{item.date} • {item.time}</Text>
          </HStack>
        </VStack>
        <VStack items="flex-end">
          <Text fontSize={16} fontWeight="800" color={item.type === 'credit' ? '#14B8A6' : '#EF4444'}>
            {item.type === 'credit' ? '+' : '-'}{item.amount}
          </Text>
          <HStack items="center" mt={4}>
            <Text fontSize={11} fontWeight="700" color={item.status === 'completed' ? '#059669' : '#D97706'} textTransform="uppercase">
              {item.status}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />
      
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text fontSize={20} color="#1E293B" fontWeight="700" ml={16}>Activity</Text>
          </HStack>
          <TouchableOpacity><Filter size={20} color="#64748B" /></TouchableOpacity>
        </HStack>
      </Box>

      <Box px={16} py={12}>
        <HStack bg="white" rounded={12} items="center" px={12} py={4} border={1} borderColor="#E2E8F0">
          <Search size={18} color="#94A3B8" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor="#94A3B8"
          />
        </HStack>
      </Box>

      <FlatList 
        data={TRANSACTIONS}
        renderItem={TransactionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchInput: { flex: 1, height: 44, marginLeft: 8, fontSize: 14, color: '#1E293B' },
});
