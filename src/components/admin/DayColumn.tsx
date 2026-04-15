import type { Shift } from '@/types/admin';
import { ShiftSelector } from './ShiftSelector';
import { getSlotsForShift, DAYS_BA, MONTHS_BA } from '@/data/admin';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  date: Date;
  shift: Shift;
  isExpanded: boolean;
  onShiftChange: (shift: Shift) => void;
  onToggleExpand: () => void;
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DayColumn({ date, shift, isExpanded, onShiftChange, onToggleExpand }: Props) {
  const dayName = DAYS_BA[(date.getDay() + 6) % 7];
  const dayNum = date.getDate();
  const monthName = MONTHS_BA[date.getMonth()];
  const slots = getSlotsForShift(shift);
  const availableCount = slots.filter((s) => s.available).length;

  const isToday = fmtDate(date) === fmtDate(new Date());

  return (
    <div className={`bg-white rounded-xl border transition-all ${isExpanded ? 'border-sage-400 shadow-sm' : 'border-cream-200'}`}>
      {/* Header — tappable */}
      <button
        onClick={onToggleExpand}
        className={`w-full text-left p-4 flex items-center justify-between rounded-t-xl transition-colors min-h-[44px] ${
          isToday ? 'bg-sage-50' : 'hover:bg-cream-50 active:bg-cream-100'
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-warm-800 text-sm">{dayName}</span>
            <span className="text-warm-400 text-xs">{dayNum}. {monthName}</span>
            {isToday && (
              <span className="text-xs bg-sage-600 text-white px-2 py-0.5 rounded-full">Danas</span>
            )}
          </div>
          <p className="text-xs text-warm-400 mt-0.5">
            {shift === null
              ? 'Svi slobodni'
              : shift === 'zatvoreno'
                ? 'Zatvoreno'
                : `${availableCount} slobodnih`}
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-warm-300 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-warm-300 shrink-0" />
        )}
      </button>

      {/* Shift selector */}
      <div className="px-4 pb-3">
        <ShiftSelector value={shift} onChange={onShiftChange} />
      </div>

      {/* Expanded slots */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-cream-100 pt-3">
          <p className="text-xs text-warm-400 mb-2">
            Zeleno = slobodan za masažu, crveno = zauzet drugim poslom
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {slots.map((slot) => (
              <div
                key={slot.time}
                className={`text-xs text-center py-2 px-1 rounded-lg font-medium min-h-[44px] flex items-center justify-center ${
                  slot.available
                    ? 'bg-sage-50 text-sage-700 border border-sage-200'
                    : 'bg-terra-50 text-terra-600 border border-terra-200'
                }`}
              >
                {slot.time}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
