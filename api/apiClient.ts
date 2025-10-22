import axios from "axios";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

// Use your local backend IP address and port here:
const baseURL = "http://10.194.169.138:8080";

// Create axios instance
const apiClient = axios.create({
  baseURL:baseURL ,
  
  headers: {
    "Content-Type": "application/json",
  },
});

// Detect Image (Base64 Upload)
export const detectImage = async (imageData) => {
  try {
    // Get correct file path depending on platform
    const uri =
      Platform.OS === "ios"
        ? imageData.uri.replace("file://", "")
        : imageData.uri;

    // Convert image to Base64
    const base64Data = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Send Base64 to Flask API
    const response = await apiClient.post("/api/v1/detect/image", {
      image_base64: base64Data,
      filename: "image.jpg",
    });

    return response.data;
  } catch (err) {
    console.error("Error reading or sending image:", err);
    throw err;
  }
};

// Text-based routes
export const checkMisinfo = (text) =>
  apiClient.post("/api/v1/misinfo", { text });

export const analyzeSentiment = (text) =>
  apiClient.post("/api/v1/sentiment", { text });

export const summarizeText = (text) =>
  apiClient.post("/api/v1/summarize", { text });

// Optional: Health check route
export const checkHealth = () => apiClient.get("/api/v1/health");

export default apiClient;
