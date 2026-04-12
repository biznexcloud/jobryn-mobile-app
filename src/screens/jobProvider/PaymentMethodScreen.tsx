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
import { useAuthStore } from '../../store/authStore';
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

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

const DUMMY_CARDS = [
  { id: '1', brand: 'Visa', last4: '4412', expiry: '12/26', isDefault: true },
  { id: '2', brand: 'Mastercard', last4: '8821', expiry: '09/27', isDefault: false },
];

export default function PaymentMethodScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
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
    <Box bg="white" p={16} rounded={16} mb={12} border={1} borderColor={card.isDefault ? FB_BLUE : '#F0F2F5'}>
      <HStack items="center" justify="space-between">
        <HStack items="center" flex={1}>
          <Box bg={card.brand === 'Visa' ? '#1A1F71' : '#EB001B'} px={8} py={4} rounded={6}>
            <Text fontSize={10} fontWeight="800" color="white">{card.brand.toUpperCase()}</Text>
          </Box>
          <VStack ml={14}>
            <Text fontSize={16} fontWeight="700" color="#111827">•••• {card.last4}</Text>
            <Text fontSize={12} color={GRAY_TEXT} mt={1}>Expires {card.expiry}</Text>
          </VStack>
        </HStack>
        <HStack space="sm">
          {card.isDefault ? (
            <Box bg="#F0F9FF" px={10} py={4} rounded={20}>
              <Text fontSize={11} fontWeight="800" color={FB_BLUE}>DEFAULT</Text>
            </Box>
          ) : (
            <>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setDefault(card.id)}>
                <CheckCircle2 size={18} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => removeCard(card.id, card.brand, card.last4)}>
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            </>
          )}
        </HStack>
      </HStack>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Box px={16} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <ChevronLeft size={22} color="black" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>Payment Methods</Text>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Text fontSize={13} fontWeight="700" color={GRAY_TEXT} mb={12} ml={4}>SAVED CARDS</Text>
        {cards.map(card => <CardRow key={card.id} card={card} />)}

        <TouchableOpacity style={styles.addCard} onPress={() => Alert.alert('Add Card', 'Form module loading...')}>
          <Plus size={20} color={FB_BLUE} />
          <Text fontSize={15} fontWeight="700" color={FB_BLUE} ml={8}>Add New Card</Text>
        </TouchableOpacity>

        <Divider color="#E5E7EB" my={24} />

        <Text fontSize={13} fontWeight="700" color={GRAY_TEXT} mb={12} ml={4}>BILLING INFORMATION</Text>
        <Box bg="white" p={16} rounded={16} mb={24}>
          <VStack space="md">
            <HStack justify="space-between">
              <Text fontSize={14} color={GRAY_TEXT}>Company Name</Text>
              <Text fontSize={14} fontWeight="700" color="#111827" numberOfLines={1} flex={1} textAlign="right" ml={16}>
                {user?.company_name || user?.name || 'Your Company Inc.'}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize={14} color={GRAY_TEXT}>Billing Email</Text>
              <Text fontSize={14} fontWeight="700" color="#111827" numberOfLines={1} flex={1} textAlign="right" ml={16}>
                {user?.email || 'accounts@company.com'}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize={14} color={GRAY_TEXT}>Tax ID</Text>
              <Text fontSize={14} fontWeight="700" color="#111827">Pending setup</Text>
            </HStack>
          </VStack>
          <TouchableOpacity style={styles.editBilling} onPress={() => navigation.navigate('EditProfile')}>
            <Text fontSize={14} fontWeight="700" color={FB_BLUE}>Edit Billing Details</Text>
          </TouchableOpacity>
        </Box>

        <Box bg="#F0FDF4" p={16} rounded={16} mb={32}>
          <HStack items="flex-start" space="sm">
            <Shield size={18} color="#16A34A" style={{ marginTop: 2 }} />
            <Text fontSize={13} color="#166534" flex={1} fontWeight="600" lineHeight={18}>
              All transactions are secure and encrypted. We use industry-standard SSL to safeguard your data.
            </Text>
          </HStack>
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' },
  addCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: FB_BLUE, borderStyle: 'dashed', borderRadius: 16, padding: 16, marginTop: 4, backgroundColor: '#F0F9FF' },
  editBilling: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', alignItems: 'center' },
});
