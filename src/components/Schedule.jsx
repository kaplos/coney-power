'use client';
import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO, getHours } from 'date-fns';
import ScheduleCard from './ScheduleCard';
// Replace with your real fetch from Supabase or API
const fetchClasses = async () => {
  try {
    const res = await fetch('/api/airtable');
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    return data
  }catch (error) {
    console.error('Failed to fetch classes:', error);
    return [];
  }
};

export default function WeeklySchedule() {
  const [classes, setClasses] = useState([]);
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchClasses();
      setClasses(data);
    };

    // Calculate start of current week (Sunday)
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDates(days);

    load();
  }, []);

  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

  return (
    <section id="schedule" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
      <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-white">
            Weekly Class Schedule
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-white">
            Plan your perfect workout week with our diverse class offerings.
          </p>
        </div>

        {/* {loading && <p className="text-center text-gray-500">Loading schedule...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>} */}


    <div className="overflow-x-auto shadow-xl rounded-lg">
            <table className="w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
            <tr>
          <th className="py-4 px-6  text-left font-semibold">Time</th>
          {weekDates.map((day, i) => (
              <th key={i} className="border px-2 py-1  text-center font-semibold min-w-32">
                {format(day, 'EEE dd')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour, timeIndex) => (
            <tr key={hour} className={timeIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-4 px-6 font-semibold text-blue-600 border-r border-gray-200">
                {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
              </td>
              {weekDates.map((day, i) => {
                const matchingClass = classes.find((cls) => {
                  const start = parseISO(cls['Class Time']);
                  return (
                    isSameDay(start, day) &&
                    getHours(start) === hour
                  );
                });

                return (
                  <td key={i} className="py-4 px-6 text-center border-r border-gray-200 last:border-r-0">
                    {matchingClass ? (
                      <ScheduleCard classInfo={matchingClass} />
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
      <p className="text-center text-gray-500 text-sm mt-6 md:hidden">
          Swipe left or right to view all days
        </p>
    
    </div>
    </section>
  );
}
