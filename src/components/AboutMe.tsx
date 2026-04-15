import { Heart } from 'lucide-react';

export function AboutMe() {
  return (
    <section id="o-menii" className="py-20 px-4 sm:px-6 bg-cream-50">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 items-center">
          {/* Photo */}
          <div className="md:col-span-2 flex justify-center">
            <div className="relative">
              <img
                src="/o%20meni.jpg"
                alt="Fizioterapeutkinja"
                className="w-64 h-80 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-terra-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-terra-400" />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-3">
            <h2 className="font-serif text-3xl sm:text-4xl text-sage-800 mb-6">O meni</h2>
            <div className="space-y-4 text-warm-600 leading-relaxed">
              <p>
                Vjerujem da je masaža put do boljeg poznavanja sopstvenog tijela i najljepši način da mu se
                zahvalimo za sve što čini za nas. Kao fizioterapeut, svoj rad zasnivam na spoju stručnog
                znanja i iskrene posvećenosti svakom ko uđe u moj prostor.
              </p>
              <p>
                Moj cilj nije samo da trenutno otklonim bol ili napetost, već da vam pružim sigurno mjesto
                gdje možete usporiti, duboko udahnuti i obnoviti svoju energiju. Bilo da birate medicinski
                oporavak ili tradicionalnu metodu hidžame, tu sam da vam pomognem da se ponovo osjećate
                lagano, zdravo i potpuno.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="bg-sage-50 rounded-xl px-4 py-3 text-center">
                <p className="text-sage-700 font-bold text-lg">Fizioterapeut</p>
                <p className="text-sage-500 text-xs">Licencirana stručnjakinja</p>
              </div>
              <div className="bg-terra-50 rounded-xl px-4 py-3 text-center">
                <p className="text-terra-600 font-bold text-lg">Hidžama</p>
                <p className="text-terra-400 text-xs">Sterilni setovi</p>
              </div>
              <div className="bg-cream-100 rounded-xl px-4 py-3 text-center">
                <p className="text-cream-700 font-bold text-lg">Individualno</p>
                <p className="text-cream-500 text-xs">Prilagođen pristup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
