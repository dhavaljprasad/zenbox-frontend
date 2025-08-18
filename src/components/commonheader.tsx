"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname

import { BsPencilSquare } from "react-icons/bs";
import { MdOutlineMailOutline } from "react-icons/md"; // Icon for 'Read Emails'

function CommonHeader({ userData }: { userData: any }) {
  const router = useRouter();
  const pathname = usePathname(); // Get the current URL path

  const isMailPage = pathname === "/mail";
  const isWritePage = pathname === "/write";

  return (
    <div className="absolute w-full h-16 bg-black flex items-center justify-between px-30">
      <h1 className="text-white text-2xl font-bold">Zenbox</h1>
      <div className="flex items-center gap-2">
        {/* Conditional rendering for the button */}
        {isMailPage && (
          <div
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors"
            onClick={() => router.push("/write")}
          >
            <BsPencilSquare color="#fff" size={18} />
            <span className="text-white text-md font-semibold">
              Write Email
            </span>
          </div>
        )}

        {isWritePage && (
          <div
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors"
            onClick={() => router.push("/mail")}
          >
            <MdOutlineMailOutline color="#fff" size={18} />
            <span className="text-white text-md font-semibold">
              Read Emails
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors">
          <span className="text-white text-md font-semibold">
            {userData?.name}
          </span>
          <img
            className="w-7 h-7 rounded-full"
            src={userData?.profileImage}
            alt="User Avatar"
          />
        </div>
      </div>
    </div>
  );
}

export default CommonHeader;
