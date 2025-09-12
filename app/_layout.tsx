import { BundleInspector } from '../.rorkai/inspector';
import { RorkErrorBoundary } from '../.rorkai/rork-error-boundary';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/providers/auth-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { CallProvider } from "@/providers/call-provider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/landing" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ title: "Login" }} />
      <Stack.Screen name="auth/register" options={{ title: "Register" }} />
      <Stack.Screen name="auth/phone-verification" options={{ title: "Phone Verification" }} />
      <Stack.Screen name="auth/otp-verification" options={{ title: "Enter Code" }} />
      <Stack.Screen name="selfie/upload" options={{ title: "Upload Selfies" }} />
      <Stack.Screen name="approval/waiting" options={{ title: "Approval Pending" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="call/incoming" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <Stack.Screen name="call/active" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <Stack.Screen name="settings/profile" options={{ title: "Profile Settings" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.gestureHandler}>
        <AuthProvider>
          <SocketProvider>
            <CallProvider>
              <BundleInspector><RorkErrorBoundary><RootLayoutNav /></RorkErrorBoundary></BundleInspector>
            </CallProvider>
          </SocketProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});