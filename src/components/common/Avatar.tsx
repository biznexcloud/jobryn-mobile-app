import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../constants';
import { moderateScale } from '../../utils/responsive';
interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  online?: boolean;
}

export const Avatar = ({ uri, name, size = moderateScale(44), online = false }: AvatarProps) => {
  const initials = name
    ? name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <View style={[styles.container, containerStyle]}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.placeholder, containerStyle]}>
            <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
          </View>
        )}
      </View>
      {online && (
        <View
          style={[
            styles.onlineDot,
            { width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14 },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: moderateScale(1),
    right: moderateScale(1),
    backgroundColor: Colors.success,
    borderWidth: moderateScale(2),
    borderColor: Colors.white,
  },
});

export default Avatar;





