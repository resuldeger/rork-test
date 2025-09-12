import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Phone, Wifi, WifiOff } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSocket } from "@/providers/socket-provider";
import { useCall } from "@/providers/call-provider";
import { useAuth } from "@/providers/auth-provider";

export default function HomeScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const { connect, disconnect, isConnected } = useSocket();
  const callContext = useCall();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const handleToggleOnline = async () => {
    if (isOnline) {
      setIsOnline(false);
      await disconnect();
    } else {
      setIsOnline(true);
      await connect();
    }
  };

  const handleSimulateCall = () => {
    if (__DEV__ && callContext?.simulateIncomingCall) {
      callContext.simulateIncomingCall({
        callId: "test-call-" + Date.now(),
        callerName: "Test User",
        callerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      });
    }
  };

  useEffect(() => {
    setIsOnline(isConnected);
  }, [isConnected]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={isOnline ? ["#4CAF50", "#45a049"] : ["#f5f5f5", "#e0e0e0"]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, {user?.email?.split("@")[0]}!</Text>
            <Text style={[styles.status, isOnline && styles.statusOnline]}>
              {isOnline ? "You&apos;re Online" : "You&apos;re Offline"}
            </Text>
          </View>

          <View style={styles.mainAction}>
            <TouchableOpacity
              style={[styles.onlineButton, isOnline && styles.onlineButtonActive]}
              onPress={handleToggleOnline}
            >
              <View style={styles.buttonContent}>
                {isOnline ? (
                  <Wifi size={40} color="white" />
                ) : (
                  <WifiOff size={40} color="#667eea" />
                )}
                <Text style={[styles.buttonText, isOnline && styles.buttonTextActive]}>
                  {isOnline ? "Go Offline" : "Go Online"}
                </Text>
                <Text style={[styles.buttonSubtext, isOnline && styles.buttonSubtextActive]}>
                  {isOnline
                    ? "You can receive calls"
                    : "Tap to start receiving calls"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Calls Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Total Calls</Text>
            </View>
          </View>

          {__DEV__ && (
            <View style={styles.debugSection}>
              <Text style={styles.debugTitle}>Debug Mode</Text>
              <TouchableOpacity
                style={styles.debugButton}
                onPress={handleSimulateCall}
              >
                <Phone size={20} color="#667eea" />
                <Text style={styles.debugButtonText}>Simulate Incoming Call</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    gap: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 16,
    color: "#666",
  },
  statusOnline: {
    color: "white",
  },
  mainAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  onlineButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  onlineButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 3,
    borderColor: "white",
  },
  buttonContent: {
    alignItems: "center",
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#667eea",
  },
  buttonTextActive: {
    color: "white",
  },
  buttonSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  buttonSubtextActive: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  stats: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 20,
  },
  debugSection: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  debugButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#667eea",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  debugButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#667eea",
  },
});