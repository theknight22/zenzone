import { Clock, HandMetal, Droplets, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/lib/api';
import { serviceCategories } from '@/data/services';
import { mapConvexService } from '@/lib/mappers';
import type { Service, ServiceCategory } from '@/types';

const categoryIcons: Record<ServiceCategory, React.ReactNode> = {
  masaze: <HandMetal className="w-5 h-5" />,
  parcijalni: <Clock className="w-5 h-5" />,
  hidzama: <Droplets className="w-5 h-5" />,
};

const categoryImages: Record<ServiceCategory, string | null> = {
  masaze: null,
  parcijalni: null,
  hidzama: '/hidzama1.jpg',
};

interface Props {
  onServiceSelect: (service: Service, serviceId: string) => void;
}

export function Services({ onServiceSelect }: Props) {
  const servicesData = useQuery(api.queries.services.getServices);
  const services: Service[] = (servicesData ?? []).map(mapConvexService);

  return (
    <section id="usluge" className="py-20 px-4 sm:px-6 bg-cream-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-sage-800 mb-3">Usluge i cijene</h2>
          <p className="text-warm-500 max-w-md mx-auto">
            Svaka usluga je prilagođena tvojim potrebama — od blagog opuštanja do dubinske terapije.
          </p>
        </div>

        {servicesData === undefined ? (
          <div className="flex items-center justify-center py-12 text-warm-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Učitavanje usluga...</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {serviceCategories.map((cat) => {
              const image = categoryImages[cat.key];
              return (
              <div key={cat.key} className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden">
                {image && (
                  <div className="h-32 overflow-hidden">
                    <img src={image} alt={cat.label} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-sage-50 text-sage-600 flex items-center justify-center">
                    {categoryIcons[cat.key]}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-sage-800">{cat.label}</h3>
                    <p className="text-warm-400 text-xs">{cat.subtitle}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {services
                    .filter((s) => s.category === cat.key)
                    .map((s) => (
                      <button
                        key={s.id}
                        onClick={() => onServiceSelect(s, s.id)}
                        className="w-full text-left flex justify-between items-start gap-3 p-3 -mx-1 rounded-xl hover:bg-sage-50 transition-colors group"
                      >
                        <div>
                          <p className="font-medium text-warm-800 text-sm group-hover:text-sage-700 transition-colors">
                            {s.name}
                            <ArrowRight className="w-3.5 h-3.5 inline ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-sage-500" />
                          </p>
                          <p className="text-warm-400 text-xs mt-0.5">{s.description}</p>
                          {s.duration && (
                            <span className="inline-block mt-1 text-xs text-sage-500 bg-sage-50 group-hover:bg-sage-100 px-2 py-0.5 rounded-full">
                              {s.duration}
                            </span>
                          )}
                        </div>
                        <span className="text-sage-700 font-semibold text-sm whitespace-nowrap">
                          {s.price} KM
                        </span>
                      </button>
                    ))}
                </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
