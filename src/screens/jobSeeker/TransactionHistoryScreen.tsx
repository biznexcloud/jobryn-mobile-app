import React from 'react';
import { ScrollView, TouchableOpacity, StatusBar, StyleSheet, View, FlatList, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Clock,
  ArrowUp,
  ArrowDown,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';

const BLUE = '#4F46E5';
const SOFT_BG = '#F8FAFC';

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
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
    >
      <HStack items="center">
        <Box bg={item.type === 'credit' ? '#DCFCE7' : '#F1F5F9'} p={10} rounded={14}>
          {item.type === 'credit' ? (
            <ArrowDown size={18} color="#16A34A" />
          ) : (
            <ArrowUp size={18} color="#475569" />
          )}
        </Box>
        <VStack ml={12} flex={1}>
          <Text fontSize={15} fontWeight="700" color="#1E293B">{item.title}</Text>
          <HStack items="center" mt={2}>
            <Clock size={12} color="#94A3B8" />
            <Text fontSize={12} color="#94A3B8" ml={4}>{item.date} • {item.time}</Text>
          </HStack>
        </VStack>
        <VStack items="flex-end">
          <Text fontSize={16} fontWeight="800" color={item.type === 'credit' ? '#16A34A' : '#1E293B'}>
            {item.type === 'credit' ? '+' : '-'}{item.amount}
          </Text>
          <Box bg={item.status === 'completed' ? '#ECFDF5' : '#FFF7ED'} px={8} py={2} rounded={6} mt={4}>
            <Text fontSize={10} fontWeight="800" color={item.status === 'completed' ? '#059669' : '#D97706'} textTransform="uppercase">
              {item.status}
            </Text>
          </Box>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={SOFT_BG}>
      <StatusBar barStyle="dark-content" />
      
      <Box px={20} pt={insets.top + 20} pb={16} bg="white">
        <HStack items="center" justify="space-between">
          <HStack items="center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="#1E293B" />
            </TouchableOpacity>
            <Text fontSize={20} color="#1E293B" fontWeight="800" ml={12}>Activity</Text>
          </HStack>
          <TouchableOpacity style={styles.iconBtn}><Filter size={20} color="#64748B" /></TouchableOpacity>
        </HStack>
        
        <Box mt={20}>
          <HStack bg="#F1F5F9" rounded={16} items="center" px={14} py={2}>
            <Search size={18} color="#94A3B8" />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search history..."
              placeholderTextColor="#94A3B8"
            />
          </HStack>
        </Box>
      </Box>

      <FlatList 
        data={TRANSACTIONS}
        renderItem={TransactionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchInput: { flex: 1, height: 44, marginLeft: 10, fontSize: 15, color: '#1E293B', fontWeight: '500' },
  iconBtn: { padding: 4 },
  itemContainer: { paddingVertical: 14, borderBottomWidth: 0, marginBottom: 4 },
});
