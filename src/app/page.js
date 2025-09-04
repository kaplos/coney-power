import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeContent from "@/components/HomeContent";

export default async function Page() {
  const session = await getServerSession(authOptions);

  return <HomeContent session={session} />;
}