import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { Calendar, MapPin, Briefcase, GraduationCap, User, Heart } from "lucide-react-native";
import { useAuth } from "@/providers/auth-provider";
import { validateAge, validateRequired } from "@/utils/validation";

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Germany", "France", "Spain", "Italy",
  "Australia", "Japan", "South Korea", "Brazil", "Mexico", "India", "Turkey", "Other"
];

const GENDERS = ["Male", "Female", "Non-binary", "Other"];
const ORIENTATIONS = ["Straight", "Gay", "Lesbian", "Bisexual", "Pansexual", "Other"];

export default function ProfileSettingsScreen() {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    about: user?.profile?.about || "",
    job: user?.profile?.job || "",
    school: user?.profile?.school || "",
    country: user?.profile?.country || "",
    gender: user?.profile?.gender || "",
    orientation: user?.profile?.orientation || "",
    birthDate: user?.profile?.birthDate || "",
  });

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!validateRequired(formData.about)) {
      newErrors.about = "About section is required (min 10 characters)";
    }
    if (!validateRequired(formData.job)) {
      newErrors.job = "Job is required";
    }
    if (!validateRequired(formData.country)) {
      newErrors.country = "Country is required";
    }
    if (!validateRequired(formData.gender)) {
      newErrors.gender = "Gender is required";
    }
    if (!validateRequired(formData.birthDate)) {
      newErrors.birthDate = "Birth date is required";
    } else {
      const ageError = validateAge(formData.birthDate);
      if (ageError) {
        newErrors.birthDate = ageError;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: PATCH https://example.com/profile
      console.log("Updating profile:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await updateProfile(formData);
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About You</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>About Me *</Text>
                  <TextInput
                    style={[styles.textArea, errors.about && styles.inputError]}
                    value={formData.about}
                    onChangeText={(text) => updateField("about", text)}
                    placeholder="Tell us about yourself (min 10 characters)"
                    multiline
                    numberOfLines={4}
                    maxLength={300}
                  />
                  <Text style={styles.charCount}>{formData.about.length}/300</Text>
                  {errors.about && <Text style={styles.errorText}>{errors.about}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Birth Date *</Text>
                  <View style={styles.inputWithIcon}>
                    <Calendar size={20} color="#666" />
                    <TextInput
                      style={[styles.input, errors.birthDate && styles.inputError]}
                      value={formData.birthDate}
                      onChangeText={(text) => updateField("birthDate", text)}
                      placeholder="YYYY-MM-DD"
                      maxLength={10}
                    />
                  </View>
                  {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Work & Education</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Job *</Text>
                  <View style={styles.inputWithIcon}>
                    <Briefcase size={20} color="#666" />
                    <TextInput
                      style={[styles.input, errors.job && styles.inputError]}
                      value={formData.job}
                      onChangeText={(text) => updateField("job", text)}
                      placeholder="Your job title"
                      maxLength={50}
                    />
                  </View>
                  {errors.job && <Text style={styles.errorText}>{errors.job}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>School</Text>
                  <View style={styles.inputWithIcon}>
                    <GraduationCap size={20} color="#666" />
                    <TextInput
                      style={styles.input}
                      value={formData.school}
                      onChangeText={(text) => updateField("school", text)}
                      placeholder="Your school or university"
                      maxLength={50}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location & Identity</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Country *</Text>
                  <View style={styles.inputWithIcon}>
                    <MapPin size={20} color="#666" />
                    <TextInput
                      style={[styles.input, errors.country && styles.inputError]}
                      value={formData.country}
                      onChangeText={(text) => updateField("country", text)}
                      placeholder="Select your country"
                    />
                  </View>
                  {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Gender *</Text>
                  <View style={styles.inputWithIcon}>
                    <User size={20} color="#666" />
                    <TextInput
                      style={[styles.input, errors.gender && styles.inputError]}
                      value={formData.gender}
                      onChangeText={(text) => updateField("gender", text)}
                      placeholder="Select your gender"
                    />
                  </View>
                  {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Sexual Orientation</Text>
                  <View style={styles.inputWithIcon}>
                    <Heart size={20} color="#666" />
                    <TextInput
                      style={styles.input}
                      value={formData.orientation}
                      onChangeText={(text) => updateField("orientation", text)}
                      placeholder="Select your orientation"
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.disabledButton]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  * Required fields. Your information helps us provide better matches.
                </Text>
              </View>
            </View>
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 32,
  },
  section: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#f9f9f9",
    gap: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
    minHeight: 100,
  },
  inputError: {
    borderColor: "#ff4444",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#667eea",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});