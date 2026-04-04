import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, HStack, VStack } from '../../components/ui';
import { ChevronLeftIcon, UserGroupIcon, BadgeCheckIcon as CheckIcon, XIcon } from 'react-native-heroicons/outline';
import { ConnectionService } from '../../services/api/connections';
import { moderateScale, verticalScale } from '../../utils/responsive';

const BLUE = '#4F46E5';

const TABS = ['Connections', 'Requests'];

const MOCK_CONNECTIONS = [
  { id: 1, name: 'Binod Tamang', role: 'React Native Dev', mutual: 8, avatar: 'https://i.pravatar.cc/150?u=binod' },
  { id: 2, name: 'Priya Mehta', role: 'UI/UX Designer', mutual: 5, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 3, name: 'Saurav Koirala', role: 'Backend Engineer', mutual: 12, avatar: 'https://i.pravatar.cc/150?u=saurav' },
];

const MOCK_REQUESTS = [
  {
    id: 1, name: 'Alice Johnson', role: 'Product Manager', avatar: 'https://i.pravatar.cc/150?img=10',
    message: 'Hi! I noticed your company\'s open roles and would love to connect.',
  },
  {
    id: 2, name: 'Raju Pandey', role: 'DevOps Engineer', avatar: 'https://i.pravatar.cc/150?u=raju',
    message: null,
  },
];

export default function ProviderNetworkScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Connections');
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const acceptRequest = async (id: number) => {
    try {
      await ConnectionService.acceptRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.warn('Accept failed');
    }
  };

  const declineRequest = async (id: number) => {
    try {
      await ConnectionService.declineRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.warn('Decline failed');
    }
  };

  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="#F9FAFB">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(8) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeftIcon size={moderateScale(22)} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text fontSize={moderateScale(17)} fontWeight="800" color="#111827">Network</Text>
        <View style={{ width: moderateScale(36) }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text fontSize={moderateScale(14)} fontWeight="700" color={activeTab === tab ? BLUE : '#6B7280'}>
              {tab}{tab === 'Requests' ? ` (${requests.length})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Connections' ? (
        <FlatList
          data={MOCK_CONNECTIONS}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{
            padding: moderateScale(16),
            paddingBottom: Math.max(insets.bottom + moderateScale(20), moderateScale(40)),
          }}
          ItemSeparatorComponent={() => <View style={{ height: moderateScale(10) }} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <HStack items="center">
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <VStack ml={moderateScale(12)} flex={1}>
                  <Text fontSize={moderateScale(15)} fontWeight="700" color="#111827">{item.name}</Text>
                  <Text fontSize={moderateScale(13)} color="#6B7280" mt={2}>{item.role}</Text>
                  <HStack items="center" mt={4}>
                    <UserGroupIcon size={moderateScale(13)} color="#9CA3AF" />
                    <Text fontSize={moderateScale(12)} color="#9CA3AF" ml={3}>{item.mutual} mutual</Text>
                  </HStack>
                </VStack>
                <TouchableOpacity style={styles.msgBtn}>
                  <Text fontSize={moderateScale(13)} fontWeight="700" color={BLUE}>Message</Text>
                </TouchableOpacity>
              </HStack>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{
            padding: moderateScale(16),
            paddingBottom: Math.max(insets.bottom + moderateScale(20), moderateScale(40)),
          }}
          ItemSeparatorComponent={() => <View style={{ height: moderateScale(10) }} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <UserGroupIcon size={moderateScale(40)} color="#E5E7EB" />
              <Text fontSize={moderateScale(15)} fontWeight="700" color="#9CA3AF" mt={moderateScale(12)}>No pending requests</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <HStack items="flex-start">
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <VStack ml={moderateScale(12)} flex={1}>
                  <Text fontSize={moderateScale(15)} fontWeight="700" color="#111827">{item.name}</Text>
                  <Text fontSize={moderateScale(13)} color="#6B7280" mt={2}>{item.role}</Text>
                  {item.message && (
                    <View style={styles.msgBubble}>
                      <Text fontSize={moderateScale(12)} color="#4B5563" style={{ fontStyle: 'italic' }}>"{item.message}"</Text>
                    </View>
                  )}
                  <HStack mt={moderateScale(14)} style={{ gap: moderateScale(10) }}>
                    <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptRequest(item.id)}>
                      <CheckIcon size={moderateScale(16)} color="#FFFFFF" strokeWidth={2.5} />
                      <Text fontSize={moderateScale(13)} fontWeight="700" color="#FFFFFF" ml={moderateScale(6)}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineBtn} onPress={() => declineRequest(item.id)}>
                      <XIcon size={moderateScale(16)} color="#6B7280" strokeWidth={2.5} />
                      <Text fontSize={moderateScale(13)} fontWeight="700" color="#6B7280" ml={moderateScale(6)}>Decline</Text>
                    </TouchableOpacity>
                  </HStack>
                </VStack>
              </HStack>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(14), borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18),
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    paddingHorizontal: moderateScale(16), borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  tab: { paddingVertical: moderateScale(12), marginRight: moderateScale(24), borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: BLUE },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: moderateScale(14), padding: moderateScale(16),
    borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  avatar: { width: moderateScale(52), height: moderateScale(52), borderRadius: moderateScale(26), backgroundColor: '#F3F4F6' },
  msgBtn: {
    borderWidth: 1.5, borderColor: BLUE, paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(7), borderRadius: moderateScale(20),
  },
  msgBubble: {
    backgroundColor: '#F3F4F6', borderRadius: moderateScale(10),
    padding: moderateScale(10), marginTop: moderateScale(10),
  },
  acceptBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: BLUE, height: moderateScale(40), borderRadius: moderateScale(10),
  },
  declineBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F3F4F6', height: moderateScale(40), borderRadius: moderateScale(10),
  },
  emptyState: { alignItems: 'center', paddingTop: verticalScale(60) },
});





