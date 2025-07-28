"use client"

import Image from "next/image"
// import { useTranslation } from "react-i18next";
import type { ChatHeaderProps } from "../types/chat-wedgit-types"

export const ChatHeader = ({ handleReset, handleCloseChat, isExpanded, setIsExpanded, isMobile }: ChatHeaderProps) => {
  // const { i18n } = useTranslation();
  // const isArabic = i18n.language === "ar";

  // const switchLanguage = () => {
  //     i18n.changeLanguage(isArabic ? "en" : "ar");
  // };

  return (
    <div className="bg-gradient-to-r from-[#0C4A4D] to-[#083032] relative">
      <div className="flex justify-end items-center gap-2 px-4 pt-4 absolute right-0">
        {/* Only show expand button on desktop */}
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
          <Image src="/assets/refresh.svg" alt="chat icon" width={14} height={14} />
        </button>
        <button onClick={handleCloseChat}>
          <Image src="/assets/close-white.svg" alt="chat icon" width={14} height={14} />
        </button>
      </div>

      <div className="bg-[url(/assets/header-background.png)] bg-no-repeat bg-left bg-contain flex flex-col gap-2 items-center justify-center">
        <Image src="/assets/logo.svg" alt="chat icon" width={66} height={66} className="rounded-full mt-3" />
        <Image
          src="/assets/header-icon.svg"
          alt="chat icon"
          width={24}
          height={24}
          className={`absolute ${isExpanded && !isMobile ? "end-[47.5%]" : "end-[41%]"} bottom-10`}
        />
        <p className={`text-white font-semibold text-base mb-3 ${isExpanded && !isMobile ? "text-2xl" : "text-base"}`}>
          Welcome to RAED
        </p>
      </div>
      {/* 
            <div className={`flex gap-1 absolute bottom-[-12px] ${isExpanded ? "start-[48%]" : "start-[44%]"}`}>
                <button onClick={switchLanguage} className="text-[#FFFFFF] text-[8px] bg-[#0C4A4D] border border-[#F5F5F5] rounded-full px-2 py-1">
                    {isArabic ? "En" : "Ar"}
                </button>

                <button onClick={handleShowFeedback} className="text-[8px] bg-[#0C4A4D] border border-[#F5F5F5] rounded-full px-2 py-1">
                    <Image src="/assets/star-white.svg" alt="chat icon" width={9} height={9} />
                </button>
            </div> */}
    </div>
  )
}
