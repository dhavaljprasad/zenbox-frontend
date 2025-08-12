"use client";

import React from "react";
import { SidebarButton } from "./appbuttons";

// Define the structure of an item within a section's contents
interface SidebarContentItem {
  title: string;
  icon: string;
  data: any; // 'data' is the property you added earlier for API response
}

// Define the structure of a section in the sidebar
interface SidebarSection {
  heading: string;
  contents: SidebarContentItem[];
}

function Sidebar({
  SideBarConfig,
  selectedTab,
  setSelectedTab,
}: {
  SideBarConfig: SidebarSection[]; // Use the defined type here
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) {
  return (
    <div className="w-80 h-screen bg-black flex flex-col pt-16 p-4">
      {SideBarConfig?.map((section, index) => {
        return (
          <div key={index} className="w-full flex flex-col gap-2 mb-4">
            <h2 className="text-white font-bold">{section.heading}</h2>
            {section.contents.map((item, itemIndex) => {
              return (
                <SidebarButton
                  key={itemIndex}
                  primaryText={`${item.icon} ${item.title}`}
                  onClick={() => setSelectedTab(item.title)}
                  selected={item.title === selectedTab}
                  secondaryText={item.data?.resultSizeEstimate}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
