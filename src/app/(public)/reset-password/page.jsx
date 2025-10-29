"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/password-reset/confim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setSuccess(true);
    //   setMessage("Password reset! You can now log in.");
    } else {
      setMessage(data.error || "Error resetting password.");
    }
  }

  if (!email || !token) return <div className="text-center mt-10 text-red-600">Invalid reset link.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#1a1a1a] to-[#222] px-4">
      <form onSubmit={handleSubmit} className="bg-black border border-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-white rounded bg-black text-white"
          disabled={success}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-white rounded bg-black text-white"
          disabled={success}
        />
        {!success && (
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#C5a572] text-white rounded"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        )}
        {message && <div className="mt-4 text-center text-white">{message}</div>}
        {success && (
          <div className="mt-4 text-center text-white">
            Password reset! You can now{" "}
            <Link
              href="/signup"
              className="inline-block underline text-[#C5a572] font-semibold hover:text-[#b89c5e] transition"
            >
              Log in
            </Link>
            .
          </div>
        )}
      </form>
    </div>
  );
}