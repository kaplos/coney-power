'use client';
import { ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Hero() {
  const { data: session } = useSession({ required: false });
  const hasActiveSubscription = session?.user?.subscriptionStatus === 'Active';

  return (
    <section id="home" className="flex justify-center py-8 px-4">
      <div
        className="relative w-full max-w-3xl rounded-lg overflow-hidden shadow-lg"
        style={{
          backgroundImage: "url('/browserIcon.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          aspectRatio: '16/9',
          minHeight: '220px'
        }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-2  sm:p-8">
          <h1 className="font-bold text-gray-100 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            Welcome To Coney Power
          </h1>

          <p className="text-gray-200 leading-tight max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl">
            We offer a variety of activities that will make you a pro!
          </p>

          <p className="text-gray-200 leading-tight max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl">
            Art, Dance, Fitness and more...
          </p>

          <p className="text-gray-200 leading-tight max-w-3xl text-xs sm:text-sm md:text-base lg:text-lg">
            Looking forward to enhancing coordination, learning respect, building confidence, improving focus, and learning the beauty of the arts.
          </p>

          <a
            className="inline-flex items-center gap-2 bg-[#C5a572] hover:bg-[#a88a4a] text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 mt-3"
            href={hasActiveSubscription ? '#schedule' : '#membership'}
          >
            {hasActiveSubscription ? 'Book A Class' : 'Sign Up'}
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>

  );
};

//  <div className="container mx-auto px-4 ">
// <div className="w-full py-16 px-4">
// <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">

//   {/* Left: Background Image + Text Overlay */}
//   <div
//     className=" relative w-full md:w-1/2 flex items-center justify-center text-white rounded-xl overflow-hidden"
//     style={{
//       backgroundImage: `url('https://api.candminc.store/image?path=belt/sf-belt-196/original/sf-belt-196-0.jpg')`,
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//     }}
//   >
//     <div className="bg-black/50 w-full h-full absolute top-0 left-0" />
//     <div className="relative z-10 p-8 text-center md:text-left space-y-4">
//       <h1 className="text-4xl md:text-5xl font-bold leading-tight">
//         Train Hard. <span className="text-blue-400">Stay Strong.</span>
//       </h1>
//       <p className="text-lg text-gray-200">
//         Classes for every body, every day.
//       </p>
//       <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2">
//         Join Now
//         <ArrowRight size={20} />
//       </button>
//     </div>
//   </div>

//   {/* Right: Placeholder or Optional Image */}
//   <div className="w-full md:w-1/2 flex items-center justify-center">
//     <div className="aspect-video w-full max-w-md bg-gray-100 rounded-xl shadow-inner flex items-center justify-center">
//       <p className="text-gray-400">Optional content or image here</p>
//     </div>
//   </div>
// </div>
// </div>
// </div>