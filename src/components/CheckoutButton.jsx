'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMessage } from './MessageProvider';
import WaiverModal from './Waiver';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE);

export default function CheckoutButton({
  item = 'Basic',
  popular = false,
  category = '',
  metaData = '',
  disabled = false,
  type = 'class',
  onBooked,
  isBooked = false,
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showMessage } = useMessage();
  const hasActiveSubscription = session?.user?.subscriptionStatus === 'Active';

  const [loading, setLoading] = useState(false);
  const [optimisticBooked, setOptimisticBooked] = useState(Boolean(isBooked));
  const [showWaiver, setShowWaiver] = useState(false);

  // keep booking logic in a separate function so modal can trigger it after accept
  const performBooking = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.userId || session?.user?.id, class: metaData }),
      });

      let data = {};
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        showMessage(data?.Message || data?.message || `Booking failed (${res.status})`, 'error');
        return;
      }

      showMessage(data?.Message || 'Booked successfully', data?.type || 'success');

      // optimistic UI update
      setOptimisticBooked(true);

      if (typeof onBooked === 'function') {
        try { onBooked({ id:metaData }); } catch (e) { /* ignore */ }
      }
    } catch (err) {
      console.error('Booking error:', err);
      showMessage(err?.message || 'An error occurred while booking the class.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    const url = `/signup?checkout=1&item=${encodeURIComponent(item)}&metaData=${encodeURIComponent(metaData)}&category=${encodeURIComponent(category)}`;
    try {
      router.push(url);
    } catch {
      window.location.href = url;
    }
  };

  const handleCheckout = async () => {
    if (loading) return;
    if (!session?.user?.email) {
      goToSignup();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/checkout?item=${encodeURIComponent(item)}&metaData=${encodeURIComponent(metaData)}&category=${encodeURIComponent(category)}`,
        { method: 'POST' }
      );

      let data = {};
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        showMessage(data?.Message || data?.message || 'Checkout failed', 'error');
        return;
      }

      if (data?.url) {
        // redirect to Stripe checkout
        window.location.href = data.url;
        return;
      }

      showMessage(data?.Message || 'Checkout started', 'info');
    } catch (err) {
      console.error('Checkout error:', err);
      showMessage(err?.message || 'Checkout error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (loading) return;
    if (!session?.user?.email) {
      goToSignup();
      return;
    }

    // if waiver is not signed, open modal instead of immediately blocking
    if (session?.user?.waiver === false) {
      setShowWaiver(true);
      return;
    }

    // proceed normally
    await performBooking();
  };

  const onWaiverAccept = async () => {
    setShowWaiver(false);
    // update session to reflect signed waiver
    session.user.waiver = true;
    // try to mark waiver on server (optional endpoint, ignore failures)
    try {
      await fetch('/api/waiver/sign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ signed: true }) });
    } catch (e) {
      console.error('Waiver sign error:', e);
    }

    // perform booking after acceptance
    await performBooking();
  };

  // choose handler: classes trigger booking, other types checkout
  const onClickHandler = ((!hasActiveSubscription && type === 'class') || hasActiveSubscription) ? handleBooking : handleCheckout;

  return (
    <>
      <button
        onClick={onClickHandler}
        disabled={disabled || loading}
        aria-busy={loading}
        className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center gap-2
          ${
            (disabled || loading)
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : isBooked
              ? 'bg-green-500'
              : popular
              ? 'bg-[#C5a572] hover:bg-[#b89c5e]'
              : 'bg-[#C5a572] hover:bg-[#b89c5e] text-white'
          }`}
      >
        {loading && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        )}
        {hasActiveSubscription || type === 'class'
          ? (loading ? 'Booking...' : (isBooked ? 'Booked' : 'Book Class'))
          : (loading ? 'Starting...' : 'Get started')}
      </button>

      <WaiverModal
        open={showWaiver}
        onClose={() => setShowWaiver(false)}
        onAccept={onWaiverAccept}
        waiverText={null}
      />
    </>
  );
}
