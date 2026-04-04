import { ViewStyle, TextStyle } from 'react-native';

export interface ShorthandProps {
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  m?: number;
  mx?: number;
  my?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  bg?: string;
  rounded?: number;
  border?: number;
  borderBottom?: number;
  borderTop?: number;
  borderLeft?: number;
  borderRight?: number;
  borderColor?: string;
  borderStyle?: ViewStyle['borderStyle'];
  flex?: number;
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  position?: 'absolute' | 'relative';
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  items?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  zIndex?: number;
  overflow?: 'visible' | 'hidden' | 'scroll';
  fontSize?: number;
  fontWeight?: TextStyle['fontWeight'];
  color?: string;
  textAlign?: TextStyle['textAlign'];
  textTransform?: TextStyle['textTransform'];
  lineHeight?: number;
  letterSpacing?: number;
  alignSelf?: ViewStyle['alignSelf'];
  flexDirection?: ViewStyle['flexDirection'];
  flexWrap?: ViewStyle['flexWrap'];
  w?: number | string;
  h?: number | string;
  roundedTop?: number;
  roundedBottom?: number;
  borderTopLeft?: number;
  borderTopRight?: number;
  borderBottomLeft?: number;
  borderBottomRight?: number;
  maxW?: number | string;
  maxH?: number | string;
  minW?: number | string;
  minH?: number | string;
  flexDir?: ViewStyle['flexDirection'];
  shadow?: number;
}

export function getShorthandStyles(props: ShorthandProps) {
  const styles: any = {};
  
  if (props.p !== undefined) styles.padding = props.p;
  if (props.px !== undefined) styles.paddingHorizontal = props.px;
  if (props.py !== undefined) styles.paddingVertical = props.py;
  if (props.pt !== undefined) styles.paddingTop = props.pt;
  if (props.pb !== undefined) styles.paddingBottom = props.pb;
  if (props.pl !== undefined) styles.paddingLeft = props.pl;
  if (props.pr !== undefined) styles.paddingRight = props.pr;
  
  if (props.m !== undefined) styles.margin = props.m;
  if (props.mx !== undefined) styles.marginHorizontal = props.mx;
  if (props.my !== undefined) styles.marginVertical = props.my;
  if (props.mt !== undefined) styles.marginTop = props.mt;
  if (props.mb !== undefined) styles.marginBottom = props.mb;
  if (props.ml !== undefined) styles.marginLeft = props.ml;
  if (props.mr !== undefined) styles.marginRight = props.mr;
  
  if (props.bg !== undefined) styles.backgroundColor = props.bg;
  if (props.rounded !== undefined) styles.borderRadius = props.rounded;
  if (props.border !== undefined) styles.borderWidth = props.border;
  if (props.borderBottom !== undefined) styles.borderBottomWidth = props.borderBottom;
  if (props.borderTop !== undefined) styles.borderTopWidth = props.borderTop;
  if (props.borderLeft !== undefined) styles.borderLeftWidth = props.borderLeft;
  if (props.borderRight !== undefined) styles.borderRightWidth = props.borderRight;
  if (props.borderColor !== undefined) styles.borderColor = props.borderColor;
  if (props.borderStyle !== undefined) styles.borderStyle = props.borderStyle;
  if (props.roundedTop !== undefined) {
    styles.borderTopLeftRadius = props.roundedTop;
    styles.borderTopRightRadius = props.roundedTop;
  }
  if (props.roundedBottom !== undefined) {
    styles.borderBottomLeftRadius = props.roundedBottom;
    styles.borderBottomRightRadius = props.roundedBottom;
  }
  if (props.borderTopLeft !== undefined) styles.borderTopLeftRadius = props.borderTopLeft;
  if (props.borderTopRight !== undefined) styles.borderTopRightRadius = props.borderTopRight;
  if (props.borderBottomLeft !== undefined) styles.borderBottomLeftRadius = props.borderBottomLeft;
  if (props.borderBottomRight !== undefined) styles.borderBottomRightRadius = props.borderBottomRight;
  
  if (props.flex !== undefined) styles.flex = props.flex;
  if (props.width !== undefined) styles.width = props.width;
  if (props.height !== undefined) styles.height = props.height;
  if (props.minWidth !== undefined) styles.minWidth = props.minWidth;
  if (props.maxWidth !== undefined) styles.maxWidth = props.maxWidth;
  if (props.minHeight !== undefined) styles.minHeight = props.minHeight;
  if (props.maxHeight !== undefined) styles.maxHeight = props.maxHeight;
  
  if (props.position !== undefined) styles.position = props.position;
  if (props.top !== undefined) styles.top = props.top;
  if (props.bottom !== undefined) styles.bottom = props.bottom;
  if (props.left !== undefined) styles.left = props.left;
  if (props.right !== undefined) styles.right = props.right;

  if (props.items !== undefined) styles.alignItems = props.items;
  if (props.justify !== undefined) styles.justifyContent = props.justify;
  if (props.zIndex !== undefined) styles.zIndex = props.zIndex;
  if (props.overflow !== undefined) styles.overflow = props.overflow;

  if (props.fontSize !== undefined) styles.fontSize = props.fontSize;
  if (props.fontWeight !== undefined) styles.fontWeight = props.fontWeight;
  if (props.color !== undefined) styles.color = props.color;
  if (props.textAlign !== undefined) styles.textAlign = props.textAlign;
  if (props.textTransform !== undefined) styles.textTransform = props.textTransform;
  if (props.lineHeight !== undefined) styles.lineHeight = props.lineHeight;
  if (props.letterSpacing !== undefined) styles.letterSpacing = props.letterSpacing;
  if (props.alignSelf !== undefined) styles.alignSelf = props.alignSelf;
  if (props.flexDirection !== undefined) styles.flexDirection = props.flexDirection;
  if (props.flexWrap !== undefined) styles.flexWrap = props.flexWrap;
  
  if (props.w !== undefined) styles.width = props.w;
  if (props.h !== undefined) styles.height = props.h;
  if (props.maxW !== undefined) styles.maxWidth = props.maxW;
  if (props.maxH !== undefined) styles.maxHeight = props.maxH;
  if (props.minW !== undefined) styles.minWidth = props.minW;
  if (props.minH !== undefined) styles.minHeight = props.minH;
  if (props.flexDir !== undefined) styles.flexDirection = props.flexDir;
  
  if (props.shadow !== undefined) {
    styles.elevation = props.shadow;
    styles.shadowColor = '#000';
    styles.shadowOffset = { width: 0, height: props.shadow };
    styles.shadowOpacity = 0.2;
    styles.shadowRadius = props.shadow;
  }

  return styles;
}





