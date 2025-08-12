"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// importing components
import CommonHeader from "@/components/commonheader";
import Sidebar from "@/components/sidebar";
import MailList from "@/components/maillist";

// importing configs and utils
import { SideBarConfig } from "@/utils/configs";
import { getAccessToken, getJWTToken } from "@/utils/functions";
import ReadMail from "@/components/readmail";

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

interface SelectedPage {
  page: number;
  pageid?: string;
}

function MailPage() {
  const [userData, setUserData] = useState<ZenboxJwtPayload | null>(null);
  const [sideBarConfig, setSideBarConfig] = useState(SideBarConfig);
  const [selectedTab, setSelectedTab] = useState<string>(
    sideBarConfig[0].contents[0].title
  );
  const [selectedPage, setSelectedPage] = useState<SelectedPage>({
    page: 0,
    pageid: "",
  });

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

  const getMailbox = async () => {
    try {
      const jwtToken = getJWTToken();
      const accessToken = await getAccessToken();

      console.log("accessToken:", accessToken);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mail/allmail`,
        {
          accessToken: accessToken,
          selectedPageId: selectedPage.pageid,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const mailboxData = response.data;
      const updatedConfig = [...sideBarConfig]; // Create a shallow copy of the state

      // Update the contents of the 'Flow' section
      updatedConfig[0].contents.forEach((item) => {
        const mailboxType = item.title.toLowerCase();
        if (mailboxData[mailboxType]) {
          item.data = mailboxData[mailboxType];
        }
      });

      // Update the contents of the 'Others' section
      updatedConfig[1].contents.forEach((item) => {
        const mailboxType = item.title.toLowerCase();
        if (mailboxData[mailboxType]) {
          item.data = mailboxData[mailboxType];
        }
      });

      console.log(updatedConfig, "updated config");

      // Set the new state to trigger a re-render
      setSideBarConfig(updatedConfig);
    } catch (error) {
      console.warn(`Following Error Occurred: ${error}`);
    }
  };

  useEffect(() => {
    if (userData) {
      getMailbox();
    }
  }, [userData]);

  return (
    <div className="w-full h-full bg-neutral-900">
      <CommonHeader userData={userData} />
      <div className="h-full w-full flex items-center">
        <Sidebar
          SideBarConfig={sideBarConfig}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <div className="h-screen w-full pt-18 p-2">
          <MailList />
          <ReadMail />
        </div>
      </div>
    </div>
  );
}

export default MailPage;
