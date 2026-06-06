"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modalSlice";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { uid, email } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [subscription, setSubscription] = useState<string>("Basic");
  const [subLoading, setSubLoading] = useState(true);

  useEffect(() => {
  if (!uid) return;
  async function fetchSubscription() {
    try {
      const ref = doc(db, "users", uid!);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().subscriptionStatus) {
        setSubscription(snap.data().subscriptionStatus);
      }
    } catch (err) {
      console.error("Failed to fetch subscription", err);
    } finally {
      setSubLoading(false);
    }
  }
  fetchSubscription();
}, [uid]);

  if (!uid) {
    return (
      <div className="settings__page">
        <h1 className="settings__title">Settings</h1>
        <div className="settings__login--wrapper">
          <p className="settings__login--text">Log in to your account to see your details.</p>
          <button className="btn settings__login--btn" onClick={() => dispatch(openModal())}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings__page">
      <h1 className="settings__title">Settings</h1>
      <div className="settings__content">
        <div className="settings__section">
          <h2 className="settings__section--title">Your Subscription plan</h2>
            <p className="settings__section--value">
              {subLoading ? "Loading..." : subscription}
            </p>
            {subscription === "Basic" && (
              <button
                className="btn settings__upgrade--btn"
                onClick={() => router.push("/choose-plan")}
              >
                Upgrade to Premium
              </button>
            )}
        </div>
        <div className="settings__section">
          <h2 className="settings__section--title">Email</h2>
          <p className="settings__section--value">{email}</p>
        </div>
      </div>
    </div>
  );
}