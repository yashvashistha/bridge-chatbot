import { useTranslation } from "react-i18next";

const LanguageButton = () => {
    const { i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    const switchLanguage = () => {
        i18n.changeLanguage(isArabic ? "en" : "ar");
    };

    return (
        <button
            onClick={switchLanguage}
            className="absolute top-6 right-6 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg hover:bg-gray-200 transition font-semibold"
        >
            {isArabic ? "English" : "العربية"}
        </button >
    )
}

export default LanguageButton