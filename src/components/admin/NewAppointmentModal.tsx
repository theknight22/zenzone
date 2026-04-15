import { useState } from 'react';
import type { Service } from '@/types';
import { X } from 'lucide-react';

interface Props {
  services: Service[];
  onSubmit: (data: { clientName: string; date: string; time: string; serviceId: string }) => void;
  onClose: () => void;
}

export function NewAppointmentModal({ services, onSubmit, onClose }: Props) {
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [serviceId, setServiceId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !date || !time || !serviceId) return;
    onSubmit({ clientName: clientName.trim(), date, time, serviceId });
  }

  const isValid = clientName.trim() && date && time && serviceId;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-lg text-sage-800">Novi termin</h3>
          <button onClick={onClose} className="p-2 -mr-2 text-warm-400 active:text-warm-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-warm-500 mb-1.5 font-medium">Ime klijenta</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ime i prezime"
              className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm text-warm-800 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 bg-cream-50"
            />
          </div>

          <div>
            <label className="block text-xs text-warm-500 mb-1.5 font-medium">Usluga</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 bg-cream-50 appearance-none"
            >
              <option value="">Izaberite uslugu</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-warm-500 mb-1.5 font-medium">Datum</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 bg-cream-50"
              />
            </div>
            <div>
              <label className="block text-xs text-warm-500 mb-1.5 font-medium">Vrijeme</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 bg-cream-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-sage-600 text-white py-3.5 rounded-xl text-sm font-medium active:bg-sage-700 transition-colors disabled:opacity-40 disabled:active:bg-sage-600 min-h-[48px]"
          >
            Kreiraj termin
          </button>
        </form>
      </div>
    </div>
  );
}
