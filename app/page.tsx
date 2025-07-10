"use client";

import { user } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { useSession } = authClient;
  return (
    <main>
      {!useSession().data?.user ? (
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => authClient.signUp.email({ email, name, password })}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div>
          {useSession().data?.user?.email}
          {useSession().data?.user?.name}
        </div>
      )}
    </main>
  );
}
