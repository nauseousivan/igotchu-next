"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";
import ToastHost from "./ToastHost";
import CoffeeModal from "./CoffeeModal";
import FeedbackModal from "./FeedbackModal";

export default function Footer() {
  const pathname = usePathname();
  const [openModal, setOpenModal] = useState(null); // 'coffee' | 'feedback' | null

  const isActive = (path) => pathname === path;

  return (
    <>
      <nav className="dock">
        <Link href="/" className={`dock-item ${isActive("/") ? "active" : ""}`}>
          <Icon name="home" size={22} />
          <span>Home</span>
        </Link>
        <Link href="/receive" className={`dock-item ${isActive("/receive") ? "active" : ""}`}>
          <Icon name="hash" size={22} />
          <span>Code</span>
        </Link>
        <Link href="/upload" className="dock-fab" title="Upload" aria-label="Upload">
          <Icon name="plus" size={28} />
        </Link>
        <button type="button" className="dock-item" onClick={() => setOpenModal("feedback")}>
          <Icon name="message" size={22} />
          <span>Chat</span>
        </button>
        <button type="button" className="dock-item coffee" onClick={() => setOpenModal("coffee")}>
          <Icon name="coffee" size={22} />
          <span>Coffee</span>
        </button>
      </nav>

      <footer className="relative z-10 text-center text-xs text-[#9B927E] font-medium pb-24 pt-4">
        made by your ates &amp; kuyas — iGotchu
      </footer>

      <CoffeeModal open={openModal === "coffee"} onClose={() => setOpenModal(null)} />
      <FeedbackModal open={openModal === "feedback"} onClose={() => setOpenModal(null)} />
      <ToastHost />
    </>
  );
}
