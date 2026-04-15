import { useReducer } from 'react';
import type { BookingState, BookingAction } from '@/types';

const initialState: BookingState = {
  step: 1,
  service: null,
  serviceId: null,
  date: null,
  time: null,
  mood: null,
  medicalChecks: {
    noBloodThinners: false,
    noAnemia: false,
    notPregnant: false,
    noRecentFood: false,
  },
  referralSource: '',
  clientName: '',
  clientEmail: '',
  clientPhone: '',
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SELECT_SERVICE':
      return { ...state, service: action.service, serviceId: action.serviceId };
    case 'SELECT_DATE':
      return { ...state, date: action.date, time: null };
    case 'SELECT_DATETIME':
      return { ...state, date: action.date, time: action.time };
    case 'SELECT_MOOD':
      return { ...state, mood: action.mood };
    case 'TOGGLE_MEDICAL':
      return {
        ...state,
        medicalChecks: {
          ...state.medicalChecks,
          [action.key]: !state.medicalChecks[action.key],
        },
      };
    case 'SET_REFERRAL':
      return { ...state, referralSource: action.source };
    case 'SET_CLIENT_NAME':
      return { ...state, clientName: action.name };
    case 'SET_CLIENT_EMAIL':
      return { ...state, clientEmail: action.email };
    case 'SET_CLIENT_PHONE':
      return { ...state, clientPhone: action.phone };
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 5) as BookingState['step'] };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) as BookingState['step'] };
    case 'GO_TO_STEP':
      return { ...state, step: action.step };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useBooking() {
  return useReducer(bookingReducer, initialState);
}
