"use client";

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
  primaryText,
  secondaryText = "",
  onClick,
  selected = false,
}: {
  primaryText: string;
  secondaryText?: string;
  onClick: () => void;
  selected?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition duration-200 ${
        selected ? "bg-neutral-700" : "bg-neutral-900 hover:bg-neutral-700"
      }`}
    >
      <span className="text-sm font-semibold text-white">{primaryText}</span>
      <span className="text-xs text-gray-400">{secondaryText}</span>
    </button>
  );
};
