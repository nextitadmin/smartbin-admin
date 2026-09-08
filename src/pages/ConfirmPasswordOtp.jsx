import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import api from "../api/apiConfig.js";
import useTokenStore from "../stores/tokenStore.js";
import useAuthStore from "../stores/authStore.js";

export default function ConfirmPasswordOtp() {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [time, setTime] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);

  const setBearerToken = useTokenStore((state) => state.setBearerToken);
  const setToken = useAuthStore((state) => state.setToken);

  const storedUserType = localStorage.getItem("userType") || "SuperAdmin";
  const storedEmail = localStorage.getItem("email") || "";

  const clearNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (location.state?.notification) {
      setNotification(location.state.notification);
    }
  }, [location.state]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, "");
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    if (val && index < code.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (!pastedData) return;
    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    const nextIdx = Math.min(pastedData.length, code.length - 1);
    inputs.current[nextIdx]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) return 0;
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!code.every((digit) => digit !== "")) {
      setNotification({ type: "error", message: "Please enter all 5 digits." });
      return;
    }

    const joinedCode = code.join("");
    setIsVerifying(true);

    let url = "/lawma/auth/password/reset/verify";
    let payload = { email: storedEmail, code: joinedCode };

    if (storedUserType === "PSPs" || storedUserType === "PSPsTeamMembers") {
      url = "/psps/auth/verify-password-reset";
      payload = { code: joinedCode };
    } else if (storedUserType === "resident") {
      url = "/residents/verify-password-reset";
      payload = { code: joinedCode };
    } else if (storedUserType === "corporate") {
      url = "/corporate/verify-password-reset";
      payload = { code: joinedCode };
    } else if (storedUserType === "agent") {
      url = "/agents/password-reset/verify";
      payload = { code: joinedCode };
    } else if (storedUserType === "facilitymgr") {
      url = "/facility-managers/account/password/verify";
      payload = { code: joinedCode };
    }

    try {
      const response = await api.post(url, payload);
      const data = response.data;

      const isSuccess =
        response.status === 200 ||
        response.status === 201 ||
        data?.success === true ||
        data?.succeeded === true;

      if (isSuccess) {
        const token =
          data?.data?.token ||
          data?.token ||
          data?.data?.accessToken ||
          data?.accessToken;

        if (token) {
          setBearerToken(token);
          if (typeof setToken === "function") setToken(token);
        }

        const verifyMsg = data?.message || "OTP verified successfully!";
        setNotification({
          type: "success",
          message: verifyMsg,
        });

        setTimeout(() => {
          navigate("/enternewpassword", {
            state: {
              notification: {
                type: "success",
                message: verifyMsg,
              },
            },
          });
        }, 1200);
      } else {
        setIsVerifying(false);
        setNotification({
          type: "error",
          message: data?.message || "Wrong OTP or verification timed out!",
        });
      }
    } catch (error) {
      setIsVerifying(false);
      console.error("Error during OTP verification:", error);
      const errData = error?.response?.data;
      const errMsg = Array.isArray(errData?.message)
        ? errData.message.join(", ")
        : errData?.message || error?.message || "Invalid or expired OTP code.";
      setNotification({ type: "error", message: errMsg });
    }
  };

  const handleResend = async () => {
    if (time > 0) return;

    if (!storedEmail) {
      setNotification({ type: "error", message: "Email not found. Please restart the reset process." });
      return;
    }

    setIsResending(true);

    let url = "/lawma/auth/passwords/reset";
    if (storedUserType === "PSPs" || storedUserType === "PSPsTeamMembers") {
      url = "/psps/auth/request-password-reset";
    } else if (storedUserType === "resident") {
      url = "/residents/request-password-reset";
    } else if (storedUserType === "corporate") {
      url = "/corporate/request-password-reset";
    } else if (storedUserType === "agent") {
      url = "/agents/password-reset/request";
    } else if (storedUserType === "facilitymgr") {
      url = "/facility-managers/account/password/request";
    }

    try {
      await api.post(url, { email: storedEmail.trim().toLowerCase() });
      setNotification({
        type: "success",
        message: "A new OTP code has been sent to your email.",
      });
      setTime(60);
      setCode(["", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP error:", err);
      const errData = err?.response?.data;
      const errMsg = Array.isArray(errData?.message)
        ? errData.message.join(", ")
        : errData?.message || "Failed to resend OTP. Please try again.";
      setNotification({ type: "error", message: errMsg });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white">
      {/* Left Panel */}
      <div className="lg:w-7/12 w-full h-full flex flex-col lg:px-36 px-8 py-12 bg-white">
        <p className="text-zinc-400 text-2xl py-8">Powered by:</p>
        
        {/* Logos */}
        <div className="flex flex-wrap gap-6 mb-8 items-center justify-start">
          <img
            src="/images/lagosmewr.png"
            alt="Lagos"
            className="h-12 object-contain"
          />
          <img
            src="/images/lawma-logo.png"
            alt="LAWMA"
            className="h-12 object-contain"
          />
          <img
            src="/images/wema-logo.png"
            alt="Wema Bank"
            className="h-12 object-contain"
          />
        </div>

        <div className="lg:my-16 my-8">
          <div className="flex flex-col bg-white">
            <div className="max-w-md w-full">
              <h2 className="text-3xl font-bold mb-2 text-zinc-900">Confirm It’s You</h2>
              <p className="text-zinc-500 mb-8">
                Enter the 5-digit verification code sent to{" "}
                <span className="font-semibold text-zinc-700">{storedEmail || "your email"}</span>
              </p>

              <label className="block text-left font-medium mb-3 text-zinc-800 text-base">
                Enter Verification Code
              </label>
              
              <div className="flex gap-3 mb-6" onPaste={handlePaste}>
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    inputMode="numeric"
                    type="text"
                    maxLength="1"
                    className="w-14 h-16 text-center border border-zinc-300 rounded-xl text-2xl font-bold outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                    value={digit}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={(el) => (inputs.current[idx] = el)}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isVerifying}
                className={`w-full bg-green-700 text-white py-4 rounded-xl font-semibold hover:bg-green-800 transition ${
                  isVerifying ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </button>

              {/* Resend Section */}
              <div className="flex items-center justify-between mt-6 text-sm">
                <span className="text-zinc-500">
                  {time > 0 ? (
                    <>Resend code in <span className="font-semibold text-zinc-700">{time}s</span></>
                  ) : (
                    "Didn't receive code?"
                  )}
                </span>
                
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={time > 0 || isResending}
                  className={`font-semibold ${
                    time > 0 || isResending
                      ? "text-zinc-400 cursor-not-allowed"
                      : "text-green-700 hover:underline cursor-pointer"
                  }`}
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              </div>

              <div className="mt-8 text-center">
                <NavLink to="/resetpassword" className="text-sm text-green-700 hover:underline">
                  Change email address
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden md:flex w-5/12 items-center justify-center bg-[url(/images/smilebin.jpg)] relative overflow-hidden bg-cover bg-no-repeat bg-center">
        <div className="absolute top-0 my-14">
          <div className="z-20 flex flex-row items-center gap-4">
            <img
              src="/images/sealLogo.svg"
              alt="Lagos Seal"
              className="h-20 mb-1 p-2"
            />
            <p className="text-white font-medium text-sm uppercase tracking-wide">
              Utilities Service Provider Initiative by
              <br />
              The Lagos State Government
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white px-6 py-4 text-center z-20">
          <p className="text-lg">
            “Experience the power of smart waste management. Sign up now and
            discover a cleaner, greener world”
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg max-w-sm z-50 ${
            notification.type === "success"
              ? "bg-green-100 border border-green-400 text-green-800"
              : "bg-red-100 border border-red-400 text-red-800"
          }`}
          role={notification.type === "error" ? "alert" : "status"}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={clearNotification}
              className={`ml-4 text-xl font-semibold leading-none ${
                notification.type === "success"
                  ? "text-green-800 hover:text-green-900"
                  : "text-red-800 hover:text-red-900"
              } focus:outline-none`}
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
