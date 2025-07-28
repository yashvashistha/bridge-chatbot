import Image from "next/image";
import { FC, useState, useEffect } from "react";
import { ChatMessageProps } from "../types/chat-wedgit-types";
import { marked } from "marked";
import translateText from "../Api/translate";

const Toast: FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed top-4 right-4 bg-[#083032] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
      <span>{message}</span>
    </div>
  );
};

export const ChatMessage: FC<ChatMessageProps> = ({
  message,
  currentTime,
  isExpanded,
  setIsLoading,
  textDirection,
}) => {
  const [showToast, setShowToast] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [translatedMessage, setTranslatedMessage] = useState<string | null>(
    null
  );
  const [translatedHtmlContent, setTranslatedHtmlContent] =
    useState<string>("");

  // const replaceNewlinesWithBreaks = (text: string) => {
  //     return text.replace(/\n/g, "<br>");
  // };

  useEffect(() => {
    const convertToHtml = async () => {
      if (message.isHtml) {
        setHtmlContent(message.text);
      } else {
        const renderer = new marked.Renderer();

        renderer.link = function ({ href, title, text }) {
          return `<a href="${href}" target="_blank" rel="noopener noreferrer" ${
            title ? `title="${title}"` : ""
          }>${text}</a>`;
        };

        const html = await marked(message.text, {
          breaks: true,
          renderer: renderer,
        });

        setHtmlContent(html);
      }
    };
    convertToHtml();
  }, [message.text, message.isHtml]);

  useEffect(() => {
    console.log(marked(`Hello \n World`, { breaks: true }));
  }, []);

  useEffect(() => {
    const convertTranslatedToHtml = async () => {
      if (translatedMessage) {
        const html = await marked(translatedMessage);
        setTranslatedHtmlContent(html);
      }
    };
    convertTranslatedToHtml();
  }, [translatedMessage]);

  const handleCopy = () => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = message.text;
    const plainText = tempElement.textContent || tempElement.innerText || "";

    navigator.clipboard
      .writeText(plainText)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleTranslate = async () => {
    try {
      setIsLoading(true);
      const translatedText = await translateText(message.text, textDirection);
      setTranslatedMessage(translatedText);
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`flex flex-col `}>
        {/* Original Message */}
        <div
          className={`flex ${
            message.user ? "flex-col" : "flex-row gap-2 justify-end items-end"
          }`}
        >
          <div className="flex flex-col items-start">
            <div className="flex items-end gap-2 w-full">
              <div
                className={`text-start p-2 my-2 rounded-t-xl max-w-[80%] break-words ${
                  message.user
                    ? "bg-[#FFFFFF] text-[#000000] rounded-br-xl me-auto"
                    : "bg-gradient-to-r from-[#0C4A4D] to-[#083032] text-[#FFFFFF] ms-auto rounded-bl-xl flex flex-col gap-2"
                }`}
              >
                <div
                  dir={message.direction}
                  // className={isExpanded ? "text-sm" : "text-xs"}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {!message.user && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/assets/thumb-up.svg"
                        alt="thumb up"
                        width={12}
                        height={12}
                        className="cursor-pointer"
                      />
                      <Image
                        src="/assets/thumb-down.svg"
                        alt="thumb down"
                        width={12}
                        height={12}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/assets/language-translation.svg"
                        alt="translation"
                        width={12}
                        height={12}
                        className="cursor-pointer"
                        onClick={handleTranslate}
                      />
                      <button
                        className="text-[#FFFFFF] text-xs"
                        onClick={handleCopy}
                      >
                        <Image
                          src={"/assets/copy.svg"}
                          alt="copy icon"
                          width={14}
                          height={14}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Image
                src="/assets/bridge-icon.svg"
                alt="chat icon"
                width={24}
                height={24}
                className={`${message.user && "hidden"} mb-2`}
              />
            </div>
            <div
              className={`text-[#797C7B] text-xs ${
                message.user ? "me-auto" : "ms-auto"
              }`}
            >
              {currentTime}
            </div>
          </div>
        </div>

        {/* Translated Message */}
        {translatedMessage && (
          <div className={`flex flex-row gap-2 items-end mt-4`}>
            <div className="flex flex-col w-fit items-start">
              <div className="flex items-end gap-2">
                <div
                  className={`text-start p-2 my-2 rounded-t-xl max-w-[80%] bg-gradient-to-r from-[#0C4A4D] to-[#083032] text-[#FFFFFF] ms-auto rounded-bl-xl flex flex-col gap-2`}
                >
                  <div
                    className={`${isExpanded ? "text-sm" : "text-xs"}`}
                    dangerouslySetInnerHTML={{ __html: translatedHtmlContent }}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/assets/thumb-up.svg"
                        alt="thumb up"
                        width={12}
                        height={12}
                        className="cursor-pointer"
                      />
                      <Image
                        src="/assets/thumb-down.svg"
                        alt="thumb down"
                        width={12}
                        height={12}
                        className="cursor-pointer"
                      />
                    </div>
                    <button
                      className="text-[#FFFFFF] text-xs"
                      onClick={handleCopy}
                    >
                      <Image
                        src={"/assets/copy.svg"}
                        alt="copy icon"
                        width={14}
                        height={14}
                      />
                    </button>
                  </div>
                </div>
                <Image
                  src="/assets/bridge-icon.svg"
                  alt="chat icon"
                  width={24}
                  height={24}
                  className="mb-2"
                />
              </div>
              <div className={`text-[#797C7B] text-xs ms-auto`}>
                {currentTime}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && <Toast message="Copied to clipboard!" />}
    </>
  );
};
