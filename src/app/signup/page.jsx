'use client';

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
const { useSession } = require("next-auth/react");
import {useSearchParams} from 'next/navigation';
function validatePassword(password) {
  const minLength = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasDigit && hasSpecial;
}


export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signup"); // "signup" or "signin"
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
const { data: session } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (session?.user?.email && searchParams.get('checkout') === '1') {
      // Optionally: remove the query params after use
      const item = searchParams.get('item');
      const metaData = searchParams.get('metaData');
      const category = searchParams.get('category');
      // Call your checkout logic here, e.g.:
      fetch(`/api/checkout?item=${item}&metaData=${metaData}&category=${category}`, {
        method: 'POST',
      })
        .then(res => res.json())
        .then(data => {
          window.location.href = data.url;
        });
    }
  }, [session, searchParams]);

  
  // Enhanced handleChange for instant password validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Instant password checks for signup step 2
    if (step === 2 && mode === "signup") {
      let msg = "";
      if ((name === "password" || name === "confirmPassword")) {
        const password = name === "password" ? value : form.password;
        const confirmPassword = name === "confirmPassword" ? value : form.confirmPassword;

        if (password && !validatePassword(password)) {
          msg = "Password must be at least 8 characters, include a digit and a special character.";
        } else if (password && confirmPassword && password !== confirmPassword) {
          msg = "Passwords do not match.";
        }
      }
      setError(msg);
    } else {
      setError("");
    }
  };


  // Step 1 for signup: check if user exists, for signin: check if user exists and go to password
  const handleEmailNext = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || (mode === "signup" && !form.name)) {
      setError(mode === "signup" ? "Please enter your name and email." : "Please enter your email.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/checkifuserexists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    const data = await res.json();
    setLoading(false);

    if (mode === "signup") {
      if (res.ok && data.exists) {
        setError("An account with this email already exists. Please sign in.");
        return;
      }
      setStep(2);
    } else {
      if (res.ok && !data.exists) {
        setError("No account found with this email. Please sign up.");
        return;
      }
      setStep(2);
    }
  };

  // Signup submit
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password, name: form.name }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(true);

      // Instantly sign in after successful signup
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      // signIn can return undefined if a redirect occurred — handle that safely
      if (typeof signInRes === "undefined") {
        // NextAuth performed a redirect; nothing else to do here
        return;
      }

      if (signInRes?.ok) {
        router.push("/"); // redirect to home or your desired page
      } else {
        setError(signInRes?.error || "Account created, but automatic sign in failed. Please sign in manually.");
      }
    } catch (err) {
      setLoading(false);
      setError("Unexpected error. Try again.");
      console.error("handleSignup error:", err);
    }
  };
  // ...existing code...

  // Signin submit
  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const callbackUrl = searchParams.get('callbackUrl') || (searchParams.get('checkout') === '1'
      ? `/signup?${searchParams.toString()}`
      : '/');

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
        callbackUrl,
      });

      setLoading(false);
      console.log('signIn response', res);

      // signIn may return undefined if NextAuth performed a full redirect
      if (typeof res === "undefined") {
        return;
      }

      if (res?.error) {
        setError(res.error || "Invalid email or password.");
        return;
      }

      // success -> redirect to returned url or default
      const dest = res?.url || callbackUrl || '/';
      setSuccess(true);
      router.push(dest);
    } catch (err) {
      setLoading(false);
      setError("Unexpected error during sign in.");
      console.error("handleSignin error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#1a1a1a] to-[#222] px-4">
      <div className="w-full max-w-md bg-black border border-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-white tracking-tight">
          {mode === "signup" ? "Create your account" : "Sign in to your account"}
        </h1>
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-white rounded-md shadow-sm text-base font-semibold bg-[#C5A572] text-white mb-6"
        >
          {/* <svg className="w-5 h-5" viewBox="0 0 48 48"> ... </svg> */}
          {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
        </button>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>
        {step === 1 && (
          <form onSubmit={handleEmailNext} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  className="p-2 mt-1 block w-full rounded-md border border-white bg-black text-white shadow-sm focus:ring-[#C5A572] focus:border-[#C5A572] sm:text-sm carret-white"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className=" p-2 mt-1 block w-full rounded-md border border-white bg-black text-white shadow-sm focus:ring-[#C5A572] focus:border-[#C5A572] sm:text-sm carret-white"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-[#C5A572] hover:bg-[#b89c5e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A572] transition"
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        )}
        {step === 2 && mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className="p-2 mt-1 block w-full rounded-md border border-white bg-black text-white shadow-sm focus:ring-[#C5A572] focus:border-[#C5A572] sm:text-sm carret-white"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="p-2 mt-1 block w-full rounded-md border border-white bg-black text-white shadow-sm focus:ring-[#C5A572] focus:border-[#C5A572] sm:text-sm carret-white"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm">Account created! Redirecting </div>
            )}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {setStep(1);setLoading(false);}}
                className="text-sm text-gray-400 hover:text-white underline"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || error }
                className="ml-2 flex justify-center py-2 px-4 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-[#C5A572] hover:bg-[#b89c5e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A572] transition"
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </div>
          </form>
        )}
        {step === 2 && mode === "signin" && (
          <form onSubmit={handleSignin} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="p-2 mt-1 block w-full rounded-md border border-white bg-black text-white shadow-sm focus:ring-[#C5A572] focus:border-[#C5A572] sm:text-sm carret-white"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm">Signed in! Redirecting…</div>
            )}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-400 hover:text-white underline"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="ml-2 flex justify-center py-2 px-4 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-[#C5A572] hover:bg-[#b89c5e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A572] transition"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        )}
        <div className="mt-8 text-center text-sm text-gray-400">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                className="text-[#C5A572] hover:underline cursor-pointer"
                onClick={() => {
                  setMode("signin");
                  setStep(1);
                  setForm({ ...form, password: "", confirmPassword: "", name: "" });
                  setError("");
                  setSuccess(false);
                }}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                className="text-[#C5A572] hover:underline cursor-pointer"
                onClick={() => {
                  setMode("signup");
                  setStep(1);
                  setForm({ ...form, password: "", confirmPassword: "" });
                  setError("");
                  setSuccess(false);
                }}
              >
                Sign up
              </button>
            </>
          )}
        </div>
        {/* <div className="mt-8 text-center text-sm text-gray-400">
         
          <a className='underline cursor-pointer'>Forgot Password</a>
        </div> */}

      </div>
    </div>
  );
}