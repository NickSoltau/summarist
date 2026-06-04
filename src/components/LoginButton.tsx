"use client";

import { useDispatch } from "react-redux";
import { openModal } from "@/store/modalSlice";

export default function LoginButton() {
  const dispatch = useDispatch();

  return (
    <button
      className="btn home__cta--btn"
      onClick={() => 
        {dispatch(openModal())}}
    >
      Login
    </button>
  );
}