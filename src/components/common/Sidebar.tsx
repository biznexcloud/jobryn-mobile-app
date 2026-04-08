import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Platform,
  Image,
  StyleSheet,
} from 'react-native';
import { moderateScale, verticalScale } from '../../utils/responsive';
import {
  UserIcon,
  CogIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  LogoutIcon,
  BriefcaseIcon,
  ChatAlt2Icon as ChatAlt2Icon,
  CalendarIcon,
  AcademicCapIcon,
  OfficeBuildingIcon as OfficeBuildingIcon,
  UsersIcon as UserGroupIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
} from 'react-native-heroicons/outline';
import { useAuthStore } from '../../store/authStore';
import { HStack, VStack, Avatar } from '../ui';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.78;

const HEADER_GREEN = '#B2EF82';
const BLUE = '#0A66C2';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: any;
  role: 'jobProvider' | 'jobSeeker';
}

export default function Sidebar({ isOpen, onClose, navigation, role }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [isRendered, setIsRendered] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 170 }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 250, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(() => setIsRendered(false));
    }
  }, [isOpen]);

  const navigateTo = (screen: string, params?: any) => {
    onClose();
    if (screen) navigation.navigate(screen, params);
  };

  const MenuItem = ({ label, icon: Icon, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
       <Icon size={24} color="#666666" />
       <Text style={styles.menuLabel}>{label}</Text>
       <ChevronRightIcon size={16} color="#999999" />
    </TouchableOpacity>
  );

  if (!isRendered) return null;

  const menuItems = role === 'jobSeeker' ? [
    { label: 'Screens Models & Features', isHeader: true },
    { label: 'View Profile',      icon: UserIcon,          screen: 'SeekerProfile' },
    { label: 'My Portfolio',      icon: BriefcaseIcon,     screen: 'Portfolio' },
    { label: 'My Applications',   icon: DocumentTextIcon,  screen: 'SeekerRoot', params: { screen: 'Applied' } },
    { label: 'Meetings',          icon: CalendarIcon,      screen: 'Meetings' },
    { label: 'Learning Center',   icon: AcademicCapIcon,   screen: 'Learning' },
    { label: 'Wallet & Billing',  icon: CurrencyDollarIcon, screen: 'Wallet' },
    { label: 'Account Settings',  icon: CogIcon,           screen: 'Settings' },
  ] : [
    { label: 'Recruiter Models & Features', isHeader: true },
    { label: 'Company Profile',   icon: OfficeBuildingIcon, screen: 'ProviderProfile' },
    { label: 'Manage Postings',   icon: BriefcaseIcon,      screen: 'ProviderRoot', params: { screen: 'Managed' } },
    { label: 'Applicants Queue',  icon: UserGroupIcon,      screen: 'ProviderRoot', params: { screen: 'Pipeline' } },
    { label: 'Billing & Plans',   icon: CreditCardIcon,     screen: 'Billing' },
    { label: 'Account Settings',  icon: CogIcon,            screen: 'ProviderSettings' },
  ];

  return (
    <View style={StyleSheet.absoluteFill}>
       <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
       </Pressable>

       <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.drawerHeader}>
             <View style={styles.greenBand} />
             <HStack items="center" mt={10}>
                <Avatar source={{ uri: user?.profile_picture || `https://i.pravatar.cc/150?u=${user?.email || 'guest'}` }} size="lg" />
                <VStack ml={12}>
                   <Text style={styles.userName}>{user?.name || 'Professional'}</Text>
                   <Text style={styles.userRole}>{user?.job_title || (role === 'jobSeeker' ? 'Expert' : 'Talent Acquisition')}</Text>
                </VStack>
             </HStack>
          </View>

          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
             {menuItems.map((item, idx) => {
                if (item.isHeader) {
                   return (
                      <View key={idx} style={styles.menuHeader}>
                         <Text style={styles.menuHeaderText}>{item.label}</Text>
                      </View>
                   );
                }
                return (
                   <MenuItem 
                      key={idx} 
                      label={item.label} 
                      icon={item.icon} 
                      onPress={() => item.screen && navigateTo(item.screen, item.params)} 
                   />
                );
             })}

             <View style={styles.divider} />
             
             <MenuItem 
                label="Sign Out" 
                icon={LogoutIcon} 
                onPress={() => { onClose(); logout(); }} 
             />
          </ScrollView>

          <View style={styles.footer}>
             <Text style={styles.versionText}>Jobryn Mobile v2.0.4</Text>
             <Text style={styles.statusText}>Stable Infrastructure Connected</Text>
          </View>
       </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  drawer: { width: DRAWER_WIDTH, height: '100%', backgroundColor: 'white', position: 'absolute', left: 0, top: 0 },
  drawerHeader: { padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  greenBand: { position: 'absolute', top: 0, left: 0, right: 0, height: 80, backgroundColor: HEADER_GREEN, opacity: 0.2 },
  userName: { fontSize: 18, fontWeight: '700', color: '#000000' },
  userRole: { fontSize: 13, color: '#666666' },
  menuContainer: { padding: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, marginBottom: 4 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: '#000000', flex: 1, marginLeft: 16 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 16 },
  footer: { padding: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  menuHeaderText: { fontSize: 13, fontWeight: '700', color: '#999999', textTransform: 'uppercase', letterSpacing: 1 },
  menuHeader: { paddingVertical: 10, marginTop: 10 },
  versionText: { fontSize: 10, color: '#999999', fontWeight: '700' },
  statusText: { fontSize: 10, color: '#057642', marginTop: 4, fontWeight: '700' },
});
