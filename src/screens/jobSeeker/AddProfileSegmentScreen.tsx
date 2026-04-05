import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';
import { ChevronLeft, Plus, GraduationCap, Briefcase, Award, Layers, UserPlus } from 'lucide-react-native';

export default function AddProfileSegmentScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const CategorySection = ({ title, options }: any) => (
    <Box mb={20}>
      <Text fontSize={18} fontWeight="800" color="#1C1E21" mb={12} px={16}>{title}</Text>
      <VStack bg="white">
        {options.map((opt: any, idx: number) => (
          <React.Fragment key={idx}>
            <TouchableOpacity onPress={opt.onPress} style={styles.segmentBtn}>
              <HStack items="center" px={16} py={14}>
                <Box w={36} h={36} rounded={18} bg="#F0F2F5" items="center" justify="center">
                   <opt.icon size={20} color="#65676B" />
                </Box>
                <VStack ml={14} flex={1}>
                   <Text fontSize={16} color="#1C1E21">{opt.title}</Text>
                   <Text fontSize={13} color="#65676B" mt={2}>{opt.subtitle}</Text>
                </VStack>
                <Plus size={20} color="#1877F2" />
              </HStack>
            </TouchableOpacity>
            {idx < options.length - 1 && <Divider color="#E5E7EB" mx={16} />}
          </React.Fragment>
        ))}
      </VStack>
    </Box>
  );

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="#F0F2F5">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box pt={insets.top + 10} pb={12} bg="white" shadow={1}>
         <HStack items="center" px={16}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
               <ChevronLeft size={26} color="#1C1E21" />
            </TouchableOpacity>
            <Text fontSize={18} fontWeight="700" color="#1C1E21" ml={16}>Add profile section</Text>
         </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
         <CategorySection 
            title="About" 
            options={[
              { icon: UserPlus, title: 'Add bio', subtitle: 'Tell the world about your professional journey', onPress: () => navigation.navigate('EditBio') },
            ]}
         />

         <CategorySection 
            title="Core" 
            options={[
              { icon: GraduationCap, title: 'Add education', subtitle: 'Show off your degrees and certifications', onPress: () => navigation.navigate('AddEducation') },
              { icon: Briefcase, title: 'Add position', subtitle: 'List your work experience', onPress: () => navigation.navigate('AddExperience') },
              { icon: Layers, title: 'Add project', subtitle: 'Highlight specific projects', onPress: () => navigation.navigate('AddProject') },
            ]}
         />

         <CategorySection 
            title="Recommended" 
            options={[
              { icon: Award, title: 'Add certification', subtitle: 'List your professional credentials', onPress: () => navigation.navigate('AddCertification') },
              { icon: Layers, title: 'Add skills', subtitle: 'Showcase your expert skills', onPress: () => {} },
            ]}
         />

         <CategorySection 
            title="Additional" 
            options={[
              { icon: UserPlus, title: 'Add volunteer work', subtitle: 'Share your community involvement', onPress: () => {} },
              { icon: Award, title: 'Add awards', subtitle: 'Show off your professional recognition', onPress: () => {} },
            ]}
         />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  segmentBtn: { backgroundColor: 'white' },
});
