"use client";

import React from "react";
import { PrimaryButton } from "./appbuttons";

function AppHeader() {
  return (
    <div className="absolute w-full h-16 bg-black flex items-center justify-between px-30">
      <h1 className="text-white text-2xl font-bold">Zenbox</h1>
      <div className="flex items-center justify-center gap-4">
        <span className="text-white text-sm font-semibold cursor-pointer">
          Pricing
        </span>
        <span className="text-white text-sm font-semibold cursor-pointer">
          About
        </span>
        <PrimaryButton
          text="Get Started"
          onClick={() => {
            console.log("Get Started clicked");
          }}
        />
      </div>
    </div>
  );
}

export default AppHeader;
