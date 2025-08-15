"use client";
import { getAccessToken, getJWTToken } from "@/utils/functions";
import axios from "axios";
import React, { useEffect, useState } from "react";

// Updated interface to reflect the new backend response
interface MessageBody {
  type: string;
  data: string;
}

interface ThreadMessage {
  subject: string;
  threads: {
    id: string;
    senderName: string;
    senderEmail: string;
    receiverName: string;
    isSent: boolean;
    message: MessageBody;
    attachments: any[];
    time: string;
    labels: string[];
    isStarred: boolean;
  }[];
}

function ReadMail({ activeMail }: { activeMail: ThreadMessage }) {
  console.log(activeMail, "active");

  const getIframeHtml = (htmlContent: string) => {
    return `
      <html>
        <head>
          <style>
            * {
              color: #e5e5e5 !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              background-color: #171717;
            }
            img, table {
              max-width: 100% !important;
              height: auto !important;
            }
            div, p, span, a {
              max-width: 100% !important;
              box-sizing: border-box !important;
              /* These properties ensure links and other long text wrap */
              word-break: break-word !important;
              overflow-wrap: break-word !important;
            }
            a {
              color: #4A90E2 !important;
            }
          </style>
        </head>
        <body>
          ${htmlContent || "No content to display."}
        </body>
      </html>
    `;
  };

  const handleAttachmentClick = async (
    messageId: string,
    attachmentId: string,
    fileName: string
  ) => {
    try {
      const jwtToken = getJWTToken();
      const accessToken = await getAccessToken();

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mail/getAttachment`,
        {
          accessToken: accessToken,
          messageId: messageId,
          attachmentId: attachmentId,
          fileName: fileName,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          responseType: "blob", // Fetches the data as a binary blob
        }
      );

      // Create a temporary URL from the blob data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor tag to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // Set the filename for the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.warn(`Following error occurred: ${error}`);
    }
  };

  return (
    <div className="h-full w-1/2 bg-black rounded-xl p-4 flex flex-col overflow-x-hidden">
      {/* Header */}
      <div className="w-full flex-shrink-0 mb-4">
        <h1 className="text-white text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis uppercase">
          {activeMail?.subject}
        </h1>
      </div>

      {/* The main component */}
      <div className="w-full h-auto flex flex-col gap-4 scrollbar-hide">
        {activeMail?.threads?.map((message, index) => (
          <div
            key={message.id || index}
            className="w-full h-auto flex flex-col gap-4 bg-neutral-900 rounded-lg p-4 shadow-lg overflow-x-hidden"
          >
            {/* Message Header */}
            <div className="w-full h-auto flex items-center justify-between">
              <div className="flex flex-col justify-center">
                <span className="font-bold text-white">
                  {message.senderName}
                </span>
                <span className="text-sm text-gray-400">
                  ({message.senderEmail})
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(Number(message.time)).toLocaleString("en-US", {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
            </div>
            {/* Message Body inside an iframe */}
            <div className="w-full h-auto">
              {message.message.type === "html" ? (
                <iframe
                  title={`email-body-${message.id}`}
                  className="w-full h-[600px] border-none bg-transparent"
                  sandbox="allow-same-origin"
                  srcDoc={getIframeHtml(message.message.data)}
                />
              ) : (
                <p
                  className="text-gray-300 text-sm"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {message.message.data}
                </p>
              )}
            </div>
            {/* Attachments list (if any) */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-4 border-t border-neutral-700 pt-2">
                <h4 className="text-gray-400 text-xs font-semibold mb-1">
                  Attachments:
                </h4>
                <ul className="list-disc list-inside text-gray-500 text-sm">
                  {message.attachments.map((attachment, attIndex) => (
                    <li key={attIndex}>
                      <button
                        onClick={() =>
                          handleAttachmentClick(
                            message.id,
                            attachment.attachmentId,
                            attachment.filename
                          )
                        }
                        className="text-blue-400 hover:underline cursor-pointer"
                      >
                        {attachment.filename}
                      </button>
                    </li>
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
