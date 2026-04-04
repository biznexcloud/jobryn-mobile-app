import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  CreditCard,
  Plus,
  CheckCircle2,
  Trash2,
  Lock,
  Shield,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Button, Divider } from '../../components/ui';
import { moderateScale } from '../../utils/responsive';

const BLUE = '#0A66C2';
const GRAY_BG = '#F3F2EF';

const DUMMY_CARDS = [
  { id: '1', brand: 'Visa', last4: '4412', expiry: '12/26', isDefault: true },
  { id: '2', brand: 'Mastercard', last4: '8821', expiry: '09/27', isDefault: false },
];

export default function PaymentMethodScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState(DUMMY_CARDS);

  const setDefault = (id: string) => {
    setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
  };

  const removeCard = (id: string, brand: string, last4: string) => {
    Alert.alert(
      'Remove Card',
      `Remove ${brand} ending in ${last4}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: () => setCards(prev => prev.filter(c => c.id !== id))
        }
      ]
    );
  };

  const CardRow = ({ card }: { card: any }) => (
    <Box bg="white" p={16} rounded={14} mb={10} border={card.isDefault ? 2 : 1} borderColor={card.isDefault ? BLUE : '#E5E7EB'}>
      <HStack items="center" justify="space-between">
        <HStack items="center" flex={1}>
          <Box bg={card.brand === 'Visa' ? '#1A1F71' : '#EB001B'} px={8} py={4} rounded={6}>
            <Text fontSize={12} fontWeight="800" color="white">{card.brand.toUpperCase()}</Text>
          </Box>
          <VStack ml={14}>
            <Text fontSize={16} fontWeight="700" color="#111827">•••• •••• •••• {card.last4}</Text>
            <Text fontSize={12} color="#6B7280" mt={2}>Expires {card.expiry}</Text>
          </VStack>
        </HStack>
        <HStack space="sm">
          {!card.isDefault && (
            <TouchableOpacity style={styles.actionBtn} onPress={() => setDefault(card.id)}>
              <CheckCircle2 size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          {card.isDefault && (
            <Box bg="#EDF3F8" px={8} py={4} rounded={6}>
              <Text fontSize={11} fontWeight="700" color={BLUE}>DEFAULT</Text>
            </Box>
          )}
          {!card.isDefault && (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]} onPress={() => removeCard(card.id, card.brand, card.last4)}>
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </HStack>
      </HStack>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />

      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text fontSize={20} fontWeight="700" color="#111827" ml={16}>Payment Methods</Text>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cards Section */}
        <Text fontSize={13} fontWeight="700" color="#6B7280" ml={4} mb={12}>YOUR CARDS</Text>
        {cards.map(card => <CardRow key={card.id} card={card} />)}

        {/* Add Card Button */}
        <TouchableOpacity style={styles.addCard} onPress={() => Alert.alert('Add Card', 'Card entry form coming soon!')}>
          <Plus size={20} color={BLUE} />
          <Text fontSize={15} fontWeight="700" color={BLUE} ml={10}>Add New Card</Text>
        </TouchableOpacity>

        <Divider color="#E5E7EB" my={24} />

        {/* Billing Address */}
        <Text fontSize={13} fontWeight="700" color="#6B7280" ml={4} mb={12}>BILLING INFORMATION</Text>
        <Box bg="white" p={16} rounded={14} mb={16}>
          <VStack space="sm">
            <HStack justify="space-between">
              <Text fontSize={14} color="#6B7280">Company Name</Text>
              <Text fontSize={14} fontWeight="700" color="#111827">Nexus Corp. Ltd.</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize={14} color="#6B7280">Billing Email</Text>
              <Text fontSize={14} fontWeight="700" color="#111827">billing@nexus.io</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize={14} color="#6B7280">Tax ID</Text>
              <Text fontSize={14} fontWeight="700" color="#111827">NX-20241234</Text>
            </HStack>
          </VStack>
          <TouchableOpacity style={styles.editBilling} onPress={() => Alert.alert('Edit Billing', 'Billing editor coming soon!')}>
            <Text fontSize={13} fontWeight="700" color={BLUE}>Edit Billing Info</Text>
          </TouchableOpacity>
        </Box>

        {/* Security Notice */}
        <Box bg="#F0FDF4" p={16} rounded={14} mb={40} border={1} borderColor="#BBF7D0">
          <HStack items="center">
            <Shield size={20} color="#16A34A" />
            <Text fontSize={12} color="#166534" ml={10} flex={1} lineHeight={18}>
              All card data is encrypted with 256-bit SSL. We never store full card numbers on our servers.
            </Text>
          </HStack>
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16 },
  actionBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F2EF', alignItems: 'center', justifyContent: 'center' },
  addCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: BLUE, borderStyle: 'dashed', borderRadius: 14, padding: 16, marginTop: 4 },
  editBilling: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', alignItems: 'center' },
});
