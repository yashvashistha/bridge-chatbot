import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ChatInputProps } from "../types/chat-wedgit-types";

const secondryOptions = ["What is GAMI?", "Key initiatives?", "Partnership process?"];

export const ChatInput = ({ input, setInput, sendMessage, showSecondryOptions, isLoading, isOpen }: ChatInputProps) => {
    const { t } = useTranslation();

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col p-3 gap-2 bg-[#FFFFFF]">
            {showSecondryOptions && (
                <div className="flex gap-1 p-1">
                    {secondryOptions.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => sendMessage(option)}
                            className="w-fit text-xs bg-[#EFF1F1] text-[#000000] p-2 rounded-lg"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
            <div className="flex max-h-[10dvh] items-center relative bg-[#EFF1F1] border-[.5px] border-[#E4E7E7] rounded-2xl overflow-hidden px-2 gap-2">
                <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("chat.placeholder")}
                    className="flex-1 py-3 bg-inherit resize-none focus:outline-none text-[#A0A0A0] placeholder:text-[#A0A0A0]"
                    onKeyDown={handleKeyDown}
                    autoFocus={isOpen}
                />
                <button className={`${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => sendMessage()}>
                    <Image src="/assets/send.svg" alt="chat icon" width={24} height={24} />
                </button>
            </div>
        </div>
    );
};
