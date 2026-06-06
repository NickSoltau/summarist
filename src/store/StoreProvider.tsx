"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { setUser, clearUser, setLoading } from "./userSlice";
import { useDispatch } from "react-redux";

function AuthListener({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email, isLoading:false }));
      } else {
        dispatch(clearUser());
      }
      dispatch(setLoading(false))
    });
    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthListener>{children}</AuthListener>
    </Provider>
  );
}