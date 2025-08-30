"use client";
import React, { useEffect, useState } from "react";
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
interface MailData {
  sender: {
    name: string;
    email: string;
  };
  subject: string;
  isRead: boolean;
  messageId: string;
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
interface MailListData {
  title?: string;
  messages: MailData[];
  nextPageToken: string;
  pageNo: number;
  resultSizeEstimate: number;
}

function MailList({
  mailList,
  refreshEmails,
}: {
  mailList: MailListData;
  refreshEmails: () => void;
}) {
  const [currentMailList, setMailList] = useState(mailList);
  const [currentArrayOfMessages, setCurrentArrayOfMessages] = useState(
    mailList?.messages || []
  );
  const [activeMail, setActiveMailData] = useState(null);

  useEffect(() => {
    if (mailList && mailList.messages && mailList.messages.length > 0) {
      setMailList(mailList);
      setCurrentArrayOfMessages(mailList.messages);
    } else if (
      mailList &&
      mailList.messages &&
      mailList.messages.length === 0
    ) {
      setCurrentArrayOfMessages([]);
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

  const getActiveMailData = async (messageId: string, threadId: string) => {
    try {
      // ✅ 1. Immediately update local + global state to mark as read
      const updatedCurrentMessages = currentArrayOfMessages.map((message) =>
        message.messageId === messageId ? { ...message, isRead: true } : message
      );
      setCurrentArrayOfMessages(updatedCurrentMessages);

      setMailList((prevMailList) => {
        const fullUpdatedMessages = prevMailList.messages.map((message) =>
          message.messageId === messageId
            ? { ...message, isRead: true }
            : message
        );
        return { ...prevMailList, messages: fullUpdatedMessages };
      });

      // ✅ 2. Call backend to fetch full mail data
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
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );

      // ✅ 3. Set the fetched mail as active
      setActiveMailData(response.data);
    } catch (error) {
      console.warn(`Following Error Occurred: ${error}`);
    }
  };

  const closeMail = () => {
    setActiveMailData(null);
  };

  console.log(currentMailList, "current Mail List Data");

  return (
    <div className="h-full w-full flex flex-col">
      {/* header */}
      <div className="w-full h-20 flex items-center justify-between px-4 bg-neutral-950">
        <h1 className="text-white text-xl font-bold uppercase cursor-pointer">
          {currentMailList?.title}
        </h1>
        <div
          className="cursor-pointer hover:bg-neutral-700 p-2 rounded"
          onClick={() => refreshEmails()}
        >
          <LuRefreshCw color="#fff" size={20} strokeWidth={2} />
        </div>
      </div>
      {/* mail list chat */}
      <div className="w-full h-full flex flex-col overflow-y-auto scrollbar-hide">
        {currentArrayOfMessages.length > 0 ? (
          currentArrayOfMessages.map((item: MailData, index: number) => (
            <MailChatBox
              data={item}
              key={index}
              setActiveMail={getActiveMailData}
            />
          ))
        ) : (
          <NoMessagesFound />
        )}
      </div>

      {/* pagination */}
      <div className="w-full h-20 flex items-center justify-between px-2">
        <span className="text-white text-base font-semibold">{`Estimated No. of Emails: ${currentMailList.resultSizeEstimate}+`}</span>
        <div className="flex items-center justify-center gap-2">
          <span className="text-white text-base font-semibold">{`Page No: ${currentMailList.pageNo}`}</span>
          <div
            className="cursor-pointer"
            onClick={() => navigateListPage("prev")}
            aria-disabled={currentMailList.pageNo <= 1}
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
      {activeMail && <ReadMail activeMail={activeMail} closeMail={closeMail} />}
    </div>
  );
}

export default MailList;
