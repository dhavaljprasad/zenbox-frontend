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
