import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { Message } from "@/src/types/chat-wedgit-types";
import sendMessageApi from "@/src/Api/get-chat";
import { marked } from "marked";

export function useChatWidget() {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(true);
  const [showSecondryOptions, setShowSecondryOptions] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [showAssistanceForm, setShowAssistanceForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [textDirection, setTextDirection] = useState<
    "en-to-ar" | "ar-to-en" | null
  >(null);

  const messageOptions = useMemo(
    () => [
      t("chat.options.services"),
      t("chat.options.contact"),
      t("chat.options.pricing"),
      t("chat.options.guidance"),
    ],
    [t]
  );

  const sendMessage = useCallback(
    async (message?: string) => {
      if (isLoading) return;

      const userMessage: string = DOMPurify.sanitize(message ?? input.trim());
      if (!userMessage) return;

      setMessages((prev) => [...prev, { text: userMessage, user: true }]);
      setInput("");
      setShowOptions(false);
      setShowSecondryOptions(true);
      setShowFeedback(false);
      setShowAssistanceForm(false);
      setIsLoading(true);

      let storedSessionId: string | null =
        sessionStorage.getItem("chatSessionId");

      try {
        const apiResponse = await sendMessageApi(
          userMessage,
          storedSessionId ?? null
        );
        console.log("API Response:", apiResponse);

        setMessages((prev) => [
          ...prev,
          {
            text: apiResponse,
            user: false,
          },
        ]);

        // const apiResponse: { session_id?: string; text_direction?: string; response?: string; references?: { ref_id: number; reference_url: string }[] } = await sendMessageApi(userMessage, storedSessionId ?? null);
        // console.log("API Response:", apiResponse);

        // if (apiResponse?.session_id) {
        //     storedSessionId = apiResponse?.session_id
        //     sessionStorage.setItem("chatSessionId", apiResponse.session_id);
        // }

        // if (apiResponse?.text_direction) {
        //     if (apiResponse.text_direction === "RTL") {
        //         setTextDirection("ar-to-en");
        //     } else {
        //         setTextDirection("en-to-ar");
        //     }
        // }

        // if (apiResponse?.response) {
        //     const htmlContent = await marked.parse(apiResponse.response);

        //     // Sanitize the HTML content while allowing specific HTML tags and attributes
        //     const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
        //         ALLOWED_TAGS: ['p', 'a', 'b', 'i', 'em', 'strong', 'span', 'br', 'ul', 'ol', 'li', 'sup'],
        //         ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
        //     });

        //     const processedHtml = sanitizedHtml.replace(/\[(\d+|\p{N}+)\]/gu, (match, refId) => {
        //         const normalizedRefId = arabicToEnglishNumbers(refId); // Convert Arabic numbers to English
        //         const reference = apiResponse.references?.find((ref) => ref.ref_id === parseInt(normalizedRefId, 10));
        //         if (!reference) return ""; // If no matching reference, return empty string

        //         const isRTL = apiResponse.text_direction === "RTL";
        //         const marginClass = isRTL ? "ml-[1px]" : "mr-[1px]";

        //         return `<sup href="${reference.reference_url}"
        //             target="_blank"
        //             rel="noopener noreferrer"
        //             class="inline-block text-[10px] ${marginClass} cursor-pointer"
        //             dir="${isRTL ? 'rtl' : 'ltr'}">${normalizedRefId}</sup>`;
        //     });

        //     setMessages((prev) => [
        //         ...prev,
        //         {
        //             text: processedHtml,
        //             user: false,
        //             isHtml: true,
        //             direction: apiResponse.text_direction === "RTL" ? "rtl" : "ltr"
        //         }
        //     ]);
        // } else {
        //     setMessages((prev) => [
        //         ...prev,
        //         { text: "No relevant information found in the knowledge base", user: false }
        //     ]);
        // }
      } catch (error) {
        console.error("Error calling API:", error);

        const errorMessage: string =
          (error as { response?: { data?: { detail?: string } } })?.response
            ?.data?.detail ?? "An error occurred";
        setMessages((prev) => [...prev, { text: errorMessage, user: false }]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  const arabicToEnglishNumbers = (str: string) => {
    return str.replace(/[\u0660-\u0669]/g, (d) =>
      String(d.charCodeAt(0) - 0x0660)
    );
  };

  // Close assistance form
  const handleCloseAssistanceForm = useCallback(() => {
    setShowAssistanceForm(false);
    setShowOptions(true);
  }, []);

  // Show feedback form
  const handleShowFeedback = useCallback(() => {
    setShowFeedback(true);
    setShowOptions(false);
    setShowSecondryOptions(false);
    setShowAssistanceForm(false);
  }, []);

  // Close feedback form
  const handleCloseFeedback = useCallback(() => {
    setShowFeedback(false);
    if (!messages.length) {
      setShowOptions(true);
    }
  }, [messages.length]);

  const handleShowContact = useCallback(() => {
    setShowContact(true);
  }, []);

  const handleCloseContact = useCallback(() => {
    setShowContact(false);
  }, []);

  const handleCloseChat = useCallback(() => {
    if (messages.length > 0 && !feedbackShown) {
      setShowFeedback(true);
      setFeedbackShown(true);
      return false;
    }

    setIsOpen(false);
    setShowFeedback(false);
    return true;
  }, [messages.length, feedbackShown, showFeedback]);

  const handleReset = useCallback(() => {
    if (isLoading) return;
    setMessages([]);
    setInput("");
    setShowOptions(true);
    setShowSecondryOptions(false);
    setShowAssistanceForm(false);
    setShowFeedback(false);
    setFeedbackShown(false); // Reset feedback shown state
  }, [isLoading]);

  return {
    isOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    showOptions,
    showSecondryOptions,
    showFeedback,
    setShowFeedback,
    showAssistanceForm,
    messageOptions,
    sendMessage,
    handleCloseAssistanceForm,
    handleShowFeedback,
    handleCloseFeedback,
    handleReset,
    isLoading,
    setIsLoading,
    textDirection,
    showContact,
    handleShowContact,
    handleCloseContact,
    handleCloseChat,
  };
}
