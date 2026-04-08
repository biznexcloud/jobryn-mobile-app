import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Text, Box, VStack, HStack, Input } from '../../components/ui';
import { ProfileService } from '../../services/api/profile';
import { PortfolioService } from '../../services/api/portfolio';
import { Roles } from '../../constants/Roles';
import {
  UserCircle,
  Camera,
  MapPin,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

const BLUE          = '#0A66C2';
const LIGHT_BLUE    = '#EBF5FF';
const GRAY_BG       = '#F9FAFB';
const GRAY_TEXT     = '#6B7280';

// ─── Static option lists ──────────────────────────────────────────────────────
const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
  'Retail', 'Manufacturing', 'Media', 'Legal', 'Consulting', 'Other',
];
const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–500', '501–1000', '1000+'];
const HIRING_ROLES  = [
  'Engineering', 'Design', 'Product', 'Marketing', 'Sales',
  'Operations', 'Finance', 'HR', 'Data Science', 'Customer Support', 'Legal', 'DevOps',
];
const EMP_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
const COMMON_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL', 'AWS',
  'Docker', 'Machine Learning', 'Figma', 'Product Management', 'Data Analysis',
  'Marketing', 'Sales', 'Project Management', 'Communication', 'Leadership',
  'Agile', 'SEO', 'Content Writing',
];

const TOTAL_STEPS = 5;

// ─── Provider step labels ─────────────────────────────────────────────────────
const PROVIDER_STEPS = ['Your Photo', 'Company Info', 'Company Details', 'Hiring Goals', "All Set!"];
// ─── Seeker step labels ───────────────────────────────────────────────────────
const SEEKER_STEPS   = ['Your Photo', 'Personal Info', 'Experience', 'Your Skills', "All Set!"];

