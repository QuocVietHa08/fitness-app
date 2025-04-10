import { StyleSheet, Switch, TouchableOpacity, ScrollView } from "react-native";
import {
  Text,
  View,
  YStack,
  XStack,
  Card,
  H2,
  Paragraph,
  Button,
  Theme,
  useTheme,
} from "tamagui";
import { useState, useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import useThemeStore, {
  ThemeMode,
  ThemeAccent,
} from "../../store/useThemeStore";

// Color option component for accent color selection
const ColorOption = ({
  color,
  name,
  isSelected,
  onSelect,
}: {
  color: string;
  name: ThemeAccent;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onSelect} style={{ marginRight: 16 }}>
      <YStack alignItems="center" space="$2">
        <View
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor={color}
          borderWidth={isSelected ? 3 : 0}
          borderColor="$background"
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={3}
        />
        <Text fontSize={12} color="$text">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Text>
      </YStack>
    </TouchableOpacity>
  );
};

// Theme mode option component
const ThemeModeOption = ({
  mode,
  label,
  isSelected,
  onSelect,
}: {
  mode: ThemeMode;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onSelect} style={{ marginRight: 16 }}>
      <Card
        bordered={isSelected}
        borderColor={isSelected ? "$accent" : "transparent"}
        backgroundColor={isSelected ? "$card" : "$background"}
        padding="$3"
        width={100}
        height={80}
        justifyContent="center"
        alignItems="center"
        borderRadius="$4"
      >
        <Text fontSize={14} fontWeight="bold" color="$text">
          {label}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const accent = useThemeStore((state) => state.accent)
  const mode= useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)
  const setAccent = useThemeStore((state) => state.setAccent)

  const systemColorScheme = useColorScheme();

  const theme = useTheme();

  const accentColors: Record<ThemeAccent, string> = {
    orange: "#FF6B00",
    blue: "#0088FF",
    green: "#00CC88",
    purple: "#8855FF",
  };

  return (
    <Theme
      name={`${
        mode === "system" ? systemColorScheme || "light" : mode
      }_${accent}`}
    >
      <ScrollView style={styles.container}>
        <YStack padding="$4" space="$6">
          <H2>Appearance</H2>

          <YStack space="$4">
            <Paragraph fontWeight="bold" color="$text">
              Theme Mode
            </Paragraph>
            <XStack>
              <ThemeModeOption
                mode="light"
                label="Light"
                isSelected={mode === "light"}
                onSelect={() => setMode("light")}
              />
              <ThemeModeOption
                mode="dark"
                label="Dark"
                isSelected={mode === "dark"}
                onSelect={() => setMode("dark")}
              />
              <ThemeModeOption
                mode="system"
                label="System"
                isSelected={mode === "system"}
                onSelect={() => setMode("system")}
              />
            </XStack>
          </YStack>

          <YStack space="$4">
            <Paragraph fontWeight="bold" color="$text">
              Accent Color
            </Paragraph>
            <XStack>
              {Object.entries(accentColors).map(([name, color]) => (
                <ColorOption
                  key={name}
                  name={name as ThemeAccent}
                  color={color}
                  isSelected={accent === name}
                  onSelect={() => setAccent(name as ThemeAccent)}
                />
              ))}
            </XStack>
            <Text>Hello</Text>
          </YStack>

          <YStack space="$4">
            <Paragraph fontWeight="bold" color="$text">
              Preview
            </Paragraph>
            <Card backgroundColor="$card" padding="$4" borderRadius="$4">
              <YStack space="$4">
                <H2 color="$text">Theme Preview</H2>
                <Paragraph color="$muted">
                  This is how your selected theme will look throughout the app.
                </Paragraph>
                <XStack space="$2">
                  <Button backgroundColor="$accent" color="white">
                    Primary Button
                  </Button>
                  <Button
                    variant="outlined"
                    borderColor="$accent"
                    color="$accent"
                  >
                    Secondary
                  </Button>
                </XStack>
              </YStack>
            </Card>
          </YStack>
        </YStack>
      </ScrollView>
    </Theme>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
