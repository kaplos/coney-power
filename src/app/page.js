
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Schedule from '@/components/Schedule';
import Membership from '@/components/Membership';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

export default function Home(){


return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />

        <Schedule />
        <Schedule />
        <Schedule />
        <Membership />
        {/* <hr className="border-t border-gray-800 space-x-6"/> */}
        {/* <Gallery /> */}
      </main>
      <Footer />
    </div>
  );
};

