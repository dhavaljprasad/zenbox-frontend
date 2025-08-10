"use client";

import AppHeader from "@/components/appheader";

export default function Home() {
  return (
    <div className="w-full h-full flex  justify-center bg-neutral-900 gap-8">
      <AppHeader />
      <HeroComponent />
    </div>
  );
}

export const HeroComponent = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-32 p-8">
      <h1 className="text-white text-6xl font-semibold">Welcome to Zenbox</h1>
      <span className="text-white text-xl">
        Your personal AI native email client that manages your emails and saves
        you time.
      </span>
      <span className="text-gray-400 text-sm">
        Built by Indian, for the world.
      </span>
    </div>
  );
};
