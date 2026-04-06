import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Share, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { ScreenWrapper, Text, Box, HStack, VStack } from '../../components/ui';
import { MOCK_PHOTOS } from '../../constants/MockData';

const { width, height } = Dimensions.get('window');

export default function PhotoViewerScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { initialIndex = 0 } = route.params || {};
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  return (
    <ScreenWrapper safeAreaTop={false} backgroundColor="black">
      <StatusBar barStyle="light-content" />
      
      {/* Header Overlay */}
      <Box 
        position="absolute" 
        top={insets.top} 
        left={0} 
        right={0} 
        zIndex={100} 
        px={16} 
        pt={12}
        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
      >
         <HStack justify="space-between" items="center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <X size={28} color="white" />
            </TouchableOpacity>
            <VStack items="center">
               <Text color="white" fontWeight="700" fontSize={16}>Photo {currentIndex + 1} of {MOCK_PHOTOS.length}</Text>
               <Text color="#9CA3AF" fontSize={12}>Uploaded 2 days ago</Text>
            </VStack>
            <TouchableOpacity>
               <Share size={24} color="white" />
            </TouchableOpacity>
         </HStack>
      </Box>

      {/* Photo View */}
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: width * initialIndex, y: 0 }}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      >
         {MOCK_PHOTOS.map((uri, idx) => (
            <View key={idx} style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
               <Image 
                  source={{ uri }} 
                  style={{ width, height: width * 1.5, resizeMode: 'contain' }} 
               />
            </View>
         ))}
      </ScrollView>

      {/* Footer Overlay */}
      <Box 
        position="absolute" 
        bottom={insets.bottom} 
        left={0} 
        right={0} 
        zIndex={100} 
        p={20}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
         <HStack justify="space-between" items="center">
            <Text color="white" fontSize={14}>Work at TechCorp Solutions Office</Text>
            <HStack space="lg">
               <TouchableOpacity><Text color="white" fontWeight="700">Edit</Text></TouchableOpacity>
               <TouchableOpacity><Text color="#F5222D" fontWeight="700">Delete</Text></TouchableOpacity>
            </HStack>
         </HStack>
      </Box>
    </ScreenWrapper>
  );
}
