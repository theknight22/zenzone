export interface Service {
  id: string;
  name: string;
  duration: string;
  description: string;
  price: number;
  category: ServiceCategory;
}

export type ServiceCategory = 'masaze' | 'parcijalni' | 'hidzama';

export type Mood = 'tisina' | 'muzika' | 'razgovor';

export interface BookingState {
  step: BookingStep;
  service: Service | null;
  serviceId: string | null;
  date: string | null;
  time: string | null;
  mood: Mood | null;
  medicalChecks: {
    noBloodThinners: boolean;
    noAnemia: boolean;
    notPregnant: boolean;
    noRecentFood: boolean;
  };
  referralSource: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

export type BookingStep = 1 | 2 | 3 | 4 | 5;

export type BookingAction =
  | { type: 'SELECT_SERVICE'; service: Service; serviceId: string }
  | { type: 'SELECT_DATE'; date: string }
  | { type: 'SELECT_DATETIME'; date: string; time: string }
  | { type: 'SELECT_MOOD'; mood: Mood }
  | { type: 'TOGGLE_MEDICAL'; key: keyof BookingState['medicalChecks'] }
  | { type: 'SET_REFERRAL'; source: string }
  | { type: 'SET_CLIENT_NAME'; name: string }
  | { type: 'SET_CLIENT_EMAIL'; email: string }
  | { type: 'SET_CLIENT_PHONE'; phone: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' }
  | { type: 'GO_TO_STEP'; step: BookingStep };

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface LoyaltyInfo {
  visitCount: number;
  lastVisit: string;
}
