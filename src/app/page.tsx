"use client";

import AppHeader from "@/components/appheader";
import Image from "next/image";
import ProductImage1 from "../assets/ProductImage1.png";
import ProductImage2 from "../assets/ProductImage2.png";
import ElonEssential from "../assets/ElonEssential.gif";
import ElonPro from "../assets/ElonPro.gif";
import { PrimaryButton } from "@/components/appbuttons";

const PricingData = [
  {
    name: "Zen Essential",
    icon: (
      <Image
        src={ElonEssential}
        alt="Elon Essential"
        height={300}
        unoptimized
      />
    ),
    price: ["₹299/month", "$3.39/month"],
    features: [
      "Unlimited smart auto-labeling",
      "50 AI inbox chats to keep you on top",
      "Instant AI thread summaries, no limits",
      "300 one-click AI-crafted emails & replies",
    ],
    for: "Perfect for individuals & lean teams",
    info: "If you provide your Gemini API key, you can unlock flat 20% off on your subscription. That's ₹239/month or $2.69/month.",
  },
  {
    name: "Zen Pro",
    price: ["₹499/month", "$5.66/month"],
    icon: <Image src={ElonPro} alt="Elon Pro" height={300} unoptimized />,
    features: [
      "Unlimited smart auto-labeling",
      "500 AI inbox chats for deep control",
      "Instant AI thread summaries, no limits",
      "2000 one-click AI-crafted emails & replies",
    ],
    for: "Made for power users & professionals",
    info: "If you provide your Gemini API key, you can unlock flat 20% off on your subscription. That's ₹399/month or $4.69/month.",
  },
];

export default function Home() {
  return (
    <div className="w-full h-fit flex flex-col bg-neutral-900 gap-8">
      <AppHeader />
      <HeroComponent />
      <ImageComponent />
      <PricingComponent />
    </div>
  );
}

const HeroComponent = () => {
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

const ImageComponent = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-neutral-900 relative border-y border-neutral-700">
      <div className="w-full h-auto bg-neutral-900">
        <div className="w-3/5 absolute top-[-5rem] left-[15rem] rounded-lg overflow-hidden h-auto hover:scale-105 hover:z-10 transition-all duration-300 shadow-[5px_5px_40px_0px_#ffffff40] hover:shadow-[10px_10px_80px_10px_#ffffff40]">
          <Image src={ProductImage2} alt="Product Image 1" className="" />
        </div>
        <div className="w-3/5 absolute top-[15rem] right-[15rem] rounded-lg overflow-hidden h-auto hover:scale-105 hover:z-10 transition-all duration-300 shadow-[5px_5px_40px_0px_#ffffff40] hover:shadow-[10px_10px_80px_10px_#ffffff40]">
          <Image src={ProductImage1} alt="Product Image 2" className="" />
        </div>
      </div>
    </div>
  );
};

const PricingComponent = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-neutral-900">
      <h1 className="text-white text-5xl font-semibold">
        Low cost. High impact.
      </h1>
      <span className="text-white text-xl">
        Your plan, your choice. Your Gemini API key? Your extra savings!
      </span>
      <div className="w-full h-auto flex items-center justify-center my-12 gap-16 px-32">
        {PricingData.map((plan) => (
          <div
            key={plan.name}
            className="h-auto w-100 flex flex-col items-center justify-center gap-4 bg-black rounded-lg p-10 shadow-md cursor-default hover:scale-105 transition-all duration-300"
          >
            {plan.icon}
            <div className="w-full flex flex-col justify-center gap-2">
              <h2 className="text-white text-4xl font-semibold">{plan.name}</h2>
              <p className="text-white font-semibold text-xl mb-2">{`${plan.price[0]} | ${plan.price[1]}`}</p>
              {plan.features.map((feature) => (
                <li key={feature} className="text-white text-sm">
                  {feature}
                </li>
              ))}
              <p className="text-gray-400 text-base mt-4">{plan.for}</p>
              <p className="text-white text-xs mb-8">{plan.info}</p>
              <PrimaryButton
                text={`${plan.price[0]} | ${plan.price[1]}`}
                onClick={() => {}}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
