"use client";

import { useDispatch } from "react-redux";
import { openModal } from "@/store/modalSlice";
import Image from "next/image";

export default function NavBar() {
  const dispatch = useDispatch();

  return (
    <nav className="nav">
      <div className="nav__wrapper">
        <figure className="nav__img--mask">
          <Image
            className="nav__img"
            src="/assets/logo.png"
            alt="logo"
            width={200}
            height={50}
          />
        </figure>
        <ul className="nav__list--wrapper">
          <li
            className="nav__list nav__list--login"
            onClick={() => {dispatch(openModal())}}
          >
            Login
          </li>
          <li className="nav__list nav__list--mobile">About</li>
          <li className="nav__list nav__list--mobile">Contact</li>
          <li className="nav__list nav__list--mobile">Help</li>
        </ul>
        
      </div>
    </nav>
  );
}