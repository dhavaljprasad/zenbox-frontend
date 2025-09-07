"use client";
import React, { use, useEffect, useState } from "react";
import {
  formatTimestamp,
  getAccessToken,
  getAlphabetAndBackground,
  getJWTToken,
} from "@/utils/functions";
import { IoIosArrowDropleft } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import { LuRefreshCw } from "react-icons/lu";
import axios from "axios";
import NoMessagesFound from "./nomessagefound";
import ReadMail from "./readmail";
import LoadingComponent from "./loading";
import { access } from "fs";

interface MailData {
  isRead: boolean;
  labelIds: string[];
  messageId: string;
  sender: { name: string; email: string };
  subject: string;
  threadId: string;
  time: string;
}

const MailChatBox = ({
  data,
  setActiveMail,
}: {
  data: MailData;
  setActiveMail: (messageId: string, threadId: string) => void;
}) => {
  const { alphabet, background } = getAlphabetAndBackground(data.sender.name);

  return (
    <div
      className={`w-full h-16 flex items-center gap-2 p-2 border-t border-gray-400 cursor-pointer hover:bg-neutral-700 flex-shrink-0 ${
        data.isRead ? "" : "bg-neutral-900"
      }`}
      onClick={() => setActiveMail(data.messageId, data.threadId)}
    >
      <div
        className="w-10 h-10 flex items-center justify-center rounded-4xl"
        style={{ background: background }}
      >
        <h3 className="font-bold text-2xl text-white">{alphabet}</h3>
      </div>
      <div className="w-2/3 h-full flex flex-col justify-center gap-1">
        <h2
          className={`text-md ${
            data.isRead ? "text-gray-500" : "text-white "
          } font-semibold whitespace-nowrap overflow-hidden text-ellipsis m-0`}
        >
          {data.subject}
        </h2>
        <span className="text-sm text-gray-500 m-0">{data.sender.email}</span>
      </div>
      <div className="w-1/3 h-full flex items-center justify-center">
        <span
          className={`${data.isRead ? "text-gray-500" : "text-white"} text-xs`}
        >
          {formatTimestamp(data?.time)}
        </span>
      </div>
    </div>
  );
};

function MailList({ activeTab }: { activeTab: string }) {
  const [superMailList, setSuperMailList] = useState([] as MailData[]);
  const [activeMailList, setActiveMailList] = useState([] as MailData[]);
  const [resultSizeEstimate, setResultSizeEstimate] = useState(0);
  const [nextPageId, setNextPageId] = useState<string>("");
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);

  const [activeMail, setActiveMail] = useState(null);

  const getSuperMailList = async () => {
    try {
      setLoading(true);
      const accessToken = await getAccessToken();
      const jwtToken = getJWTToken();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mail/allmail`,
        {
          accessToken: accessToken,
          selectedTab: activeTab.toLowerCase(),
          selectedPageId: "",
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setSuperMailList(response.data.data.messages);
      setNextPageId(response.data.data.nextPageToken);
      setActiveMailList(response.data.data.messages);
      setResultSizeEstimate(response.data.data.resultSizeEstimate);
      setPageNo(1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mail list:", error);
    }
  };

  const navigateMailList = async (navigateTo: "next" | "prev") => {
    const currentStartIndex = superMailList.findIndex(
      (mail) => mail.messageId === activeMailList[0]?.messageId
    );

    if (navigateTo === "prev") {
      // If already have prev 20 in superMailList
      if (currentStartIndex >= 20) {
        const newStart = currentStartIndex - 20;
        const newEnd = currentStartIndex;
        setActiveMailList(superMailList.slice(newStart, newEnd));
        setPageNo((prev) => (prev > 1 ? prev - 1 : 1));
      }
    } else if (navigateTo === "next") {
      const nextStart = currentStartIndex + 20;
      const nextEnd = nextStart + 20;

      // If already have next 20 in superMailList
      if (superMailList.length >= nextEnd) {
        setActiveMailList(superMailList.slice(nextStart, nextEnd));
        setPageNo((prev) => prev + 1);
      }

      //  Else fetch new from API
      else if (nextPageId) {
        try {
          setLoading(true);
          const accessToken = await getAccessToken();
          const jwtToken = getJWTToken();
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/mail/allmail`,
            {
              accessToken: accessToken,
              selectedTab: activeTab.toLowerCase(),
              selectedPageId: nextPageId,
            },
            {
              headers: { Authorization: `Bearer ${jwtToken}` },
            }
          );

          const newMessages = response.data.data.messages || [];
          const nextToken = response.data.data.nextPageToken || "";

          setSuperMailList((prev) => [...prev, ...newMessages]);
          setActiveMailList(newMessages);
          setNextPageId(nextToken);
          setPageNo((prev) => prev + 1);
        } catch (error) {
          console.error("Error navigating next:", error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const getActiveMail = async (messageId: string, threadId: string) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mail/getmaildata`,
        {
          messageId: messageId,
          threadId: threadId,
          accessToken: accessToken,
        },
        {
          headers: {
            Authorization: `Bearer ${getJWTToken()}`,
          },
        }
      );
      setActiveMail(response.data);
    } catch (error) {
      console.error("Error fetching active mail:", error);
    }
  };

  useEffect(() => {
    getSuperMailList();
  }, [activeTab]);

  return (
    <div className="h-full w-full flex flex-col relative">
      {/* header */}
      <div className="w-full h-20 flex items-center justify-between px-4 bg-neutral-950">
        <h1 className="text-white text-xl font-bold uppercase cursor-pointer">
          {activeTab}
        </h1>
        <div
          className="cursor-pointer hover:bg-neutral-700 p-2 rounded"
          onClick={() => {}}
        >
          <LuRefreshCw color="#fff" size={20} strokeWidth={2} />
        </div>
      </div>

      {/* mail list chat */}
      <div className="w-full h-full flex flex-col overflow-y-auto scrollbar-hide">
        {loading ? (
          <LoadingComponent />
        ) : activeMailList?.length > 0 ? (
          activeMailList.map((item: MailData, index: number) => (
            <MailChatBox
              data={item}
              key={index}
              setActiveMail={getActiveMail}
            />
          ))
        ) : (
          <NoMessagesFound />
        )}
      </div>

      {/* pagination */}
      <div className="w-full h-20 flex items-center justify-between px-2 relative">
        <span className="text-white text-base font-semibold">{`Estimated No. of Emails: ${resultSizeEstimate}+`}</span>
        <div className="flex items-center justify-center gap-2">
          <span className="text-white text-base font-semibold">{`Page No: ${pageNo}`}</span>
          <div
            className="cursor-pointer"
            onClick={() => navigateMailList("prev")}
          >
            <IoIosArrowDropleft color="#fff" size={30} />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => navigateMailList("next")}
          >
            <IoIosArrowDropright color="#fff" size={30} />
          </div>
        </div>
      </div>

      {/* active mail view */}
      {activeMail && (
        <div className="absolute inset-0 flex-col overflow-hidden z-10">
          <ReadMail
            activeMail={activeMail}
            closeMail={() => setActiveMail(null)}
          />
        </div>
      )}
    </div>
  );
}

export default MailList;
