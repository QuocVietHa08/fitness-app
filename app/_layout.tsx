import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, Redirect, useSegments, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import "react-native-reanimated";
import { Appearance } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { TamaguiProvider, View } from "@tamagui/core";
import config from "../tamagui.config";
import useAuthStore from "../store/useAuthStore";
import useThemeStore, { ThemeAccent, ThemeMode } from "../store/useThemeStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

async function getStoredUser() {
  const storedUser = await AsyncStorage.getItem("user");
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
}

const AuthenticationGuard = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  const authState = useAuthStore.getState();

  // Load user data on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = await getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return; // Don't navigate while still loading

    const inAuthGroup = segments[0] === "(tabs)";
    const inLoginScreen = segments[0] === "login";

    if (!authState.isAuthenticated && inAuthGroup) {
      // If not authenticated and trying to access protected routes, redirect to login
      router.replace("/login");
    } else if (authState.isAuthenticated && inLoginScreen) {
      // If authenticated and on login screen, redirect to home
      router.replace("/(tabs)");
    }
  }, [isLoading, segments, router, authState.isAuthenticated]);

  // Show children regardless of auth state - navigation is handled by the effect above
  return <>{children}</>;
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const themeStore = useMemo(() => {
    const state = useThemeStore.getState();
    return {
      mode: state.mode,
      accent: state.accent,
    };
  }, []);

  const actualColorScheme = useMemo(() => {
    if (themeStore.mode === "system") {
      return systemColorScheme || "light";
    }
    return themeStore.mode;
  }, [themeStore.mode, systemColorScheme]);

  const themeName = useMemo(() => {
    return `${actualColorScheme}_${themeStore.accent}`;
  }, [actualColorScheme, themeStore.accent]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <AuthenticationGuard>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthenticationGuard>
      <StatusBar style={actualColorScheme === "dark" ? "light" : "dark"} />
    </TamaguiProvider>
  );
}
