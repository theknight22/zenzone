import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DayAvailability, Shift } from '@/types/admin';
import { DayColumn } from './DayColumn';
import { getWeekDates, MONTHS_BA } from '@/data/admin';

interface Props {
  availability: DayAvailability[];
  weekOffset: number;
  onWeekOffsetChange: (offset: number) => void;
  onShiftChange: (date: string, shift: Shift) => void;
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function WeekAvailability({ availability, weekOffset, onWeekOffsetChange, onShiftChange }: Props) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const weekDates = getWeekDates(weekOffset);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];
  const weekTitle = `${weekStart.getDate()}. ${MONTHS_BA[weekStart.getMonth()]} – ${weekEnd.getDate()}. ${MONTHS_BA[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  function getShiftForDate(date: string): Shift {
    const entry = availability.find((a) => a.date === date);
    return entry?.shift ?? null;
  }

  return (
    <div>
      {/* Week navigation — mobile friendly buttons */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => onWeekOffsetChange(weekOffset - 1)}
          className="flex items-center gap-1 text-warm-500 hover:text-sage-600 active:text-sage-700 text-sm transition-colors min-h-[44px] px-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Prošla</span>
        </button>

        <h3 className="font-serif text-base sm:text-lg text-sage-800 text-center">{weekTitle}</h3>

        <button
          onClick={() => onWeekOffsetChange(weekOffset + 1)}
          className="flex items-center gap-1 text-warm-500 hover:text-sage-600 active:text-sage-700 text-sm transition-colors min-h-[44px] px-2"
        >
          <span className="hidden sm:inline">Sljedeća</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {weekOffset !== 0 && (
        <div className="text-center mb-4">
          <button
            onClick={() => onWeekOffsetChange(0)}
            className="text-xs text-sage-500 hover:text-sage-700 underline transition-colors min-h-[44px]"
          >
            Nazad na trenutnu sedmicu
          </button>
        </div>
      )}

      {/* Days — stack on mobile, grid on larger */}
      <div className="space-y-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-3 sm:space-y-0">
        {weekDates.map((date) => {
          const dateStr = fmtDate(date);
          const isExpanded = expandedDay === dateStr;
          return (
            <DayColumn
              key={dateStr}
              date={date}
              shift={getShiftForDate(dateStr)}
              isExpanded={isExpanded}
              onShiftChange={(shift) => onShiftChange(dateStr, shift)}
              onToggleExpand={() => setExpandedDay(isExpanded ? null : dateStr)}
            />
          );
        })}
      </div>
    </div>
  );
}
