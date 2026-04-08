import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider, Button } from '../../components/ui';
import { ChevronLeft, Plus, Globe, DollarSign, Edit3, Trash2 } from 'lucide-react-native';

import { useFocusEffect } from '@react-navigation/native';

const BLUE = '#1066C2';
const FB_GRAY = '#F0F2F5';

const ServiceCard = ({ service, onEdit, onDelete }: any) => (
  <Box bg="white" p={16} mb={12} rounded={8} border={1} borderColor="#CED0D4">
     <HStack justify="space-between" items="flex-start">
        <VStack flex={1}>
           <Text fontSize={17} fontWeight="700" color="#1C1E21">{service.title}</Text>
           <Text fontSize={15} color={BLUE} fontWeight="600" mt={2}>{service.price}</Text>
           <Text fontSize={14} color="#65676B" mt={8} lineHeight={20}>{service.description}</Text>
        </VStack>
        <HStack space="md">
           <TouchableOpacity onPress={onEdit}>
              <Box w={32} h={32} bg="#F0F2F5" rounded={16} items="center" justify="center">
                 <Edit3 size={16} color="#65676B" />
              </Box>
           </TouchableOpacity>
           <TouchableOpacity onPress={onDelete}>
              <Box w={32} h={32} bg="#FFF1F0" rounded={16} items="center" justify="center">
                 <Trash2 size={16} color="#F5222D" />
              </Box>
           </TouchableOpacity>
        </HStack>
     </HStack>
  </Box>
);

export default function ServiceShowcaseScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Simulate API delay to test loading states
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const mockServices = [
        { id: 1, title: 'Full Stack Web Development', price: '$50 - $100 / hr', description: 'Transforming designs into high-performance web applications using React, Node, and TypeScript.' },
        { id: 2, title: 'UI/UX Mobile Design', price: '$40 - $80 / hr', description: 'Creating intuitive and visually stunning mobile experiences with a focus on user retention.' },
      ];
      setServices(mockServices);
    } catch (e) {
      console.warn('Service fetch failed:', e);
      Alert.alert('Error', 'Unable to load services. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [])
  );

  const handleDelete = (id: number) => {
    Alert.alert('Remove Service', 'Are you sure you want to stop showcasing this service?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setServices(services.filter(s => s.id !== id)) }
    ]);
  };

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor={FB_GRAY}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box pt={insets.top + 10} pb={16} bg="white" borderBottom={1} borderColor="#CED0D4">
         <HStack items="center" px={16} justify="space-between">
            <HStack items="center">
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ChevronLeft size={28} color="#1C1E21" />
               </TouchableOpacity>
               <Text fontSize={18} fontWeight="700" color="#1C1E21" ml={16}>Service Showcasing</Text>
            </HStack>
            <TouchableOpacity onPress={() => navigation.navigate('AddService')}>
               <Plus size={26} color={BLUE} strokeWidth={2.5} />
            </TouchableOpacity>
         </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
         <VStack mb={24}>
            <Text fontSize={20} fontWeight="800" color="#1C1E21">What services do you offer?</Text>
            <Text fontSize={15} color="#65676B" mt={6}>Showcasing services helps potential clients and businesses find you directly.</Text>
         </VStack>

         {loading ? (
            <Box py={100} items="center" justify="center">
               <ActivityIndicator size="large" color={BLUE} />
               <Text mt={16} color="#65676B">Loading your professional services...</Text>
            </Box>
         ) : (
            <>
               {services.length > 0 ? (
                  services.map(s => (
                     <ServiceCard 
                        key={s.id} 
                        service={s} 
                        onEdit={() => navigation.navigate('AddService', { edit: true, service: s })}
                        onDelete={() => handleDelete(s.id)}
                     />
                  ))
               ) : (
                  <Box py={40} px={20} bg="white" rounded={12} items="center">
                     <Text color="#65676B" textAlign="center">No services showcased yet. Add your skills to attract potential clients.</Text>
                  </Box>
               )}
            </>
         )}

         <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddService')}
         >
            <Plus size={22} color={BLUE} strokeWidth={2.5} />
            <Text fontSize={16} fontWeight="700" color={BLUE} ml={10}>Add a new service</Text>
         </TouchableOpacity>

         <Box mt={40}>
            <Button 
               label="Save and show on profile" 
               bg={BLUE} 
               onPress={() => {
                  Alert.alert('Published', 'Your services are now live on your profile.');
                  navigation.goBack();
               }} 
               style={{ height: 50, borderRadius: 25 }}
            />
         </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  addBtn: { 
    height: 52, 
    borderWidth: 2, 
    borderColor: BLUE, 
    borderStyle: 'dashed', 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: 'white',
  },
});
