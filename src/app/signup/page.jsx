// ...existing code...
import React, { Suspense } from 'react';
import SignupClient from './SignupClient';

export default function Page() {
  return (
    <main>
      <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
        <SignupClient />
      </Suspense>
    </main>
  );
}
// ...existing code...