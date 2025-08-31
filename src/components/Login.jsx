"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  return (
    <button
      onClick={() => (session ? signOut() : signIn())}
      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm px-2 py-1"
    >
      {session ? "Sign Out" : "LogIn / Sign Up"}
    </button>
  );
}
