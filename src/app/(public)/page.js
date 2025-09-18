import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeContent from "@/components/HomeContent";

export default async function Page() {
  const session = await getServerSession(authOptions);

  return <HomeContent session={session} />;
}
//TODO add the checkin backend page for the qr code
//TODO add a check on the checkin page to make sure the waiver is filled out
//FIXME change auth provider
//TODO add on success page the qr info