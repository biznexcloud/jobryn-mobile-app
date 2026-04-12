import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

// Layouts
import { SeekerTabs, ProviderTabs } from './BottomTabs';

// ─── Auth Screens ──────────────────────────────────────────────────────────────
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyOtpScreen from '../screens/auth/VerifyOtpScreen';

// ─── Seeker Screens ────────────────────────────────────────────────────────────
import SeekerProfileScreen from '../screens/jobSeeker/ProfileScreen';
import MessagesScreen from '../screens/jobSeeker/MessagesScreen';
import JobDetailScreen from '../screens/jobSeeker/JobDetailScreen';
import ApplyJobScreen from '../screens/jobSeeker/ApplyJobScreen';
import CertificationsScreen from '../screens/jobSeeker/CertificationsScreen';
import AddCertificationScreen from '../screens/jobSeeker/AddCertificationScreen';
import ProjectsScreen from '../screens/jobSeeker/ProjectsScreen';
import AddProjectScreen from '../screens/jobSeeker/AddProjectScreen';
import AddExperienceScreen from '../screens/jobSeeker/AddExperienceScreen';
import AddEducationScreen from '../screens/jobSeeker/AddEducationScreen';
import PortfolioScreen from '../screens/jobSeeker/PortfolioScreen';
import LearningScreen from '../screens/jobSeeker/LearningScreen';
import CourseDetailScreen from '../screens/jobSeeker/CourseDetailScreen';
import LessonScreen from '../screens/jobSeeker/LessonScreen';
import WalletScreen from '../screens/jobSeeker/WalletScreen';
import SettingsScreen from '../screens/jobSeeker/SettingsScreen';
import SeekerEditProfileScreen from '../screens/jobSeeker/EditProfileScreen';
import SeekerCreateSocialPostScreen from '../screens/jobSeeker/CreateSocialPostScreen';
import SeekerPostDetailScreen from '../screens/jobSeeker/PostDetailScreen';
import SeekerSearchExploreScreen from '../screens/jobSeeker/SearchExploreScreen';
import SavedItemsScreen from '../screens/jobSeeker/SavedItemsScreen';
import CompanyDetailScreen from '../screens/jobSeeker/CompanyDetailScreen';
import PublicUserProfileScreen from '../screens/jobSeeker/PublicUserProfileScreen';
import CreateStoryScreen from '../screens/jobSeeker/CreateStoryScreen';
import StoryViewerScreen from '../screens/jobSeeker/StoryViewerScreen';
import SeekerAboutInfoScreen from '../screens/jobSeeker/SeekerAboutInfoScreen';
import OpenToSelectionScreen from '../screens/jobSeeker/OpenToSelectionScreen';
import AddProfileSegmentScreen from '../screens/jobSeeker/AddProfileSegmentScreen';
import ProfileManagementScreen from '../screens/jobSeeker/ProfileManagementScreen';
import JobPreferencesScreen from '../screens/jobSeeker/JobPreferencesScreen';
import ServiceShowcaseScreen from '../screens/jobSeeker/ServiceShowcaseScreen';
import EditBioScreen from '../screens/jobSeeker/EditBioScreen';
import ExperienceManagementScreen from '../screens/jobSeeker/ExperienceManagementScreen';
import PhotoViewerScreen from '../screens/jobSeeker/PhotoViewerScreen';
import AddServiceScreen from '../screens/jobSeeker/AddServiceScreen';
import ConnectionsListScreen from '../screens/jobSeeker/ConnectionsListScreen';
import EducationManagementScreen from '../screens/jobSeeker/EducationManagementScreen';
import ProjectManagementScreen from '../screens/jobSeeker/ProjectManagementScreen';

// ─── Provider Screens ────────────────────────────────────────────────────────
import ApplicantDetailScreen from '../screens/jobProvider/ApplicantDetailScreen';
import ProviderProfileScreen from '../screens/jobProvider/ProfileScreen';
import BillingScreen from '../screens/jobProvider/BillingScreen';
import ProviderSettingsScreen from '../screens/jobProvider/SettingsScreen';
import ProviderEditProfileScreen from '../screens/jobProvider/EditProfileScreen';
import ProviderAboutInfoScreen from '../screens/jobProvider/ProviderAboutInfoScreen';

// ─── Shared Screens (Seeker) ───────────────────────────────────────────────────
import SeekerMeetingsScreen from '../screens/jobSeeker/MeetingsScreen';
import SeekerNotificationsScreen from '../screens/jobSeeker/NotificationsScreen';
import SeekerChatDetailScreen from '../screens/jobSeeker/ChatDetailScreen';

