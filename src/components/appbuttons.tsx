"use client";
import React from "react";

export const PrimaryButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center px-2 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200"
    >
      <span className="text-sm font-semibold text-black">{text}</span>
    </button>
  );
};

export const SidebarButton = ({
  Icon,
  onClick,
  selected = false,
  title = "",
}: {
  Icon: React.ReactNode;
  onClick: () => void;
  selected?: boolean;
  title?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded-xs cursor-pointer transition duration-200 ${
        selected ? "bg-neutral-700" : "bg-neutral-900 hover:bg-neutral-700"
      }`}
    >
      {Icon}
      <span className="text-base text-white">{title}</span>
    </button>
  );
};
