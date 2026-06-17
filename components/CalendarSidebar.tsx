'use client';

import React, { useEffect, useState, useRef } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Calendar, Video } from 'lucide-react';
import { format, isToday, parseISO, startOfDay, endOfDay, differenceInMinutes } from 'date-fns';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CalendarSidebar() {
  // Fetch today's events
  const todayStart = startOfDay(new Date()).toISOString();
  const todayEnd = endOfDay(new Date()).toISOString();

  const { data, error, isLoading } = useSWR(
    `/api/calendar?timeMin=${encodeURIComponent(todayStart)}&timeMax=${encodeURIComponent(todayEnd)}`,
    fetcher
  );

  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  // Current time indicator calculation
  const dayStartHour = new Date().setHours(0, 0, 0, 0);
  const currentTimeDiff = differenceInMinutes(currentTime, dayStartHour);
  const pixelPerMinute = 80 / 60;
  const showCurrentTime = currentTimeDiff >= 0 && currentTimeDiff <= 24 * 60;

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (mounted && scrollRef.current) {
      const containerHeight = scrollRef.current.clientHeight;
      const topPx = currentTimeDiff * pixelPerMinute;
      const defaultScroll = 8 * 60 * pixelPerMinute; // 8 AM
      scrollRef.current.scrollTop = Math.max(0, topPx > 0 && topPx < 20 * 60 * pixelPerMinute ? topPx - containerHeight / 3 : defaultScroll - 40);
    }
  }, [mounted]); // Run once when mounted

  const events = data?.events || [];

  const displayEvents = events;

  // 24-hour timeline
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventStyle = (event: any) => {
    const start = new Date(event.start?.dateTime || event.start?.date || event.start);
    const end = new Date(event.end?.dateTime || event.end?.date || event.end);

    // Relative to midnight for our 24h timeline display
    const dayStart = new Date(start).setHours(0, 0, 0, 0);
    const topDiff = differenceInMinutes(start, dayStart);
    const duration = differenceInMinutes(end, start);

    return {
      top: `${topDiff * pixelPerMinute}px`,
      height: `${Math.max(duration, 20) * pixelPerMinute}px`,
      minHeight: '40px',
    };
  };

  const getThemeColors = (colorId?: string) => {
    const id = colorId || '1';
    const googleColors: Record<string, string> = {
      '1': 'bg-[#CBE4FF] border-l-[#B4D7FF]', '2': 'bg-[#BCF0C8] border-l-[#A3E8B3]',
      '3': 'bg-[#E3D1FE] border-l-[#D4B9FD]', '4': 'bg-[#FFBBD7] border-l-[#FF9CBF]',
      '5': 'bg-[#FBE4A1] border-l-[#F8D87E]', '6': 'bg-[#FFE2D1] border-l-[#FFCFAE]',
      '7': 'bg-[#C2E0FF] border-l-[#99C8FF]', '8': 'bg-[#E2E8F0] border-l-[#CBD5E1]',
      '9': 'bg-[#C7D2FE] border-l-[#A5B4FC]', '10': 'bg-[#BBF7D0] border-l-[#86EFAC]',
      '11': 'bg-[#FECDD3] border-l-[#FDA4AF]'
    };
    return googleColors[id] || googleColors['1'];
  };

  return (
    <div className="w-[320px] bg-white border-l border-zinc-200 flex flex-col h-full shrink-0 shadow-sm z-10">
      <div className="h-[72px] flex items-center px-6 border-b border-zinc-200 shrink-0 bg-white relative z-20">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-900" />
          <h2 className="text-[15px] font-bold text-zinc-900 tracking-tight">Today's Calendar</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 relative no-scrollbar" ref={scrollRef}>
        {isLoading ? (
          <div className="relative">
            {hours.map((hour, i) => (
              <div key={hour} className="flex relative h-[80px]">
                <div className="w-14 shrink-0 text-[11px] font-medium text-zinc-400 -mt-2 pr-3 text-right">
                  {hour === 0 ? '12 AM' : hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                </div>
                <div className="flex-1 border-t border-zinc-100 relative"></div>
              </div>
            ))}
            <div className="absolute top-0 left-14 right-2 bottom-0">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 rounded-xl border-l-[4px] border-zinc-200 bg-zinc-50/80 p-3 animate-pulse"
                  style={{ top: `${(i * 120) + 120}px`, height: '60px', animationDelay: `${i * 150}ms` }}
                >
                  <div className="w-2/3 h-2.5 bg-zinc-200 rounded-full mb-2.5"></div>
                  <div className="w-1/3 h-2 bg-zinc-200/50 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline grid */}
            {hours.map((hour, i) => (
              <div key={hour} className="flex relative h-[80px]">
                <div className="w-14 shrink-0 text-[11px] font-medium text-zinc-400 -mt-2 pr-3 text-right">
                  {hour === 0 ? '12 AM' : hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                </div>
                <div className="flex-1 border-t border-zinc-100 relative"></div>
              </div>
            ))}

            {/* Current Time Line */}
            {mounted && showCurrentTime && (
              <div
                className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
                style={{ top: `${currentTimeDiff * pixelPerMinute}px`, transform: 'translateY(-50%)' }}
              >
                <div className="w-14 shrink-0 flex justify-end pr-2">
                  <div className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm relative z-10">
                    {format(currentTime, 'h:mm')}
                  </div>
                </div>
                <div className="flex-1 h-[2px] bg-blue-600 -ml-1 shadow-sm"></div>
              </div>
            )}

            {/* Event Cards */}
            <div className="absolute top-0 left-14 right-2 bottom-0 pointer-events-none">
              {displayEvents.map((event: any, idx: number) => {
                const style = getEventStyle(event);
                const colorClass = getThemeColors(event.colorId);

                return (
                  <div
                    key={event.id}
                    onClick={() => router.push(`/calendar?editEventId=${event.id}`)}
                    className={`absolute left-0 right-0 rounded-xl border-l-[4px] shadow-sm px-3 py-2 pointer-events-auto transition-all hover:brightness-95 hover:shadow-md cursor-pointer ${colorClass} overflow-hidden flex flex-col`}
                    style={style}
                  >
                    <h3 className="text-[12px] font-bold text-zinc-900 mb-0.5 line-clamp-1 leading-tight">{event.title || event.summary || 'Untitled Event'}</h3>
                    <p className="text-[10px] text-zinc-700/80 font-medium line-clamp-1">
                      {format(new Date(event.start?.dateTime || event.start?.date || event.start), 'h:mm a')} - {format(new Date(event.end?.dateTime || event.end?.date || event.end), 'h:mm a')}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
