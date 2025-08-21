"use client";

import Image from "next/image";
// import { useTranslation } from "react-i18next";
import type { ChatHeaderProps } from "../types/chat-wedgit-types";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../hooks/AuthContext";

export const ChatHeader = ({
  handleReset,
  handleCloseChat,
  isExpanded,
  setIsExpanded,
  isMobile,
}: ChatHeaderProps) => {
  const { logout, selectedApp, setSelectedApp } = useContext(AuthContext);
  const apps = [
    { name: "Finance Bot", value: "0e61eb947e7211f0be8ec275eddfd3ec" },
    { name: "EchoAIChat Bot", value: "9bd39c34422c11f0939c1e51c9c660f8" },
  ];
  return (
    <div className="bg-gradient-to-r from-[#0C4A4D] to-[#083032] relative">
      <div className="flex justify-between items-center px-4 pt-4 absolute right-0 left-0">
        {/* Left side */}
        <select
          className="border rounded px-2 py-1 bg-[#0C4A4D] w-[130px]"
          value={selectedApp.value}
          onChange={(e) => {
            const app = apps.find((a: any) => a.value === e.target.value);
            if (app && setSelectedApp) {
              setSelectedApp({ name: app.name, value: app.value });
            }
          }}
        >
          <option value="" disabled>
            Select an app
          </option>
          {apps.map((app: any) => (
            <option key={app.value} value={app.value}>
              {app.name}
            </option>
          ))}
        </select>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {!isMobile && (
            <button onClick={() => setIsExpanded(!isExpanded)}>
              <Image
                src={isExpanded ? "/assets/collapse.svg" : "/assets/expand.svg"}
                alt="expand/collapse icon"
                width={14}
                height={14}
              />
            </button>
          )}

          <button onClick={handleReset}>
            <Image
              src="/assets/refresh.svg"
              alt="chat icon"
              width={14}
              height={14}
            />
          </button>
          <button onClick={handleCloseChat}>
            <Image
              src="/assets/close-white.svg"
              alt="chat icon"
              width={14}
              height={14}
            />
          </button>
          <button onClick={() => logout?.()}>
            <LogOut size={14} />
          </button>
        </div>
      </div>

      <div className="bg-[url(/assets/header-background.png)] bg-no-repeat bg-left bg-contain flex flex-col gap-2 items-center justify-center">
        <Image
          src="/assets/bridge-icon.svg"
          alt="chat icon"
          width={66}
          height={66}
          className="rounded-full mt-3"
        />
        <p
          className={`text-white font-semibold text-base mb-3 ${
            isExpanded && !isMobile ? "text-2xl" : "text-base"
          }`}
        >
          Welcome to Eko.AI
        </p>
      </div>
    </div>
  );
};
