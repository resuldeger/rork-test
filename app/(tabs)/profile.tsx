import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Edit, Camera, MapPin, Briefcase, GraduationCap } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/providers/auth-provider";

export default function ProfileScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const profileData = {
    name: user?.email?.split("@")[0] || "User",
    age: user?.profile?.age || "Not set",
    location: user?.profile?.country || "Not set",
    job: user?.profile?.job || "Not set",
    school: user?.profile?.school || "Not set",
    about: user?.profile?.about || "Tell us about yourself...",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{profileData.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <MapPin size={20} color="#667eea" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{profileData.location}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Briefcase size={20} color="#667eea" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Job</Text>
                <Text style={styles.infoValue}>{profileData.job}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <GraduationCap size={20} color="#667eea" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Education</Text>
                <Text style={styles.infoValue}>{profileData.school}</Text>
              </View>
            </View>
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.aboutText}>{profileData.about}</Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/settings/profile")}
          >
            <Edit size={20} color="white" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={styles.verificationSection}>
            <Text style={styles.sectionTitle}>Verification Status</Text>
            <View style={styles.verificationItem}>
              <Text style={styles.verificationLabel}>Phone Number</Text>
              <View style={styles.verificationBadge}>
                <Text style={styles.verificationBadgeText}>Verified</Text>
              </View>
            </View>
            <View style={styles.verificationItem}>
              <Text style={styles.verificationLabel}>Selfie Verification</Text>
              <View style={[
                styles.verificationBadge,
                user?.approvalStatus === "approved" && styles.verificationBadgeSuccess
              ]}>
                <Text style={styles.verificationBadgeText}>
                  {user?.approvalStatus === "approved" ? "Approved" : "Pending"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 32,
  },
  header: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#667eea",
    borderRadius: 16,
    padding: 8,
    borderWidth: 3,
    borderColor: "white",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  infoSection: {
    gap: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  aboutSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  aboutText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#667eea",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  verificationSection: {
    gap: 16,
  },
  verificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  verificationLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  verificationBadge: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verificationBadgeSuccess: {
    backgroundColor: "#4CAF50",
  },
  verificationBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});