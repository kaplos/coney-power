'use client';
import { SessionProvider, useSession } from "next-auth/react";
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Schedule from '@/components/Schedule';
import Membership from '@/components/Membership';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

export default function HomeContent({ session }) {
  return (
    <SessionProvider session={session}>
      <Home />
    </SessionProvider>
  );
}

function Home() {
  const { data: session, status } = useSession();
  const hasActiveSubscription = session?.user?.subscriptionStatus === 'Active';

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero />
        <Gallery />
        <Schedule />
        {!hasActiveSubscription && <Membership />}
      </main>
      <Footer />
    </div>
  );
}