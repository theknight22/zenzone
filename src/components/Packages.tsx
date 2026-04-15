import { Gift, TrendingDown, Loader2 } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/lib/api';
import { mapConvexPackage } from '@/lib/mappers';
import type { ServicePackage } from '@/types';

export function Packages() {
  const packagesData = useQuery(api.queries.services.getServicePackages);
  const packages: ServicePackage[] = (packagesData ?? []).map(mapConvexPackage);

  return (
    <section id="paketi" className="py-20 px-4 sm:px-6 bg-sage-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-sage-800 mb-3">Paketi usluga</h2>
          <p className="text-warm-500 max-w-md mx-auto">
            Uštedi uz redovnu njegu — tvoje tijelo će ti zahvaliti.
          </p>
        </div>

        {packagesData === undefined ? (
          <div className="flex items-center justify-center py-12 text-warm-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Učitavanje paketa...</span>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => {
              const hasDiscount = pkg.originalPrice > 0;
              const savings = pkg.originalPrice - pkg.price;

              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {pkg.id === 'reset-sistem' ? (
                      <Gift className="w-5 h-5 text-terra-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-sage-500" />
                    )}
                    <span className="text-xs font-medium text-warm-400 bg-cream-100 px-2 py-0.5 rounded-full">
                      {pkg.terms}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-sage-800 mb-1">{pkg.name}</h3>
                  <p className="text-warm-400 text-sm flex-1">{pkg.description}</p>

                  <div className="mt-4 pt-4 border-t border-cream-100">
                    {hasDiscount ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-sage-700 font-bold text-xl">{pkg.price} KM</span>
                        <span className="text-warm-300 line-through text-sm">{pkg.originalPrice} KM</span>
                        <span className="text-terra-500 text-xs font-medium ml-auto">
                          Ušteda {savings} KM
                        </span>
                      </div>
                    ) : (
                      <span className="text-terra-500 font-semibold text-sm">Gratis termin!</span>
                    )}
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
