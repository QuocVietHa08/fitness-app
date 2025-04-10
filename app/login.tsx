import { useState, useCallback } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Image, Text, View } from "tamagui";
import { useRouter } from "expo-router";
import useAuthStore from "../store/useAuthStore";
import Logo from '@/assets/images/logo.png';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = useCallback(() => {
    if (password === '123') {
      Toast.show({
        type: 'error',
        text1: 'Invalid password',
        text2: 'Please try again',
      })
      return
    }

    useAuthStore.getState().login(email, password);
    router.replace("/(tabs)");
  }, [email, password, router]);

  return (
    <View style={styles.container}>
      <Toast />
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />
      </View>

      <Text style={styles.title}>Log In</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          textContentType="emailAddress"
          placeholderTextColor="#666"
          underlineColorAndroid="transparent"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Password checkasdfas"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 90,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FF6B00",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#FFB27F",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
