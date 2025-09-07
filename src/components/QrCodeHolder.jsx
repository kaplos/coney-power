'use client';

import { useState, useEffect } from 'react';
import QRCodeClient from './QrCodeClient';
import { ScanQrCode } from 'lucide-react';
export default function QrCodeHolder({ memberId }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        function onKey(e) {
            if (e.key === 'Escape') setOpen(false);
        }
        if (open) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <>
            {/* floating button fixed to viewport bottom-right */}
            <div className="fixed bottom-5 right-5 z-50">
                <button
                    type="button"
                    aria-label="Show QR"
                    onClick={() => setOpen(true)}
                    className="flex items-center justify-center gap-2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition"
                >
                    {/* QR icon */}
                   <ScanQrCode className="w-6 h-6 text-black" />
                    <span className="sr-only">Show QR</span>
                </button>
            </div>

            {/* modal */}
            {open && (
                <div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg text-black text-center font-medium">Member QR</h3>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="text-sm  text-black"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex justify-center mb-4">
                            <QRCodeClient text={memberId || 'No Member ID'} />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 bg-[#C5A572] text-white rounded hover:bg-goldHover"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
