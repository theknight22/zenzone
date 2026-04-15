import type { BookingState } from '@/types';

interface Props {
  checks: BookingState['medicalChecks'];
  referralSource: string;
  onToggle: (key: keyof BookingState['medicalChecks']) => void;
  onReferral: (source: string) => void;
}

const checkItems: { key: keyof BookingState['medicalChecks']; label: string }[] = [
  { key: 'noBloodThinners', label: 'Ne koristim lijekove za razređivanje krvi.' },
  { key: 'noAnemia', label: 'Nemam anemiju ili teža srčana oboljenja.' },
  { key: 'notPregnant', label: 'Nisam u ciklusu niti u drugom stanju.' },
  { key: 'noRecentFood', label: 'Nisam konzumirao/la hranu 2-3 sata prije termina.' },
];

export function MedicalForm({ checks, referralSource, onToggle, onReferral }: Props) {
  const allChecked = Object.values(checks).every(Boolean);

  return (
    <div>
      <h3 className="font-serif text-xl text-sage-800 mb-1">Medicinski upitnik</h3>
      <p className="text-warm-400 text-sm mb-5">Molimo te potvrdi sljedeće prije zakazivanja.</p>

      <div className="space-y-3">
        {checkItems.map((item) => (
          <label
            key={item.key}
            className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
              checks[item.key]
                ? 'border-sage-400 bg-sage-50'
                : 'border-cream-200 bg-white hover:border-sage-200'
            }`}
          >
            <input
              type="checkbox"
              checked={checks[item.key]}
              onChange={() => onToggle(item.key)}
              className="mt-0.5 accent-sage-600 w-4 h-4"
            />
            <span className="text-sm text-warm-700">{item.label}</span>
          </label>
        ))}
      </div>

      {!allChecked && (
        <p className="mt-3 text-xs text-terra-500 bg-terra-50 px-3 py-2 rounded-lg">
          Sva polja moraju biti označena za nastavak.
        </p>
      )}

      <div className="mt-6">
        <label className="text-sm font-medium text-warm-600 block mb-2">
          Kako ste saznali za mene? <span className="text-warm-300">(opciono)</span>
        </label>
        <input
          type="text"
          value={referralSource}
          onChange={(e) => onReferral(e.target.value)}
          placeholder="Npr. Instagram, prijatelj, Google..."
          className="w-full border-2 border-cream-200 rounded-xl px-4 py-2.5 text-sm text-warm-700 placeholder:text-warm-300 focus:border-sage-400 focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
}
