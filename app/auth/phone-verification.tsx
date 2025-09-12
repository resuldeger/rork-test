import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import { validatePhoneNumber } from "@/utils/validation";

export default function PhoneVerificationScreen() {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    const fullPhone = countryCode + phoneNumber;
    const phoneError = validatePhoneNumber(fullPhone);

    if (phoneError) {
      setError(phoneError);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: POST /auth/phone/send-code
      console.log("Sending code to:", fullPhone);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push({
        pathname: "/auth/otp-verification",
        params: { phoneNumber: fullPhone }
      });
    } catch (error) {
      Alert.alert("Error", "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "");
    
    // Format based on country code (US format for now)
    if (countryCode === "+1") {
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        return [match[1], match[2], match[3]].filter(Boolean).join("-");
      }
    }
    
    return cleaned;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Verify Your Phone</Text>
              <Text style={styles.subtitle}>
                We'll send you a verification code to confirm your number
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                
                <View style={styles.phoneInputContainer}>
                  <TouchableOpacity style={styles.countrySelector}>
                    <Text style={styles.countryCode}>{countryCode}</Text>
                    <ChevronDown size={16} color="#666" />
                  </TouchableOpacity>
                  
                  <TextInput
                    style={[styles.phoneInput, error && styles.inputError]}
                    value={phoneNumber}
                    onChangeText={(text) => {
                      const formatted = formatPhoneNumber(text);
                      setPhoneNumber(formatted);
                      if (error) setError("");
                    }}
                    placeholder="123-456-7890"
                    keyboardType="phone-pad"
                    maxLength={12}
                  />
                </View>
                
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>

              <TouchableOpacity
                style={[styles.sendButton, isLoading && styles.disabledButton]}
                onPress={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.sendButtonText}>Send Code</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing, you agree to receive SMS messages from us
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    gap: 32,
  },
  inputContainer: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  phoneInputContainer: {
    flexDirection: "row",
    gap: 12,
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#f9f9f9",
    gap: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: "#667eea",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});