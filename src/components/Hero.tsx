import { ArrowDown, Phone, MapPin } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-sage-50 via-cream-50 to-cream-100">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-sage-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-terra-200/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 items-center">
        {/* Text */}
        <div className="text-center md:text-left">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-sage-800 mb-4 leading-tight">
            Prostor za<br />
            <span className="text-terra-500">tvoj oporavak</span>
          </h1>

          <p className="text-warm-600 text-lg sm:text-xl mb-8 max-w-lg md:max-w-none leading-relaxed">
            Fizioterapija, masaža i hidžama — sve na jednom mjestu,
            s pažnjom koju zaslužuješ.
          </p>

          <a
            href="#zakazi"
            className="inline-flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-8 py-3.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-sage-600/20"
          >
            Zakaži termin
            <ArrowDown className="w-4 h-4" />
          </a>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <a href="tel:+38762598756" className="flex items-center gap-2 text-sage-600 hover:text-sage-700 text-sm font-medium">
              <Phone className="w-4 h-4" />
              +387 62 598 756
            </a>
            <a href="https://maps.app.goo.gl/dsdndiYG3hdi3G2f6" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sage-600 hover:text-sage-700 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              Hajderevac, Gračanica 75320
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="hidden md:flex justify-center">
          <div className="relative">
            <img
              src="/masaza.jpg"
              alt="Masaža — opuštanje i oporavak"
              className="w-full max-w-md h-[480px] object-cover rounded-3xl shadow-2xl shadow-sage-900/10"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-sage-900/20 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-5 h-5 text-warm-400" />
      </div>
    </section>
  );
}
