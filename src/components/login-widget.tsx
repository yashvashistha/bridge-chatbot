"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import ChatButton from "./chat-button";
import { useChatWidget } from "../hooks/use-chatWidget";
import { AuthContext } from "../hooks/AuthContext";
import { encryptPassword } from "../hooks/encryption";

export default function LoginWidget() {
  const { isOpen, setIsOpen } = useChatWidget();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (window.parent !== window) {
      const widgetState = {
        isOpen,
        isExpanded: isExpanded && !isMobile,
        isMobile,
      };
      console.log("Sending widget state to parent:", widgetState); // Debug log
      window.parent.postMessage(
        { type: "WIDGET_STATE_CHANGE", ...widgetState },
        "*"
      );
    }
  }, [isOpen, isExpanded, isMobile]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "CLOSE_WIDGET") {
        setIsOpen(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setIsOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return;

      const target = event.target as Element;
      const chatContainer = document.querySelector("[data-chat-widget]");

      if (chatContainer && !chatContainer.contains(target)) {
        const chatButton = document.querySelector("[data-chat-button]");
        if (chatButton && !chatButton.contains(target)) {
          setIsOpen(false);
          setIsExpanded(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  //   const { login, handleOTPEntered } = useContext(AuthContext);
  const { login, handleOTPEntered } = useContext(AuthContext);

  const [step, setStep] = useState<"login" | "otp">("login");
  const [userLoginId, setUserLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!login) {
      throw new Error("Error while Accessing the Login");
    }

    const encryptedPassword = encryptPassword(password);

    if (!encryptedPassword) {
      throw new Error("Error while encrypting the Password");
    }

    const res = await login(userLoginId, encryptedPassword);
    setLoading(false);
    console.log(res);

    if (res?.status === 1 && res?.message == "OK") {
      setStep("otp");
    } else {
      setError(res?.message);
    }
  };

  const handleOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!handleOTPEntered) {
      throw new Error("Error while Accessing the handleOTPEntered");
    }

    const res = await handleOTPEntered(otp, userLoginId);
    setLoading(false);

    if (res.status === 200) {
      alert("Login successful!");
    } else {
      setError(res.message);
    }
  };

  return (
    <>
      <ChatButton isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && (
        <motion.div
          data-chat-widget
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            width: isExpanded && !isMobile ? "96vw" : "24rem",
            height: isExpanded && !isMobile ? "85vh" : "32rem",
            borderRadius: isExpanded && !isMobile ? "0px" : "12px",
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-2 md:bottom-4 right-1 md:right-6 max-w-[90vw] bg-white shadow-xl flex flex-col overflow-hidden outline outline-[#FFFFFF]"
        >
          {" "}
          <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow-lg text-black">
            <h1 className="text-black text-[20px] font-semibold">
              Welcome back
            </h1>
            <h4 className="text-black text-[14px] mt-2 font-light">
              Enter your credentails to sign in
            </h4>
            {step === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                {/* <h2 className="text-xl font-bold">Login</h2> */}

                <input
                  type="text"
                  placeholder="User Login ID"
                  value={userLoginId}
                  onChange={(e) => setUserLoginId(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleOTP} className="space-y-4">
                <h2 className="text-xl font-bold">Enter OTP</h2>

                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
