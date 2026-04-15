import { useQuery } from 'convex/react';
import { api } from '@/lib/api';
import { mapConvexService } from '@/lib/mappers';
import type { Service } from '@/types';

interface Props {
  selected: Service | null;
  onSelect: (service: Service, serviceId: string) => void;
}

export function ServicePicker({ selected, onSelect }: Props) {
  const servicesData = useQuery(api.queries.services.getServices);
  const services: Service[] = (servicesData ?? []).map(mapConvexService);

  if (servicesData === undefined) {
    return (
      <div>
        <h3 className="font-serif text-xl text-sage-800 mb-1">Odaberi uslugu</h3>
        <p className="text-warm-400 text-sm mb-5">Koji tretman te zove danas?</p>
        <div className="grid sm:grid-cols-2 gap-3 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border-2 border-cream-200 p-4 h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-serif text-xl text-sage-800 mb-1">Odaberi uslugu</h3>
      <p className="text-warm-400 text-sm mb-5">Koji tretman te zove danas?</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {services.map((s) => {
          const isActive = selected?.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s, s.id)}
              className={`text-left rounded-xl border-2 p-4 transition-all ${
                isActive
                  ? 'border-sage-500 bg-sage-50 shadow-sm'
                  : 'border-cream-200 bg-white hover:border-sage-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`font-medium text-sm ${isActive ? 'text-sage-800' : 'text-warm-800'}`}>
                    {s.name}
                  </p>
                  <p className="text-warm-400 text-xs mt-0.5">{s.description}</p>
                </div>
                <span className="text-sage-600 font-semibold text-sm ml-2 whitespace-nowrap">
                  {s.price} KM
                </span>
              </div>
              {s.duration && (
                <span className="inline-block mt-2 text-xs text-sage-500 bg-sage-100/50 px-2 py-0.5 rounded-full">
                  {s.duration}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
