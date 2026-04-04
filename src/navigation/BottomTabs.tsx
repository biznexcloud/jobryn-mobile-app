import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HomeIcon,
  BriefcaseIcon,
  PlusIcon,
  BellIcon,
  BookmarkIcon,
  UsersIcon,
} from 'react-native-heroicons/outline';
import {
  HomeIcon as HomeIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  PlusIcon as PlusIconSolid,
  BellIcon as BellIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  UsersIcon as UsersIconSolid,
} from 'react-native-heroicons/solid';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from '../utils/responsive';

const Tab = createBottomTabNavigator();

// ─── Seeker Tab Screens ────────────────────────────────────────────────────────
import SeekerDashboard from '../screens/jobSeeker/DashboardScreen';
import NetworkScreen from '../screens/jobSeeker/NetworkScreen';
import AppliedJobsScreen from '../screens/jobSeeker/AppliedJobsScreen';
import JobListScreen from '../screens/jobSeeker/JobListScreen';
import MeetingsScreen from '../screens/jobSeeker/MeetingsScreen';

// ─── Provider Tab Screens ──────────────────────────────────────────────────────
import ProviderDashboard from '../screens/jobProvider/DashboardScreen';
import ApplicantsScreen from '../screens/jobProvider/ApplicantsScreen';
import PostJobScreen from '../screens/jobProvider/PostJobScreen';
import JobPostingsScreen from '../screens/jobProvider/JobPostingsScreen';

export function SeekerTabs() {
  const insets = useSafeAreaInsets();
  
  const tabBarStyle = {
    height: verticalScale(60) + (insets.bottom > 0 ? insets.bottom - 4 : 8),
    paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 8,
    paddingTop: verticalScale(8),
    borderTopColor: '#F1F5F9',
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  };

  const seekerOptions = {
    headerShown: false,
    tabBarActiveTintColor: '#0A66C2', // Standard LinkedIn Blue
    tabBarInactiveTintColor: '#94A3B8',
    tabBarLabelStyle: { fontSize: moderateScale(10), fontWeight: '700' as const, marginBottom: 4 },
    tabBarStyle,
  };

  return (
    <Tab.Navigator screenOptions={seekerOptions}>

      <Tab.Screen
        name="Home"
        component={SeekerDashboard}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <HomeIconSolid size={size} color={color} />
              : <HomeIcon size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Network"
        component={NetworkScreen}
        options={{
          tabBarLabel: 'My Network',
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <UsersIconSolid size={size} color={color} />
              : <UsersIcon size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Jobs"
        component={JobListScreen}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <BriefcaseIconSolid size={size} color={color} />
              : <BriefcaseIcon size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Applied"
        component={AppliedJobsScreen}
        options={{
          tabBarLabel: 'Applied',
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <BookmarkIconSolid size={size} color={color} />
              : <BookmarkIcon size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Meetings"
        component={MeetingsScreen}
        initialParams={{ role: 'jobSeeker' }}
        options={{
          tabBarLabel: 'Meetings',
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <BellIconSolid size={size} color={color} />
              : <BellIcon size={size} color={color} />,
        }}
      />

    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export function ProviderTabs() {
  const insets = useSafeAreaInsets();

  const tabBarStyle = {
    height: verticalScale(60) + (insets.bottom > 0 ? insets.bottom - 4 : 8),
    paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 8,
    paddingTop: verticalScale(8),
    borderTopColor: '#F1F5F9',
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  };

  const providerOptions = {
    headerShown: false,
    tabBarActiveTintColor: '#0A66C2',
    tabBarInactiveTintColor: '#94A3B8',
    tabBarLabelStyle: { fontSize: moderateScale(10), fontWeight: '700' as const, marginBottom: 4 },
    tabBarStyle,
  };

  return (
    <Tab.Navigator screenOptions={providerOptions}>

      <Tab.Screen
        name="Home"
        component={ProviderDashboard}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <HomeIconSolid size={size} color={color} />
              : <HomeIcon size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Pipeline"
        component={ApplicantsScreen}
        options={{
          tabBarLabel: 'Pipeline',
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <UsersIconSolid size={size} color={color} />
              : <UsersIcon size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Post"
        component={PostJobScreen}
        options={{
          tabBarLabel: 'Post Job',
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <PlusIconSolid size={size} color={color} />
              : <PlusIcon size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Managed"
        component={JobPostingsScreen}
        options={{
          tabBarLabel: 'My Jobs',
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <BriefcaseIconSolid size={size} color={color} />
              : <BriefcaseIcon size={size} color={color} />,
        }}
      />

    </Tab.Navigator>
  );
}
