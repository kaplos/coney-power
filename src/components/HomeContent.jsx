'use client';
import { SessionProvider, useSession } from "next-auth/react";
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Schedule from '@/components/Schedule';
import Membership from '@/components/Membership';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import { MessageProvider } from "./MessageProvider";
import QrCodeHolder from "./QrCodeHolder";

export default function HomeContent({ session }) {
  return (
    <MessageProvider>
      <SessionProvider session={session}>
         <div className="min-h-screen bg-black">
          <QrCodeHolder memberId={session?.user?.memberId} />
          <Home />
        </div>
      </SessionProvider>
    </MessageProvider>
  );
}

function Home() {
  const { data: session, status } = useSession();
  const hasActiveSubscription = session?.user?.subscriptionStatus === 'Active';

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
      <main>
        <Hero />
        <Gallery />
        <Schedule />
        {!hasActiveSubscription && <Membership />}
      </main>
  );
}