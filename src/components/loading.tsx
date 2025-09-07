"use client";
import React from "react";

function LoadingComponent() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
      <div className="animate-spin rounded-full h-20 w-20 border-t-8 border-b-8 border-white"></div>
      <span className="text-white">Loading...</span>
    </div>
  );
}

export default LoadingComponent;
