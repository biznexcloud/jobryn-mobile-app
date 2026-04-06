import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ArrowUpRight,
  Wallet,
  Building2,
  CheckCircle2,
  Info,
  ShieldCheck,
  Banknote,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Button } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';

const BLUE = '#4F46E5';
const SOFT_BG = '#F8FAFC';

export default function PayoutScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('100.00');
  const [selectedMethod, setSelectedMethod] = useState('bank');

  const handlePayout = () => {
    Alert.alert(
      'Confirm Payout',
      `Are you sure you want to withdraw $${amount} to your ${selectedMethod === 'bank' ? 'Bank Account' : 'Digital Wallet'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Payout Initiated', 'Your withdrawal request has been sent and will be processed within 24-48 hours.', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          } 
        }
      ]
    );
  };

  const MethodRow = ({ id, icon: Icon, label, subtitle }: any) => (
    <TouchableOpacity 
      style={[styles.methodCard, selectedMethod === id && styles.selectedMethod]} 
      onPress={() => setSelectedMethod(id)}
      activeOpacity={0.7}
    >
      <HStack items="center">
        <Box bg={selectedMethod === id ? '#EEF2FF' : '#F1F5F9'} p={10} rounded={14}>
          <Icon size={22} color={selectedMethod === id ? BLUE : '#64748B'} />
        </Box>
        <VStack ml={12} flex={1}>
          <Text fontSize={16} fontWeight="700" color="#1E293B">{label}</Text>
          <Text fontSize={12} color="#64748B" mt={2}>{subtitle}</Text>
        </VStack>
        {selectedMethod === id && (
          <Box bg={BLUE} p={4} rounded={100}>
            <CheckCircle2 size={14} color="white" />
          </Box>
        )}
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={SOFT_BG}>
      <StatusBar barStyle="dark-content" />
      
      <Box px={20} pt={insets.top + 20} pb={16} bg="white">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#1E293B" />
          </TouchableOpacity>
          <Text fontSize={20} color="#1E293B" fontWeight="800" ml={12}>Withdraw Funds</Text>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Box bg="white" p={24} rounded={28} mb={24} shadow={0.5} border={1} borderColor="#F1F5F9">
          <HStack justify="space-between" mb={12}>
            <Text fontSize={13} color="#64748B" fontWeight="800" letterSpacing={1}>AVAILABLE BALANCE</Text>
            <Text fontSize={13} color={BLUE} fontWeight="800">$1,245.00</Text>
          </HStack>
          <HStack items="center" borderBottom={2} borderColor="#F1F5F9" pb={12}>
            <Text fontSize={36} fontWeight="900" color="#1E293B">$</Text>
            <TextInput 
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#CBD5E1"
            />
          </HStack>
          <Text fontSize={12} color="#94A3B8" mt={12} fontWeight="600">Min. withdrawal: $20.00 • Max. daily: $2,500.00</Text>
        </Box>

        <Text fontSize={14} fontWeight="800" color="#64748B" ml={4} mb={16} letterSpacing={1}>WITHDRAW TO</Text>
        
        <MethodRow id="bank" icon={Building2} label="Bank Account" subtitle="Main checking account (**** 9901)" />
        <MethodRow id="khalti" icon={Wallet} label="Khalti ID" subtitle="Instant payout via phone number" />
        <MethodRow id="esewa" icon={Wallet} label="eSewa Wallet" subtitle="Direct digital transfer" />
        <MethodRow id="venmo" icon={Banknote} label="Global Wire" subtitle="International SWIFT/BIC payout" />

        <Box bg="#F0F9FF" p={16} rounded={20} mt={24} mb={40} border={1} borderColor="#E0F2FE">
          <HStack items="flex-start" space="md">
            <Info size={20} color="#0EA5E9" style={{ marginTop: 2 }} />
            <VStack flex={1}>
               <Text fontSize={13} color="#0369A1" fontWeight="700">Withdrawal Policy</Text>
               <Text fontSize={12} color="#0369A1" mt={4} lineHeight={18}>
                  Bank withdrawals take 1-3 business days. Digital wallet transfers are usually processed within hours.
               </Text>
            </VStack>
          </HStack>
        </Box>

        <Button 
          onPress={handlePayout}
          style={styles.withdrawBtn}
        >
          <HStack space="sm" items="center">
             <Text style={styles.withdrawBtnText}>Withdraw Now</Text>
             <ArrowUpRight size={20} color="white" />
          </HStack>
        </Button>

        <HStack justify="center" mt={32} style={{ opacity: 0.6 }}>
           <ShieldCheck size={14} color="#64748B" />
           <Text fontSize={10} color="#64748B" ml={4} fontWeight="800" letterSpacing={0.5}>SECURED WITH 256-BIT ENCRYPTION</Text>
        </HStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },
  amountInput: { flex: 1, fontSize: 36, fontWeight: '900', color: '#1E293B', marginLeft: 12, padding: 0 },
  methodCard: { padding: 16, backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 12 },
  selectedMethod: { borderColor: BLUE, backgroundColor: '#F5F7FF' },
  withdrawBtn: { height: 64, borderRadius: 32, backgroundColor: BLUE, shadowColor: BLUE, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12 },
  withdrawBtnText: { fontSize: 20, fontWeight: '900', color: 'white' },
});
