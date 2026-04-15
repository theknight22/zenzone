export const SHIFT_CONFIG: Record<
  "smjena1" | "smjena2" | "medu" | "zatvoreno",
  { start: number; end: number }
> = {
  smjena1: { start: 8, end: 16 },
  smjena2: { start: 13, end: 21 },
  medu: { start: 10, end: 18 },
  zatvoreno: { start: 0, end: 24 },
};

export const ALL_HOURS: number[] = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20];

export const APP_TIME_ZONE = "Europe/Sarajevo";
