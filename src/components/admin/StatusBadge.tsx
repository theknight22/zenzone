import type { AppointmentStatus } from '@/types/admin';

const config: Record<AppointmentStatus, { label: string; className: string }> = {
  'potvrđen': { label: 'Potvrđen', className: 'bg-sage-100 text-sage-700' },
  'čekanje': { label: 'Čekanje', className: 'bg-terra-100 text-terra-700' },
  'otkazan': { label: 'Otkazan', className: 'bg-cream-200 text-warm-500 line-through' },
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const c = config[status];
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${c.className}`}>
      {c.label}
    </span>
  );
}
