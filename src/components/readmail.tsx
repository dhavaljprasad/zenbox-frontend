"use client";
import { getJWTToken } from "@/utils/functions";
import axios from "axios";
import React, { useEffect, useState } from "react";

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
interface SummaryState {
  summary: string;
  color: string;
  state: string;
  category: string;
}

function ReadMail({ activeMail }: { activeMail: ThreadMessage }) {
  const [aiGeneratedSummary, setAIGeneratedSummary] = useState<SummaryState>({
    summary: "Generating summary of the thread",
    color: "gray",
    state: "generating",
    category: "Uncategorized",
  });

  const getIframeHtml = (htmlContent: string) => {
    return `
    <html>
      <head>
        <style>
          * {
            color: white !important;            /* base color */
            mix-blend-mode: difference !important;
            max-width: 100% !important;   /* 🔑 keep everything inside parent width */
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            background-color: #171717;
            height: auto !important;
            max-width: 100% !important;   /* 🔑 never exceed container */
            overflow-x: hidden !important;/* 🔑 disable horizontal scroll */
          }
          img, table {
            max-width: 100% !important;
            height: auto !important;
          }
          div, p, span, a {
            max-width: 100% !important;
            box-sizing: border-box !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
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

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mail/getAttachment`,
        {
          messageId: messageId,
          attachmentId: attachmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.warn(`Following error occurred: ${error}`);
    }
  };

  const getAIGeneratedSummary = async (dataArray: string[]) => {
    try {
      const jwtToken = getJWTToken();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/threadSummary`,
        { dataArray: dataArray },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      // The API response is expected to be a JSON string from the backend.
      // Parse it to a JavaScript object.
      const jsonString = response.data.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn(`Following error occurred: ${error}`);
      return null;
    }
  };

  useEffect(() => {
    const fetchSummary = async () => {
      if (activeMail && activeMail.threads) {
        const messagesData = activeMail.threads.map(
          (message) => message.message.data
        );

        // Reset state to 'generating'
        setAIGeneratedSummary({
          summary: "Generating summary of the thread",
          color: "gray",
          state: "generating",
          category: "Uncategorized",
        });

        // Assume the API returns a 'color' property
        const summaryResponse = await getAIGeneratedSummary(messagesData);

        if (
          summaryResponse &&
          summaryResponse.summary &&
          summaryResponse.color
        ) {
          setAIGeneratedSummary({
            summary: summaryResponse.summary,
            category: summaryResponse.category,
            color: summaryResponse.color, // Directly using the color from the API
            state: "generated",
          });
        } else {
          // Fallback if the API response is not as expected
          setAIGeneratedSummary({
            summary: "Failed to generate summary.",
            category: "Error",
            color: "red",
            state: "error",
          });
        }
      }
    };
    fetchSummary();
  }, [activeMail]);

  return (
    <div className="h-full w-1/2 bg-black rounded-xl p-4 flex flex-col">
      {/* Header */}
      <div className="max-w-full overflow-hidden flex-shrink-0 mb-4">
        <h1 className="text-white text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis uppercase">
          {activeMail?.subject}
        </h1>
      </div>

      <div
        className="w-full h-auto rounded-lg p-4 mb-4"
        style={{
          borderColor: aiGeneratedSummary.color,
          borderWidth: "1px",
          borderStyle: "solid",
          backgroundColor: `${aiGeneratedSummary.color}20`, // This won't work with Tailwind's color system
        }}
      >
        <span style={{ color: aiGeneratedSummary.color }}>
          {aiGeneratedSummary.summary}
        </span>
      </div>

      {/* The main component */}
      <div className="w-full h-full flex flex-col gap-4 scrollbar-hide overflow-y-scroll">
        {activeMail?.threads?.map((message, index) => (
          <div
            key={message.id || index}
            className="w-full h-auto flex flex-col gap-4 bg-neutral-900 rounded-lg p-4 shadow-lg"
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
            <div className="w-full">
              {message.message.type === "html" ? (
                <iframe
                  ref={(el) => {
                    if (el) {
                      el.onload = () => {
                        try {
                          const doc =
                            el.contentDocument || el.contentWindow?.document;
                          if (doc) {
                            el.style.height = doc.body.scrollHeight + "px";
                            el.style.width = "100%"; // force it to respect parent width
                            el.style.overflow = "hidden";
                          }
                        } catch (e) {
                          console.warn("Iframe resize failed:", e);
                        }
                      };
                    }
                  }}
                  title={`email-body-${message.id}`}
                  className="w-full border-none bg-transparent"
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
