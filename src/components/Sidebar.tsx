"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { openModal } from "@/store/modalSlice";
import { clearUser } from "@/store/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";
import { BiCrown } from "react-icons/bi";
import { BsBookmark, BsPerson }  from "react-icons/bs";
import { AiOutlineHome, AiOutlineSearch, AiOutlineBulb, AiOutlineHighlight, AiOutlineLogout } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";

export default function Sidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { uid } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
    router.push("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar__logo--wrapper">
        <img src="/assets/logo.png" alt="logo" className="sidebar__logo" />
      </div>
      <div className="sidebar__items--wrapper">
        <Link href="/for-you" className={`sidebar__item ${pathname === "/for-you" ? "sidebar__item--active" : ""}`}>
          <AiOutlineHome />
          <span>For You</span>
        </Link>
        <Link href="/library" className={`sidebar__item ${pathname === "/library" ? "sidebar__item--active" : ""}`}>
          <BsBookmark />
          <span>My Library</span>
        </Link>
        <div className="sidebar__item sidebar__item--disabled">
          <AiOutlineHighlight />
          <span>Highlights</span>
        </div>
        <div className="sidebar__item sidebar__item--disabled">
          <AiOutlineSearch />
          <span>Search</span>
        </div>
        <Link href="/settings" className={`sidebar__item ${pathname === "/settings" ? "sidebar__item--active" : ""}`}>
          <IoSettingsOutline />
          <span>Settings</span>
        </Link>
        <div className="sidebar__item sidebar__item--disabled">
          <AiOutlineBulb />
          <span>Help & Support</span>
        </div>
        <div
          className="sidebar__item"
          onClick={uid ? handleLogout : () => dispatch(openModal())}
        >
          <AiOutlineLogout />
          <span>{uid ? "Logout" : "Login"}</span>
        </div>
      </div>
    </div>
  );
}