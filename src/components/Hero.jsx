'use client';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className=" py-20 lg:py-32 ">
        <div 
  className="w-full md:w-1/2 flex items-center justify-center text-white overflow-hidden"
  style={{
        backgroundImage: "url('/icon.jpeg')",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

        height: '60vh'
      }}
    >
      <div className="bg-black/50  absolute top-0 left-0" />
    <div className="relative z-10 p-8 text-center md:text-left space-y-4">
      {/* <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Train Hard. <span className="text-blue-400"> Live fully</span>
      </h1> */}
      <p className="text-lg text-gray-200">
        Classes for every body, every day.
      </p>
      <a
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
          href="#membership"
        >
          Sign Up
          <ArrowRight size={20} />
        </a>
    </div>
    </div>
    </section>
  );
};

export default Hero;
 <div className="container mx-auto px-4 ">
<div className="w-full py-16 px-4">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">

  {/* Left: Background Image + Text Overlay */}
  <div
    className=" relative w-full md:w-1/2 flex items-center justify-center text-white rounded-xl overflow-hidden"
    style={{
      backgroundImage: `url('https://api.candminc.store/image?path=belt/sf-belt-196/original/sf-belt-196-0.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="bg-black/50 w-full h-full absolute top-0 left-0" />
    <div className="relative z-10 p-8 text-center md:text-left space-y-4">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Train Hard. <span className="text-blue-400">Stay Strong.</span>
      </h1>
      <p className="text-lg text-gray-200">
        Classes for every body, every day.
      </p>
      <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2">
        Join Now
        <ArrowRight size={20} />
      </button>
    </div>
  </div>

  {/* Right: Placeholder or Optional Image */}
  <div className="w-full md:w-1/2 flex items-center justify-center">
    <div className="aspect-video w-full max-w-md bg-gray-100 rounded-xl shadow-inner flex items-center justify-center">
      <p className="text-gray-400">Optional content or image here</p>
    </div>
  </div>
</div>
</div>
</div>