"use client";

import { useRef, useState } from "react";
import { Icon } from "./icons";
import { toast } from "@/lib/toast";

const TAUNTS = ["u thought.", "the QR is right there bestie", "ayaw bff?", "k."];

export default function CoffeeModal({ open, onClose }) {
  const [pos, setPos] = useState(null); // { left, top } or null (default corner)
  const [taunt, setTaunt] = useState("");
  const attempts = useRef(0);
  const cardRef = useRef(null);
  const xRef = useRef(null);

  if (!open) return null;

  const handleXClick = () => {
    if (attempts.current < 4) {
      const card = cardRef.current;
      const btn = xRef.current;
      const maxX = card.clientWidth - btn.offsetWidth - 16;
      const maxY = card.clientHeight - btn.offsetHeight - 16;
      // eslint-disable-next-line react-hooks/purity -- click handler, not render; Math.random here is fine
      setPos({ left: 8 + Math.random() * maxX, top: 8 + Math.random() * maxY });
      setTaunt(TAUNTS[attempts.current]);
      attempts.current++;
    } else {
      toast("joke lang po, libre naman lahat here. salamat bff");
      handleClose();
    }
  };

  const handleClose = () => {
    attempts.current = 0;
    setPos(null);
    setTaunt("");
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        ref={cardRef}
        className="card relative p-8 max-w-sm w-full text-center pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={xRef}
          type="button"
          onClick={handleXClick}
          className="modal-x icon-btn"
          aria-label="Close"
          style={pos ? { left: pos.left, top: pos.top, right: "auto" } : undefined}
        >
          <Icon name="x" size={16} />
        </button>
        <div className="w-12 h-12 rounded-xl bg-[#FFD644] border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] text-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
          <Icon name="coffee" size={22} />
        </div>
        <h2 className="text-xl font-bold tracking-tight">online li is mos hehe</h2>
        <p className="text-sm text-[#6B6455] font-medium mt-1 mb-5">libre mag-download, pero ang kape ko hinde</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gcash-qr.png"
          alt="QR"
          className="w-[220px] h-[220px] object-contain mx-auto rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] bg-white"
        />
        <p className="text-xs font-bold text-[#a05a2c] mt-4 h-4">{taunt}</p>
      </div>
    </div>
  );
}
