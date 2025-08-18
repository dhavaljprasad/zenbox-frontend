"use client";
import CommonHeader from "@/components/commonheader";
import WriteEmail from "@/components/writeemail";
import WriterHelperAi from "@/components/writerhelperai";
import { getJWTToken } from "@/utils/functions";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

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

function WritePage() {
  const [userData, setUserData] = useState<ZenboxJwtPayload | null>(null);

  useEffect(() => {
    const jwtToken = getJWTToken();

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
    <div className="w-full h-full bg-neutral-900">
      <CommonHeader userData={userData} />
      <div className="w-full h-full flex items-center gap-2 p-2 pt-18">
        <WriteEmail />
        <WriterHelperAi />
      </div>
    </div>
  );
}

export default WritePage;
