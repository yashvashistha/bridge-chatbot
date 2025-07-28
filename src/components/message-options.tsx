import { FC } from "react";
import { MessageOptionsProps } from "../types/chat-wedgit-types";

export const MessageOptions: FC<MessageOptionsProps> = ({ messageOptions, sendMessage, isLoading }) => {
    return (
        <div className="flex flex-col gap-1">
            {messageOptions.map((option, index) => (
                <button
                    key={index}
                    onClick={() => sendMessage(option)}
                    className={`text-left w-fit bg-[#FFFFFF] text-[#000000] p-2 rounded-xl my-[2px] ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};