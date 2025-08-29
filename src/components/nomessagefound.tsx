"use client";
import React from "react";
import GhostSVG from "../assets/ghost.png";
import Image from "next/image";

function NoMessagesFound() {
  return (
    <div className=" w-full h-full flex flex-col items-center justify-center">
      <Image src={GhostSVG} alt="No Messages" width={200} height={200} />
      <p className="text-gray-500 font-semibold">Sorry, nothing to see here!</p>
    </div>
  );
}

export default NoMessagesFound;
