import type { Service, Mood } from './index';

export type Shift = 'smjena1' | 'smjena2' | 'medu' | 'zatvoreno' | null;

export interface DayAvailability {
  date: string;
  shift: Shift;
  blockedSlots: string[];
}

export type AppointmentStatus = 'potvrđen' | 'čekanje' | 'otkazan';

export interface Appointment {
  id: string;
  date: string;
  time: string;
  service: Service;
  mood: Mood;
  clientName: string;
  clientPhone: string;
  status: AppointmentStatus;
  referralSource: string;
}

export const SHIFT_CONFIG: Record<Exclude<Shift, null>, { label: string; start: number; end: number }> = {
  smjena1: { label: 'Smjena 1 (08–16)', start: 8, end: 16 },
  smjena2: { label: 'Smjena 2 (13–21)', start: 13, end: 21 },
  medu: { label: 'Među (10–18)', start: 10, end: 18 },
  zatvoreno: { label: 'Zatvoreno', start: 0, end: 24 },
};

export const ALL_HOURS: number[] = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20];
