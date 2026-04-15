import type { Appointment } from '@/types/admin';
import { StatusBadge } from './StatusBadge';
import { Clock, User, Phone } from 'lucide-react';

interface Props {
  appointments: Appointment[];
  onStatusChange: (id: string, status: Appointment['status']) => void;
}

export function DayOverview({ appointments, onStatusChange }: Props) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-warm-400">
        <p className="text-sm">Nema termina za danas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:space-y-0">
      {appointments.map((apt) => (
        <div key={apt.id} className="bg-white rounded-xl border border-cream-200 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sage-500" />
              <span className="text-sage-700 font-semibold text-sm">{apt.time}</span>
            </div>
            <StatusBadge status={apt.status} />
          </div>

          <p className="text-warm-800 font-medium text-sm mb-2">{apt.service.name}</p>

          <div className="flex items-center gap-1.5 text-warm-500 text-xs mb-1">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span>{apt.clientName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-warm-400 text-xs mb-3">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>{apt.clientPhone}</span>
          </div>

          <div className="flex gap-2">
            {apt.status !== 'potvrđen' && (
              <button
                onClick={() => onStatusChange(apt.id, 'potvrđen')}
                className="text-xs bg-sage-50 text-sage-600 hover:bg-sage-100 active:bg-sage-200 px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center"
              >
                Potvrdi
              </button>
            )}
            {apt.status !== 'otkazan' && (
              <button
                onClick={() => onStatusChange(apt.id, 'otkazan')}
                className="text-xs bg-terra-50 text-terra-600 hover:bg-terra-100 active:bg-terra-200 px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center"
              >
                Otkaži
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
