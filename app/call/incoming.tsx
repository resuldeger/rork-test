import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Phone, PhoneOff } from "lucide-react-native";
import { useCall } from "@/providers/call-provider";
import { useSocket } from "@/providers/socket-provider";

const { width, height } = Dimensions.get("window");

export default function IncomingCallScreen() {
  const { callId, callerName, callerAvatar } = useLocalSearchParams<{
    callId: string;
    callerName: string;
    callerAvatar: string;
  }>();
  
  const callContext = useCall();
  const socketContext = useSocket();

  const handleAccept = () => {
    if (callId && socketContext?.emitAccept && callContext?.acceptCall) {
      socketContext.emitAccept(callId);
      callContext.acceptCall(callId);
    }
  };

  const handleReject = () => {
    if (callId && socketContext?.emitReject && callContext?.rejectCall) {
      socketContext.emitReject(callId);
      callContext.rejectCall(callId);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.callerInfo}>
            <Text style={styles.incomingText}>Incoming Call</Text>
            
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: callerAvatar }}
                style={styles.avatar}
              />
              <View style={styles.pulseRing} />
              <View style={styles.pulseRing2} />
            </View>
            
            <Text style={styles.callerName}>{callerName}</Text>
            <Text style={styles.callType}>Video Call</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={handleReject}
            >
              <PhoneOff size={32} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}
            >
              <Phone size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 80,
  },
  callerInfo: {
    alignItems: "center",
    gap: 20,
  },
  incomingText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "white",
  },
  pulseRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  pulseRing2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  callerName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  callType: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: width * 0.8,
  },
  acceptButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
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
  rejectButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f44336",
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
});