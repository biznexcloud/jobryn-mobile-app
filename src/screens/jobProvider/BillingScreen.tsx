import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft as ChevronLeftIcon,
  CreditCard as CreditCardIcon,
  BadgeCheck as CheckIcon,
  ChevronRight as ChevronRightIcon,
  RefreshCw as RefreshIcon,
  Lock as LockClosedIcon,
} from 'lucide-react-native';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';

const BLUE = '#0A66C2';
const GRAY_BG = '#F3F2EF';

export default function BillingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(false);

  const PlanOption = ({ title, price, features, isCurrent }: any) => (
    <Box bg="white" p={20} rounded={12} mb={16} border={2} borderColor={isCurrent ? BLUE : '#E5E7EB'}>
       <HStack justify="space-between" items="center" mb={12}>
          <Text fontSize={18} fontWeight="700" color="#1F2937">{title}</Text>
          {isCurrent && (
             <Box bg="#EDF3F8" px={10} py={4} rounded={4}>
                <Text fontSize={11} fontWeight="700" color={BLUE}>CURRENT PLAN</Text>
             </Box>
          )}
       </HStack>
       <Text fontSize={24} fontWeight="700" color="#1F2937" mb={16}>{price}</Text>
       <VStack space="sm" mb={20}>
          {features.map((f: string, i: number) => (
             <HStack items="center" key={i}>
                <CheckIcon size={18} color="#057642" />
                <Text fontSize={14} color="#475569" ml={10}>{f}</Text>
             </HStack>
          ))}
       </VStack>
       <Button 
          title={isCurrent ? "Manage Plan" : "Upgrade Now"} 
          variant={isCurrent ? "outline" : "solid"} 
          onPress={() => navigation.navigate('Billing')} 
          style={!isCurrent && { backgroundColor: BLUE }}
          textStyle={isCurrent && { color: BLUE }}
       />
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <Box px={16} pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#E5E7EB">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeftIcon size={24} color="#1F2937" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text fontSize={20} color="#1F2937" fontWeight="700" ml={16}>Billing & Plans</Text>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
         <Box bg="white" p={16} rounded={12} mb={20} border={1} borderColor="#E5E7EB">
            <HStack items="center" justify="space-between" mb={12}>
               <Text fontSize={14} color="#6B7280" fontWeight="700">ACTIVE PAYMENT METHOD</Text>
               <TouchableOpacity onPress={() => navigation.navigate('PaymentMethod')}><Text fontSize={14} fontWeight="700" color={BLUE}>Change</Text></TouchableOpacity>
            </HStack>
            <HStack items="center">
               <View style={styles.cardIconBox}><CreditCardIcon size={24} color="#475569" /></View>
               <VStack ml={12}>
                  <Text fontSize={16} fontWeight="700" color="#1F2937">Visa ending in 4412</Text>
                  <Text fontSize={13} color="#6B7280">Expires 12/26</Text>
               </VStack>
               <HStack flex={1} justify="flex-end"><LockClosedIcon size={18} color="#9CA3AF" /></HStack>
            </HStack>
         </Box>

         <Text fontSize={14} color="#6B7280" fontWeight="700" ml={4} mb={10}>SUBSCRIPTION PLANS</Text>
         <PlanOption 
            label="Recruiter Professional" 
            price="$89.99/mo" 
            isCurrent={true}
            features={[
               "Single user license",
               "Up to 20 active job postings",
               "Search through all candidates",
               "10 Inbound messages per day"
            ]}
         />
         <PlanOption 
            label="Nexus Corporate" 
            price="$299.99/mo" 
            isCurrent={false}
            features={[
               "Up to 5 team members",
               "Unlimited job postings",
               "Priority candidate matching",
               "Unlimited messaging & scheduling",
               "Dedicated support manager"
            ]}
         />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16 },
  cardIconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#F3F2EF', alignItems: 'center', justifyContent: 'center' },
});





