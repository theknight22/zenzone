import { useQuery } from 'convex/react';
import { api } from '@/lib/api';
import type { BookingState, BookingAction } from '@/types';

const moodLabels: Record<NonNullable<BookingState['mood']>, string> = {
  tisina: 'Tišina',
  muzika: 'Muzika',
  razgovor: 'Razgovor',
};

interface Props {
  booking: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

export function BookingSummary({ booking, dispatch, onConfirm, isSubmitting }: Props) {
  const { service, date, time, mood, medicalChecks, referralSource, clientName, clientEmail, clientPhone } = booking;
  const isHidzama = service?.category === 'hidzama';
  const medicalAllChecked = Object.values(medicalChecks).every(Boolean);
  const canConfirm = service && date && time && mood && (!isHidzama || medicalAllChecked)
    && clientName.trim() && clientPhone.trim();

  // Loyalty lookup
  const normalizedPhone = clientPhone.replace(/[\s-]/g, '');
  const loyalty = useQuery(api.queries.loyalty.getLoyaltyByPhone,
    normalizedPhone.length >= 6 ? { phone: normalizedPhone } : 'skip'
  );

  return (
    <div>
      <h3 className="font-serif text-xl text-sage-800 mb-1">Pregled termina</h3>
      <p className="text-warm-400 text-sm mb-5">Provjeri detalje i potvrdi svoj termin.</p>

      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        {service && (
          <div className="px-5 py-4 border-b border-cream-100">
            <p className="text-xs text-warm-400 uppercase tracking-wide mb-1">Usluga</p>
            <p className="text-warm-800 font-medium">{service.name}</p>
            <p className="text-sage-600 font-semibold text-sm">{service.price} KM</p>
          </div>
        )}

        {date && time && (
          <div className="px-5 py-4 border-b border-cream-100">
            <p className="text-xs text-warm-400 uppercase tracking-wide mb-1">Datum i vrijeme</p>
            <p className="text-warm-800 font-medium">
              {date} u {time}
            </p>
          </div>
        )}

        <div className="px-5 py-4 border-b border-cream-100">
          <p className="text-xs text-warm-400 uppercase tracking-wide mb-1">Ambijent</p>
          <p className="text-warm-700 text-sm">{mood ? moodLabels[mood] : 'Nije odabrano'}</p>
        </div>

        {referralSource && (
          <div className="px-5 py-4 border-b border-cream-100">
            <p className="text-xs text-warm-400 uppercase tracking-wide mb-1">Čuli ste o meni putem</p>
            <p className="text-warm-700 text-sm">{referralSource}</p>
          </div>
        )}

        {/* Client info fields */}
        <div className="px-5 py-4 border-b border-cream-100 space-y-3">
          <p className="text-xs text-warm-400 uppercase tracking-wide mb-2">Vaši podaci</p>

          <div>
            <label htmlFor="clientName" className="block text-xs text-warm-500 mb-1">Ime i prezime *</label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => dispatch({ type: 'SET_CLIENT_NAME', name: e.target.value })}
              className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm text-warm-800 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="Amra Begović"
            />
          </div>

          <div>
            <label htmlFor="clientEmail" className="block text-xs text-warm-500 mb-1">Email (opcionalno)</label>
            <input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => dispatch({ type: 'SET_CLIENT_EMAIL', email: e.target.value })}
              className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm text-warm-800 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="amra@email.com"
            />
          </div>

          <div>
            <label htmlFor="clientPhone" className="block text-xs text-warm-500 mb-1">Telefon *</label>
            <input
              id="clientPhone"
              type="tel"
              value={clientPhone}
              onChange={(e) => dispatch({ type: 'SET_CLIENT_PHONE', phone: e.target.value })}
              className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm text-warm-800 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="+387 61 234 567"
            />
            {loyalty && loyalty.visitCount > 0 && (
              <span className="inline-block mt-1.5 text-xs text-sage-600 bg-sage-50 px-2 py-0.5 rounded-full font-medium">
                {loyalty.visitCount}. posjeta
              </span>
            )}
          </div>
        </div>

        <div className="px-5 py-4 bg-sage-50">
          <p className="text-xs text-sage-600">
            Ako unesete email, dobit ćete podsjetnik 24h prije termina. Nakon tretmana ćete dobiti savjet za hidrataciju.
          </p>
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={!canConfirm || isSubmitting}
        className="mt-6 w-full bg-sage-600 hover:bg-sage-700 disabled:bg-cream-300 disabled:cursor-not-allowed text-white disabled:text-warm-400 py-3.5 rounded-xl font-medium transition-colors"
      >
        {isSubmitting ? 'Zakazivanje...' : 'Potvrdi termin'}
      </button>

      {isHidzama && !medicalAllChecked && (
        <p className="mt-2 text-xs text-terra-500 text-center">
          Molimo označi sva polja u medicinskom upitniku.
        </p>
      )}
    </div>
  );
}
