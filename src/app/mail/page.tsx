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

interface ActiveMailListState {
  messages: any[]; // Or a more specific type like Message[]
  nextPageToken: string;
  pageNo: number;
  resultSizeEstimate: number;
  title?: string; // The '?' here correctly marks the property as optional
}

function MailPage() {
  const [userData, setUserData] = useState<ZenboxJwtPayload | null>(null);
  const [sideBarConfig, setSideBarConfig] = useState(SideBarConfig);
  const [selectedTab, setSelectedTab] = useState<string>(
    sideBarConfig[0].contents[0].title
  );
  const [globalMailBoxData, setGlobalMailboxData] = useState();
  // const [selectedPage, setSelectedPage] = useState<SelectedPage>({
  //   page: 0,
  //   pageid: "",
  // });
  const [activeMailListData, setactiveMailListData] =
    useState<ActiveMailListState>({
      messages: [],
      nextPageToken: "",
      pageNo: 1,
      resultSizeEstimate: 0,
      title: "",
    });
  const [activeMail, setActiveMail] = useState();

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

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mail/allmail`,
        {
          accessToken: accessToken,
          selectedPageId: "",
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      let mailboxData = response.data;
      for (const key in response.data) {
        if (Object.prototype.hasOwnProperty.call(response.data, key)) {
          response.data[key].pageNo = 1;
        }
      }
      setGlobalMailboxData(response.data);
      const updatedConfig = [...sideBarConfig];

      // Update the contents of the 'Flow' section
      updatedConfig[0].contents.forEach((item) => {
        const mailboxType = item.title.toLowerCase();
        if (mailboxData[mailboxType]) {
          item.data = mailboxData[mailboxType];
          if (item.data) {
            (item.data as any).title = mailboxType;
          }
        }
      });

      // Update the contents of the 'Others' section
      updatedConfig[1].contents.forEach((item) => {
        const mailboxType = item.title.toLowerCase();
        if (mailboxData[mailboxType]) {
          item.data = mailboxData[mailboxType];
          if (item.data) {
            (item.data as any).title = mailboxType;
          }
        }
      });

      setSideBarConfig(updatedConfig);
      setactiveMailListData(mailboxData.inbox);
    } catch (error) {
      console.warn(`Following Error Occurred: ${error}`);
    }
  };

  useEffect(() => {
    if (userData) {
      getMailbox();
    }
  }, [userData]);

  const switchSideBarTab = (tabName: string) => {
    setSelectedTab(tabName);
    const keyName = tabName.toLowerCase();
    if (globalMailBoxData) {
      setactiveMailListData(globalMailBoxData[keyName]);
    }
  };

  const getActiveMailData = async (messageId: string, threadId: string) => {
    try {
      const jwtToken = getJWTToken();
      const accessToken = await getAccessToken();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mail/getMailData`,
        {
          accessToken: accessToken,
          threadId: threadId,
          messageId: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setActiveMail(response.data);

      // const updatedState = activeMailListData
      //   ? {
      //       ...activeMailListData,
      //       messages: activeMailListData.messages.map((message) => {
      //         if (message.messageId === messageId) {
      //           return {
      //             ...message,
      //             isRead: true,
      //           };
      //         }
      //         return message;
      //       }),
      //     }
      //   : null;

      // if (updatedState) {
      //   setactiveMailListData(updatedState);
      // }
    } catch (error) {
      console.warn(`Following Error Occurred: ${error}`);
    }
  };

  return (
    <div className="w-full h-full bg-neutral-900">
      <CommonHeader userData={userData} />
      <div className="h-full w-full flex items-center">
        <Sidebar
          SideBarConfig={sideBarConfig}
          selectedTab={selectedTab}
          setSelectedTab={switchSideBarTab}
        />
        <div className="h-screen w-full flex gap-2 pt-18 p-2">
          <MailList
            mailList={activeMailListData}
            setActiveMail={getActiveMailData}
          />
          {activeMail && <ReadMail activeMail={activeMail} />}
        </div>
      </div>
    </div>
  );
}

export default MailPage;
