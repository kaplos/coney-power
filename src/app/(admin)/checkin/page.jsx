import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { redirect } from "next/navigation";
import CheckIn from "@/components/CheckIn"; // your actual check-in UI

export default async function Page() {
  const session = await getServerSession(authOptions);
  // Replace with your admin check logic
  const isAdmin = session?.user?.id === "recLeOkKQFRESxVb1" || session?.user?.id === "recg9mX4bYkq1v0b" || session?.user?.id === "recB80BvlXty2DlOu";
  console.log("isAdmin", isAdmin);
    if (!isAdmin) {
      redirect("/signup"); // Instantly redirect to main page
  }

  return <CheckIn />;
}