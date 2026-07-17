"use client";

import { useActionState } from "react";

const initialState = { error: null };

export default function LoginForm({ action }) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state?.error && <p className="text-red-600 text-sm mb-1 font-medium">{state.error}</p>}
      <input type="text" name="username" placeholder="Username" autoComplete="username" className="input" required />
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        className="input"
        required
      />
      <button type="submit" disabled={pending} className="btn-primary mt-1">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
