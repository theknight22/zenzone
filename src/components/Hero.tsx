import { ArrowDown, MapPin, Phone } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sage-50 via-cream-50 to-cream-100 pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div className="absolute -top-16 -left-12 h-72 w-72 rounded-full bg-sage-200/50 blur-3xl" />
      <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-terra-200/40 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(122,140,102,0.08),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(214,115,69,0.08),transparent_38%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="flex min-h-[calc(100svh-8.5rem)] flex-col justify-center text-center md:min-h-0 md:text-left">
          <h1 className="mx-auto text-center font-serif text-4xl leading-tight text-sage-800 sm:text-5xl md:mx-0 md:text-left md:text-6xl">
            Prostor za
            <span className="block text-terra-500">tvoj oporavak</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-warm-600 md:mx-0 md:text-xl">
            Fizioterapija, masaža i hidžama — sve na jednom mjestu,
            s pažnjom koju zaslužuješ.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start">
            <a
              href="#zakazi"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sage-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sage-700/20 transition-colors hover:bg-sage-700"
            >
              Zakaži termin
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="#usluge"
              className="inline-flex items-center justify-center rounded-full border border-sage-300 bg-white/80 px-8 py-3.5 text-sm font-semibold text-sage-700 transition-colors hover:bg-sage-50"
            >
              Pogledaj usluge
            </a>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="tel:+38762598756"
              className="flex items-center justify-center gap-2 rounded-2xl border border-cream-200 bg-white/80 px-4 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50 md:justify-start"
            >
              <Phone className="h-4 w-4" />
              +387 62 598 756
            </a>
            <a
              href="https://maps.app.goo.gl/dsdndiYG3hdi3G2f6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-cream-200 bg-white/80 px-4 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50 md:justify-start"
            >
              <MapPin className="h-4 w-4" />
              Hajderevac, Gračanica
            </a>
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="relative w-full max-w-md md:max-w-lg">
            <div className="absolute -inset-2 -z-10 rounded-[2rem] bg-gradient-to-br from-sage-200/45 via-cream-100 to-terra-100/45 blur-xl" />
            <img
              src="/masaza.jpg"
              alt="Masaža — opuštanje i oporavak"
              className="h-[380px] w-full rounded-[2rem] object-cover shadow-2xl shadow-sage-900/15 sm:h-[450px] md:h-[520px]"
            />

            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-sage-900/25 via-transparent to-transparent" />

            <div className="absolute -bottom-6 -left-4 w-44 overflow-hidden rounded-2xl border-4 border-cream-50 shadow-xl shadow-sage-900/15 sm:w-52">
              <img
                src="/hidzama1.jpg"
                alt="Hidžama tretman"
                className="h-28 w-full object-cover sm:h-32"
              />
            </div>

            <div className="absolute -top-4 -right-4 rounded-2xl border border-sage-200 bg-white/95 px-4 py-3 text-left shadow-lg backdrop-blur-sm">
              <p className="text-xs font-semibold tracking-wide text-sage-600">TOP IZBOR</p>
              <p className="font-serif text-lg text-sage-800">Sportska masaža</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-5 w-5 text-warm-400" />
      </div>
    </section>
  );
}
