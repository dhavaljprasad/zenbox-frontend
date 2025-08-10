"use client";
import React, { use, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import CommonHeader from "@/components/commonheader";
import Sidebar from "@/components/sidebar";

import { SideBarConfig } from "@/utils/configs";

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

function MailPage() {
  const [userData, setUserData] = useState<ZenboxJwtPayload | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>(
    SideBarConfig[0].contents[0].title
  );

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    const googleAccessToken = getCookie("accessToken");
    if (jwtToken) {
      try {
        const decodedToken = jwtDecode<ZenboxJwtPayload>(jwtToken as string);
        setUserData(decodedToken);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
    if (typeof googleAccessToken === "string") {
      setAccessToken(googleAccessToken);
    }
  }, []);

  return (
    <div className="w-full h-full bg-neutral-900">
      <CommonHeader userData={userData} />
      <div className="h-full w-full flex items-center">
        <Sidebar
          SideBarConfig={SideBarConfig}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>
    </div>
  );
}

export default MailPage;
