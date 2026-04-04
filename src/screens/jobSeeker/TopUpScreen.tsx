import React from 'react';
import { ScrollView, TouchableOpacity, StatusBar, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  CreditCard, 
  Building2, 
  Wallet as WalletIcon, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Button, Divider } from '../../components/ui';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#4F46E5';
const GRAY_BG = '#F9FAFB';

export default function TopUpScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = React.useState('50.00');
  const [selectedMethod, setSelectedMethod] = React.useState('card');

  const MethodRow = ({ id, icon: Icon, label, subtitle }: any) => (
    <TouchableOpacity 
      style={[styles.methodCard, selectedMethod === id && styles.selectedMethod]} 
      onPress={() => setSelectedMethod(id)}
    >
      <HStack items="center">
        <Box bg={selectedMethod === id ? '#EFF6FF' : '#F1F5F9'} p={10} rounded={10}>
          <Icon size={22} color={selectedMethod === id ? BLUE : '#64748B'} />
        </Box>
        <VStack ml={12} flex={1}>
          <Text fontSize={16} fontWeight="700" color="#1E293B">{label}</Text>
          <Text fontSize={12} color="#64748B" mt={2}>{subtitle}</Text>
        </VStack>
        {selectedMethod === id && <CheckCircle2 size={20} color={BLUE} />}
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />
      
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text fontSize={20} color="#1E293B" fontWeight="700" ml={16}>Top Up Wallet</Text>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Box bg="white" p={20} rounded={20} mb={24} border={1} borderColor="#E5E7EB">
          <Text fontSize={14} color="#64748B" fontWeight="700" mb={12}>ENTER AMOUNT</Text>
          <HStack items="center" borderBottom={2} borderColor={BLUE} pb={8}>
            <Text fontSize={32} fontWeight="800" color="#1E293B">$</Text>
            <TextInput 
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              autoFocus
            />
          </HStack>
          <HStack space="sm" mt={16}>
            {['10.00', '25.00', '50.00', '100.00'].map(val => (
              <TouchableOpacity 
                key={val} 
                style={[styles.chip, amount === val && styles.activeChip]}
                onPress={() => setAmount(val)}
              >
                <Text fontSize={13} fontWeight="700" color={amount === val ? 'white' : '#64748B'}>${val}</Text>
              </TouchableOpacity>
            ))}
          </HStack>
        </Box>

        <Text fontSize={14} color="#64748B" fontWeight="700" ml={4} mb={12}>PAYMENT METHOD</Text>
        <MethodRow id="card" icon={CreditCard} label="Credit or Debit Card" subtitle="Visa, Mastercard, Amex" />
        <MethodRow id="bank" icon={Building2} label="Bank Transfer" subtitle="Direct bank access (ACH)" />
        <MethodRow id="wallet" icon={WalletIcon} label="Apple / Google Pay" subtitle="One-tap secure payment" />

        <Box bg="#F0F9FF" p={16} rounded={12} mt={24} mb={40}>
          <HStack space="md">
            <ShieldCheck size={20} color={BLUE} />
            <Text fontSize={12} color="#1E3A8A" flex={1}>
              Your transaction is secured with bank-level 256-bit encryption. Funds will be available instantly.
            </Text>
          </HStack>
        </Box>

        <Button 
          title={`Add $${amount}`}
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: BLUE, height: 56, borderRadius: 28 }}
          textStyle={{ fontSize: 18, fontWeight: '800' }}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  amountInput: { flex: 1, fontSize: 32, fontWeight: '800', color: '#1E293B', marginLeft: 8, padding: 0 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  activeChip: { backgroundColor: BLUE, borderColor: BLUE },
  methodCard: { padding: 16, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  selectedMethod: { borderColor: BLUE, borderWidth: 2, backgroundColor: '#FBFCFF' },
});
