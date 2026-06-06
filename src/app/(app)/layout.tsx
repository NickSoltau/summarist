"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { AiOutlineMenu } from "react-icons/ai";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="with__sidebar">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar__overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="with__sidebar--content">
        <div className="search__bar--wrapper">
          <SearchBar />
          <button
            className="hamburger__btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <AiOutlineMenu />
          </button>
        </div>
        <div className="page__content">
          {children}
        </div>
      </div>
    </div>
  );
}