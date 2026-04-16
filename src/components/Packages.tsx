import { Gift, Sparkles, Target } from 'lucide-react';

const programRules = [
  {
    title: '1 termin = 1 bod',
    description: 'Svaka realizovana usluga donosi 1 bod na tvoj broj telefona.',
    icon: <Target className="w-5 h-5" />,
  },
  {
    title: '5 bodova = 20 KM popusta',
    description: 'Popust koristiš na sljedeći termin kada skupiš 5 bodova.',
    icon: <Gift className="w-5 h-5" />,
  },
  {
    title: '10 bodova = gratis masaža',
    description: 'Nagradu biraš: jedna parcijalna masaža ili masaža. Hidžama nije uključena.',
    icon: <Sparkles className="w-5 h-5" />,
  },
] as const;

const programNotes = [
  'Bodovi važe 12 mjeseci od datuma sticanja.',
  'Bodovi se ne mogu zamijeniti za gotovinu.',
  'Loyalty pogodnosti se ne kombinuju sa drugim promo akcijama.',
  'Praćenje bodova je vezano za tvoj broj telefona.',
] as const;

export function Packages() {
  return (
    <section id="loyalty" className="py-20 px-4 sm:px-6 bg-sage-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-sage-800 mb-3">Loyalty program</h2>
          <p className="text-warm-500 max-w-md mx-auto">
            Nema paketa. Svaki dolazak ti donosi bodove i jasne nagrade.
          </p>
          <p className="text-sage-600 text-sm mt-2 font-medium">
            Bodovi važe 12 mjeseci.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {programRules.map((rule) => (
            <article
              key={rule.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-sage-700 mb-4">
                {rule.icon}
                Pravilo
              </div>
              <h3 className="font-serif text-2xl text-sage-800 leading-tight">{rule.title}</h3>
              <p className="text-warm-600 mt-3 leading-relaxed">{rule.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-cream-200">
          <h3 className="font-serif text-2xl text-sage-800">Uslovi loyalty programa</h3>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-warm-700">
            {programNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
