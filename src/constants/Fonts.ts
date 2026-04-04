import { moderateScale } from '../utils/responsive';

export const Fonts = {
  // Family
  regular: 'TimesNewRoman',
  bold: 'TimesNewRoman-Bold',
  italic: 'TimesNewRoman-Italic',

  // Sizes
  xs: moderateScale(11),
  sm: moderateScale(13),
  base: moderateScale(15),
  md: moderateScale(16),
  lg: moderateScale(18),
  xl: moderateScale(20),
  '2xl': moderateScale(24),
  '3xl': moderateScale(28),
  '4xl': moderateScale(32),

  // Weights
  weightNormal: '400' as const,
  weightMedium: '500' as const,
  weightSemiBold: '600' as const,
  weightBold: '700' as const,
};

export default Fonts;





