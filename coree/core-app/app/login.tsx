import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Login() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* SignUp Screen */}
      <View style={styles.signupContainer}>
        <Text style={styles.coreLogo}>CORE</Text>
        <Text style={styles.signupTitle}>Sign Up Account</Text>
        <Text style={styles.signupSubtitle}>enter your personal data to create your account</Text>

        <View style={styles.socialButtonsRow}>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
            <FontAwesome name="google" size={18} color="#fff" />
            <Text style={styles.socialText}>  Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
            <FontAwesome name="apple" size={18} color="#fff" />
            <Text style={styles.socialText}>  Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={{ marginHorizontal: 10, color: '#aaa' }}>or</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.nameRow}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.inputLabel}>first name</Text>
            <TextInput style={styles.input} placeholder="First name" placeholderTextColor="#888" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>last name</Text>
            <TextInput style={styles.input} placeholder="Last name" placeholderTextColor="#888" />
          </View>
        </View>

        <View>
          <Text style={styles.inputLabel}>email</Text>
          <TextInput style={styles.inputFull} placeholder="Email" keyboardType="email-address" placeholderTextColor="#888" />
        </View>

        <View style={styles.nameRow}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.inputLabel}>password</Text>
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888" secureTextEntry />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>confirm password</Text>
            <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#888" secureTextEntry />
          </View>
        </View>

        <TouchableOpacity style={{ marginVertical: 12 }}>
          <Text style={styles.loginText}>
            already have an account? <Text style={{ fontWeight: 'bold', color: 'white' }}>log in</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} activeOpacity={0.85}>
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    height: 600,
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingLeft: 20,
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 8,
    marginLeft: 4,
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 50,
  },

  signupContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#000000',
  },
  coreLogo: {
    fontSize: 40,
    fontWeight: '900',
    color: 'white',
    alignSelf: 'center',
    marginBottom: 20,
  },
  signupTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    alignSelf: 'center',
  },
  signupSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 15,
    alignSelf: 'center',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#5a5a5a',
    borderRadius: 4,
    paddingVertical: 12,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    color: 'white',
    fontWeight: '600',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  nameRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  inputLabel: {
    color: 'white',
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: 'white',
  },
  inputFull: {
    backgroundColor: '#333',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: 'white',
    marginVertical: 8,
  },
  loginText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  signUpButton: {
    marginTop: 20,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a3dbb',
    justifyContent: 'center',
    alignItems: 'center',
    // Gradient effect on button can be added with LinearGradient wrapper if desired
  },
  signUpButtonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 18,
  },
}); 