'use client';
import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';
import ScheduleCard from './ScheduleCard';
import { toZonedTime ,formatInTimeZone} from 'date-fns-tz';

const TZ = 'America/New_York';

const fetchClasses = async () => {
  try {
    const res = await fetch('/api/airtable');
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch classes:', error);
    return [];
  }
};
const fetchBookedClasses = async() =>{
  try{
    const res = await fetch('/api/bookedclasses')
    if(!res.ok){
      throw new Error(`Error:${res.status}`)
    }
    const data = await res.json()
    // console.log('fetched class data : ' ,data)
    return data
  }catch (error) {
    console.error('Failed to fetch classes:', error);
    return [];
  }

}


export default function WeeklySchedule() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState([]);
  const [weekDates, setWeekDates] = useState([]);
  const [bookedClasses, setBookedClasses] = useState([]);
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
useEffect(()=>{
    const loadBookedClasses = async () => {
      const data = await fetchBookedClasses()
      setBookedClasses(data.bookings)
    }
    
  if(session?.user?.id){
    loadBookedClasses()
  }
      
  },[])

  // Only show hours that have at least one class (using America/New_York hour)
   const hoursWithClasses = Array.from(
    new Set(
      classes.map((cls) => {
        const iso = cls['Class Time'];
        if (!iso) return null;
        const hourStr = formatInTimeZone(parseISO(iso), TZ, 'H'); // '0'..'23'
        return Number(hourStr);
      }).filter(Boolean)
    )
  ).sort((a, b) => a - b);
    const formatHourLabel = (hour) => {
    const h12 = ((hour + 11) % 12) + 1;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h12}:00 ${ampm}`;
  };

 return (
    <section id="schedule" className="py-10 bg-black">
      <div className="container mx-auto px-2">
        {/* ...existing header... */}

        <div className="overflow-x-auto shadow rounded-lg">
          <table className="w-full bg-blue-500 rounded-lg overflow-hidden text-xs md:text-sm">
            <thead className="bg-[#C5a572] text-white">
              <tr>
                <th className="py-2 px-2 text-left font-semibold">Time (ET)</th>
                {weekDates.map((day, i) => (
                  <th key={i} className="px-1 py-1 text-center font-semibold min-w-20">
                    {format(day, 'EEE dd')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hoursWithClasses.map((hour) => (
                <tr key={hour} className="bg-black">
                  <td className="py-2 px-2 font-semibold text-white">{formatHourLabel(hour)}</td>
                  {weekDates.map((day, i) => {
                    const dayKey = format(day, 'yyyy-MM-dd');
                    const matchingClass = classes.find((cls) => {
                      const iso = cls['Class Time'];
                      if (!iso) return false;
                      const startLocalDay = formatInTimeZone(parseISO(iso), TZ, 'yyyy-MM-dd');
                      const startLocalHour = Number(formatInTimeZone(parseISO(iso), TZ, 'H'));
                      return startLocalDay === dayKey && startLocalHour === hour;
                    });

                    return (
                      <td key={i} className="py-1 px-1 text-center last:border-r-0 align-top">
                        {matchingClass ? (
                          <ScheduleCard classInfo={matchingClass} bookedClasses={bookedClasses} setBookedClasses={setBookedClasses} />
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* ...existing footer ... */}
      </div>
    </section>
  );
}
