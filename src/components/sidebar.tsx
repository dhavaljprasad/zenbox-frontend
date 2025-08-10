"use client";

import React from "react";
import { SidebarButton } from "./appbuttons";

function Sidebar({
  SideBarConfig,
  selectedTab,
  setSelectedTab,
}: {
  SideBarConfig: any;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) {
  return (
    <div className="w-80 h-screen bg-black flex flex-col pt-16 p-4">
      {SideBarConfig?.map((section, index) => (
        <div key={index} className="w-full flex flex-col gap-2 mb-4">
          <h2 className="text-white font-bold">{section.heading}</h2>
          {section.contents.map((item, itemIndex) => (
            <SidebarButton
              key={itemIndex}
              primaryText={`${item.icon} ${item.title}`}
              onClick={() => setSelectedTab(item.title)}
              selected={item.title === selectedTab}
              secondaryText={item.title}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
