"use client";

import React from "react";

// You should define an interface for the activeMail data for better type safety
interface MessagePart {
  type: string;
  data: string;
}

interface ThreadMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  receiverName: string;
  isSent: boolean;
  message: MessagePart[];
  attachments: any[]; // You can define a specific type here as well
  time: string;
  labels: string[];
  isStarred: boolean;
}

function ReadMail({ activeMail }: { activeMail: ThreadMessage[] | null }) {
  console.log(activeMail, "activeMail");
  return (
    <div className="h-full w-1/2 bg-black rounded-xl p-4 flex flex-col">
      <div className="w-full flex-shrink-0 mb-4">
        {/* You can display the subject or first message's subject here */}
        <h1 className="text-white text-xl font-semibold uppercase">
          Thread Conversation
        </h1>
      </div>

      {/* The main scrollable area for all messages in the thread */}
      <div className="w-full h-full overflow-y-auto scrollbar-hide space-y-4">
        {activeMail?.map((message, index) => (
          <div
            key={message.id || index}
            className="bg-neutral-900 rounded-lg p-4 shadow-lg"
          >
            {/* Message Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">
                  {message.senderName}
                </span>
                <span className="text-sm text-gray-400">
                  ({message.senderEmail})
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(Number(message.time)).toLocaleString()}
              </span>
            </div>

            {/* Message Body */}
            <div>
              {message.message.map((part, partIndex) => {
                switch (part.type) {
                  case "text/html":
                    return (
                      <div
                        key={partIndex}
                        dangerouslySetInnerHTML={{ __html: part.data }}
                        className="text-gray-300 text-sm"
                      ></div>
                    );
                  case "text/plain":
                    return (
                      <p key={partIndex} className="text-gray-300 text-sm">
                        {part.data}
                      </p>
                    );
                  // You can add more cases for images, PDFs, etc.
                  default:
                    return (
                      <p
                        key={partIndex}
                        className="text-gray-500 text-sm italic"
                      >
                        [Attachment: {part.type}]
                      </p>
                    );
                }
              })}
            </div>

            {/* Attachments list (if any) */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-4 border-t border-neutral-700 pt-2">
                <h4 className="text-gray-400 text-xs font-semibold mb-1">
                  Attachments:
                </h4>
                <ul className="list-disc list-inside text-gray-500 text-sm">
                  {message.attachments.map((attachment, attIndex) => (
                    <li key={attIndex}>{attachment.filename}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReadMail;
