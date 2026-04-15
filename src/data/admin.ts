import type { Shift } from '@/types/admin';

export function getSlotsForShift(shift: Shift, blockedSlots: string[] = []): { time: string; available: boolean; blocked: boolean }[] {
  const hours = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20];

  if (shift === null) {
    return hours.map((h) => {
      const time = `${String(h).padStart(2, '0')}:00`;
      return { time, available: !blockedSlots.includes(time), blocked: blockedSlots.includes(time) };
    });
  }

  if (shift === 'zatvoreno') {
    return hours.map((h) => {
      const time = `${String(h).padStart(2, '0')}:00`;
      return { time, available: false, blocked: true };
    });
  }

  const { start, end } = { smjena1: { start: 8, end: 16 }, smjena2: { start: 13, end: 21 }, medu: { start: 10, end: 18 } }[shift];

  return hours.map((h) => {
    const time = `${String(h).padStart(2, '0')}:00`;
    const isBlocked = blockedSlots.includes(time);
    return {
      time,
      available: (h < start || h >= end) && !isBlocked,
      blocked: isBlocked || h >= start && h < end,
    };
  });
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function getWeekDates(offset: number = 0): Date[] {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + offset * 7);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export const DAYS_BA = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
export const MONTHS_BA = [
  'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni',
  'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar',
];
