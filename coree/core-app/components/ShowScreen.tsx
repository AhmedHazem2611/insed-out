import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

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

  return (
    <View style={styles.container}>
      {/* Top-to-bottom base: deep black to dark grey, then faint into transparent to allow overlays */}
      <LinearGradient
        colors={[
          'rgba(0,0,0,1)',       // deep black top
          'rgba(18,18,20,0.9)',  // near-black
          'rgba(28,28,32,0.75)', // dark grey
          'rgba(28,28,32,0.0)',  // fade for overlays
        ]}
        locations={[0, 0.22, 0.42, 0.7]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Misty blue-violet base cloud - widest spread, very soft */}
      <Animated.View style={[styles.layerBase, translate(motion1, -16, -10)]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(40,70,200,0.10)',   // cool blue
            'rgba(90,60,220,0.14)',   // indigo
            'rgba(140,80,255,0.18)',  // soft violet
            'transparent',
          ]}
          locations={[0, 0.28, 0.56, 0.82, 1]}
          start={{ x: 0.15, y: 0.1 }}
          end={{ x: 0.85, y: 0.9 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Brighter magenta/blue core glow near lower section - more blue bias */}
      <Animated.View style={[styles.layerCore, translate(motion2, -12, 12)]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(70,120,255,0.16)',  // neon-ish blue
            'rgba(130,80,255,0.22)',  // neon purple
            'rgba(210,80,255,0.12)',  // subtle magenta tint
            'transparent',
          ]}
          locations={[0, 0.24, 0.55, 0.78, 1]}
          start={{ x: 0.8, y: 0.2 }}
          end={{ x: 0.2, y: 0.95 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Deep blue accent cloud for depth */}
      <Animated.View style={[styles.layerAccent, translate(motion3, 10, -12)]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(30,60,160,0.10)',
            'rgba(50,90,200,0.14)',
            'transparent',
          ]}
          locations={[0, 0.36, 0.7, 1]}
          start={{ x: 0.9, y: 0.25 }}
          end={{ x: 0.1, y: 0.85 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Bottom glow: white -> bluish-magenta -> fade to transparent to simulate foggy light pool */}
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.20)', // soft white glow
          'rgba(180,140,255,0.18)', // pale violet
          'rgba(120,120,255,0.12)', // bluish layer
          'rgba(0,0,0,0.0)',        // dissolve into scene
        ]}
        locations={[0, 0.28, 0.56, 1]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.bottomFog}
      />

      {/* Subtle top vignette to keep top deep and smooth */}
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.35)', 'transparent']}
        locations={[0, 0.4, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.topVignette}
        pointerEvents="none"
      />

      {/* Subtle side vignettes for edge softness */}
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent']}
        locations={[0, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.leftVignette}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)']}
        locations={[0, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.rightVignette}
        pointerEvents="none"
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