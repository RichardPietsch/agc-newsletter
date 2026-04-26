"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("office@anglogermanclub.de");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mx-auto mt-16 max-w-md space-y-4 rounded-xl bg-white p-6 shadow"
      onSubmit={async (e) => {
        e.preventDefault();
        const result = await signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: "/dashboard",
        });

        if (result?.error) {
          setError("Invalid credentials.");
        }
      }}
    >
      <h1 className="text-2xl font-semibold text-agc-navy">Club Office Login</h1>
      <p className="text-sm text-slate-600">Secure access for newsletter preparation.</p>
      <label className="block text-sm">
        Email
        <input className="mt-1 w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="block text-sm">
        Password
        <input
          type="password"
          className="mt-1 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="w-full bg-agc-burgundy text-white">
        Sign in
      </button>
    </form>
  );
}
