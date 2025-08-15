"use client";
import React from "react";

import { getAlphabetAndBackground } from "@/utils/functions";

const MailChatBox = ({
  data,
  setActiveMail,
}: {
  data: any;
  setActiveMail: (messageId: string, threadId: string) => void;
}) => {
  const { alphabet, background } = getAlphabetAndBackground(data.sender.name);
  // console.log(data, "data");
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

function MailList({
  mailList,
  setActiveMail,
}: {
  mailList: any;
  setActiveMail: (messageId: string, threadId: string) => void;
}) {
  return (
    <div className="h-full w-1/2 flex flex-col bg-black rounded-xl">
      {/* header */}
      <div className="w-full h-14 flex items-center">
        <h1 className="text-white text-xl font-semibold px-2 uppercase">
          {mailList?.title}
        </h1>
      </div>
      {/* mail list chat */}
      <div className="w-full h-full flex flex-col overflow-y-auto scrollbar-hide">
        {mailList?.messages.map((items, itemsIndex) => {
          return (
            <MailChatBox
              data={items}
              key={itemsIndex}
              setActiveMail={setActiveMail}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MailList;
