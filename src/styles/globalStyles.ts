import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../constants';

/**
 * Global styles shared across the app.
 * Use Tailwind classes (NativeWind) for one-off styling;
 * use these for repeated structural patterns.
 */
export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Typography using Times New Roman
  h1: {
    fontFamily: Fonts.bold,
    fontSize: Fonts['3xl'],
    color: Colors.textPrimary,
  },
  h2: {
    fontFamily: Fonts.bold,
    fontSize: Fonts['2xl'],
    color: Colors.textPrimary,
  },
  h3: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.xl,
    color: Colors.textPrimary,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
  },
  // Gradient placeholder (use LinearGradient for real gradient)
  gradientBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBtnText: {
    color: Colors.textInverse,
    fontFamily: Fonts.bold,
    fontSize: Fonts.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  avatar: {
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.md,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  badgeText: {
    fontSize: Fonts.xs,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
});

export default globalStyles;





