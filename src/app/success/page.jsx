
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link'

export default function Success({}) {
     
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

    return (
    <div className=" bg-black min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold  text-gray-900 mb-2">Welcome !</h1>
          <p className="text-gray-600">
            Thank you for joining our fitness community. We're excited to help you achieve your fitness goals!
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {/* <li>• Check your email for welcome instructions</li>
              <li>• Download our mobile app</li>
              <li>• Book your first class</li> */}
              <li>• Meet our trainers</li>
            </ul>
          </div>
          
          <Link 
            href="/" 
            className="inline-block w-full bg-primary text-[#C5a572] font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

