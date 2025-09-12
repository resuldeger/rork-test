import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  email: string;
  phoneVerified: boolean;
  selfiesUploaded: number;
  approvalStatus: "pending" | "approved" | "rejected";
  profile?: {
    about?: string;
    job?: string;
    school?: string;
    country?: string;
    gender?: string;
    orientation?: string;
    birthDate?: string;
    age?: number;
    showGender?: boolean;
    showAge?: boolean;
    showDistance?: boolean;
  };
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const saveUser = useCallback(async (userData: User) => {
    if (!userData) return;
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.log("Failed to save user:", error);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email?.trim() || !password?.trim()) return;
    console.log("Login:", email.trim());
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData: User = {
      id: "user-" + Date.now(),
      email: email.trim(),
      phoneVerified: false,
      selfiesUploaded: 0,
      approvalStatus: "pending",
    };
    
    await saveUser(userData);
  }, [saveUser]);

  const register = useCallback(async (email: string, password: string) => {
    if (!email?.trim() || !password?.trim()) return;
    console.log("Register:", email.trim());
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData: User = {
      id: "user-" + Date.now(),
      email: email.trim(),
      phoneVerified: false,
      selfiesUploaded: 0,
      approvalStatus: "pending",
    };
    
    await saveUser(userData);
  }, [saveUser]);

  const verifyPhone = useCallback(async (phoneNumber: string, code: string) => {
    if (!phoneNumber?.trim() || !code?.trim()) return;
    console.log("Verify phone:", phoneNumber.trim());
    
    if (!user) throw new Error("No user found");
    
    const updatedUser = {
      ...user,
      phoneVerified: true,
    };
    
    await saveUser(updatedUser);
  }, [user, saveUser]);

  const checkApprovalStatus = useCallback(async (): Promise<string> => {
    console.log("Checking approval status");
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (user && user.selfiesUploaded >= 5) {
      const timeSinceUpload = Date.now() - parseInt(user.id.split("-")[1]);
      if (timeSinceUpload > 10000) {
        const updatedUser = {
          ...user,
          approvalStatus: "approved" as const,
        };
        await saveUser(updatedUser);
        return "approved";
      }
    }
    
    return user?.approvalStatus || "pending";
  }, [user, saveUser]);

  const updateProfile = useCallback(async (profileData: any) => {
    if (!user) throw new Error("No user found");
    
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...profileData,
      },
    };
    
    await saveUser(updatedUser);
  }, [user, saveUser]);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.log("Failed to logout:", error);
    }
  }, []);

  return useMemo(() => ({
    user,
    isLoading,
    login,
    register,
    verifyPhone,
    checkApprovalStatus,
    updateProfile,
    logout,
  }), [user, isLoading, login, register, verifyPhone, checkApprovalStatus, updateProfile, logout]);
});