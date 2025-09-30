import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { register, login, googleLogin } from '../lib/api';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const googleClientId = (process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID as string) || '';
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({ clientId: googleClientId });

  React.useEffect(() => {
    async function handleGoogle() {
      if (response?.type === 'success' && response.params?.id_token) {
        try {
          setGoogleLoading(true);
          setError(null);
          setSuccess(null);
          const res = await googleLogin(response.params.id_token);
          setSuccess(`Logged in as ${res.user.name}`);
          router.replace('/ai-therepest');
        } catch (e: any) {
          setError(e.message || 'Google login failed');
        } finally {
          setGoogleLoading(false);
        }
      }
    }
    handleGoogle();
  }, [response]);

  async function onSignUp() {
    setError(null);
    setSuccess(null);
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    router.replace('/ai-therepest');
  }

  async function onLogin() {
    setError(null);
    setSuccess(null);
    if (!email || !password) {
      setError('Enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await login({ email, password });
      setSuccess(`Logged in as ${res.user.name}`);
      router.replace('/ai-therepest');
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setSuccess(null);
    if (!googleClientId) {
      setError('Google client ID not configured');
      return;
    }
    setGoogleLoading(true);
    try {
      await promptAsync();
    } catch (e: any) {
      setError(e.message || 'Google login failed');
      setGoogleLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* SignUp Screen */}
      <View style={styles.signupContainer}>
        <Text style={styles.coreLogo}>CORE</Text>
        <Text style={styles.signupTitle}>Sign Up Account</Text>
        <Text style={styles.signupSubtitle}>enter your personal data to create your account</Text>

        <View style={styles.socialButtonsRow}>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.8} onPress={onGoogle} disabled={googleLoading || !request}>
            {googleLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <FontAwesome name="google" size={18} color="#fff" />
                <Text style={styles.socialText}>  Google</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.8} disabled>
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
            <TextInput style={styles.input} placeholder="First name" placeholderTextColor="#888" value={firstName} onChangeText={setFirstName} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>last name</Text>
            <TextInput style={styles.input} placeholder="Last name" placeholderTextColor="#888" value={lastName} onChangeText={setLastName} />
          </View>
        </View>

        <View>
          <Text style={styles.inputLabel}>email</Text>
          <TextInput style={styles.inputFull} placeholder="Email" keyboardType="email-address" placeholderTextColor="#888" value={email} onChangeText={setEmail} autoCapitalize="none" />
        </View>

        <View style={styles.nameRow}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.inputLabel}>password</Text>
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>confirm password</Text>
            <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#888" secureTextEntry value={confirm} onChangeText={setConfirm} />
          </View>
        </View>

        {error ? (
          <Text style={{ color: '#ff6b6b', textAlign: 'center', marginTop: 8 }}>{error}</Text>
        ) : null}
        {success ? (
          <Text style={{ color: '#4caf50', textAlign: 'center', marginTop: 8 }}>{success}</Text>
        ) : null}

        <TouchableOpacity style={{ marginVertical: 12 }} onPress={onLogin}>
          <Text style={styles.loginText}>
            already have an account? <Text style={{ fontWeight: 'bold', color: 'white' }}>log in</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} activeOpacity={0.85} onPress={onSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signUpButtonText}>Sign up</Text>}
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
    paddingVertical: 14,
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