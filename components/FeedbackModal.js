"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { toast } from "@/lib/toast";

export default function FeedbackModal({ open, onClose }) {
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    try {
      const res = await fetch("/api/feedback", { method: "POST", body: new FormData(form) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Could not send.");
      form.reset();
      onClose();
      toast("Sent. Salamat sa feedback!");
    } catch (err) {
      toast(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card relative p-7 max-w-sm w-full pop-in" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="modal-x icon-btn" aria-label="Close">
          <Icon name="x" size={16} />
        </button>
        <h2 className="text-lg font-bold tracking-tight">Feedback</h2>
        <p className="text-sm text-[#6B6455] font-medium mt-1 mb-4">
          What should be improved? Or just say hi. Goes straight to the dev.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="text" name="name" maxLength={100} placeholder="Name (optional)" className="input" />
          <textarea
            name="message"
            rows={4}
            maxLength={1000}
            required
            placeholder="Type it out…"
            className="input resize-none"
          />
          <button type="submit" disabled={sending} className="btn-primary">
            {sending ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
