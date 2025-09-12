import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import { AppState } from "react-native";
import { useAuth } from "./auth-provider";

export interface IncomingCall {
  callId: string;
  callerName: string;
  callerAvatar: string;
}

export const [SocketProvider, useSocket] = createContextHook(() => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [incomingCallHandler, setIncomingCallHandler] = useState<((call: IncomingCall) => void) | null>(null);
  const { user } = useAuth();

  const disconnect = useCallback(async () => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
    }
    console.log("Going offline");
  }, [socket]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        disconnect();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription?.remove();
  }, [disconnect]);

  const connect = useCallback(async () => {
    if (!user) return;

    try {
      console.log("Connecting to socket...");
      
      const ws = new WebSocket("wss://echo.websocket.org");
      
      ws.onopen = () => {
        console.log("Socket connected");
        setIsConnected(true);
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Socket message:", data);
          
          if (data.type === "incoming_call" && incomingCallHandler) {
            incomingCallHandler({
              callId: data.callId,
              callerName: data.callerName,
              callerAvatar: data.callerAvatar,
            });
          }
        } catch (parseError) {
          if (parseError instanceof Error) {
            console.log("Failed to parse socket message:", parseError.message);
          }
        }
      };

      ws.onclose = () => {
        console.log("Socket disconnected");
        setIsConnected(false);
        setSocket(null);
      };

      ws.onerror = () => {
        console.log("Socket error occurred");
        setIsConnected(false);
      };

    } catch (connectError) {
      console.log("Failed to connect socket:", connectError);
    }
  }, [user, incomingCallHandler]);

  const emitAccept = useCallback((callId: string) => {
    if (socket && isConnected && callId?.trim()) {
      socket.send(JSON.stringify({ type: "accept_call", callId: callId.trim() }));
    }
  }, [socket, isConnected]);

  const emitReject = useCallback((callId: string) => {
    if (socket && isConnected && callId?.trim()) {
      socket.send(JSON.stringify({ type: "reject_call", callId: callId.trim() }));
    }
  }, [socket, isConnected]);

  const setIncomingCallHandlerCallback = useCallback((handler: (call: IncomingCall) => void) => {
    setIncomingCallHandler(() => handler);
  }, []);

  return useMemo(() => ({
    isConnected,
    connect,
    disconnect,
    emitAccept,
    emitReject,
    setIncomingCallHandler: setIncomingCallHandlerCallback,
  }), [isConnected, connect, disconnect, emitAccept, emitReject, setIncomingCallHandlerCallback]);
});