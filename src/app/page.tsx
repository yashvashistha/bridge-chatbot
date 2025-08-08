"use client";
import { useTranslation } from "react-i18next";
import "./i18n";
import ChatWidget from "@/src/components/chat-widget";
// import LanguageButton from "@/src/components/language-button";
import { useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../hooks/AuthContext";
import LoginWidget from "../components/login-widget";

export default function MainPage() {
  const { t } = useTranslation();

  // const url =
  //   process.env.NEXT_PUBLIC_API_URL ||
  //   "https://ecoapilwebapp02-ash2f8e6fcgzexgq.centralindia-01.azurewebsites.net/api";

  // const CSRFToken = async () => {
  //   try {
  //     const response = await axios.get(`${url}/v1/get-csrf-token`);
  //     return response.data.csrf_token;
  //   } catch (err) {
  //     console.error("Error in CSRF Token", err);
  //     return "";
  //   }
  // };

  // function useAutoRefreshToken() {
  //   useEffect(() => {
  //     const refreshToken = async () => {
  //       try {
  //         const csrfToken = await CSRFToken();
  //         const config = {
  //           method: "post",
  //           maxBodyLength: Number.POSITIVE_INFINITY,
  //           url: `${url}/v1/refresh_token`,
  //           headers: {
  //             accept: "application/json",
  //             "Content-Type": "application/json",
  //             ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
  //           },
  //           data: {
  //             token:
  //               localStorage.getItem("refresh_token") ||
  //               "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTQwNTA3OTcsInN1YiI6InRlc3QxMDAwMSJ9.f6Bx8Jj7HIj_rR-9szSM0wQKD2WXQo-FEyJxXd2yCoU",
  //           },
  //         };
  //         const response = await axios.request(config);
  //         const token = response.data.data.result;
  //         console.log("Token refreshed:");
  //         if (token) {
  //           localStorage.setItem("access_token", token?.access_token);
  //           localStorage.setItem("refresh_token", token?.refresh_token);
  //           console.log("Token refreshed");
  //         }
  //       } catch (err) {
  //         console.error("Refresh token failed", err);
  //       }
  //     };

  //     refreshToken(); // First time
  //     const interval = setInterval(refreshToken, 12 * 60 * 1000); // every 12 mins

  //     return () => clearInterval(interval); // cleanup
  //   }, []);
  // }

  // useAutoRefreshToken();

  const { UserData } = useContext(AuthContext);

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-blue-600 to-purple-800 flex flex-col items-center justify-center text-white text-center p-6">
      <h1 className="text-3xl font-bold mb-4">{t("project.title")}</h1>
      {/* <p className="text-lg max-w-xl">{t("project.description")}</p> */}
      <p className="text-lg max-w-xl">
        This Project demonstrates a chatbot with HR Support
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
