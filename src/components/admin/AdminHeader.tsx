import { Link } from '@tanstack/react-router';
import { Flower2, ArrowLeft, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-sage-800 text-sage-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-white font-serif text-lg sm:text-xl font-bold hover:opacity-90 transition-opacity">
          <Flower2 className="w-5 h-5" />
          ZenZone
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4">
          <a href="#pregled" className="text-sage-300 hover:text-white text-sm transition-colors">Termini</a>
          <a href="#dostupnost" className="text-sage-300 hover:text-white text-sm transition-colors">Dostupnost</a>
          <a href="#lista" className="text-sage-300 hover:text-white text-sm transition-colors">Termini</a>
          <Link to="/" className="flex items-center gap-1.5 text-sage-300 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Nazad na sajt
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sage-300 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Odjavi se
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="sm:hidden text-sage-200 p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-sage-700 px-4 pb-3 space-y-2">
          <a href="#pregled" onClick={() => setMenuOpen(false)} className="block py-2 text-sage-300 text-sm">Termini</a>
          <a href="#dostupnost" onClick={() => setMenuOpen(false)} className="block py-2 text-sage-300 text-sm">Dostupnost</a>
          <a href="#lista" onClick={() => setMenuOpen(false)} className="block py-2 text-sage-300 text-sm">Termini</a>
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 py-2 text-sage-300 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Nazad na sajt
          </Link>
          <button
            onClick={() => { setMenuOpen(false); onLogout(); }}
            className="flex items-center gap-1.5 py-2 text-sage-300 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Odjavi se
          </button>
        </div>
      )}
    </header>
  );
}
