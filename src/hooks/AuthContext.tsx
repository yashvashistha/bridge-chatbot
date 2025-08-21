"use client";

import axios from "axios";
import {
  createContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import Cookies from "js-cookie";
import { APIcallFunction } from "./APIFunction";

interface UserData {
  user_login_id: string | null;
  designation: string | null;
  user_role: string | null;
  user_name: string | null;
  user_uuid: string | null;
}

interface AuthContextType {
  user: string;
  UserData: UserData;
  loading: boolean;
  isExpired: boolean;
  setIsExpired: (value: boolean) => void;
  selectedApp: any;
  setSelectedApp: Dispatch<SetStateAction<any>>;
  login: (
    user_login_id: string,
    password: string
  ) => Promise<{ status: number; message: string }>;
  logout: () => Promise<string>;
  handleOTPEntered: (
    otp: string,
    user_login_id: string
  ) => Promise<{ status: number; message: string }>;
  getnewCSRF: () => Promise<string>;
}

export const AuthContext = createContext<Partial<AuthContextType>>({
  UserData: {
    user_login_id: "",
    designation: "",
    user_role: "",
    user_name: "",
    user_uuid: "",
  },
  selectedApp: {},
  setSelectedApp: async () => {
    console.error("setSearchInput was called outside of AppProvider");
  },
  login: async () => {
    return { status: 0, message: "" };
  },
  logout: async () => {
    return "";
  },
  handleOTPEntered: async () => {
    return { status: 0, message: "" };
  },
});

// --- Helper: Parse user details from cookie once ---
function getUserDetailsFromCookie(): any | null {
  const data = Cookies.get("EkoBot");
  return data ? JSON.parse(data) : null;
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/v1`;

  // --- State ---

  const [selectedApp, setSelectedApp] = useState<any>({
    name: "EchoAIChat Bot",
    value: "9bd39c34422c11f0939c1e51c9c660f8",
  });

  const [user, setUser] = useState<string>("user");
  const [loading, setLoading] = useState<boolean>(false);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [UserData, setUserData] = useState<UserData>({
    user_login_id: null,
    designation: null,
    user_role: null,
    user_name: null,
    user_uuid: null,
  });
  const [isExpired, setIsExpired] = useState<boolean>(
    typeof window !== "undefined" && localStorage.getItem("EkoBot") === "true"
  );

  // --- Refs for timeouts ---
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- API call helper ---
  const apicall = APIcallFunction();
  // --- Session/Refresh timeouts (memoized for performance) ---
  const sessionTimeout = useMemo(() => {
    return 15 * 60 * 1000; // 15 minutes
  }, [UserData.user_login_id]);

  const refreshTimeout = useMemo(() => {
    return 12 * 60 * 1000; // 12 minutes
  }, [UserData.user_login_id]);

  // --- CSRF Token: Cache and refresh only if missing ---
  const getCSRFtoken = useCallback(async () => {
    if (csrfToken) return csrfToken;
    try {
      const response = await axios.get(`${url}/get-csrf-token`);
      setCsrfToken(response.data.csrf_token);
      return response.data.csrf_token;
    } catch (err) {
      console.error("Error in CSRF Token", err);
      return "";
    }
  }, [csrfToken, url]);

  useEffect(() => {
    const interval = setInterval(async () => {
      setCsrfToken(""); // remove old token
      await getCSRFtoken(); // fetch a new one
    }, 3 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval); // cleanup on unmount
  }, [getCSRFtoken]);

  // --- Logout: Clear all sensitive data ---
  const logout = useCallback(async (): Promise<string> => {
    try {
      const csrf = await getCSRFtoken();
      const response = await apicall(
        "v1/logout",
        "post",
        { "X-CSRF-Token": csrf },
        null
      );
      if (response.status == 1) {
        setUser(null as any);
        Cookies.remove("EkoBot");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (typeof window !== "undefined") {
          window.location.assign("/");
        }
        Cookies.set("EkoIsOTP", "false");
        return "";
      } else {
        // toast({
        //   title: "Error",
        //   description: "Please Logout Again.!",
        //   variant: "destructive",
        // });
        return "Please Logout Again.!";
      }
    } catch (error) {
      //   toast({
      //     title: "Error",
      //     description: "Please Logout Again.!",
      //     variant: "destructive",
      //   });
      console.error("Logout failed:", error);
      return "Please Logout Again.!";
    }
  }, [apicall, getCSRFtoken]);

  // --- Reset session timeout on user activity ---
  const resetTimeout = useCallback(() => {
    if (!UserData.user_login_id) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Update cookie expiry for non-admins
    const userDetails = Cookies.get("EkoBot");
    if (userDetails) {
      Cookies.set("EkoBot", userDetails, { expires: 15 / 1440 });
    }

    timeoutRef.current = setTimeout(() => {
      setIsExpired(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("EkoBotisExpired", "true");
      }
      logout();
    }, sessionTimeout);
  }, [UserData.user_login_id, sessionTimeout, logout]);

  // --- Effect: Listen for user activity to reset session timeout ---
  useEffect(() => {
    if (!UserData.user_login_id || typeof window === "undefined") return;
    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);
    return () => {
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
    };
  }, [resetTimeout, UserData.user_login_id]);

  // --- Effect: Token refresh interval ---
  useEffect(() => {
    if (!UserData.user_login_id) return;
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    refreshIntervalRef.current = setInterval(async () => {
      await RefreshToken();
    }, refreshTimeout);
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [UserData.user_login_id, refreshTimeout]);

  // --- Effect: Load user from cookie on mount ---
  useEffect(() => {
    setLoading(true);
    const sessionObject = getUserDetailsFromCookie();
    if (sessionObject) {
      setUserData({
        user_login_id: sessionObject.user_login_id,
        designation: sessionObject.designation,
        user_role: sessionObject.user_role,
        user_name: sessionObject.user_name,
        user_uuid: sessionObject.user_uuid,
      });
    } else {
      setUser(null as any);
      setUserData({
        user_login_id: null,
        designation: null,
        user_role: null,
        user_name: null,
        user_uuid: null,
      });
    }
    setLoading(false);
  }, []);

  // --- Effect: Fetch CSRF token on mount ---
  useEffect(() => {
    getCSRFtoken();
  }, [getCSRFtoken]);

  // --- Refresh Token: Use cached CSRF token if available ---
  const RefreshToken = useCallback(async () => {
    const csrf = csrfToken || (await getCSRFtoken());
    try {
      const userDetails = getUserDetailsFromCookie();
      if (!userDetails) throw new Error("No user details found");
      const config_token = {
        method: "post",
        maxBodyLength: Number.POSITIVE_INFINITY,
        url: `${url}/refresh_token`,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf,
        },
        data: {
          token: userDetails?.refresh_token,
        },
      };
      const responseTokens = await axios.request(config_token);

      Cookies.set(
        "EkoBot",
        JSON.stringify({
          user_name: responseTokens.data.data.result.user_name,
          user_role: responseTokens.data.data.result.user_role,
          designation: responseTokens.data.data.result.designation,
          user_login_id: responseTokens.data.data.result.user_login_id,
          access_token: responseTokens.data.data.result.access_token,
          refresh_token: responseTokens.data.data.result.refresh_token,
          api_key: userDetails?.api_key,
          user_uuid: userDetails?.user_uuid,
          email_id: responseTokens.data?.result?.email_id,
          department: responseTokens.data?.result?.department,
          location: responseTokens.data?.result?.location,
        }),
        { expires: 15 / 1440 }
      );
    } catch (error) {
      console.error("Token Refresh Failed", error);
    }
  }, [csrfToken, url, getCSRFtoken]);

  // --- Login ---
  const login = useCallback(
    async (
      user_login_id: string,
      password: string
    ): Promise<{ status: number; message: string }> => {
      try {
        const csrf = await getCSRFtoken();
        const LoginData = {
          identifier: user_login_id.trim(),
          password: password.trim(),
        };
        const response = await axios.post(`${url}/login`, LoginData, {
          headers: { "X-CSRF-Token": csrf },
        });
        if (response.data.status === 1) {
          Cookies.remove("EkoBot");
          Cookies.set("EkoIsOTP", "false");
          resetTimeout();
          setIsExpired(false);
          if (typeof window !== "undefined") {
            localStorage.removeItem("EkoisExpired");
          }
          // --- Update UserData state immediately after login ---
          setUserData({
            user_login_id:
              response.data.data.result?.user_login_id ?? user_login_id,
            designation: response.data.data.result?.designation ?? "",
            user_role: response.data.data.result?.user_role ?? "",
            user_name: response.data.data.result?.user_name ?? "",
            user_uuid: response.data.data.result?.user_uuid ?? "",
          });
          return { status: response.data.status, message: "OK" };
        } else if (
          response.data.status === 0 &&
          response.data.data.error.code === 400
        ) {
          return { status: 0, message: response.data.data.error.msg };
        }
        return { status: 0, message: "An unknown error occurred" };
      } catch (error) {
        console.error("Login failed:", error);
        return {
          status: 0,
          message: "An unknown error occurred. Please try again later.",
        };
      }
    },
    [getCSRFtoken, resetTimeout, url]
  );

  // --- Other functions (handleOTPEntered, CallbackHandler, etc.) ---
  const CallUser = async (response: any) => {
    try {
      const response1 = await apicall(
        `v1/search_user?page=${1}&limit=${1000}&query=${
          response.data.data.result.user_uuid
        }`,
        "get",
        {
          accept: "application/json, text/plain, /",
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        }
      );

      Cookies.set(
        "EkoBot",
        JSON.stringify({
          access_token: response.data.data.result.access_token,
          refresh_token: response.data.data.result.refresh_token,
          user_name: response.data.data.result.user_name,
          user_role: response.data.data.result.user_role,
          designation: response.data.data.result.designation,
          user_login_id: response.data.data.result.user_login_id,
          api_key: "sk-hkOofdr8qZikcsoNu5sNPw",
          user_uuid: response.data.data.result.user_uuid,
          email_id: response1.data?.result?.results[0]?.email_id,
          department: response1.data?.result?.results[0]?.department,
          location: response1.data?.result?.results[0]?.location,
        }),
        {
          expires: 15 / 1440,
        }
      );

      return response1?.status ? response1?.data?.result?.results[0] : 0;
    } catch (err) {
      console.error("Error while fetching the User", err);
    }
  };

  // --- handleOTPEntered ---
  const handleOTPEntered = useCallback(
    async (
      otp: string,
      user_login_id: string
    ): Promise<{ status: number; message: string }> => {
      try {
        await getCSRFtoken();
        const optdata = {
          identifier: user_login_id,
          otp: otp.trim(),
        };
        const response = await axios.post(
          `${url}/validate_login_otp`,
          optdata,
          {
            headers: {
              accept: "application/json",
              "X-CSRF-Token": csrfToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status === 1) {
          Cookies.set(
            "EkoBot",
            JSON.stringify({
              access_token: response.data.data.result.access_token,
              refresh_token: response.data.data.result.refresh_token,
              user_name: response.data.data.result.user_name,
              user_role: response.data.data.result.user_role,
              designation: response.data.data.result.designation,
              user_login_id: response.data.data.result.user_login_id,
              api_key: "sk-hkOofdr8qZikcsoNu5sNPw",
              user_uuid: response.data.data.result.user_uuid,
              email_id: "",
              department: "",
              location: "",
            }),
            {
              expires: 15 / 1440,
            }
          );

          Cookies.set("EkoIsOTP", "true");
          setUser(response.data.data.result.user_name);
          setLoading(false);
          // --- Update UserData state immediately after OTP validation ---
          setUserData({
            user_login_id: response.data.data.result.user_login_id,
            designation: response.data.data.result.designation,
            user_role: response.data.data.result.user_role,
            user_name: response.data.data.result.user_name,
            user_uuid: response.data.data.result.user_uuid,
          });
          const user = await CallUser(response);
          console.log(user);
          if (user) {
            return { status: 1, message: "OK" };
          } else {
            return { status: 0, message: "Error" };
          }
        } else if (response.data.status == 0) {
          return { status: 0, message: response.data.data.error.msg };
        } else {
          return { status: 0, message: "Error" };
        }
      } catch (error) {
        console.error("Login failed:", error);
        return {
          status: 0,
          message: "An unknown error occurred. Please try again later.",
        };
      }
    },
    [getCSRFtoken, url, CallUser]
  );

  const getnewCSRF = useCallback(async (): Promise<string> => {
    try {
      const response = await axios.get(`${url}/get-csrf-token`);
      setCsrfToken(response.data.csrf_token);
      return response.data.csrf_token;
    } catch (err) {
      console.error(err);
      return "";
    }
  }, [url]);

  // --- Context Value: Memoized for performance ---
  const authContextValue = useMemo(
    () => ({
      user,
      loading,
      UserData,
      selectedApp,
      setSelectedApp,
      login,
      logout,
      handleOTPEntered,
      getnewCSRF,
      isExpired,
      setIsExpired: (value: boolean) => {
        setIsExpired(value);
        if (typeof window !== "undefined") {
          localStorage.setItem("EchoisExpired", String(value));
        }
      },
    }),
    [user, loading, UserData, login, logout, handleOTPEntered, isExpired]
  );

  // --- Provider ---
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
