"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const HOLD_MS = 2600;
const FADE_MS = 600;

export default function SplashScreen() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard mount-detection pattern, reads sessionStorage which doesn't exist during SSR
    setMounted(true);
    if (pathname !== "/") return;
    if (sessionStorage.getItem("igSplash")) return;
    sessionStorage.setItem("igSplash", "1");
    setVisible(true);
    const fadeTimer = setTimeout(() => setFading(true), HOLD_MS);
    const removeTimer = setTimeout(() => setVisible(false), HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [pathname]);

  if (!mounted || !visible || pathname !== "/") return null;

  return (
    <div className="splash" style={{ opacity: fading ? 0 : 1 }}>
      <div className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ig.png" alt="iGotchu" className="splash-logo-img" />
        <div className="splash-track">
          <div className="splash-fill" />
          <div className="splash-cat-wrap">
            <span className="splash-cat">🐱</span>
          </div>
        </div>
      </div>
    </div>
  );
}
