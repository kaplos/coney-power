'use client';

import React, { useEffect,useState} from 'react';

const images = [
  '/images/IMG_2505.JPG',
  '/images/IMG_2508.jpeg',
  '/images/IMG_2504.PNG',
  '/images/IMG_2513.jpg',
  '/images/IMG_2507.jpg',
];

export default function MovingGallery({ speedSeconds = 30 }) {

  return (
    <div id='gallery' className="w-full overflow-hidden">
      {/* One track with duplicated images for a seamless loop */}
      <div className="marquee" style={{ animationDuration: `${speedSeconds}s` }}>
        {[...images, ...images].map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="w-72 h-72 object-cover mx-2 rounded-lg shadow"
            draggable={false}
          />
        ))}
      </div>

      <style jsx>{`
        .marquee {
          display: flex;
          width: max-content;              /* shrink to content width */
          will-change: transform;
          animation-name: marquee-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          /* Move exactly half the track width (because we duplicated the content).
             When it loops back to 0%, the second half matches the first — seamless. */
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