// ─── Chip component ───────────────────────────────────────────────────────────
function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text fontSize={13} fontWeight="700" color={active ? BLUE : GRAY_TEXT}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProfileWizardScreen({ navigation }: { navigation: any }) {
  const { setOnboarded, userRole } = useAuthStore();
  const insets    = useSafeAreaInsets();
  const isProvider = userRole === Roles.JOB_PROVIDER;
  const stepLabels = isProvider ? PROVIDER_STEPS : SEEKER_STEPS;

  const [currentStep, setCurrentStep] = useState(0);
  const [loading,     setLoading]     = useState(false);

  // slide animation
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ── Shared ──────────────────────────────────────────────────────────────────
  const [photo, setPhoto] = useState<string | null>(null);

  // ── Provider fields ────────────────────────────────────────────────────────
  const [companyName,     setCompanyName]     = useState('');
  const [industry,        setIndustry]        = useState('');
  const [companySize,     setCompanySize]     = useState('');
  const [website,         setWebsite]         = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companyDesc,     setCompanyDesc]     = useState('');
  const [hiringGoals,     setHiringGoals]     = useState<string[]>([]);

  // ── Seeker fields ──────────────────────────────────────────────────────────
  const [headline,    setHeadline]    = useState('');
  const [location,    setLocation]    = useState('');
  const [phone,       setPhone]       = useState('');
  const [jobTitle,    setJobTitle]    = useState('');
  const [jobCompany,  setJobCompany]  = useState('');
  const [empType,     setEmpType]     = useState('');
  const [isCurrent,   setIsCurrent]   = useState(true);
  const [skills,      setSkills]      = useState<string[]>([]);

  // ─── Animation helpers ─────────────────────────────────────────────────────
  const slideOut = (forward: boolean, cb: () => void) => {
    Animated.timing(slideAnim, {
      toValue: forward ? -width : width,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(forward ? width : -width);
      cb();
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      slideOut(true, () => setCurrentStep(prev => prev + 1));
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      slideOut(false, () => setCurrentStep(prev => prev - 1));
    }
  };

  // ─── Image picker ──────────────────────────────────────────────────────────
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  // ─── Toggle helpers ────────────────────────────────────────────────────────
  const toggleGoal  = (g: string) => setHiringGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  const toggleSkill = (s: string) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  // ─── Final API submission ──────────────────────────────────────────────────
  const handleComplete = async () => {
    setLoading(true);
    try {
      if (isProvider) {
        await ProfileService.createRecruiterProfile({
          company_name: companyName || 'My Company',
          headline:     companyName || 'Recruiter',
          bio:          companyDesc,
          location:     companyLocation,
          industry,
          company_size: companySize,
          website,
        });
      } else {
        await ProfileService.createSeekerProfile({
          headline: headline || 'Professional',
          bio:      '',
          location,
          phone,
        });
        if (jobTitle && jobCompany) {
          await PortfolioService.addExperience({
            title:           jobTitle,
            company_name:    jobCompany,
            employment_type: 'full_time',
            start_date:      new Date().toISOString().split('T')[0],
            is_current:      isCurrent,
          });
        }
      }
    } catch (e) {
      // Graceful: log but don't block the user
      console.warn('[Onboarding] Profile save warning:', e);
    } finally {
      setLoading(false);
      setOnboarded(true);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP RENDERERS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Step 0 — Profile Photo (shared for both roles) */
  const renderPhotoStep = () => (
    <VStack items="center" px={24} pt={32} pb={16}>
      <TouchableOpacity onPress={pickImage} style={styles.photoOuter} activeOpacity={0.85}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photoImg} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <UserCircle size={96} color="#C4D1E4" strokeWidth={1} />
          </View>
        )}
        <View style={styles.cameraBadge}>
          <Camera size={16} color="white" />
        </View>
      </TouchableOpacity>

      <Text fontSize={22} fontWeight="900" color="#111827" mt={28} textAlign="center">
        {isProvider ? 'Add your company photo' : 'Add a profile photo'}
      </Text>
      <Text fontSize={15} color={GRAY_TEXT} mt={10} textAlign="center" lineHeight={22} px={8}>
        {isProvider
          ? 'Upload your company logo or a professional headshot to build trust with candidates.'
          : 'A clear, professional photo helps recruiters recognise you.'}
      </Text>

      <HStack space="sm" mt={32}>
        <TouchableOpacity style={styles.photoBtn} onPress={pickImage} activeOpacity={0.8}>
          <Text fontSize={14} fontWeight="700" color={BLUE}>Choose from gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.photoBtn, styles.photoBtnFilled]} onPress={takePhoto} activeOpacity={0.8}>
          <Text fontSize={14} fontWeight="700" color={BLUE}>Take a photo</Text>
        </TouchableOpacity>
      </HStack>
    </VStack>
  );

  /** Step 1 — Provider: Company Info */
  const renderProviderCompanyInfo = () => (
    <VStack px={24} pt={20} space="lg">
      <Input
        label="Company Name"
        placeholder="e.g. Nexus Technologies"
        value={companyName}
        onChangeText={setCompanyName}
        bg={GRAY_BG}
      />

      <VStack>
        <Text fontSize={12} fontWeight="700" color="#374151" mb={10}>Industry</Text>
        <View style={styles.chipsWrap}>
          {INDUSTRIES.map(ind => (
            <Chip key={ind} label={ind} active={industry === ind} onPress={() => setIndustry(ind)} />
          ))}
        </View>
      </VStack>

      <VStack>
        <Text fontSize={12} fontWeight="700" color="#374151" mb={10}>Company Size</Text>
        <View style={styles.chipsWrap}>
          {COMPANY_SIZES.map(sz => (
            <Chip key={sz} label={`${sz} employees`} active={companySize === sz} onPress={() => setCompanySize(sz)} />
          ))}
        </View>
      </VStack>
    </VStack>
  );

  /** Step 2 — Provider: Company Details */
  const renderProviderDetails = () => (
    <VStack px={24} pt={20} space="lg">
      <Input
        label="Company Website"
        placeholder="https://yourcompany.com"
        value={website}
        onChangeText={setWebsite}
        autoCapitalize="none"
        keyboardType="url"
        bg={GRAY_BG}
      />
      <Input
        label="Headquarters / Location"
        placeholder="e.g. London, UK"
        value={companyLocation}
        onChangeText={setCompanyLocation}
        bg={GRAY_BG}
      />
      <Input
        label="About Your Company"
        placeholder="Describe your company, culture, and mission..."
        value={companyDesc}
        onChangeText={setCompanyDesc}
        multiline
        numberOfLines={5}
        bg={GRAY_BG}
      />
    </VStack>
  );

  /** Step 3 — Provider: Hiring Goals */
  const renderHiringGoals = () => (
    <VStack px={24} pt={20}>
      <Text fontSize={15} color={GRAY_TEXT} mb={20} lineHeight={22}>
        Select the types of roles you're looking to fill. This helps us tailor your job-posting experience.
      </Text>
      <View style={styles.chipsWrap}>
        {HIRING_ROLES.map(goal => (
          <Chip key={goal} label={goal} active={hiringGoals.includes(goal)} onPress={() => toggleGoal(goal)} />
        ))}
      </View>
      {hiringGoals.length > 0 && (
        <Text fontSize={13} color={BLUE} fontWeight="700" mt={16}>
          {hiringGoals.length} role type{hiringGoals.length > 1 ? 's' : ''} selected
        </Text>
      )}
    </VStack>
  );

  /** Step 1 — Seeker: Personal Info */
  const renderSeekerPersonalInfo = () => (
    <VStack px={24} pt={20} space="lg">
      <Input
        label="Professional Headline"
        placeholder="e.g. Senior Software Engineer"
        value={headline}
        onChangeText={setHeadline}
        bg={GRAY_BG}
      />
      <Input
        label="Location"
        placeholder="e.g. London, UK"
        value={location}
        onChangeText={setLocation}
        bg={GRAY_BG}
      />
      <Input
        label="Phone Number (optional)"
        placeholder="+44 7700 000000"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        bg={GRAY_BG}
      />
    </VStack>
  );

  /** Step 2 — Seeker: Experience */
  const renderExperience = () => (
    <VStack px={24} pt={20} space="lg">
      <Input
        label="Job Title"
        placeholder="e.g. Senior Software Engineer"
        value={jobTitle}
        onChangeText={setJobTitle}
        bg={GRAY_BG}
      />
      <Input
        label="Company"
        placeholder="e.g. Google, Startup Inc."
        value={jobCompany}
        onChangeText={setJobCompany}
        bg={GRAY_BG}
      />

      <VStack>
        <Text fontSize={12} fontWeight="700" color="#374151" mb={10}>Employment Type</Text>
        <View style={styles.chipsWrap}>
          {EMP_TYPES.map(type => (
            <Chip key={type} label={type} active={empType === type} onPress={() => setEmpType(type)} />
          ))}
        </View>
      </VStack>

      <TouchableOpacity
        style={styles.checkRow}
        onPress={() => setIsCurrent(!isCurrent)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, isCurrent && styles.checkboxOn]}>
          {isCurrent && <Text style={{ color: 'white', fontSize: 12, fontWeight: '900' }}>✓</Text>}
        </View>
        <Text fontSize={15} fontWeight="600" color="#111827" ml={12}>I currently work here</Text>
      </TouchableOpacity>
    </VStack>
  );

  /** Step 3 — Seeker: Skills */
  const renderSkills = () => (
    <VStack px={24} pt={20}>
      <Text fontSize={15} color={GRAY_TEXT} mb={20} lineHeight={22}>
        Add skills that showcase your expertise. You can always add more from your profile later.
      </Text>
      <View style={styles.chipsWrap}>
        {COMMON_SKILLS.map(skill => (
          <Chip key={skill} label={skill} active={skills.includes(skill)} onPress={() => toggleSkill(skill)} />
        ))}
      </View>
      {skills.length > 0 && (
        <Text fontSize={13} color={BLUE} fontWeight="700" mt={16}>
          {skills.length} skill{skills.length > 1 ? 's' : ''} selected
        </Text>
      )}
    </VStack>
  );

  /** Step 4 — All Set (shared) */
  const renderDone = () => (
    <VStack items="center" px={24} pt={44} pb={32}>
      <View style={styles.doneRing}>
        <CheckCircle size={52} color={BLUE} strokeWidth={1.5} />
      </View>

      <Text fontSize={28} fontWeight="900" color="#111827" mt={24} textAlign="center">
        You're all set!
      </Text>
      <Text fontSize={16} color={GRAY_TEXT} mt={12} textAlign="center" lineHeight={26} px={8}>
        {isProvider
          ? 'Your recruiter profile is live. Start posting jobs and discovering top talent today.'
          : 'Your profile is live. Start applying for jobs and connecting with great companies.'}
      </Text>

      {/* Summary card */}
      <View style={styles.doneCard}>
        <HStack items="center" justify="space-between">
          <View style={styles.rolePill}>
            <Text fontSize={12} fontWeight="800" color={BLUE}>
              {isProvider ? '🏢  Job Provider' : '👤  Job Seeker'}
            </Text>
          </View>
          {photo && <Image source={{ uri: photo }} style={styles.doneMini} />}
        </HStack>

        {isProvider && companyName ? (
          <VStack mt={14}>
            <Text fontSize={18} fontWeight="800" color="#111827">{companyName}</Text>
            {industry    ? <Text fontSize={13} color={GRAY_TEXT} mt={2}>{industry}{companySize ? ` · ${companySize} employees` : ''}</Text> : null}
            {companyLocation ? (
              <HStack items="center" mt={6} space="xs">
                <MapPin size={13} color={GRAY_TEXT} />
                <Text fontSize={13} color={GRAY_TEXT}>{companyLocation}</Text>
              </HStack>
            ) : null}
            {hiringGoals.length > 0 && (
              <Text fontSize={13} color={BLUE} fontWeight="600" mt={8}>
                Hiring: {hiringGoals.slice(0, 3).join(', ')}{hiringGoals.length > 3 ? ` +${hiringGoals.length - 3}` : ''}
              </Text>
            )}
          </VStack>
        ) : null}

        {!isProvider && (headline || location) ? (
          <VStack mt={14}>
            {headline  ? <Text fontSize={16} fontWeight="700" color="#111827">{headline}</Text> : null}
            {location  ? (
              <HStack items="center" mt={4} space="xs">
                <MapPin size={13} color={GRAY_TEXT} />
                <Text fontSize={13} color={GRAY_TEXT}>{location}</Text>
              </HStack>
            ) : null}
            {skills.length > 0 && (
              <Text fontSize={13} color={BLUE} fontWeight="600" mt={8}>
                Skills: {skills.slice(0, 4).join(', ')}{skills.length > 4 ? ` +${skills.length - 4}` : ''}
              </Text>
            )}
          </VStack>
        ) : null}
      </View>
    </VStack>
  );

  // ─── Route to correct step content ────────────────────────────────────────
  const renderStep = () => {
    if (isProvider) {
      switch (currentStep) {
        case 0: return renderPhotoStep();
        case 1: return renderProviderCompanyInfo();
        case 2: return renderProviderDetails();
        case 3: return renderHiringGoals();
        case 4: return renderDone();
        default: return null;
      }
    } else {
      switch (currentStep) {
        case 0: return renderPhotoStep();
        case 1: return renderSeekerPersonalInfo();
        case 2: return renderExperience();
        case 3: return renderSkills();
        case 4: return renderDone();
        default: return null;
      }
    }
  };

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <ScreenWrapper safeAreaTop={false} safeAreaBottom={false} backgroundColor="#FFFFFF">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        {/* Back button */}
        <TouchableOpacity
          style={[styles.backBtn, currentStep === 0 && { opacity: 0.3 }]}
          onPress={handleBack}
          disabled={currentStep === 0}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>

        {/* Progress indicator */}
        <View style={styles.progressRow}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
            const done   = i < currentStep;
            const active = i === currentStep;
            return (
              <React.Fragment key={i}>
                <View style={[
                  styles.dot,
                  done   && styles.dotDone,
                  active && styles.dotActive,
                ]}>
                  <Text style={[
                    styles.dotLabel,
                    (done || active) && { color: 'white' },
                  ]}>
                    {done ? '✓' : String(i + 1)}
                  </Text>
                </View>
                {i < TOTAL_STEPS - 1 && (
                  <View style={[styles.progressLine, done && styles.progressLineDone]} />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* Skip */}
        <TouchableOpacity onPress={() => setOnboarded(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text fontSize={14} fontWeight="800" color={BLUE}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Step title (below header) ────────────────────────────────────── */}
      <View style={styles.titleBox}>
        <Text fontSize={11} fontWeight="800" color="#9CA3AF" letterSpacing={1.5}>
          STEP {currentStep + 1} OF {TOTAL_STEPS}
        </Text>
        <Text fontSize={26} fontWeight="900" color="#111827" mt={4}>
          {stepLabels[currentStep]}
        </Text>
      </View>

      {/* ─── Animated step content ────────────────────────────────────────── */}
      <Animated.View style={[{ flex: 1 }, { transform: [{ translateX: slideAnim }] }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>
      </Animated.View>

      {/* ─── Footer CTA ───────────────────────────────────────────────────── */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.ctaBtn, loading && { opacity: 0.7 }]}
          onPress={handleNext}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <HStack items="center" justify="center" space="xs">
              <Text fontSize={17} fontWeight="800" color="white">
                {isLastStep ? 'Enter Dashboard' : 'Continue'}
              </Text>
              {!isLastStep && <ChevronRight size={20} color="white" strokeWidth={2.5} />}
            </HStack>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  dotDone: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  dotLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  progressLine: {
    width: 18,
    height: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
    marginHorizontal: 2,
  },
  progressLineDone: {
    backgroundColor: '#059669',
  },

  // Step title block
  titleBox: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
    backgroundColor: '#FFFFFF',
  },

  // Photo step
  photoOuter: {
    width: 156,
    height: 156,
    borderRadius: 78,
  },
  photoImg: {
    width: 156,
    height: 156,
    borderRadius: 78,
  },
  photoPlaceholder: {
    width: 156,
    height: 156,
    borderRadius: 78,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  photoBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  photoBtnFilled: {
    backgroundColor: LIGHT_BLUE,
    borderColor: BLUE,
  },

  // Chips
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    marginRight: 8,
  },
  chipActive: {
    borderColor: BLUE,
    backgroundColor: LIGHT_BLUE,
  },

  // Experience step
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxOn: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },

  // Done step
  doneRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: LIGHT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    marginTop: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: LIGHT_BLUE,
    borderRadius: 20,
  },
  doneMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Footer CTA
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaBtn: {
    height: 54,
    backgroundColor: BLUE,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
});
