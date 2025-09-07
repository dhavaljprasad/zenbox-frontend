"use client";
import React, { useState } from "react";

// importing components
import Sidebar from "@/components/sidebar";
import MailList from "@/components/maillist";

// importing configs and utils
import { SideBarConfig } from "@/utils/configs";

function MailPage() {
  const [selectedTab, setSelectedTab] = useState<string>(
    SideBarConfig[0].title
  );

  const switchSideBarTab = (tabName: string) => {
    setSelectedTab(tabName);
  };

  return (
    <div className="w-full h-full bg-black">
      <div className="h-full w-full flex items-center">
        <Sidebar
          SideBarConfig={SideBarConfig}
          selectedTab={selectedTab}
          setSelectedTab={switchSideBarTab}
        />
        <div className="h-screen w-full flex">
          <MailList activeTab={selectedTab} />
        </div>
      </div>
    </div>
  );
}

export default MailPage;
