'use client';

import React from 'react';

const images = [
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/gallery-5.jpg',
  '/images/gallery-6.jpg',
];

export default function MovingGallery() {
  return (
    <div className="w-full overflow-hidden bg-white dark:bg-gray-900 py-6 ">
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
