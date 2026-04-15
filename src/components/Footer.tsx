import { Link } from '@tanstack/react-router';
import { Flower2, MapPin, Phone, Camera } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-sage-800 text-sage-100 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-serif text-xl font-bold mb-3">
              <Flower2 className="w-5 h-5" />
              ZenZone
            </div>
            <p className="text-sage-300 text-sm leading-relaxed">
              Prostor za tvoj oporavak. Fizioterapija, masaža i hidžama s pažnjom koju zaslužuješ.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Kontakt</h4>
            <div className="space-y-2 text-sage-300 text-sm">
              <a href="tel:+38762598756" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                +387 62 598 756
              </a>
              <a href="https://maps.app.goo.gl/dsdndiYG3hdi3G2f6" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
                Hajderevac, Gračanica 75320
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                <Camera className="w-4 h-4" />
                @zenzone
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Brzi linkovi</h4>
            <div className="space-y-2 text-sage-300 text-sm">
              <a href="#usluge" className="block hover:text-white transition-colors">Usluge</a>
              <a href="#paketi" className="block hover:text-white transition-colors">Paketi</a>
              <a href="#o-menii" className="block hover:text-white transition-colors">O meni</a>
              <a href="#zakazi" className="block hover:text-white transition-colors">Zakaži termin</a>
              <Link to="/admin" className="block hover:text-white transition-colors">Menadžment</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-sage-700 text-center text-sage-400 text-xs">
          &copy; {new Date().getFullYear()} ZenZone. Sva prava zadržana.
        </div>
      </div>
    </footer>
  );
}
