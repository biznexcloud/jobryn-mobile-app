import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';
import { ChevronLeft, Briefcase, UserPlus, ShieldCheck, ChevronRight } from 'lucide-react-native';

export default function OpenToSelectionScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const OptionItem = ({ icon: Icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.optionContainer}>
      <HStack items="center" px={16} py={16}>
        <Box w={44} h={44} rounded={22} bg="#F0F2F5" items="center" justify="center">
           <Icon size={22} color="#1C1E21" />
        </Box>
        <VStack ml={16} flex={1}>
           <Text fontSize={16} fontWeight="700" color="#1C1E21">{title}</Text>
           <Text fontSize={14} color="#65676B" mt={2}>{subtitle}</Text>
        </VStack>
        <ChevronRight size={20} color="#65676B" />
      </HStack>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box pt={insets.top + 10} pb={12} bg="white" borderBottom={1} borderColor="#E5E7EB">
         <HStack items="center" px={16}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
               <ChevronLeft size={26} color="#1C1E21" />
            </TouchableOpacity>
            <Text fontSize={18} fontWeight="700" color="#1C1E21" ml={16}>Open to</Text>
         </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
         <Box p={16}>
            <Text fontSize={20} fontWeight="800" color="#1C1E21" mb={8}>What are you looking for?</Text>
            <Text fontSize={15} color="#65676B" mb={20}>Select an option to show recruiters and your network that you're open to new opportunities.</Text>
         </Box>

         <VStack>
            <OptionItem 
               icon={Briefcase} 
               title="Finding a new job" 
               subtitle="Show recruiters you're looking for a job"
               onPress={() => navigation.navigate('JobPreferences')}
            />
            <Divider color="#E5E7EB" mx={16} />
            <OptionItem 
               icon={UserPlus} 
               title="Hiring" 
               subtitle="Share that you're hiring and find qualified candidates"
               onPress={() => navigation.navigate('PostJob')}
            />
            <Divider color="#E5E7EB" mx={16} />
            <OptionItem 
               icon={ShieldCheck} 
               title="Providing services" 
               subtitle="Showcase services you offer so new clients can find you"
               onPress={() => navigation.navigate('ServiceShowcase')}
            />
         </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  optionContainer: { backgroundColor: 'white' },
});
