'use client';

import React from 'react';

const images = [
  '/images/IMG_2505.JPG',
  '/images/IMG_2508.jpeg',
  '/images/IMG_2504.PNG',
  '/images/IMG_2513.jpg',
  '/images/IMG_2507.jpg',
];

export default function MovingGallery() {
  return (
    <div id='gallery' className="w-full overflow-hidden bg-black py-6 ">
      <div className="whitespace-nowrap animate-scroll flex items-center gap-4">
        {[...images, ...images].map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Gym photo ${i + 1}`}
            className="h-40 w-auto rounded-lg object-cover inline-block"
          />
        ))}
      </div>
    </div>
  );
}
