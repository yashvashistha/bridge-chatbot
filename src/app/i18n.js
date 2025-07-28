import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      project: {
        title: "Welcome",
        description:
          "This project demonstrates a chatbot with multilingual support.",
      },
      chat: {
        title: "Chatbot",
        welcome: "Hello! Please type your message to start the conversation.",
        options: {
          services: "What are the requirements for a military manufacturing license?",
          contact: "What are the licensing requirements by GAMI?",
          pricing:
            "What is the validity period of a military license?",
          guidance: "Can you explain the IP licensing rules for government-funded projects?",
        },
        responses: {
          services:
            "We offer a range of services including tech support and consultation. What specific service are you interested in?",
          contact:
            "You can reach support via email or phone. Would you like me to provide contact details?",
          pricing:
            "Our pricing varies based on the plan you choose. Would you like to see a pricing table?",
          guidance:
            "Sure, I can guide you. What specific information or assistance do you need?",
          defaultResponse: "I'm only a chatbot simulation.",
          assistance:
            "I'm glad to help! Is there anything else I can assist you with?",
        },
        placeholder: "Type a message...",
        send: "Send",
      },
      notFound: {
        title: "Oops! Page Not Found",
        description:
          "The page you're looking for doesn't exist or has been moved. Let's get you back on track!",
        backToHome: "Back to Home",
      },
    },
  },
  ar: {
    translation: {
      project: {
        title: "مرحبًا بك",
        description: "يُظهر هذا المشروع روبوت دردشة يدعم عدة لغات.",
      },
      chat: {
        title: "روبوت الدردشة",
        welcome: "مرحبًا! الرجاء كتابة رسالتك لبدء المحادثة.",
        options: {
          services: "ما هي متطلبات الحصول على ترخيص تصنيع عسكري؟",
          contact: "ما هي متطلبات الترخيص من قبل الهيئة العامة للصناعات العسكرية (GAMI)؟",
          pricing: "ما هي مدة صلاحية الترخيص العسكري؟",
          guidance: "هل يمكنك شرح قواعد ترخيص حقوق الملكية الفكرية للمشاريع الممولة من الحكومة؟",
        },
        responses: {
          services:
            "نقدم مجموعة متنوعة من الخدمات، بما في ذلك الدعم التقني والاستشارات. ما هي الخدمة التي تهتم بها بالتحديد؟",
          contact:
            "يمكنك التواصل مع فريق الدعم عبر البريد الإلكتروني أو الهاتف. هل ترغب في الحصول على تفاصيل الاتصال؟",
          pricing:
            "تعتمد أسعارنا على الخطة التي تختارها. هل ترغب في الاطلاع على جدول الأسعار؟",
          guidance:
            "بالطبع، يمكنني مساعدتك. ما نوع المعلومات أو المساعدة التي تحتاجها؟",
          defaultResponse: "أنا مجرد محاكاة لروبوت دردشة.",
          assistance:
            "يسعدني مساعدتك! هل هناك أي شيء آخر يمكنني تقديم المساعدة فيه؟",
        },
        placeholder: "اكتب رسالة...",
        send: "إرسال",
      },
      notFound: {
        title: "عذرًا! الصفحة غير موجودة",
        description:
          "الصفحة التي تبحث عنها غير موجودة أو تم نقلها. دعنا نساعدك في العودة إلى المسار الصحيح!",
        backToHome: "العودة إلى الصفحة الرئيسية",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
