"use client";

export function toast(message) {
  window.dispatchEvent(new CustomEvent("ig-toast", { detail: message }));
}
