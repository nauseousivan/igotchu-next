import Link from "next/link";
import { Icon } from "./icons";

export default function Header() {
  return (
    <header className="topbar sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center brand-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ig.png" alt="iGotchu" className="h-8 w-auto" />
        </Link>
        <Link href="/manual" className="icon-btn round" title="Help">
          <Icon name="help" size={18} />
        </Link>
      </div>
    </header>
  );
}
