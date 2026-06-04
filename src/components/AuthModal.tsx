"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { closeModal } from "@/store/modalSlice";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { AiOutlineClose } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Three possible views inside the modal
type ModalView = "login" | "register" | "forgot";

export default function AuthModal() {
  const dispatch = useDispatch();
  const router= useRouter();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  const [view, setView] = useState<ModalView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setError("");
    setMessage("");
  };

  const switchView = (v: ModalView) => {
    resetFields();
    setView(v);
  };

  // --- AUTH FUNCTIONS ---

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      dispatch(closeModal());
      router.push("/for-you");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") setError("Email already in use.");
      else if (err.code === "auth/invalid-email") setError("Invalid email address.");
      else if (err.code === "auth/weak-password") setError("Password must be at least 6 characters.");
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      
    }
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(closeModal());
      router.push("/for-you");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") setError("No account found with this email.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password.");
      else if (err.code === "auth/invalid-email") setError("Invalid email address.");
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, "guest@summarist.com", "guest123");
      dispatch(closeModal());
      router.push("/for-you");
    } catch {
      setError("Guest login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      dispatch(closeModal());
      router.push("/for-you");
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") setError("No account found with this email.");
      else if (err.code === "auth/invalid-email") setError("Invalid email address.");
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---

  return (
    // Backdrop — clicking outside closes the modal
    <div className="modal__backdrop" onClick={() => dispatch(closeModal())}>
      <div className="modal__container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close button */}
        <button className="modal__close" onClick={() => dispatch(closeModal())}>
          <AiOutlineClose />
        </button>

        <h2 className="modal__title">
          {view === "login" && "Log in to Summarist"}
          {view === "register" && "Sign up to Summarist"}
          {view === "forgot" && "Reset your password"}
        </h2>

        {/* Guest login — only on login view */}
        {view === "login" && (
          <button className="modal__btn modal__btn--guest" onClick={handleGuestLogin} disabled={loading}>
            <FaUser />
            Login as a Guest
          </button>
        )}

        <div className="modal__separator"><span>or</span></div>

        {/* Google login */}
        {view !== "forgot" && (
          <button className="modal__btn modal__btn--google" onClick={handleGoogleLogin} disabled={loading}>
            <FcGoogle />
            {view === "login" ? "Login with Google" : "Sign up with Google"}
          </button>
        )}

        {view !== "forgot" && <div className="modal__separator"><span>or</span></div>}

        {/* Email + Password fields */}
        <input
          className="modal__input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {view !== "forgot" && (
          <input
            className="modal__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        {/* Error and success messages */}
        {error && <p className="modal__error">{error}</p>}
        {message && <p className="modal__success">{message}</p>}

        {/* Main action button */}
        <button
          className="modal__btn modal__btn--primary"
          disabled={loading}
          onClick={
            view === "login"
              ? handleLogin
              : view === "register"
              ? handleRegister
              : handleForgotPassword
          }
        >
          {loading ? "Please wait..." : view === "login" ? "Login" : view === "register" ? "Sign Up" : "Send Reset Email"}
        </button>

        {/* Footer links */}
        <div className="modal__footer">
          {view === "login" && (
            <>
              <button className="modal__link" onClick={() => switchView("forgot")}>
                Forgot your password?
              </button>
              <button className="modal__link" onClick={() => switchView("register")}>
                Don't have an account?
              </button>
            </>
          )}
          {view === "register" && (
            <button className="modal__link" onClick={() => switchView("login")}>
              Already have an account?
            </button>
          )}
          {view === "forgot" && (
            <button className="modal__link" onClick={() => switchView("login")}>
              Back to login
            </button>
          )}
        </div>

      </div>
    </div>
  );
}