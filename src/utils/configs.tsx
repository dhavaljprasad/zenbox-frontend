import { FiInbox } from "react-icons/fi";
import { BsFillSendFill } from "react-icons/bs";
import { MdDrafts } from "react-icons/md";
import { BiStar } from "react-icons/bi";

export let SideBarConfig = [
  {
    title: "Inbox",
    icon: <FiInbox size={24} color="white" />,
    data: null,
  },
  {
    title: "Sent",
    icon: <BsFillSendFill size={24} color="white" />,
    data: null,
  },
  {
    title: "Drafts",
    icon: <MdDrafts size={24} color="white" />,
    data: null,
  },
  {
    title: "Starred",
    icon: <BiStar size={24} color="white" />,
    data: null,
  },
];

export const GetIframeHTML = (htmlContent: string) => {
  return `
    <html>
      <head>
        <style>
          /* Reset defaults for all elements */
          * {
            color: #ffffff !important;
            mix-blend-mode: difference !important;  
            max-width: 100% !important;
          }

          /* For WebKit browsers */
          ::-webkit-scrollbar {
            width: 8px; /* Width of the vertical scrollbar */
            height: 8px; /* Height of the horizontal scrollbar */
          }

          ::-webkit-scrollbar-track {
            background: #2d2d2d; /* Dark background for the track */
            border-radius: 10px; /* Rounded corners for a softer look */
          }

          ::-webkit-scrollbar-thumb {
            background-color: #555; /* Medium dark grey for the scrollbar handle */
            border-radius: 10px; /* Rounded corners for the handle */
            border: 2px solid #2d2d2d; /* A bit of padding around the handle */
          }

          ::-webkit-scrollbar-thumb:hover {
            background-color: #777; /* Lighter grey on hover */
          }

          /* For Firefox */
          * {
            scrollbar-width: thin; /* "auto" or "thin" */
            scrollbar-color: #555 #2d2d2d; /* thumb color and track color */
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            background-color: #000000;
            max-width: 100% !important;
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
