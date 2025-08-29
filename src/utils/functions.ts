import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

// Access the public environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getJWTToken = () => {
  const jwtToken = getCookie("jwtToken");
  if (!jwtToken) {
    console.error("No JWT token found. User is not authenticated.");
    return null;
  }
  return jwtToken;
};

export const getAccessToken = async () => {
  const googleAccessToken = getCookie("accessToken");

  if (googleAccessToken) {
    return googleAccessToken;
  } else {
    try {
      const jwtToken = getJWTToken();

      if (!jwtToken) {
        return null;
      }

      const response = await axios.get(`${BACKEND_URL}/gmail/accessToken`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const newAccessToken = response.data.accessToken;

      // Set the new access token in the cookie with a one-hour expiration
      setCookie("accessToken", newAccessToken, {
        maxAge: 60 * 60, // 1 hour in seconds
        path: "/",
      });

      console.log("New access token received and saved to cookie.");
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      return null;
    }
  }
};

export const getAlphabetAndBackground = (data: string) => {
  const name = data || "";
  let alphabet = "-";
  let background = "#666"; // default base gray

  // Brand colors
  const brandColors: Record<string, { letter: string; color: string }> = {
    google: {
      letter: "G",
      color:
        "conic-gradient(from 0deg, #4285F4 0deg, #EA4335 90deg, #FBBC05 180deg, #34A853 270deg, #4285F4 360deg)",
    },
    linkedin: { letter: "L", color: "#0A66C2" },
    pinterest: { letter: "P", color: "#E60023" },
    x: { letter: "X", color: "#000000" }, // X (Twitter) = black
    twitter: { letter: "T", color: "#1DA1F2" }, // fallback if still says Twitter
    github: { letter: "G", color: "#181717" },
    instagram: {
      letter: "I",
      color:
        "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    },
    reddit: { letter: "R", color: "#FF4500" },
    threads: { letter: "T", color: "#000000" },
    snapchat: { letter: "S", color: "#ddda00ff" },
  };

  if (!name || name.trim() === "") {
    return { alphabet, background };
  }

  const nameLower = name.toLowerCase();

  // Check if it matches a known brand
  for (const key in brandColors) {
    if (nameLower.includes(key)) {
      alphabet = brandColors[key].letter;
      background = brandColors[key].color;
      return { alphabet, background };
    }
  }

  // Default: first alphabet + gray background
  alphabet = name.charAt(0).toUpperCase();
  return { alphabet, background };
};
