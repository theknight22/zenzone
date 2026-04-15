import type { Shift } from '@/types/admin';
import { SHIFT_CONFIG } from '@/types/admin';

interface Props {
  value: Shift;
  onChange: (shift: Shift) => void;
}

const options: { key: Shift; label: string }[] = [
  { key: null, label: '— Slobodan cijeli dan' },
  { key: 'smjena1', label: SHIFT_CONFIG.smjena1.label },
  { key: 'smjena2', label: SHIFT_CONFIG.smjena2.label },
  { key: 'medu', label: SHIFT_CONFIG.medu.label },
  { key: 'zatvoreno', label: 'Zatvoreno' },
];

export function ShiftSelector({ value, onChange }: Props) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === '' ? null : v as Shift);
      }}
      className="text-sm border border-cream-200 rounded-lg px-3 py-2 bg-white text-warm-700 focus:border-sage-400 focus:outline-none w-full"
    >
      {options.map((o) => (
        <option key={String(o.key)} value={o.key ?? ''}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
