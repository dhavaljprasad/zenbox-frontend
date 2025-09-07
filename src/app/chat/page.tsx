"use client";
import { getAccessToken, getJWTToken } from "@/utils/functions";
import axios from "axios";
import { headers } from "next/headers";
import React, { useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

interface Message {
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

const SearchBar = ({
  chatInput,
  setChatInput,
  sendInput,
  started = false,
  disabled = false,
}: {
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  sendInput: (input: string) => void;
  started?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div
      className={`${started ? "w-300" : "w-200"} h-16 ${
        started ? "absolute bottom-4" : ""
      } bg-neutral-800 rounded-full flex items-center p-3`}
    >
      <input
        type="text"
        placeholder="Ask anything about your emails..."
        className="w-full h-auto bg-transparent px-4 border-none outline-none text-white text-wrap text-xl placeholder-gray-400"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        disabled={disabled}
      />
      {chatInput.trim().length > 0 && (
        <div
          className="h-10 w-10 flex items-center justify-center cursor-pointer p-2 bg-white rounded-full hover:bg-gray-200 transition duration-200"
          onClick={() => sendInput(chatInput)}
        >
          <FaArrowUp size={16} color="black" />
        </div>
      )}
    </div>
  );
};

function ChatWithAIPage() {
  const [chatInput, setChatInput] = useState("");
  const [messagesArray, setMessagesArray] = useState<Message[]>([]);
  const [chatSummary, setChatSummary] = useState<string>("");

  const handleSendMessage = async (input: string) => {
    try {
      const jwtToken = await getJWTToken();
      const accessToken = await getAccessToken();
      setMessagesArray((prev) => [
        ...prev,
        { sender: "user", content: input, timestamp: new Date() },
      ]);
      setChatInput("");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/chat`,
        {
          message: input,
          accessToken: accessToken,
          chatSummary: chatSummary,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log(response.data);
      setMessagesArray((prev) => [
        ...prev,
        {
          sender: "ai",
          content: JSON.stringify(response.data),
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-2 bg-neutral-950">
      {messagesArray.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-white text-2xl font-semibold">
            Ready when you are!
          </h1>
          <SearchBar
            chatInput={chatInput}
            setChatInput={setChatInput}
            sendInput={handleSendMessage}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 gap-4">
          <div className="w-full h-full overflow-y-auto scrollbar-hide flex flex-col px-100  gap-4">
            {messagesArray.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.sender === "user" ? "self-end" : "self-start"
                } max-w-2/3 p-2 rounded-lg text-base ${
                  message.sender === "user"
                    ? "bg-white text-black"
                    : "text-white"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <SearchBar
            chatInput={chatInput}
            setChatInput={setChatInput}
            sendInput={handleSendMessage}
          />
        </div>
      )}
    </div>
  );
}

export default ChatWithAIPage;
