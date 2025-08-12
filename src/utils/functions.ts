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
  const name = data;
  let alphabet = "-";
  let background = "#666";

  const googleColors =
    "conic-gradient(from 0deg, #4285F4 0deg, #EA4335 90deg, #FBBC05 180deg, #34A853 270deg, #4285F4 360deg)";
  const linkedInColor = "#0A66C2";
  const highContrastColors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
  ];

  if (!name || name.trim() === "") {
    return { alphabet, background };
  }

  const nameLower = name.toLowerCase();

  if (nameLower.includes("google")) {
    alphabet = "G";
    background = googleColors;
  } else if (nameLower.includes("linkedin")) {
    alphabet = "L";
    background = linkedInColor;
  } else {
    alphabet = name.charAt(0).toUpperCase();
    background =
      highContrastColors[Math.floor(Math.random() * highContrastColors.length)];
  }

  return { alphabet, background };
};
