"use client";
import { useTranslation } from "react-i18next";
import "./i18n";
import Link from "next/link";

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="relative w-screen h-screen bg-gradient-to-br from-blue-600 to-purple-800 flex flex-col items-center justify-center text-white text-center p-6">
            <h1 className="text-6xl font-bold mb-4 animate-bounce">
                404
            </h1>
            
            <h2 className="text-3xl font-semibold mb-6">
                {t("notFound.title")}
            </h2>

            <p className="text-lg max-w-xl mb-8">
                {t("notFound.description")}
            </p>

            <Link
                href="/"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transition-all"
            >
                {t("notFound.backToHome")}
            </Link>

            <div className="mt-12">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="150"
                    height="150"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white animate-pulse"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>
        </div>
    );
}
