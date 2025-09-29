import React from 'react';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity } from 'react-native';
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

export default function Welcome() {
  const router = useRouter();
  const stars = [
    { top: 8, left: 14, size: 2 },
    { top: 11, left: 52, size: 1.5 },
    { top: 6, left: 70, size: 2 },
    { top: 18, left: 26, size: 1.5 },
    { top: 22, left: 78, size: 2 },
    { top: 28, left: 16, size: 1.5 },
    { top: 34, left: 62, size: 1.5 },
    { top: 40, left: 12, size: 1.5 },
    { top: 43, left: 86, size: 2 },
  ];

  return (
    <View style={styles.container}>



      {/* Stars */}
      {stars.map((s, i) => (
        <Star key={i} top={s.top} left={s.left} size={s.size as number} opacity={0.65} />
      ))}

      {/* Static soft pink mist glow layers at bottom */}
     

      {/* Pool of light at extreme bottom to create dreamy pink diffusion */}
    

      {/* Title + triangle accent + subtitle */}
      <View style={[styles.centerText, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 200, alignItems: 'center', justifyContent: 'center', zIndex: 10 }]}>
        <View style={styles.titleRow}>
          <View style={styles.starAccent} />
          <Text style={styles.title}>Welcome</Text>
        </View>
        <Text style={styles.subtitle}>To The First Page Of Your{"\n"}Next Chapter</Text>
        <TouchableOpacity onPress={() => router.push('/login')} style={styles.ctaButton} activeOpacity={0.9}>
          <Text style={styles.ctaText}>Go to Login</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom image */}
      <Image
        source={require('../assets/images/g2/Ellipse 4.png')}
        style={[styles.bottomImage, { width: '100%', height: '40%' }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.25,
  },
  leftVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.14,
  },
  rightVignette: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: width * 0.14,
  },
  glowBase: {
    position: 'absolute',
    bottom: height * 0.14,
    left: -width * 0.34,
    right: -width * 0.34,
    height: height * 0.56,
  },
  glowCore: {
    position: 'absolute',
    bottom: height * 0.08,
    right: -width * 0.18,
    width: width * 1.18,
    height: height * 0.5,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.58,
    borderTopLeftRadius: width / 2,
    borderTopRightRadius: width / 2,
  },
  centerText: {
    position: 'absolute',
    top: height * 0.27,
    left: 0,
    right: 0,
    alignItems: 'flex-start',
    paddingHorizontal: 28,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starAccent: {
    width: 28,
    height: 28,
    marginRight: 8,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 16,
    lineHeight: 24,
  },
  ctaButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(138,43,226,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    zIndex: 5,
  },
}); 