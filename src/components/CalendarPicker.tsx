import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/lib/api';
import type { TimeSlot } from '@/types';

interface Props {
  date: string | null;
  time: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (date: string, time: string) => void;
}

const DAYS_BA = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
const MONTHS_BA = [
  'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni',
  'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar',
];

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday=0
  const days: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

export function CalendarPicker({ date, time, onSelectDate, onSelectTime }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(date);

  const calendarDays = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);

  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  // Fetch available slots from Convex
  const slotsData = useQuery(api.queries.availability.getAvailableSlots,
    selectedDate ? { date: selectedDate } : 'skip'
  );
  const slots: TimeSlot[] = slotsData ?? [];
  const slotsLoading = slotsData === undefined && selectedDate !== null;

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function handleDateClick(d: Date) {
    const formatted = formatDate(d);
    setSelectedDate(formatted);
    onSelectDate(formatted);
  }

  function handleTimeClick(t: string) {
    if (selectedDate) onSelectTime(selectedDate, t);
  }

  const isPast = (d: Date) => {
    const todayStr = formatDate(today);
    const dStr = formatDate(d);
    return dStr < todayStr;
  };

  return (
    <div>
      <h3 className="font-serif text-xl text-sage-800 mb-1">Odaberi datum i vrijeme</h3>
      <p className="text-warm-400 text-sm mb-5">Izaberi slobodan termin koji ti odgovara.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-1 text-warm-400 hover:text-sage-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-warm-700 text-sm">
              {MONTHS_BA[viewMonth]} {viewYear}
            </span>
            <button onClick={handleNextMonth} className="p-1 text-warm-400 hover:text-sage-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {DAYS_BA.map((d) => (
              <span key={d} className="text-xs text-warm-300 font-medium py-1">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, i) => {
              if (!d) return <div key={`empty-${i}`} />;
              const dStr = formatDate(d);
              const isSel = selectedDate === dStr;
              const disabled = isPast(d);
              return (
                <button
                  key={dStr}
                  disabled={disabled}
                  onClick={() => handleDateClick(d)}
                  className={`py-1.5 text-xs rounded-lg transition-colors ${
                    isSel
                      ? 'bg-sage-600 text-white font-bold'
                      : disabled
                        ? 'text-cream-300 cursor-not-allowed'
                        : 'text-warm-600 hover:bg-sage-50'
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <p className="text-sm font-medium text-warm-600 mb-3">
            {selectedDate ? `Slobodni termini` : 'Prvo odaberi datum'}
          </p>

          {selectedDate ? (
            slotsLoading ? (
              <div className="flex items-center justify-center py-8 text-warm-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Učitavanje...</span>
              </div>
            ) : slots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => handleTimeClick(slot.time)}
                    className={`py-2 text-sm rounded-lg border transition-colors ${
                      time === slot.time && selectedDate === date
                        ? 'bg-sage-600 text-white border-sage-600'
                        : slot.available
                          ? 'border-cream-200 text-warm-600 hover:border-sage-400'
                          : 'border-cream-100 text-cream-300 cursor-not-allowed line-through'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-warm-300 text-sm">Nema slobodnih termina za odabrani datum.</p>
            )
          ) : (
            <p className="text-warm-300 text-sm">Klikni na datum u kalendaru...</p>
          )}

          {selectedDate && time && (
            <p className="mt-3 text-xs text-sage-500 bg-sage-50 px-3 py-2 rounded-lg">
              15 min buffer je automatski uključen između termina za pripremu prostora.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
