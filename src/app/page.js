
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Schedule from '@/components/Schedule';
import Membership from '@/components/Membership';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />

        <Schedule />
        <Membership />
        {/* <hr className="border-t border-gray-800 space-x-6"/> */}
        <Gallery />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
