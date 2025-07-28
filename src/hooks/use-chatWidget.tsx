import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { Message } from "@/src/types/chat-wedgit-types";
import sendMessageApi from "@/src/Api/get-chat";

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
  // const [textDirection, setTextDirection] = useState<
  //   "en-to-ar" | "ar-to-en" | null
  // >(null);

  const textDirection = null;

  const messageOptions = useMemo(
    () => [
      "What is the company policy on leave?",
      "What are the working hours?",
      // t("chat.options.services"),
      // t("chat.options.contact"),
      // t("chat.options.pricing"),
      // t("chat.options.guidance"),
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

      try {
        const apiResponse = await sendMessageApi(userMessage);

        setMessages((prev) => [
          ...prev,
          {
            text: apiResponse,
            user: false,
          },
        ]);
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
