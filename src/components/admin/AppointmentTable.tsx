import type { Appointment, AppointmentStatus } from '@/types/admin';
import { StatusBadge } from './StatusBadge';
import { Calendar, Clock, User, Phone } from 'lucide-react';

interface Props {
  appointments: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}

export function AppointmentTable({ appointments, onStatusChange }: Props) {
  if (appointments.length === 0) {
    return <p className="text-center py-8 text-warm-400 text-sm">Nema termina.</p>;
  }

  return (
    <>
      {/* Mobile: cards */}
      <div className="sm:hidden space-y-3 p-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="bg-cream-50 rounded-xl p-4 border border-cream-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-warm-300 shrink-0" />
                <span className="text-warm-600">{apt.date}</span>
                <Clock className="w-4 h-4 text-warm-300 shrink-0 ml-1" />
                <span className="text-warm-700 font-medium">{apt.time}</span>
              </div>
              <StatusBadge status={apt.status} />
            </div>

            <p className="text-warm-800 font-medium text-sm mb-1">{apt.service.name}</p>

            <div className="flex items-center gap-1.5 text-warm-500 text-xs mb-1">
              <User className="w-3.5 h-3.5 shrink-0" />
              {apt.clientName}
            </div>
            <div className="flex items-center gap-1.5 text-warm-400 text-xs mb-3">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              {apt.clientPhone}
            </div>

            <div className="flex gap-2">
              {apt.status !== 'potvrđen' && (
                <button
                  onClick={() => onStatusChange(apt.id, 'potvrđen')}
                  className="text-xs bg-sage-50 text-sage-600 active:bg-sage-200 px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center"
                >
                  Potvrdi
                </button>
              )}
              {apt.status !== 'otkazan' && (
                <button
                  onClick={() => onStatusChange(apt.id, 'otkazan')}
                  className="text-xs bg-terra-50 text-terra-600 active:bg-terra-200 px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center"
                >
                  Otkaži
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-200">
              <th className="text-left py-3 px-3 text-warm-400 font-medium text-xs uppercase tracking-wide">Datum</th>
              <th className="text-left py-3 px-3 text-warm-400 font-medium text-xs uppercase tracking-wide">Vrijeme</th>
              <th className="text-left py-3 px-3 text-warm-400 font-medium text-xs uppercase tracking-wide">Usluga</th>
              <th className="text-left py-3 px-3 text-warm-400 font-medium text-xs uppercase tracking-wide">Klijent</th>
              <th className="text-left py-3 px-3 text-warm-400 font-medium text-xs uppercase tracking-wide">Status</th>
              <th className="text-right py-3 px-3 text-warm-400 font-medium text-xs uppercase tracking-wide">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id} className="border-b border-cream-100 hover:bg-cream-50/50 transition-colors">
                <td className="py-3 px-3 text-warm-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-warm-300" />
                    {apt.date}
                  </span>
                </td>
                <td className="py-3 px-3 text-warm-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-warm-300" />
                    {apt.time}
                  </span>
                </td>
                <td className="py-3 px-3 text-warm-700 font-medium">{apt.service.name}</td>
                <td className="py-3 px-3 text-warm-600">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-warm-300" />
                    {apt.clientName}
                  </span>
                </td>
                <td className="py-3 px-3"><StatusBadge status={apt.status} /></td>
                <td className="py-3 px-3 text-right">
                  <div className="flex justify-end gap-2">
                    {apt.status !== 'potvrđen' && (
                      <button
                        onClick={() => onStatusChange(apt.id, 'potvrđen')}
                        className="text-xs bg-sage-50 text-sage-600 hover:bg-sage-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Potvrdi
                      </button>
                    )}
                    {apt.status !== 'otkazan' && (
                      <button
                        onClick={() => onStatusChange(apt.id, 'otkazan')}
                        className="text-xs bg-terra-50 text-terra-600 hover:bg-terra-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Otkaži
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
