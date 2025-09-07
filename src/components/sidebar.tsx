"use client";
import React, { useEffect, useState } from "react";
import { SidebarButton } from "./appbuttons";
import { getJWTToken } from "@/utils/functions";
import { jwtDecode } from "jwt-decode";
import AppIcon from "../app/icon.svg";
import Image from "next/image";
import { CgCompress } from "react-icons/cg";
import { FaPenAlt } from "react-icons/fa";

interface SidebarContentItem {
  title: string;
  icon: React.JSX.Element;
}
interface ZenboxJwtPayload {
  id: string;
  name: string;
  email: string;
  provider: string;
  profileImage: string;
  subscriptionTier: string;
  exp?: number;
  iat?: number;
}

function Sidebar({
  SideBarConfig,
  selectedTab,
  setSelectedTab,
}: {
  SideBarConfig: SidebarContentItem[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) {
  const [userData, setUserData] = useState<ZenboxJwtPayload | null>(null);

  useEffect(() => {
    const jwtToken = getJWTToken();

    if (jwtToken) {
      try {
        const decodedToken = jwtDecode<ZenboxJwtPayload>(jwtToken as string);
        setUserData(decodedToken);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, []);

  return (
    <div className="w-100 h-screen bg-neutral-950 flex flex-col items-center justify-between">
      <div className="w-full flex flex-col items-center justify-between gap-4 p-4">
        <div className="w-full h-auto flex flex-row items-center justify-between">
          <div className="h-10 w-10 cursor-pointer">
            <Image src={AppIcon} alt="App Icon" />
          </div>
          <div className="cursor-pointer hover:bg-neutral-700 p-1 rounded">
            <CgCompress size={24} color="white" />
          </div>
        </div>
        <hr className="border-neutral-500 border-1 w-full" />
        <div className="flex flex-col gap-2 w-full">
          {SideBarConfig.map((item, itemIndex) => {
            return (
              <SidebarButton
                key={itemIndex}
                Icon={item.icon}
                title={item.title}
                onClick={() => setSelectedTab(item.title)}
                selected={item.title === selectedTab}
              />
            );
          })}
        </div>
        <hr className="border-neutral-500 border-1 w-full" />
        <div className="flex flex-col gap-2 w-full">
          <SidebarButton
            Icon={<FaPenAlt size={20} color="white" />}
            title={"Compose"}
            onClick={() => {}}
            selected={false}
          />
        </div>
      </div>

      <div className="w-full flex items-center gap-2 cursor-pointer p-4">
        <div className="rounded overflow-hidden">
          <Image
            width={50}
            height={50}
            src={
              userData?.profileImage ||
              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            }
            alt="User Profile"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-base text-white">{userData?.name}</span>
          <span className="text-sm text-neutral-400">{userData?.email}</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
