import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const Star = ({ top, left, size = 2, opacity = 0.7 }: { top: number; left: number; size?: number; opacity?: number }) => (
  <View
    style={{
      position: 'absolute',
      top: `${top}%`,
      left: `${left}%`,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: 'white',
      opacity,
    }}
  />
);

export default function ShowScreen() {
  const router = useRouter();
  const motion1 = useRef(new Animated.Value(0)).current;
  const motion2 = useRef(new Animated.Value(0)).current;
  const motion3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val: Animated.Value, duration: number, delay = 0) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1, duration, delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
        ])
      ).start();
    };
    loop(motion1, 9000);
    loop(motion2, 12000, 900);
    loop(motion3, 15000, 1800);
  }, [motion1, motion2, motion3]);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        router.replace('/welcome');
      } catch {}
    }, 2500);
    return () => clearTimeout(t);
  }, [router]);

  const translate = (val: Animated.Value, x: number, y: number) => ({
    transform: [
      { translateX: val.interpolate({ inputRange: [0, 1], outputRange: [0, x] }) },
      { translateY: val.interpolate({ inputRange: [0, 1], outputRange: [0, y] }) },
      { scale: val.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) },
    ],
  });

  const stars = [
    { top: 6, left: 12, size: 2 },
    { top: 9, left: 28, size: 1.5 },
    { top: 7, left: 46, size: 2 },
    { top: 11, left: 62, size: 1.5 },
    { top: 8, left: 78, size: 2 },
    { top: 14, left: 18, size: 1.5 },
    { top: 16, left: 38, size: 1.5 },
    { top: 15, left: 54, size: 1.5 },
    { top: 17, left: 82, size: 2 },
  ];

  return (
    <View style={styles.container}>
      {/* Stars */}
      {stars.map((s, i) => (
        <Star key={i} top={s.top} left={s.left} size={s.size as number} opacity={0.7} />
      ))}

      {/* Bottom decorative images */}
      <Image
        source={require('../assets/images/g2/Ellipse 4.png')}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: width,
          height: height * 0.22,
        }}
        resizeMode="cover"
      />
      

      {/* Centered logo image */}
      <View style={[styles.centerContainer, { transform: [{ scale: 1.5 }] }]} pointerEvents="none">
        <Image
          source={require('../assets/images/logo.png')}
          style={[styles.centerLogo, { width: '50%', height: '50%' }]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  layerBase: {
    position: 'absolute',
    bottom: -height * 0.06,
    left: -width * 0.35,
    right: -width * 0.25,
    height: height * 0.72,
  },
  layerCore: {
    position: 'absolute',
    bottom: height * 0.06,
    right: -width * 0.18,
    width: width * 1.15,
    height: height * 0.5,
  },
  layerAccent: {
    position: 'absolute',
    bottom: height * 0.18,
    right: -width * 0.12,
    width: width * 0.92,
    height: height * 0.4,
  },
  bottomFog: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.62,
    borderTopLeftRadius: width / 2,
    borderTopRightRadius: width / 2,
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.48,
  },
  leftVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.12,
  },
  rightVignette: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: width * 0.12,
  },
  centerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLogo: {
    width: width * 0.42,
    height: width * 0.42,
    opacity: 0.92,
  },
});