"use client";
import { useTranslation } from "react-i18next";
import "./i18n";
import ChatWidget from "@/src/components/chat-widget";
import { useContext } from "react";
import { AuthContext } from "../hooks/AuthContext";
import LoginWidget from "../components/login-widget";

export default function MainPage() {
  const { t } = useTranslation();

  const { UserData, selectedApp } = useContext(AuthContext);

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-blue-600 to-purple-800 flex flex-col items-center justify-center text-white text-center p-6">
      <h1 className="text-3xl font-bold mb-4">{t("project.title")}</h1>

      <p className="text-lg max-w-xl">
        {UserData?.user_name && UserData?.user_name !== ""
          ? `This Project demonstrates a chatbot with ${selectedApp.name} Support`
          : "Enter you credentails to sign in"}
      </p>
      {/* <LanguageButton /> */}
      {UserData?.user_name && UserData?.user_name !== "" ? (
        <ChatWidget />
      ) : (
        <LoginWidget />
      )}
    </div>
  );
}
