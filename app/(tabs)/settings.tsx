import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { router } from "expo-router";
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Eye,
  MapPin,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/providers/auth-provider";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [showGender, setShowGender] = React.useState(user?.profile?.showGender ?? true);
  const [showAge, setShowAge] = React.useState(user?.profile?.showAge ?? true);
  const [showDistance, setShowDistance] = React.useState(user?.profile?.showDistance ?? true);

  const handleLogout = () => {
    logout();
  };

  const settingSections = [
    {
      title: "Profile",
      items: [
        {
          icon: <User size={20} color="#667eea" />,
          title: "Edit Profile",
          subtitle: "Update your personal information",
          onPress: () => router.push("/settings/profile"),
          showArrow: true,
        },
      ],
    },
    {
      title: "Privacy",
      items: [
        {
          icon: <Eye size={20} color="#667eea" />,
          title: "Show Gender",
          subtitle: "Display your gender to other users",
          rightComponent: (
            <Switch
              value={showGender}
              onValueChange={setShowGender}
              trackColor={{ false: "#ddd", true: "#667eea" }}
            />
          ),
        },
        {
          icon: <Eye size={20} color="#667eea" />,
          title: "Show Age",
          subtitle: "Display your age to other users",
          rightComponent: (
            <Switch
              value={showAge}
              onValueChange={setShowAge}
              trackColor={{ false: "#ddd", true: "#667eea" }}
            />
          ),
        },
        {
          icon: <MapPin size={20} color="#667eea" />,
          title: "Show Distance",
          subtitle: "Display your distance to other users",
          rightComponent: (
            <Switch
              value={showDistance}
              onValueChange={setShowDistance}
              trackColor={{ false: "#ddd", true: "#667eea" }}
            />
          ),
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: <Bell size={20} color="#667eea" />,
          title: "Push Notifications",
          subtitle: "Manage your notification preferences",
          onPress: () => console.log("Notification settings"),
          showArrow: true,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: <Shield size={20} color="#667eea" />,
          title: "Privacy Policy",
          subtitle: "Read our privacy policy",
          onPress: () => console.log("Privacy policy"),
          showArrow: true,
        },
        {
          icon: <HelpCircle size={20} color="#667eea" />,
          title: "Help & Support",
          subtitle: "Get help or contact support",
          onPress: () => console.log("Help & Support"),
          showArrow: true,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: <LogOut size={20} color="#f44336" />,
          title: "Logout",
          subtitle: "Sign out of your account",
          onPress: handleLogout,
          titleColor: "#f44336",
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
          </View>

          {settingSections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.items.map((item) => (
                  <TouchableOpacity
                    key={item.title}
                    style={styles.settingItem}
                    onPress={(item as any).onPress}
                    disabled={!(item as any).onPress}
                  >
                    <View style={styles.settingLeft}>
                      <View style={styles.settingIcon}>{item.icon}</View>
                      <View style={styles.settingContent}>
                        <Text
                          style={[
                            styles.settingTitle,
                            (item as any).titleColor && { color: (item as any).titleColor },
                          ]}
                        >
                          {item.title}
                        </Text>
                        {item.subtitle && (
                          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.settingRight}>
                      {(item as any).rightComponent}
                      {(item as any).showArrow && <ChevronRight size={16} color="#ccc" />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>VideoCall v1.0.0</Text>
            <Text style={styles.footerText}>Made with ❤️</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footer: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
  },
});