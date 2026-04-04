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

export default function ProviderAboutInfoScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();

  const CategoryHeader = ({ title }: { title: string }) => (
    <Text fontSize={18} fontWeight="800" color="#1C1E21" mb={12} mt={16}>{title}</Text>
  );

  const InfoRow = ({ icon: Icon, title, subtitle, canEdit = true }: any) => (
    <HStack items="flex-start" mb={16}>
      <Icon size={28} color="#8A8D91" />
      <VStack ml={12} flex={1}>
        <Text fontSize={16} fontWeight="600" color="#1C1E21">{title}</Text>
        {subtitle && <Text fontSize={14} color="#65676B" mt={2}>{subtitle}</Text>}
      </VStack>
      {canEdit && (
        <TouchableOpacity style={styles.editBtn}>
          <PencilIcon size={16} color="#1C1E21" />
        </TouchableOpacity>
      )}
    </HStack>
  );

  return (
    <ScreenWrapper safeAreaTop backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Box px={16} py={12} borderBottom={1} borderColor="#CED0D4">
        <HStack items="center">
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ChevronLeftIcon size={24} color="#1C1E21" />
          </TouchableOpacity>
          <Text fontSize={18} fontWeight="800" color="#1C1E21" ml={16}>About Company</Text>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        
        <CategoryHeader title="Company Overview" />
        <InfoRow icon={BuildingIcon} title="Industry" subtitle="Information Technology & Services" />
        <InfoRow icon={UsersIcon} title="Company Size" subtitle="201-500 employees" />
        <InfoRow icon={GlobeIcon} title="Headquarters" subtitle="Palo Alto, California, US" />

        <Divider mb={8} color="#CED0D4" />

        <CategoryHeader title="Recruitment Vitals" />
        <InfoRow icon={SparklesIcon} title="Hiring Status" subtitle="Actively Hiring (24 open roles)" />
        <InfoRow icon={UsersIcon} title="Team Culture" subtitle="Remote-first, Agile, Inclusive" />

        <Divider mb={8} color="#CED0D4" />

        <CategoryHeader title="Online Presence" />
        <InfoRow icon={LinkIcon} title="Website" subtitle="https://innovatetech.io" />
        <InfoRow icon={LinkIcon} title="Twitter" subtitle="@innovate_tech" />
        <InfoRow icon={LinkIcon} title="LinkedIn" subtitle="linkedin.com/company/innovate-tech" />

        <Divider mb={8} color="#CED0D4" />

        <CategoryHeader title="Contact Info" />
        <InfoRow icon={MailIcon} title="HR Department" subtitle="hr@innovatetech.io" canEdit={false} />
        <InfoRow icon={MailIcon} title="Business Inquiries" subtitle="contact@innovatetech.io" canEdit={false} />
        
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  editBtn: {
    padding: 8,
    backgroundColor: '#F0F2F5',
    borderRadius: 20
  }
});





