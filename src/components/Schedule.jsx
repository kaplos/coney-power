'use client';
import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO, getHours } from 'date-fns';
import ScheduleCard from './ScheduleCard';

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

    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    const days = Array.from({ length: 6 }, (_, i) => addDays(start, i));
    setWeekDates(days);

    load();
  }, []);

  // Only show hours that have at least one class
  const hoursWithClasses = Array.from(
    new Set(classes.map(cls => getHours(parseISO(cls['Class Time']))))
  ).sort((a, b) => a - b);

  return (
    <section id="schedule" className="py-10 bg-black">
      <div className="container mx-auto px-2">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-red-700">
            Weekly Class Schedule
          </h2>
          <p className="text-base text-white max-w-xl mx-auto ">
            Plan your perfect workout week with our diverse class offerings.
          </p>
        </div>

        <div className="overflow-x-auto shadow rounded-lg">
          <table className="w-full bg-blue-500 rounded-lg overflow-hidden text-xs md:text-sm">
            <thead className="bg-[#C5A572] text-white">
              <tr>
                <th className="py-2 px-2 text-left font-semibold">Time</th>
                {weekDates.map((day, i) => (
                  <th key={i} className=" px-1 py-1 text-center font-semibold min-w-20">
                    {format(day, 'EEE dd')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hoursWithClasses.map((hour, timeIndex) => (
                <tr key={hour} className={ 'bg-black '}>
                  <td className="py-2 px-2 font-semibold text-white  ">
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
                      <td key={i} className="py-1 px-1 text-center last:border-r-0 align-top">
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
        <p className="text-center text-gray-500 text-xs mt-4 md:hidden">
          Swipe left or right to view all days
        </p>
      </div>
    </section>
  );
}
