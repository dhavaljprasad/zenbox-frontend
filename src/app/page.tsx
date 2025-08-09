"use client";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-neutral-900 p-16 gap-8">
      <HeroComponent />
    </div>
  );
}

export const HeroComponent = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 pt-16 p-8">
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
