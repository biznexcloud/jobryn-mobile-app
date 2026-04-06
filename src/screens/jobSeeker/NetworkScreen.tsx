import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  UserPlus,
  ChevronRight,
  Users,
  Search,
  Plus,
  X,
  Bell,
  Check,
  UserCheck,
} from 'lucide-react-native';
import { ConnectionService } from '../../services/api/connections';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/authStore';
import { ScreenWrapper, Text, Box, VStack, HStack, Avatar, Divider, Button } from '../../components/ui';
import { moderateScale, verticalScale } from '../../utils/responsive';
import { MOCK_NETWORK_SUGGESTIONS } from '../../constants/MockData';

const { width } = Dimensions.get('window');
const GRID_SPACING = 12;
const COLUMN_WIDTH = (width - (16 * 2) - GRID_SPACING) / 2;

const BLUE = '#0A66C2'; 
const LIGHT_BLUE = '#EFF6FF';
const GRAY_BG = '#F3F2EF';

export default function NetworkScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>(MOCK_NETWORK_SUGGESTIONS);

  const fetchData = async () => {
    try {
      const data = await ConnectionService.getConnections();
      setConnections(data?.results || (Array.isArray(data) ? data : []));
    } catch (e) {
      console.warn('Network sync error');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const handleConnect = async (userId: string) => {
    try {
      await ConnectionService.connect(userId);
      Toast.show({ type: 'success', text1: 'Request sent' });
      setSuggestions(prev => prev.filter(s => s.id !== userId));
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to send request' });
    }
  };

  const navigateToProfile = (userId: string) => {
    navigation.navigate('PublicProfile', { userId });
  };

  if (loading) {
    return (
      <Box flex={1} bg="white" justify="center" items="center">
        <ActivityIndicator size="large" color={BLUE} />
      </Box>
    );
  }

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor={GRAY_BG}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Top Bar - FB Style Header but with Search Link */}
      <Box px={16} pt={insets.top + 4} pb={12} bg="white">
         <HStack items="center" justify="space-between">
            <Box flex={1} bg="#F0F2F5" rounded={20} h={36} px={12} justify="center">
               <TouchableOpacity onPress={() => navigation.navigate('SearchExplore')}>
                  <HStack items="center">
                     <Search size={18} color="#65676B" />
                     <Text fontSize={14} color="#65676B" ml={8}>Search network</Text>
                  </HStack>
               </TouchableOpacity>
            </Box>
            <TouchableOpacity style={{ marginLeft: 16 }}>
               <Bell size={24} color="#1c1e21" />
            </TouchableOpacity>
         </HStack>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Manage Network Header (Grouped) */}
        <Box bg="white" mb={1} borderBottom={1} borderColor="#E5E7EB">
            <TouchableOpacity style={{ padding: 16 }} onPress={() => {}}>
               <HStack justify="space-between" items="center">
                  <HStack items="center">
                     <Users size={20} color={BLUE} />
                     <Text fontSize={16} fontWeight="700" color={BLUE} ml={12}>Manage my network</Text>
                  </HStack>
                  <ChevronRight size={20} color="#65676B" />
               </HStack>
            </TouchableOpacity>
        </Box>

        {/* Invitations Section */}
        <Box bg="white" mb={8} borderBottom={1} borderColor="#E5E7EB">
           <HStack justify="space-between" items="center" p={16}>
              <Text fontSize={14} fontWeight="800" color="#65676B">Invitations (3)</Text>
              <TouchableOpacity>
                 <Text fontSize={14} fontWeight="800" color={BLUE}>Manage</Text>
              </TouchableOpacity>
           </HStack>
           
           <Divider color="#F3F2EF" />
           
           <Box p={16}>
              <HStack items="center">
                 <TouchableOpacity onPress={() => navigateToProfile('invite-1')}>
                    <Avatar source={{ uri: 'https://i.pravatar.cc/150?u=invite' }} style={{ width: 56, height: 56, borderRadius: 28 }} />
                 </TouchableOpacity>
                 <VStack ml={12} flex={1}>
                    <TouchableOpacity onPress={() => navigateToProfile('invite-1')}>
                       <Text fontSize={15} fontWeight="800" color="#1c1e21">Kiran Adhikari</Text>
                       <Text fontSize={13} color="#65676B" numberOfLines={1}>Talent Acquisition @ GlobalTech</Text>
                       <HStack items="center" mt={4}>
                          <UserCheck size={12} color="#65676B" />
                          <Text fontSize={12} color="#65676B" ml={4}>8 mutual connections</Text>
                       </HStack>
                    </TouchableOpacity>
                 </VStack>
                 <HStack space="sm">
                    <TouchableOpacity style={styles.actionIconCircle}>
                       <X size={20} color="#65676B" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionIconCircle, { borderColor: BLUE }]}>
                       <Check size={20} color={BLUE} />
                    </TouchableOpacity>
                 </HStack>
              </HStack>
           </Box>
        </Box>

        {/* People You May Know - Grid Layout */}
        <Box px={16} pb={20}>
           <Text fontSize={16} fontWeight="800" color="#1c1e21" mb={12}>People you may know</Text>
           
           <Box style={styles.gridContainer}>
              {suggestions.map((item) => (
                 <TouchableOpacity 
                    key={item.id}
                    activeOpacity={0.9} 
                    onPress={() => navigateToProfile(item.id)}
                    style={styles.suggestionCard}
                 >
                    <Box h={moderateScale(60)} bg="#E5E7EB">
                       <Image 
                          source={{ uri: item.banner }} 
                          style={StyleSheet.absoluteFillObject} 
                          resizeMode="cover"
                       />
                       <Box bg="rgba(0,0,0,0.1)" style={StyleSheet.absoluteFillObject} />
                    </Box>
                    
                    <Box style={styles.cardAvatarWrapper}>
                       <Avatar 
                          source={{ uri: item.avatar }} 
                          size={72} 
                          style={{ borderWidth: 3, borderColor: 'white' }} 
                       />
                    </Box>

                    <VStack items="center" p={12} pt={40} flex={1} justify="space-between">
                       <VStack items="center">
                          <Text fontSize={15} fontWeight="900" color="#1c1e21" textAlign="center" numberOfLines={1}>
                             {item.name}
                          </Text>
                          <Text fontSize={12} color="#65676B" mt={2} textAlign="center" numberOfLines={2} h={moderateScale(34)}>
                             {item.role}
                          </Text>
                       </VStack>
                       
                       <HStack mt={8} items="center">
                          <Users size={12} color="#65676B" />
                          <Text fontSize={11} color="#65676B" ml={4}>{item.mutual} mutuals</Text>
                       </HStack>
                    </VStack>

                    <Box p={12} pt={0}>
                       <TouchableOpacity 
                          style={styles.connectOutlineBtn}
                          onPress={() => handleConnect(item.id)}
                       >
                          <Text fontSize={14} fontWeight="800" color={BLUE}>Connect</Text>
                       </TouchableOpacity>
                    </Box>
                    
                    <TouchableOpacity style={styles.closeBtn}>
                       <X size={16} color="white" />
                    </TouchableOpacity>
                 </TouchableOpacity>
              ))}
           </Box>
        </Box>

        <Box items="center" py={40}>
           <Text fontSize={12} color="#94A3B8" fontWeight="800" letterSpacing={1}>JOBRYN NETWORK</Text>
           <Text fontSize={11} color="#94A3B8" mt={4}>Grow your professional influence</Text>
        </Box>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  actionIconCircle: {
     width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#CED0D4', alignItems: 'center', justifyContent: 'center'
  },
  gridContainer: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     justifyContent: 'space-between',
  },
  suggestionCard: {
     width: COLUMN_WIDTH,
     backgroundColor: 'white',
     borderRadius: 12,
     marginBottom: GRID_SPACING,
     overflow: 'hidden',
     borderWidth: 1,
     borderColor: '#E5E7EB',
     elevation: 2,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.08,
     shadowRadius: 4,
     height: verticalScale(250),
  },
  cardBanner: {
     width: '100%', height: moderateScale(60), backgroundColor: '#A0A0A0'
  },
  cardAvatarWrapper: {
     position: 'absolute', top: moderateScale(24), alignSelf: 'center', zIndex: 1
  },
  connectOutlineBtn: {
     width: '100%', height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: BLUE, alignItems: 'center', justifyContent: 'center'
  },
  closeBtn: {
     position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center'
  }
});
