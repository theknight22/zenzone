import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/lib/api';
import { ServicePicker } from './ServicePicker';
import { CalendarPicker } from './CalendarPicker';
import { MoodPicker } from './MoodPicker';
import { MedicalForm } from './MedicalForm';
import { BookingSummary } from './BookingSummary';
import { ChevronLeft } from 'lucide-react';
import type { Service, BookingState, BookingAction } from '@/types';

interface Props {
  booking: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

export function BookingFlow({ booking, dispatch }: Props) {
  const { step, service } = booking;
  const isHidzama = service?.category === 'hidzama';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const createBooking = useMutation(api.mutations.bookings.createBooking);

  const steps = isHidzama
    ? ['Usluga', 'Datum', 'Ambijent', 'Upitnik', 'Potvrda']
    : ['Usluga', 'Datum', 'Ambijent', 'Potvrda'];

  function effectiveStep(): number {
    if (!isHidzama && step >= 4) return step - 1;
    return step;
  }

  function canProceed(): boolean {
    switch (step) {
      case 1: return booking.service !== null;
      case 2: return booking.date !== null && booking.time !== null;
      case 3: return booking.mood !== null;
      case 4: return isHidzama && Object.values(booking.medicalChecks).every(Boolean);
      case 5: return true;
      default: return false;
    }
  }

  function handleNext() {
    if (step === 3 && !isHidzama) {
      dispatch({ type: 'GO_TO_STEP', step: 5 });
    } else {
      dispatch({ type: 'NEXT_STEP' });
    }
  }

  function handlePrev() {
    if (step === 5 && !isHidzama) {
      dispatch({ type: 'GO_TO_STEP', step: 3 });
    } else {
      dispatch({ type: 'PREV_STEP' });
    }
  }

  async function handleConfirm() {
    if (!booking.serviceId || !booking.date || !booking.time || !booking.mood) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createBooking({
        serviceId: booking.serviceId as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Convex Id type
        date: booking.date,
        time: booking.time,
        mood: booking.mood,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone,
        medicalChecks: booking.medicalChecks,
        referralSource: booking.referralSource,
      });
      setSubmitSuccess(true);
      dispatch({ type: 'RESET' });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Greška pri zakazivanju termina.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="zakazi" className="py-20 px-4 sm:px-6 bg-sage-50/50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl text-sage-800 mb-3">Zakaži termin</h2>
          <p className="text-warm-500">Brzo i jednostavno — bez pozivanja, bez čekanja.</p>
        </div>

        {submitSuccess && (
          <div className="mb-6 bg-sage-50 border border-sage-200 rounded-xl p-4 text-center">
            <p className="text-sage-700 font-medium">
              Termin primljen! Uskoro će biti potvrđen. Ako ste unijeli email, dobit ćete obavijest.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-2 text-sage-600 text-sm underline"
            >
              Zakaži još jedan termin
            </button>
          </div>
        )}

        {submitError && (
          <div className="mb-6 bg-terra-50 border border-terra-200 rounded-xl p-4 text-center">
            <p className="text-terra-700 text-sm">{submitError}</p>
          </div>
        )}

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 px-2">
          {steps.map((label, i) => {
            const stepPos = i + 1;
            const isActive = effectiveStep() === stepPos;
            const isDone = effectiveStep() > stepPos;
            return (
              <div key={label} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isDone
                      ? 'bg-sage-600 text-white'
                      : isActive
                        ? 'bg-sage-500 text-white ring-4 ring-sage-100'
                        : 'bg-cream-200 text-warm-400'
                  }`}
                >
                  {isDone ? '✓' : stepPos}
                </div>
                <span className="text-xs mt-1.5 text-warm-400 hidden sm:block">{label}</span>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-cream-200">
          {step === 1 && (
            <ServicePicker
              selected={booking.service}
              onSelect={(s: Service, serviceId: string) => dispatch({ type: 'SELECT_SERVICE', service: s, serviceId })}
            />
          )}
          {step === 2 && (
            <CalendarPicker
              date={booking.date}
              time={booking.time}
              onSelectDate={(date: string) => dispatch({ type: 'SELECT_DATE', date })}
              onSelectTime={(date: string, time: string) => dispatch({ type: 'SELECT_DATETIME', date, time })}
            />
          )}
          {step === 3 && (
            <MoodPicker
              mood={booking.mood}
              onMood={(mood) => dispatch({ type: 'SELECT_MOOD', mood })}
            />
          )}
          {step === 4 && isHidzama && (
            <MedicalForm
              checks={booking.medicalChecks}
              referralSource={booking.referralSource}
              onToggle={(key) => dispatch({ type: 'TOGGLE_MEDICAL', key })}
              onReferral={(source) => dispatch({ type: 'SET_REFERRAL', source })}
            />
          )}
          {step === 5 && (
            <BookingSummary
              booking={booking}
              dispatch={dispatch}
              onConfirm={handleConfirm}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 text-warm-500 hover:text-sage-600 text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Nazad
            </button>
          ) : (
            <div />
          )}

          {step < 5 && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-sage-600 hover:bg-sage-700 disabled:bg-cream-300 disabled:cursor-not-allowed text-white disabled:text-warm-400 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Dalje
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
