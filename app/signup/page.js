"use client";
// app/signup/page.js
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = e.currentTarget;
    const username = form.elements.namedItem("username").value;
    const firstName = form.elements.namedItem("firstName").value;
    const password = form.elements.namedItem("password").value;
    const passphrase = form.elements.namedItem("passphrase").value;
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, firstName, password, passphrase }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("User created successfully. Please login.");
      form.reset();
      // Automatically sign in after successful signup
      await signIn("credentials", { username, password, redirect: true, callbackUrl: "/dashboard" });
    } else {
      setError(data.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Signup</h1>
        <input name="username" type="text" placeholder="Username" className="border p-2 rounded" required />
        <input name="firstName" type="text" placeholder="First Name" className="border p-2 rounded" required />
        <input name="password" type="password" placeholder="Password" className="border p-2 rounded" required />
        <input name="passphrase" type="text" placeholder="Signup Passphrase" className="border p-2 rounded" required />
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">Signup</button>
      </form>
    </div>
  );
}