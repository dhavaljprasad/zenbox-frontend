"use client";

import React, { useEffect, useState } from "react";
import { PrimaryButton } from "./appbuttons";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface ZenboxJwtPayload {
  id: string;
  name: string;
  email: string;
  provider: string;
  profileImage: string;
  subscriptionTier: string;
  exp?: number;
  iat?: number;
}

function AppHeader() {
  const [userData, setUserData] = useState<ZenboxJwtPayload | null>(null);

  const router = useRouter();

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      try {
        const decodedToken = jwtDecode<ZenboxJwtPayload>(jwtToken as string);
        setUserData(decodedToken);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, []);

  return (
    <div className="absolute w-full h-16 bg-black flex items-center justify-between px-30">
      <h1 className="text-white text-2xl font-bold">Zenbox</h1>
      <div className="flex items-center justify-center gap-4">
        <span className="text-white text-sm font-semibold cursor-pointer">
          Pricing
        </span>
        <span className="text-white text-sm font-semibold cursor-pointer">
          About
        </span>
        {userData ? (
          <>
            <PrimaryButton
              text="Go to Mail"
              onClick={() => {
                router.push("/mail");
              }}
            />
          </>
        ) : (
          <PrimaryButton
            text="Get Started"
            onClick={() => {
              window.location.href = "http://localhost:8080/auth/google";
            }}
          />
        )}
      </div>
    </div>
  );
}

export default AppHeader;
