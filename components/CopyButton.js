"use client";

import { Icon } from "./icons";
import { toast } from "@/lib/toast";

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy") ? resolve() : reject();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(ta);
    }
  });
}

export default function CopyButton({ text, message = "Copied to clipboard", className = "btn-outline", icon = "copy", iconSize = 15, children }) {
  const handleClick = () => {
    copyText(text).then(
      () => toast(message),
      () => toast("Could not copy — copy it manually")
    );
  };
  return (
    <button type="button" onClick={handleClick} className={className}>
      <Icon name={icon} size={iconSize} />
      {children}
    </button>
  );
}
