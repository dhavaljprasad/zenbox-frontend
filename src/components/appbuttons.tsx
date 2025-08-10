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

export const SecondaryButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center px-2 py-2 bg-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-700 transition duration-200"
    >
      <span className="text-sm font-semibold text-white">{text}</span>
    </button>
  );
};
