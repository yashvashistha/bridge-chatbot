import { FC, useEffect, useRef } from "react";
import { ChatMessagesProps } from "../types/chat-wedgit-types";
import { ChatFeedback } from "./chat-feedback";
import { AssistanceForm } from "./assistance-form";
import { ChatMessage } from "./chat-message";
import { MessageOptions } from "./message-options";
import { LoadingIndicator } from "./loading-indicator";
import ContactForm from "./contact_form";

export const ChatMessages: FC<ChatMessagesProps> = ({
  messages,
  showOptions,
  showAssistanceForm,
  messageOptions,
  sendMessage,
  showFeedback,
  setShowFeedback,
  showContact,
  handleCloseContact,
  handleCloseFeedback,
  handleCloseAssistanceForm,
  isLoading,
  isExpanded,
  isMobile,
  setIsLoading,
  textDirection,
  handleCloseChat,
}) => {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const feedbackContainerRef = useRef<HTMLDivElement | null>(null);
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom(chatContainerRef);
    // scrollToBottom(feedbackContainerRef);
  }, [messages, showFeedback, showContact]);

  return (
    <div
      className="flex-1 p-3 overflow-auto bg-[#EFF1F1] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
      ref={chatContainerRef}
    >
      {showAssistanceForm ? (
        <AssistanceForm handleCloseAssistanceForm={handleCloseAssistanceForm} />
      ) : (
        <>
          <div className="my-2">
            <p
              className={`text-center text-[#3C3C3C] text-xs px-5 ${
                isExpanded && !isMobile ? "text-base" : "text-xs"
              }`}
            >
              I&apos;m here to help you with all your policy-related questions.
            </p>
            <p className="text-center font-bold text-xs text-[#3C3C3C]">
              How can I help you today?
            </p>
          </div>

          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg}
              currentTime={currentTime}
              setShowFeedback={setShowFeedback}
              isExpanded={isExpanded}
              isMobile={isMobile}
              textDirection={textDirection}
              setIsLoading={setIsLoading}
            />
          ))}

          {isLoading && <LoadingIndicator />}
        </>
      )}

      {showOptions && (
        <MessageOptions
          messageOptions={messageOptions}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      )}

      {showFeedback && (
        <ChatFeedback
          handleCloseFeedback={handleCloseFeedback}
          feedbackContainerRef={feedbackContainerRef}
          handleCloseChat={handleCloseChat}
          scrollToBottom={scrollToBottom}
        />
      )}

      {showContact && (
        <ContactForm
          handleCloseContact={handleCloseContact}
          isSmallScreen={!isExpanded || isMobile}
        />
      )}
    </div>
  );
};
