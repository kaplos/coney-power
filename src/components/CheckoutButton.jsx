'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useSession, signIn, signOut } from "next-auth/react";
import { useMessage } from './MessageProvider';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE);

export default function CheckoutButton({ item = 'Basic',popular = false ,metaData = '',disabled =false ,type='class'}) {
  const { data: session } = useSession();
  const {showMessage} = useMessage();
  const hasActiveSubscription = session?.user?.subscriptionStatus === 'Active';
const handleCheckout = async () => {
    const res = await fetch(`/api/checkout?item=${item}&metaData=${metaData}`, {
      method: 'POST',
    });
    const data = await res.json();
    console.log(data)
    window.location.href = data.url; // redirect to Stripe Checkout
  };
const handleBooking = async () => {
  await fetch('/api/booking', {
    method: 'POST',
    body: JSON.stringify({ userId: session?.user?.userId , class: metaData }),
  }).then(res => res.json())
.then(data => {
    console.log(data);
    showMessage(data.Message, data.type);
    // alert('Class booked successfully!');
  })
  .catch(err => {
    console.error('Error:', err);
    showMessage(err.message, 'error');
    // alert('An error occurred while booking the class.');
  })
}
  return (
   <button
    onClick={ !hasActiveSubscription && type === 'class'  || hasActiveSubscription? handleBooking : handleCheckout}
    disabled={disabled} // <-- Add this line
    className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center
      ${
        disabled
          ? 'bg-gray-300 cursor-not-allowed text-gray-500'
          : popular
          ? 'bg-[#C5A572] hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
          : 'bg-[#C5A572] hover:bg-gray-200 text-gray-900 focus:ring-4 focus:ring-gray-300'
      }`}
  >
    {hasActiveSubscription || type === 'class' ? "Book Class" : "Get started"}
  </button>

  );
}
