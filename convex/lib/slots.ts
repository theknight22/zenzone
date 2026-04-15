import { APP_TIME_ZONE, SHIFT_CONFIG, ALL_HOURS } from "./constants";

export interface SlotInfo {
  time: string;
  available: boolean;
}

export interface BookingTimeLike {
  time: string;
  status?: string;
}

/**
 * Compute base availability from shift configuration.
 * Shift = time at OTHER job, so hours OUTSIDE shift = available for massage.
 * shift "" or not in config = all hours available.
 * "zatvoreno" = no bookable hours.
 */
export function getSlotsForShift(shift: string): SlotInfo[] {
  if (shift === "" || !(shift in SHIFT_CONFIG)) {
    return ALL_HOURS.map((h) => ({ time: formatHour(h), available: true }));
  }

  if (shift === "zatvoreno") {
    return [];
  }

  const { start, end } = SHIFT_CONFIG[shift as keyof typeof SHIFT_CONFIG];
  return ALL_HOURS.map((h) => ({
    time: formatHour(h),
    available: h < start || h >= end,
  }));
}

export function formatHour(h: number): string {
  return `${String(h).padStart(2, "0")}:00`;
}

function parseHour(time: string): number {
  return parseInt(time.split(":")[0], 10);
}

export function getBlockedTimesFromBookings(
  bookings: BookingTimeLike[]
): Set<string> {
  const blocked = new Set<string>();
  const validHours = new Set(ALL_HOURS);

  for (const booking of bookings) {
    if (booking.status === "otkazan") {
      continue;
    }

    blocked.add(booking.time);

    const hour = parseHour(booking.time);
    for (const neighbor of [hour - 1, hour + 1]) {
      if (validHours.has(neighbor)) {
        blocked.add(formatHour(neighbor));
      }
    }
  }

  return blocked;
}

export function getAvailableSlotsForDay(
  shift: string,
  bookings: BookingTimeLike[]
): SlotInfo[] {
  const baseSlots = getSlotsForShift(shift);
  if (baseSlots.length === 0) {
    return [];
  }

  const blockedTimes = getBlockedTimesFromBookings(bookings);
  return baseSlots.map((slot) => ({
    time: slot.time,
    available: slot.available && !blockedTimes.has(slot.time),
  }));
}

export function isSlotAvailable(
  shift: string,
  bookings: BookingTimeLike[],
  time: string
): boolean {
  return getAvailableSlotsForDay(shift, bookings).some(
    (slot) => slot.time === time && slot.available
  );
}

/**
 * Compute the date string for a day offset from the Monday of the current week.
 * offset=0 → current week, offset=1 → next week, etc.
 */
export function getWeekDateStrings(offset: number): string[] {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // Monday=0
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + offset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return formatDate(d);
  });
}

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getTimeZoneParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const lookup = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    year: lookup.year,
    month: lookup.month,
    day: lookup.day,
    hour: lookup.hour,
  };
}

export function formatDateInTimeZone(
  date: Date,
  timeZone: string = APP_TIME_ZONE
): string {
  const parts = getTimeZoneParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/**
 * Get tomorrow's date as "YYYY-MM-DD".
 */
export function getTomorrowString(timeZone: string = APP_TIME_ZONE): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return formatDateInTimeZone(d, timeZone);
}

/**
 * Get today's date as "YYYY-MM-DD".
 */
export function getTodayString(timeZone: string = APP_TIME_ZONE): string {
  return formatDateInTimeZone(new Date(), timeZone);
}

export function getHourInTimeZone(
  date: Date = new Date(),
  timeZone: string = APP_TIME_ZONE
): number {
  return parseInt(getTimeZoneParts(date, timeZone).hour, 10);
}