// ─── Shared Screens (Provider) ─────────────────────────────────────────────────
import ProviderMeetingsScreen from '../screens/jobProvider/MeetingsScreen';
import ProviderNotificationsScreen from '../screens/jobProvider/NotificationsScreen';
import ProviderChatDetailScreen from '../screens/jobProvider/ChatDetailScreen';
import PostJobScreen from '../screens/jobProvider/PostJobScreen';
import ProviderCreateSocialPostScreen from '../screens/jobProvider/CreateSocialPostScreen';
import ProviderPostDetailScreen from '../screens/jobProvider/PostDetailScreen';
import AnalyticsScreen from '../screens/jobProvider/AnalyticsScreen';
import TalentSearchScreen from '../screens/jobProvider/TalentSearchScreen';
import ProviderNetworkScreen from '../screens/jobProvider/ProviderNetworkScreen';
import ProviderSearchExploreScreen from '../screens/jobProvider/SearchExploreScreen';
import EditJobScreen from '../screens/jobProvider/EditJobScreen';
import JobDetailProviderScreen from '../screens/jobProvider/JobDetailProviderScreen';
import ScheduleMeetingScreen from '../screens/jobProvider/ScheduleMeetingScreen';
import PaymentMethodScreen from '../screens/jobProvider/PaymentMethodScreen';
import JobListScreen from '../screens/jobSeeker/JobListScreen';
import SecuritySettingsScreen from '../screens/shared/SecuritySettingsScreen';
import NotificationSettingsScreen from '../screens/shared/NotificationSettingsScreen';
import PrivacySettingsScreen from '../screens/shared/PrivacySettingsScreen';
import TopUpScreen from '../screens/jobSeeker/TopUpScreen';
import TransactionHistoryScreen from '../screens/jobSeeker/TransactionHistoryScreen';
import PayoutScreen from '../screens/jobSeeker/PayoutScreen';
import TransactionDetailScreen from '../screens/shared/TransactionDetailScreen';
import InvoiceDetailScreen from '../screens/shared/InvoiceDetailScreen';
import LikersListScreen from '../screens/shared/LikersListScreen';
import AIChatbotScreen from '../screens/shared/AIChatbotScreen';

// ─── Shared Screens (All Roles) ────────────────────────────────────────────────
import ProfileWizardScreen from '../screens/auth/ProfileWizardScreen';

