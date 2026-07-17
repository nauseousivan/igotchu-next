"use client";

import { useEffect, useRef, useState } from "react";

let nextId = 1;

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  useEffect(() => {
    function onToast(e) {
      const id = nextId++;
      setToasts((t) => [...t, { id, message: e.detail, hiding: false }]);
      timers.current[id] = setTimeout(() => {
        setToasts((t) => t.map((x) => (x.id === id ? { ...x, hiding: true } : x)));
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 300);
      }, 2600);
    }
    window.addEventListener("ig-toast", onToast);
    return () => window.removeEventListener("ig-toast", onToast);
  }, []);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.hiding ? "hide" : ""}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
