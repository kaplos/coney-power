'use client';

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE);

export default function CheckoutButton({ item = 'Basic',popular = false }) {
//   const handleCheckout = async () => {
//     const stripe = await stripePromise;

//     const res = await fetch(`/api/checkout?item=${item}`, {
//       method: 'POST',
//     });

//     const data = await res.json();

//     if (data.sessionId) {
//       stripe.redirectToCheckout({ sessionId: data.sessionId });
//     } else {
//       alert('Checkout session creation failed.');
//     }
//   };
const handleCheckout = async () => {
    const res = await fetch(`/api/checkout?item=${item}`, {
      method: 'POST',
    });
    const data = await res.json();
    console.log(data)
    window.location.href = data.url; // redirect to Stripe Checkout
  };
  return (
    <button
                onClick={handleCheckout}
                className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                popular
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                    : 'bg-blue-600 hover:bg-gray-200 text-gray-900 focus:ring-4 focus:ring-gray-300'
                }`}
              >
                Get started
              </button>
  );
}
