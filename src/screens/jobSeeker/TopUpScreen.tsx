import React from 'react';
import { ScrollView, TouchableOpacity, StatusBar, StyleSheet, TextInput, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  CreditCard, 
  Building2, 
  Wallet as WalletIcon, 
  CheckCircle2,
  ShieldCheck,
  Banknote,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Button } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';
import { BillingService } from '../../services/api/billing';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';

const BLUE = '#4F46E5';
const SOFT_BG = '#F8FAFC';

export default function TopUpScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = React.useState('50.00');
  const [selectedMethod, setSelectedMethod] = React.useState('khalti');
  const [loading, setLoading] = React.useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await BillingService.createTopUp({ 
        amount, 
        payment_method: selectedMethod 
      });
      Toast.show({ type: 'success', text1: 'Payment Initiated', text2: 'Please follow the instructions in your wallet app.' });
      navigation.goBack();
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Payment failed' });
    } finally {
      setLoading(false);
    }
  };

  const MethodRow = ({ id, icon: Icon, label, subtitle, isImage }: any) => (
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
          <Text fontSize={20} color="#1E293B" fontWeight="800" ml={12}>Top Up</Text>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Box bg="white" p={24} rounded={24} mb={24} shadow={0.5} border={1} borderColor="#F1F5F9">
          <Text fontSize={13} color="#64748B" fontWeight="800" mb={16} letterSpacing={1}>ENTER AMOUNT</Text>
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
          
          <HStack justify="space-between" mt={24}>
            {['10.00', '25.00', '50.00', '100.00'].map(val => (
              <TouchableOpacity 
                key={val} 
                style={[styles.chip, amount === val && styles.activeChip]}
                onPress={() => setAmount(val)}
                activeOpacity={0.7}
              >
                <Text fontSize={14} fontWeight="700" color={amount === val ? 'white' : '#64748B'}>${val}</Text>
              </TouchableOpacity>
            ))}
          </HStack>
        </Box>

        <Text fontSize={14} color="#64748B" fontWeight="800" ml={4} mb={16} letterSpacing={1}>PAYMENT METHOD</Text>
        
        <MethodRow id="khalti" icon={WalletIcon} label="Khalti Wallet" subtitle="Instant digital payment" />
        <MethodRow id="esewa" icon={WalletIcon} label="eSewa" subtitle="Nepal's first digital wallet" />
        <MethodRow id="bank_transfer" icon={Building2} label="Bank Transfer" subtitle="Direct deposit to Jobryn" />
        <MethodRow id="cash" icon={Banknote} label="Cash Payment" subtitle="Pay at authorized centers" />

        <Box bg="#F0F9FF" p={16} rounded={16} mt={24} mb={40} border={1} borderColor="#E0F2FE">
          <HStack space="md" items="center">
            <ShieldCheck size={20} color={BLUE} />
            <Text fontSize={12} color="#0369A1" flex={1} fontWeight="500" lineHeight={18}>
              Transactions are secured with 256-bit encryption. Funds usually reflect instantly in your wallet.
            </Text>
          </HStack>
        </Box>

        <Button 
          title={loading ? "" : `Pay $${amount}`}
          onPress={handlePay}
          disabled={loading}
          style={styles.payBtn}
          textStyle={styles.payBtnText}
        >
          {loading && <ActivityIndicator color="white" />}
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  amountInput: { flex: 1, fontSize: 36, fontWeight: '900', color: '#1E293B', marginLeft: 12, padding: 0 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  activeChip: { backgroundColor: BLUE, borderColor: BLUE },
  methodCard: { padding: 16, backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 12 },
  selectedMethod: { borderColor: BLUE, backgroundColor: '#F5F7FF' },
  payBtn: { backgroundColor: BLUE, height: 60, borderRadius: 30, shadowColor: BLUE, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 },
  payBtnText: { fontSize: 18, fontWeight: '800' },
});
