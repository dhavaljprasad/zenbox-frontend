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

interface ActiveMailListState {
  messages: any[]; // Or a more specific type like Message[]
  nextPageToken: string;
  pageNo: number;
  resultSizeEstimate: number;
  title?: string; // The '?' here correctly marks the property as optional
}

function MailPage() {
  const [sideBarConfig, setSideBarConfig] = useState(SideBarConfig);
  const [selectedTab, setSelectedTab] = useState<string>(
    sideBarConfig[0].title
  );
  const [globalMailBoxData, setGlobalMailboxData] = useState();
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
    getMailbox();
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

      for (let i = 0; i < updatedConfig.length; i++) {
        updatedConfig[i].data =
          mailboxData[updatedConfig[i].title.toLowerCase()];
        mailboxData[updatedConfig[i].title.toLowerCase()].title =
          updatedConfig[i].title;
      }

      setSideBarConfig(updatedConfig);
      setactiveMailListData(mailboxData.inbox);
    } catch (error) {
      console.warn(`Following Error Occurred: ${error}`);
    }
  };

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
    } catch (error) {
      console.warn(`Following Error Occurred: ${error}`);
    }
  };

  return (
    <div className="w-full h-full bg-black">
      <div className="h-full w-full flex items-center">
        <Sidebar
          SideBarConfig={sideBarConfig}
          selectedTab={selectedTab}
          setSelectedTab={switchSideBarTab}
        />
        <div className="h-screen w-full flex">
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
