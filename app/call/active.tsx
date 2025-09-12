import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Phone, Mic, MicOff, Video, VideoOff, Volume2 } from "lucide-react-native";
import { useCall } from "@/providers/call-provider";

const { width, height } = Dimensions.get("window");

export default function ActiveCallScreen() {
  const { callId } = useLocalSearchParams<{ callId: string }>();
  const callContext = useCall();
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (callContext?.endCall) {
      callContext.endCall();
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // TODO: Toggle speaker with Agora
    console.log("Toggle speaker:", !isSpeakerOn);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Video Area */}
        <View style={styles.videoContainer}>
          <View style={styles.remoteVideo}>
            <Text style={styles.videoPlaceholder}>Remote Video</Text>
          </View>
          
          <View style={styles.localVideo}>
            <Text style={styles.localVideoPlaceholder}>You</Text>
          </View>
        </View>

        {/* Call Info */}
        <View style={styles.callInfo}>
          <Text style={styles.callStatus}>Connected</Text>
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, callContext?.isMuted && styles.controlButtonActive]}
            onPress={() => callContext?.toggleMute?.()}
          >
            {callContext?.isMuted ? (
              <MicOff size={24} color="white" />
            ) : (
              <Mic size={24} color="#333" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, !callContext?.isVideoEnabled && styles.controlButtonActive]}
            onPress={() => callContext?.toggleVideo?.()}
          >
            {callContext?.isVideoEnabled ? (
              <Video size={24} color="#333" />
            ) : (
              <VideoOff size={24} color="white" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
            onPress={toggleSpeaker}
          >
            <Volume2 size={24} color={isSpeakerOn ? "white" : "#333"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <Phone size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholder: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  localVideo: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: "#555",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  localVideoPlaceholder: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  callInfo: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  callStatus: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  callDuration: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 40,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonActive: {
    backgroundColor: "#667eea",
  },
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
  },
});