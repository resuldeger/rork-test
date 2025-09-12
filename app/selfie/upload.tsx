import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Camera, RotateCcw, Upload, Check } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");
const CAMERA_SIZE = width - 48;

export default function SelfieUploadScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("front");
  const [selfies, setSelfies] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        setSelfies([...selfies, photo.uri]);
        setShowCamera(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take picture");
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelfies([...selfies, result.assets[0].uri]);
    }
  };

  const removeSelfie = (index: number) => {
    setSelfies(selfies.filter((_, i) => i !== index));
  };

  const uploadSelfies = async () => {
    if (selfies.length < 5) {
      Alert.alert("Error", "Please upload 5 selfies to continue");
      return;
    }

    setIsUploading(true);
    try {
      // TODO: Upload selfies to POST /selfies
      console.log("Uploading selfies:", selfies);
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        "Success",
        "Selfies uploaded successfully! Your profile is now under review.",
        [{ text: "OK", onPress: () => router.replace("/") }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to upload selfies");
    } finally {
      setIsUploading(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#667eea" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={80} color="#667eea" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to take selfies for verification
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showCamera) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.faceGuide} />
              <Text style={styles.guideText}>
                Position your face in the circle
              </Text>
            </View>
          </CameraView>
          
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.controlButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setFacing(facing === "back" ? "front" : "back")}
            >
              <RotateCcw size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Upload Selfies</Text>
            <Text style={styles.subtitle}>
              Take 5 clear selfies for verification. Make sure your face is clearly visible.
            </Text>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{selfies.length}/5 uploaded</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(selfies.length / 5) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.selfiesGrid}>
            {Array.from({ length: 5 }).map((_, index) => (
              <View key={index} style={styles.selfieSlot}>
                {selfies[index] ? (
                  <TouchableOpacity
                    style={styles.selfieContainer}
                    onPress={() => removeSelfie(index)}
                  >
                    <Image source={{ uri: selfies[index] }} style={styles.selfieImage} />
                    <View style={styles.selfieOverlay}>
                      <Check size={20} color="white" />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.emptySlot}>
                    <Text style={styles.slotNumber}>{index + 1}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowCamera(true)}
            >
              <Camera size={24} color="#667eea" />
              <Text style={styles.actionButtonText}>Take Selfie</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={pickFromGallery}
            >
              <Upload size={24} color="#667eea" />
              <Text style={styles.actionButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.uploadButton,
              (selfies.length < 5 || isUploading) && styles.disabledButton,
            ]}
            onPress={uploadSelfies}
            disabled={selfies.length < 5 || isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.uploadButtonText}>
                Submit for Review ({selfies.length}/5)
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  progressContainer: {
    width: "100%",
    gap: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#667eea",
    borderRadius: 4,
  },
  selfiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  selfieSlot: {
    width: (width - 72) / 3,
    aspectRatio: 1,
  },
  selfieContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  selfieImage: {
    width: "100%",
    height: "100%",
  },
  selfieOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 4,
  },
  emptySlot: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  slotNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ccc",
  },
  actions: {
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#667eea",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#667eea",
  },
  uploadButton: {
    backgroundColor: "#667eea",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  permissionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  faceGuide: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "white",
    borderStyle: "dashed",
  },
  guideText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: "black",
  },
  controlButton: {
    padding: 16,
  },
  controlButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#667eea",
  },
});