import { Roles } from '../constants/Roles';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const { user, userRole, token, onboarded, hasHydrated, setHasHydrated, logout } = useAuthStore();

  useEffect(() => {
    // FORCE LOGOUT IF DEMO TOKEN DETECTED (to start professional flow)
    if (token?.startsWith('demo_') || token === 'demo-token') {
      console.log('--- PURGING DEMO SESSION ---');
      logout();
    }
  }, [token]);

  useEffect(() => {
    if (!hasHydrated) {
      const timer = setTimeout(() => setHasHydrated(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasHydrated]);

  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#0A66C2" />
      </View>
    );
  }

  const isProvider =
    userRole === Roles.JOB_PROVIDER || 
    user?.role === 'job_provider' || 
    user?.role === 'recruiter';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {!token ? (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ animation: 'slide_from_bottom' }} />
        </Stack.Group>
      ) : !onboarded ? (
        <Stack.Group>
          <Stack.Screen name="ProfileWizard" component={ProfileWizardScreen} />
        </Stack.Group>
      ) : isProvider ? (
        <Stack.Group>
          <Stack.Screen name="ProviderRoot" component={ProviderTabs} />
          <Stack.Screen name="ApplicantDetail" component={ApplicantDetailScreen} />
          <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} />
          <Stack.Screen name="EditProfile" component={ProviderEditProfileScreen} />
          <Stack.Screen name="Billing" component={BillingScreen} />
          <Stack.Screen name="ProviderSettings" component={ProviderSettingsScreen} />
          <Stack.Screen name="ProviderAboutInfo" component={ProviderAboutInfoScreen} />
          <Stack.Screen name="Messages" component={MessagesScreen} />
          <Stack.Screen name="ChatDetail" component={ProviderChatDetailScreen} />
          <Stack.Screen name="Notifications" component={ProviderNotificationsScreen} />
          <Stack.Screen name="PostJob" component={PostJobScreen} />
          <Stack.Screen name="CreateSocialPost" component={ProviderCreateSocialPostScreen} />
          <Stack.Screen name="PostDetail" component={ProviderPostDetailScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          <Stack.Screen name="TalentSearch" component={TalentSearchScreen} />
          <Stack.Screen name="ProviderNetwork" component={ProviderNetworkScreen} />
          <Stack.Screen name="PublicProfile" component={PublicUserProfileScreen} />
          <Stack.Screen name="SearchExplore" component={ProviderSearchExploreScreen} />
          <Stack.Screen name="Meetings" component={ProviderMeetingsScreen} initialParams={{ role: 'jobProvider' }} />
          <Stack.Screen name="CreateStory" component={CreateStoryScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="StoryViewer" component={StoryViewerScreen} options={{ animation: 'fade', presentation: 'fullScreenModal' }} />
          <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
          <Stack.Screen name="EditJob" component={EditJobScreen} />
          <Stack.Screen name="JobDetailProvider" component={JobDetailProviderScreen} />
          <Stack.Screen name="ScheduleMeeting" component={ScheduleMeetingScreen} />
          <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
          <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
          <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
          <Stack.Screen name="LikersList" component={LikersListScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="AIChat" component={AIChatbotScreen} options={{ animation: 'slide_from_bottom' }} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="SeekerRoot" component={SeekerTabs} />
          <Stack.Screen name="JobDetail" component={JobDetailScreen} />
          <Stack.Screen name="ApplyJob" component={ApplyJobScreen} />
          <Stack.Screen name="Certifications" component={CertificationsScreen} />
          <Stack.Screen name="AddCertification" component={AddCertificationScreen} />
          <Stack.Screen name="Projects" component={ProjectsScreen} />
          <Stack.Screen name="AddProject" component={AddProjectScreen} />
          <Stack.Screen name="AddExperience" component={AddExperienceScreen} />
          <Stack.Screen name="AddEducation" component={AddEducationScreen} />
          <Stack.Screen name="SeekerProfile" component={SeekerProfileScreen} />
          <Stack.Screen name="EditProfile" component={SeekerEditProfileScreen} />
          <Stack.Screen name="Portfolio" component={PortfolioScreen} />
          <Stack.Screen name="Learning" component={LearningScreen} />
          <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
          <Stack.Screen name="Lesson" component={LessonScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="CreateSocialPost" component={SeekerCreateSocialPostScreen} />
          <Stack.Screen name="PostDetail" component={SeekerPostDetailScreen} />
          <Stack.Screen name="SearchExplore" component={SeekerSearchExploreScreen} />
          <Stack.Screen name="SavedItems" component={SavedItemsScreen} />
          <Stack.Screen name="CompanyDetail" component={CompanyDetailScreen} />
          <Stack.Screen name="PublicProfile" component={PublicUserProfileScreen} />
          <Stack.Screen name="SeekerAboutInfo" component={SeekerAboutInfoScreen} />
          <Stack.Screen name="OpenToSelection" component={OpenToSelectionScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="AddProfileSegment" component={AddProfileSegmentScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="ProfileManagement" component={ProfileManagementScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="JobPreferences" component={JobPreferencesScreen} />
          <Stack.Screen name="ServiceShowcase" component={ServiceShowcaseScreen} />
          <Stack.Screen name="AddService" component={AddServiceScreen} />
          <Stack.Screen name="PostJob" component={PostJobScreen} />
          <Stack.Screen name="EditBio" component={EditBioScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="ExperienceManagement" component={ExperienceManagementScreen} />
          <Stack.Screen name="EducationManagement" component={EducationManagementScreen} />
          <Stack.Screen name="ProjectManagement" component={ProjectManagementScreen} />
          <Stack.Screen name="ConnectionsList" component={ConnectionsListScreen} />
          <Stack.Screen name="PhotoViewer" component={PhotoViewerScreen} options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
          <Stack.Screen name="CreateStory" component={CreateStoryScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="StoryViewer" component={StoryViewerScreen} options={{ animation: 'fade', presentation: 'fullScreenModal' }} />
          <Stack.Screen name="Messages" component={MessagesScreen} />
          <Stack.Screen name="ChatDetail" component={SeekerChatDetailScreen} />
          <Stack.Screen name="Notifications" component={SeekerNotificationsScreen} />
          <Stack.Screen name="JobList" component={JobListScreen} />
          <Stack.Screen name="Meetings" component={SeekerMeetingsScreen} initialParams={{ role: 'jobSeeker' }} />
          <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
          <Stack.Screen name="TopUp" component={TopUpScreen} />
          <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
          <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
          <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
          <Stack.Screen name="Payout" component={PayoutScreen} />
          <Stack.Screen name="LikersList" component={LikersListScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="AIChat" component={AIChatbotScreen} options={{ animation: 'slide_from_bottom' }} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}


