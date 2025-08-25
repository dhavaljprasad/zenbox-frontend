export let SideBarConfig = [
  {
    heading: "Flow",
    contents: [
      {
        title: "Inbox",
        icon: "📥",
        data: null, // Initial data is null
      },
      {
        title: "Sent",
        icon: "➡️",
        data: null, // Initial data is null
      },
      {
        title: "Drafts",
        icon: "✏️",
        data: null, // Initial data is null
      },
    ],
  },
  {
    heading: "Others",
    contents: [
      {
        title: "Archive",
        icon: "📦",
        data: null, // Initial data is null
      },
      {
        title: "Spam",
        icon: "🤬",
        data: null, // Initial data is null
      },
    ],
  },
];

export const GetIframeHTML = (htmlContent: string) => {
  return `
    <html>
      <head>
        <style>
          * {
            color: #ffffff !important;
            mix-blend-mode: difference !important;  
            max-width: 100% !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            background-color: #000000;
            height: auto !important;
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
