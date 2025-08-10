import { getCookie } from "cookies-next";
import axios from "axios";

export const getAccessToken = () => {
  const accessToken = getCookie("accessToken");
  return typeof accessToken === "string" ? accessToken : null;
};
