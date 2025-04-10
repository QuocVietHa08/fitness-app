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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AuthenticationGuard({ children }: { children: React.ReactNode }) {
  // For now, we'll just render the children without any authentication logic
  // This will prevent any infinite loops while you're developing
  return <>{children}</>;
}

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Get theme settings from store - using getState to avoid subscription and re-renders
  const themeStore = useMemo(() => {
    const state = useThemeStore.getState();
    return {
      mode: state.mode,
      accent: state.accent,
    };
  }, []);

  // Determine the actual color scheme based on theme mode
  const actualColorScheme = useMemo(() => {
    if (themeStore.mode === "system") {
      return systemColorScheme || "light";
    }
    return themeStore.mode;
  }, [themeStore.mode, systemColorScheme]);

  // Set the theme name based on color scheme and accent color
  const themeName = useMemo(() => {
    return `${actualColorScheme}_${themeStore.accent}`;
  }, [actualColorScheme, themeStore.accent]);

  // Handle splash screen hiding
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
      <ThemeProvider
        value={actualColorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <AuthenticationGuard>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthenticationGuard>
        <StatusBar style={actualColorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </TamaguiProvider>
  );
}
