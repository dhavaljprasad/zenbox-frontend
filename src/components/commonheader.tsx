"use client";
import React from "react";

function CommonHeader({ userData }: { userData: any }) {
  return (
    <div className="absolute w-full h-16 bg-black flex items-center justify-between px-30">
      <h1 className="text-white text-2xl font-bold">Zenbox</h1>
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
  );
}

export default CommonHeader;
