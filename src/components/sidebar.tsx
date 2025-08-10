"use client";

import React from "react";
import { SecondaryButton } from "./appbuttons";

function Sidebar() {
  return (
    <div className="w-80 h-screen bg-black flex flex-col pt-16 p-4">
      <SecondaryButton text="Compose" onClick={() => {}} />
    </div>
  );
}

export default Sidebar;
