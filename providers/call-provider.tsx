import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";
import { useSocket, type IncomingCall } from "./socket-provider";

export const [CallProvider, useCall] = createContextHook(() => {
  const [currentCall, setCurrentCall] = useState<IncomingCall | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const socketContext = useSocket();

  const showIncomingCallScreen = useCallback((call: IncomingCall) => {
    if (!call?.callId?.trim() || !call?.callerName?.trim()) return;
    router.push({
      pathname: "/call/incoming",
      params: {
        callId: call.callId.trim(),
        callerName: call.callerName.trim(),
        callerAvatar: call.callerAvatar || "",
      },
    });
  }, []);

  const handleIncomingCall = useCallback((call: IncomingCall) => {
    if (!call?.callId?.trim()) return;
    console.log("Incoming call:", call.callId.trim());
    setCurrentCall(call);
    
    if (Platform.OS === "ios") {
      showIncomingCallScreen(call);
    } else {
      showIncomingCallScreen(call);
    }
  }, [showIncomingCallScreen]);

  const acceptCall = useCallback(async (callId: string) => {
    if (!callId?.trim()) return;
    try {
      console.log("Accepting call:", callId.trim());
      
      setIsInCall(true);
      router.replace({
        pathname: "/call/active",
        params: { callId: callId.trim() },
      });
    } catch (error) {
      console.log("Failed to accept call:", error);
    }
  }, []);

  const rejectCall = useCallback((callId: string) => {
    if (!callId?.trim()) return;
    console.log("Rejecting call:", callId.trim());
    setCurrentCall(null);
    router.back();
  }, []);

  const endCall = useCallback(async () => {
    try {
      console.log("Ending call");
      
      setIsInCall(false);
      setCurrentCall(null);
      router.back();
    } catch (error) {
      console.log("Failed to end call:", error);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    console.log("Toggle mute:", !isMuted);
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    setIsVideoEnabled(!isVideoEnabled);
    console.log("Toggle video:", !isVideoEnabled);
  }, [isVideoEnabled]);

  const simulateIncomingCall = useCallback((call: IncomingCall) => {
    if (__DEV__ && call?.callId?.trim()) {
      setTimeout(() => {
        handleIncomingCall(call);
      }, 3000);
    }
  }, [handleIncomingCall]);

  useEffect(() => {
    if (socketContext?.setIncomingCallHandler) {
      socketContext.setIncomingCallHandler(handleIncomingCall);
    }
  }, [handleIncomingCall, socketContext]);

  return useMemo(() => ({
    currentCall,
    isInCall,
    isMuted,
    isVideoEnabled,
    handleIncomingCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
    simulateIncomingCall,
  }), [currentCall, isInCall, isMuted, isVideoEnabled, handleIncomingCall, acceptCall, rejectCall, endCall, toggleMute, toggleVideo, simulateIncomingCall]);
});