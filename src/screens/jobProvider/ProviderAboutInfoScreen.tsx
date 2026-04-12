import React from 'react';
import { View, TouchableOpacity, StatusBar, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Divider } from '../../components/ui';
import { 
  Pencil as PencilIcon, 
  ChevronLeft as ChevronLeftIcon,
  Building as BuildingIcon,
  Users as UsersIcon,
  Globe as GlobeIcon,
  Sparkles as SparklesIcon,
  Link as LinkIcon,
  Mail as MailIcon
} from 'lucide-react-native';

const FB_BLUE = '#1877F2'; 
const FB_GRAY = '#F0F2F5';
const GRAY_TEXT = '#65676B';

import { useAuthStore } from '../../store/authStore';

export default function ProviderAboutInfoScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const CategoryHeader = ({ title }: { title: string }) => (
    <Text fontSize={13} fontWeight="700" color={GRAY_TEXT} mb={12} mt={24} ml={4}>{title.toUpperCase()}</Text>
  );

  const InfoRow = ({ icon: Icon, title, subtitle, canEdit = true }: any) => (
    <HStack items="center" mb={16} px={4}>
      <Box w={36} h={36} rounded={18} bg={FB_GRAY} items="center" justify="center">
        <Icon size={18} color="#1F2937" />
      </Box>
      <VStack ml={12} flex={1}>
        <Text fontSize={16} fontWeight="600" color="#111827">{title}</Text>
        {subtitle && <Text fontSize={14} color={GRAY_TEXT} mt={1}>{subtitle}</Text>}
      </VStack>
      {canEdit && (
        <TouchableOpacity style={styles.editBtn}>
          <PencilIcon size={14} color="#1F2937" />
        </TouchableOpacity>
      )}
    </HStack>
  );

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box px={16} pt={insets.top + 8} pb={12} bg="white" borderBottom={1} borderColor="#F0F2F5">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <ChevronLeftIcon size={22} color="black" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text fontSize={17} fontWeight="700" color="#111827" ml={12}>About Company</Text>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 60 }}>
        
        <CategoryHeader title="Overview" />
        <InfoRow icon={BuildingIcon} title="Industry" subtitle="Information Technology & Services" />
        <InfoRow icon={UsersIcon} title="Company Size" subtitle="201-500 employees" />
        <InfoRow icon={GlobeIcon} title="Headquarters" subtitle="Palo Alto, California, US" />

        <Divider mt={8} color="#F3F4F6" />

        <CategoryHeader title="Hiring Status" />
        <InfoRow icon={SparklesIcon} title="Current Outlook" subtitle="Actively Hiring (24 open roles)" />
        <InfoRow icon={UsersIcon} title="Culture" subtitle="Remote-first, Agile, Inclusive" />

        <Divider mt={8} color="#F3F4F6" />

        <CategoryHeader title="Links" />
        <InfoRow icon={LinkIcon} title="Website" subtitle="https://company.io" />
        <InfoRow icon={LinkIcon} title="Twitter" subtitle="@company_inc" />
        <InfoRow icon={LinkIcon} title="Link" subtitle="linkedin.com/company/company-inc" />

        <Divider mt={8} color="#F3F4F6" />

        <CategoryHeader title="Contact" />
        <InfoRow icon={MailIcon} title="Recruiter Email" subtitle={user?.email || "hr@innovatetech.io"} canEdit={false} />
        <InfoRow icon={MailIcon} title="Support" subtitle="contact@company.io" canEdit={false} />
        
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  editBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#F0F2F5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
