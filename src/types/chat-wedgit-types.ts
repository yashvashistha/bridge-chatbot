export interface Message {
  text: string;
  user: boolean;
  isHtml?: boolean;
  direction?: "rtl" | "ltr";
}
export interface ChatButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export interface ChatHeaderProps {
  handleReset: () => void;
  handleCloseChat: () => void;
  isMobile: boolean;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

export interface ChatMessagesProps {
  messages: Message[];
  showOptions: boolean;
  showAssistanceForm: boolean;
  messageOptions: string[];
  sendMessage: (message?: string) => void;
  showFeedback: boolean;
  setShowFeedback: (show: boolean) => void;
  handleCloseAssistanceForm: () => void;
  handleCloseFeedback: () => void;
  isLoading: boolean;
  isExpanded: boolean;
  isMobile: boolean;
  setIsLoading: (isLoading: boolean) => void;
  textDirection: "en-to-ar" | "ar-to-en" | null;
  showContact: boolean;
  handleCloseContact: () => void;
  handleCloseChat: () => void;
}

export interface AssistanceFormProps {
  handleCloseAssistanceForm: () => void;
}

export interface ChatMessageProps {
  message: Message;
  currentTime: string;
  setShowFeedback: (show: boolean) => void;
  isExpanded: boolean;
  isMobile: boolean;
  setIsLoading: (isLoading: boolean) => void;
  textDirection: "en-to-ar" | "ar-to-en" | null;
}

export interface MessageOptionsProps {
  messageOptions: string[];
  sendMessage: (message?: string) => void;
  isLoading: boolean;
}

export interface ChatFeedbackProps {
  handleCloseFeedback: () => void;
  handleCloseChat: () => void;
  scrollToBottom: (ref: React.RefObject<HTMLDivElement | null>) => void;
  feedbackContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export interface ChatContactProps {
  handleCloseContact: () => void;
  isSmallScreen: boolean;
  contactContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  sendMessage: (message?: string) => void;
  showSecondryOptions: boolean;
  isLoading: boolean;
  isOpen: boolean;
}
