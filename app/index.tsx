import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/providers/auth-provider";

export default function IndexScreen() {
  const { user, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/auth/landing");
      return;
    }

    if (!user.phoneVerified) {
      router.replace("/auth/phone-verification");
    } else if (user.selfiesUploaded < 5) {
      router.replace("/selfie/upload");
    } else if (user.approvalStatus === "pending") {
      router.replace("/approval/waiting");
    } else if (user.approvalStatus === "approved") {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/auth/landing");
    }
  }, [user, isLoading]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});