'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}
function formatTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function dateKey(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString();
}

export default function BookingsListPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('schedule'); // 'schedule' or 'list'
  const [showPast, setShowPast] = useState(false);

  const fetchBookings = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/bookedclasses');
      const json = await res.json();

      if (res.status === 401 || res.status === 403) {
        // not authorized -> prompt sign in and stop
        signIn(undefined, { callbackUrl: '/bookings' });
        return;
      }

      if (!res.ok) {
        setError(json?.error || 'Could not load bookings');
        setBookings([]);
        return;
      }

      setBookings(json.bookings || []);
    } catch (err) {
      console.error('fetchBookings error', err);
      setError('Unexpected error loading bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchBookings();
  }, [status, fetchBookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings
      .filter((b) => {
        const f = b.fields || {};
        if (statusFilter !== 'all' && String((f.Status || '').toLowerCase()) !== statusFilter) return false;
        if (!q) return true;
        const hay = [
          f['Class'],
          f['Name'],
          f['Description'],
          f.Email,
          f['Member ID'],
        ].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => {
        const ad = new Date(a.fields?.Date || a.fields?.CreatedAt || 0).getTime();
        const bd = new Date(b.fields?.Date || b.fields?.CreatedAt || 0).getTime();
        return ad - bd; // ascending for schedule
      });
  }, [bookings, query, statusFilter]);

  const grouped = useMemo(() => {
    const map = new Map();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    filtered.forEach((b) => {
      const f = b.fields || {};
      const dStr = dateKey(f.Date || f['Created At'] || f.CreatedAt || '');
      const dObj = new Date(f.Date || f['Created At'] || f.CreatedAt || 0);
      const isPast = !Number.isNaN(dObj.getTime()) && dObj < todayStart;
      if (isPast && !showPast) return;
      if (!map.has(dStr)) map.set(dStr, []);
      map.get(dStr).push({ id: b.id, fields: f, dateObj: dObj });
    });

    // Convert to array and sort by date ascending
    return Array.from(map.entries())
      .map(([dateLabel, items]) => ({
        dateLabel,
        items: items.sort((a, b) => a.dateObj - b.dateObj),
      }))
      .sort((a, b) => {
        const da = new Date(a.items[0]?.dateObj || a.dateLabel).getTime();
        const db = new Date(b.items[0]?.dateObj || b.dateLabel).getTime();
        return da - db;
      });
  }, [filtered, showPast]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Checking session…
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black via-[#111] to-[#222] text-white">
      <div className="max-w-6xl mx-auto bg-black/60 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-semibold">Your Schedule</h2>
          <div className="flex gap-2 items-center">
            <div className="inline-flex rounded bg-gray-900 p-1">
              <button
                onClick={() => setViewMode('schedule')}
                className={`px-3 py-1 text-sm ${viewMode === 'schedule' ? 'bg-gray-700 rounded' : 'text-gray-300'}`}
              >
                Schedule
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-gray-700 rounded' : 'text-gray-300'}`}
              >
                List
              </button>
            </div>
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-sm"
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        {status !== 'authenticated' ? (
          <div className="py-8 text-center">
            <p className="text-gray-300 mb-4">You must be signed in to view your schedule.</p>
            <button
              className="bg-[#C5A572] px-4 py-2 rounded"
              onClick={() => signIn(undefined, { callbackUrl: '/bookings' })}
            >
              Sign in
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="search"
                placeholder="Search class, email, member id..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-sm col-span-2"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 bg-gray-900 border border-gray-700 rounded text-sm"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="booked">Booked</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} />
                Show past
              </label>
            </div>

            {error && <div className="text-red-400 mb-4">{error}</div>}

            {viewMode === 'list' ? (
              // compact list view (re-uses earlier table structure but simpler)
              filtered.length === 0 && !loading ? (
                <div className="py-8 text-gray-400">No bookings found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left divide-y divide-gray-700">
                    <thead>
                      <tr className="text-sm text-gray-400">
                        <th className="px-4 py-2">When</th>
                        <th className="px-4 py-2">Class / Description</th>
                        <th className="px-4 py-2">Booked by</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filtered.map((b) => {
                        const f = b.fields || {};
                        return (
                          <tr key={b.id} className="align-top">
                            <td className="px-4 py-3 align-top text-sm text-gray-300 w-48">{formatDate(f.Date || f['Created At'] || f.CreatedAt)}</td>
                            <td className="px-4 py-3">
                              <div className="font-medium">{f['Class'] || f['Name'] || 'Class'}</div>
                              {f['Description'] && <div className="text-sm text-gray-400">{f['Description']}</div>}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">{f.Email || f['Member ID'] || '—'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs ${String((f.Status || '').toLowerCase()) === 'cancelled' ? 'bg-red-700 text-white' : 'bg-green-700 text-white'}`}>
                                {f.Status || 'Booked'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">{b.id}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              // schedule view grouped by date
              grouped.length === 0 && !loading ? (
                <div className="py-8 text-gray-400">No scheduled classes.</div>
              ) : (
                <div className="space-y-6">
                  {grouped.map((group) => (
                    <div key={group.dateLabel} className="bg-gray-900/30 border border-gray-800 rounded p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-lg font-semibold">{group.dateLabel}</div>
                          <div className="text-sm text-gray-400">{group.items.length} class{group.items.length !== 1 ? 'es' : ''}</div>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {group.items.map((it) => {
                          const f = it.fields || {};
                          return (
                            <li key={it.id} className="p-3 bg-black/40 rounded flex items-center justify-between">
                              <div>
                                <div className="text-sm text-gray-300">{formatTime(f.Date || f['Created At'] || f.CreatedAt)}</div>
                                <div className="font-medium">{f['Class'] || f['Name'] || 'Class'}</div>
                                {f['Description'] && <div className="text-sm text-gray-400">{f['Description']}</div>}
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-300">{f.Email || f['Member ID'] || '—'}</div>
                                <div className="mt-2">
                                  <span className={`px-2 py-1 rounded text-xs ${String((f.Status || '').toLowerCase()) === 'cancelled' ? 'bg-red-700 text-white' : 'bg-green-700 text-white'}`}>
                                    {f.Status || 'Booked'}
                                  </span>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}