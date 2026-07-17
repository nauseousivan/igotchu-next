"use client";

import { useState } from "react";

export default function CodeInput({ name, defaultValue = "", className = "" }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={(e) => setValue(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
      placeholder="A9K2XQ"
      maxLength={6}
      autoFocus
      className={className}
    />
  );
}
