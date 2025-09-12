import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/providers/auth-provider";

export default function WaitingScreen() {
  const [isChecking, setIsChecking] = useState(false);
  const { user, checkApprovalStatus } = useAuth();
  const insets = useSafeAreaInsets();

  const checkStatus = useCallback(async () => {
    try {
      const status = await checkApprovalStatus();
      if (status === "approved") {
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.log("Failed to check approval status:", error);
    }
  }, [checkApprovalStatus]);

  useEffect(() => {
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      const status = await checkApprovalStatus();
      if (status === "approved") {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("Failed to check approval status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = () => {
    switch (user?.approvalStatus) {
      case "approved":
        return <CheckCircle size={80} color="#4CAF50" />;
      case "rejected":
        return <XCircle size={80} color="#f44336" />;
      default:
        return <Clock size={80} color="#FF9800" />;
    }
  };

  const getStatusTitle = () => {
    switch (user?.approvalStatus) {
      case "approved":
        return "Profile Approved!";
      case "rejected":
        return "Profile Rejected";
      default:
        return "Under Review";
    }
  };

  const getStatusMessage = () => {
    switch (user?.approvalStatus) {
      case "approved":
        return "Your profile has been approved! You can now start receiving calls.";
      case "rejected":
        return "Your profile was rejected. Please contact support for more information.";
      default:
        return "Your profile is being reviewed by our team. This usually takes 24-48 hours. You'll be notified once approved.";
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text style={styles.title}>{getStatusTitle()}</Text>
          <Text style={styles.message}>{getStatusMessage()}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.checkButton, isChecking && styles.disabledButton]}
            onPress={handleManualCheck}
            disabled={isChecking}
          >
            {isChecking ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <RefreshCw size={20} color="white" />
                <Text style={styles.checkButtonText}>Check Status</Text>
              </>
            )}
          </TouchableOpacity>

          {user?.approvalStatus === "rejected" && (
            <TouchableOpacity
              style={styles.supportButton}
              onPress={() => {
                // TODO: Open support/contact page
              }}
            >
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                Our team reviews your selfies for authenticity
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                You&apos;ll receive a notification once approved
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                Start receiving video calls from verified users
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  statusContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actions: {
    gap: 16,
    marginVertical: 32,
  },
  checkButton: {
    flexDirection: "row",
    backgroundColor: "#667eea",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  checkButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  supportButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#667eea",
  },
  supportButtonText: {
    color: "#667eea",
    fontSize: 18,
    fontWeight: "600",
  },
  info: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    gap: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  infoBullet: {
    fontSize: 16,
    color: "#667eea",
    fontWeight: "bold",
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
});