"use client";
import React, { useEffect, useState } from "react";
import {
  getAccessToken,
  getAlphabetAndBackground,
  getJWTToken,
} from "@/utils/functions";
import { IoIosArrowDropleft } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import axios from "axios";

interface MailData {
  sender: {
    name: string;
    email: string;
  };
  subject: string;
  isRead: boolean;
  messageId: string;
  threadId: string;
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
      className={`w-full h-16 flex items-center gap-2 p-2 border-t border-gray-400 cursor-pointer hover:bg-neutral-700 flex-shrink-0`}
      onClick={() => setActiveMail(data.messageId, data.threadId)}
    >
      <div
        className="w-10 h-10 flex items-center justify-center rounded-4xl"
        style={{ background: background }}
      >
        <h3 className="font-bold text-2xl text-white">{alphabet}</h3>
      </div>
      <div className="w-100 h-full flex flex-col justify-center gap-1">
        <h2
          className={`text-md ${
            data.isRead ? "text-gray-500" : "text-white "
          } font-semibold whitespace-nowrap overflow-hidden text-ellipsis m-0`}
        >
          {data.subject}
        </h2>
        <span className="text-sm text-gray-500 m-0">{data.sender.email}</span>
      </div>
    </div>
  );
};

interface MailListData {
  title?: string;
  messages: MailData[];
  nextPageToken: string;
  pageNo: number;
  resultSizeEstimate: number;
}

function MailList({
  mailList,
  setActiveMail,
}: {
  mailList: MailListData;
  setActiveMail: (messageId: string, threadId: string) => void;
}) {
  const [currentMailList, setMailList] = useState(mailList);
  const [currentArrayOfMessages, setCurrentArrayOfMessages] = useState(
    mailList?.messages || []
  );
  useEffect(() => {
    if (mailList && mailList.messages && mailList.messages.length > 0) {
      setMailList(mailList);
      setCurrentArrayOfMessages(mailList.messages);
    }
  }, [mailList]);

  const navigateListPage = async (state: string) => {
    if (state === "next") {
      const currentStartIndex = currentMailList.messages.findIndex(
        (message) => message.messageId === currentArrayOfMessages[0]?.messageId
      );

      const nextStartIndex = currentStartIndex + currentArrayOfMessages.length;

      if (currentMailList.messages[nextStartIndex]) {
        const nextMessages = currentMailList.messages.slice(
          nextStartIndex,
          nextStartIndex + 20
        );
        setCurrentArrayOfMessages(nextMessages);
        setMailList((prevMailList) => ({
          ...prevMailList,
          pageNo: prevMailList.pageNo + 1,
        }));
      } else {
        try {
          const jwtToken = getJWTToken();
          const accessToken = await getAccessToken();
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/mail/nextMailSet`,
            {
              accessToken: accessToken,
              nextPageToken: currentMailList.nextPageToken,
              type: mailList.title,
            },
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );

          const newMailData = response.data;

          // Update the full mail list state with the new messages
          setMailList((prevMailList) => ({
            ...prevMailList,
            messages: [...prevMailList.messages, ...newMailData.messages],
            nextPageToken: newMailData.nextPageToken,
            resultSizeEstimate: newMailData.resultSizeEstimate,
            pageNo: prevMailList.pageNo + 1,
          }));

          // Use the newly fetched messages to update the displayed list
          setCurrentArrayOfMessages(newMailData.messages);
        } catch (error) {
          console.warn(`API Error failed: ${error}`);
        }
      }
    } else {
      if (currentMailList.pageNo <= 1) {
        return;
      }

      const currentStartIndex = currentMailList.messages.findIndex(
        (message) => message.messageId === currentArrayOfMessages[0]?.messageId
      );

      const previousStartIndex = currentStartIndex - 20;

      const previousMessages = currentMailList.messages.slice(
        Math.max(0, previousStartIndex),
        currentStartIndex
      );

      setCurrentArrayOfMessages(previousMessages);
      setMailList((prevMailList) => ({
        ...prevMailList,
        pageNo: prevMailList.pageNo - 1,
      }));
    }
  };

  const handleSetActiveMail = (messageId: string, threadId: string) => {
    // 1. Call the parent's function to update the global mail list
    setActiveMail(messageId, threadId);

    // 2. Update the local view (current page) to show the change immediately
    const updatedCurrentMessages = currentArrayOfMessages.map((message) => {
      if (message.messageId === messageId) {
        return { ...message, isRead: true };
      }
      return message;
    });

    setCurrentArrayOfMessages(updatedCurrentMessages);

    // 3. Update the full, cached mail list so the change persists on navigation
    setMailList((prevMailList) => {
      const fullUpdatedMessages = prevMailList.messages.map((message) => {
        if (message.messageId === messageId) {
          return { ...message, isRead: true };
        }
        return message;
      });

      return {
        ...prevMailList,
        messages: fullUpdatedMessages,
      };
    });
  };

  return (
    <div className="h-full w-1/2 flex flex-col bg-black rounded-xl">
      {/* header */}
      <div className="w-full h-14 flex items-center">
        <h1 className="text-white text-xl font-bold px-2 uppercase cursor-pointer">
          {currentMailList?.title}
        </h1>
      </div>
      {/* mail list chat */}
      <div className="w-full h-full flex flex-col overflow-y-auto scrollbar-hide">
        {currentArrayOfMessages.map((item: MailData, index: number) => {
          return (
            <MailChatBox
              data={item}
              key={index}
              setActiveMail={handleSetActiveMail}
            />
          );
        })}
      </div>

      {/* pagination */}
      <div className="w-full h-14 flex items-center justify-between px-2">
        <span className="text-white text-sm font-semibold">{`Total Result: ${currentMailList.resultSizeEstimate}`}</span>
        <div className="flex items-center justify-center gap-2">
          <span className="text-white text-sm font-semibold">{`Page No: ${currentMailList.pageNo}`}</span>
          <div
            className="cursor-pointer"
            onClick={() => navigateListPage("prev")}
          >
            <IoIosArrowDropleft color="#fff" size={30} />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => navigateListPage("next")}
          >
            <IoIosArrowDropright color="#fff" size={30} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MailList;
