import React, { useState, useEffect } from "react";
import api from "../api/apiConfig.js";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import useTokenStore from "../stores/tokenStore.js";

export default function EnterNewPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const storedUserType = localStorage.getItem("userType") || "SuperAdmin";
  const clearBearerToken = useTokenStore((state) => state.clearBearerToken);

  const clearNotification = () => setNotification(null);

  useEffect(() => {
    if (location.state?.notification) {
      setNotification(location.state.notification);
    }
  }, [location.state]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(clearNotification, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !cPassword) {
      setNotification({ type: "error", message: "Please fill in both password fields." });
      return;
    }

    if (password.length < 6) {
      setNotification({ type: "error", message: "Password must be at least 6 characters long." });
      return;
    }

    if (password !== cPassword) {
      setNotification({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);

    let url = "/lawma/auth/passwords/reset/complete";
    let requestBody = {
      password,
      confirmPassword: cPassword,
    };

    if (storedUserType === "PSPs" || storedUserType === "PSPsTeamMembers") {
      url = "/psps/auth/reset-password";
    } else if (storedUserType === "resident") {
      url = "/residents/reset-password";
    } else if (storedUserType === "corporate") {
      url = "/corporate/reset-password";
    } else if (storedUserType === "agent") {
      url = "/agents/password-reset/complete";
    } else if (storedUserType === "facilitymgr") {
      url = "/facility-managers/account/password/complete";
      requestBody = {
        newPassword: password,
        confirmPassword: cPassword,
      };
    }

    try {
      const response = await api.post(url, requestBody);
      const { data } = response;

      const isSuccess =
        response.status === 200 ||
        response.status === 201 ||
        data?.success === true ||
        data?.succeeded === true;

      if (isSuccess) {
        const successMsg =
          data?.data?.message ||
          data?.message ||
          "Password changed successfully! You can now log in.";

        setNotification({
          type: "success",
          message: successMsg,
        });

        if (typeof clearBearerToken === "function") {
          clearBearerToken();
        } else {
          localStorage.removeItem("bearerToken");
        }

        setTimeout(() => {
          navigate("/", {
            state: {
              notification: {
                type: "success",
                message: successMsg,
              },
            },
          });
        }, 1500);
      } else {
        setIsSubmitting(false);
        setNotification({
          type: "error",
          message: data?.message || "Failed to update password. Please try again.",
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error changing password:", error);
      const errData = error?.response?.data;
      const errMsg = Array.isArray(errData?.message)
        ? errData.message.join(", ")
        : errData?.message || error?.message || "Failed to update password.";
      setNotification({ type: "error", message: errMsg });
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
              <h2 className="text-3xl font-bold mb-2 text-zinc-900">Create New Password</h2>
              <p className="text-zinc-500 mb-8">
                Your new password must be different from previously used passwords
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-zinc-300 rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.477 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={cPassword}
                      onChange={(e) => setCPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-zinc-300 rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.477 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-green-700 text-white py-4 rounded-xl font-semibold hover:bg-green-800 transition ${
                    isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Updating Password..." : "Change Password"}
                </button>

                <div className="text-center pt-2">
                  <NavLink to="/" className="text-sm text-green-700 hover:underline">
                    Back to Login
                  </NavLink>
                </div>
              </form>
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
