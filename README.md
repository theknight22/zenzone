# ZenZone

Web platforma za fizioterapeutkinju — klijentski sajt za zakazivanje termina + admin panel za upravljanje.

## Tehnologije

| Layer | Tehnologija |
|-------|-------------|
| Frontend | React 19, TypeScript |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query (pripremljen za Convex) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Build | Vite 8 |
| PWA | Service Worker, manifest.json |
| Backend (planirano) | Convex, Resend.com — vidi [backend_plan.md](./backend_plan.md) |

## Pokretanje

```bash
npm install
npm run dev        # development server
npm run build      # production build
npm run lint       # eslint provjera
```

## Struktura projekta

```
zenzone/
├── public/
│   ├── masaza.jpg           # Hero slika
│   ├── hidzama1.jpg         # Hidžama kategorija slika
│   ├── o meni.jpg           # Fotografija za O meni sekciju
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service Worker
├── src/
│   ├── main.tsx             # App entry — Convex + Router + Query provider
│   ├── router.ts            # TanStack Router instanca
│   ├── index.css            # Tailwind v4 + custom theme (sage/cream/terra)
│   ├── routeTree.gen.ts     # Auto-generisani route tree
│   ├── routes/
│   │   ├── __root.tsx       # Root layout — Navbar+Footer na klijentskim rutama
│   │   ├── index.tsx        # Klijentska stranica (/)
│   │   └── admin.lazy.tsx   # Admin panel (/admin)
│   ├── components/
│   │   ├── Navbar.tsx        # Sticky navigacija, mobile hamburger
│   │   ├── Hero.tsx          # Landing sa slikom masaze
│   │   ├── Services.tsx      # Usluge i cijene — klikabilne kartice
│   │   ├── Packages.tsx      # Paketi sa uštedom
│   │   ├── AboutMe.tsx       # Bio sa fotografijom
│   │   ├── BookingFlow.tsx   # Multi-step booking orchestrator
│   │   ├── ServicePicker.tsx # Korak 1: odabir usluge
│   │   ├── CalendarPicker.tsx# Korak 2: datum i vrijeme
│   │   ├── MoodPicker.tsx    # Korak 3: ambijent (tišina/muzika/razgovor)
│   │   ├── MedicalForm.tsx   # Korak 4: medicinski upitnik (samo hidžama)
│   │   ├── BookingSummary.tsx# Korak 5: pregled i potvrda
│   │   ├── Footer.tsx        # Footer sa linkom na admin
│   │   └── admin/
│   │       ├── AdminHeader.tsx      # Admin header sa navigacijom
│   │       ├── DayOverview.tsx      # Današnji termini (kartice)
│   │       ├── WeekAvailability.tsx # Sedmični prikaz smjena
│   │       ├── DayColumn.tsx        # Jedan dan sa shift dropdownom
│   │       ├── ShiftSelector.tsx    # Dropdown: smjena1/2/među/zatvoreno
│   │       ├── AppointmentTable.tsx # Svi termini (tabela + mobile kartice)
│   │       └── StatusBadge.tsx      # Status badge (potvrđen/čekanje/otkazan)
│   ├── data/
│   │   ├── services.ts       # Usluge, paketi, mock slotovi
│   │   └── admin.ts         # Mock termini, smjene, dostupnost logika
│   ├── hooks/
│   │   └── useBooking.ts    # Booking state machine (useReducer)
│   └── types/
│       ├── index.ts          # Service, BookingState, TimeSlot...
│       └── admin.ts         # Shift, Appointment, DayAvailability
├── backend_plan.md           # Plan za Convex + Resend backend
└── package.json
```

## Klijentski sajt (/)

Jednostranični sajt sa sekcijama i multi-step booking flow-om.

### Sekcije

1. **Hero** — Naslov "Prostor za tvoj oporavak", CTA dugme, slika masaze (desktop)
2. **Usluge i cijene** — 3 kategorije (Masaže, Parcijalni, Hidžama), klik na uslugu otvara booking
3. **Paketi** — 4 paketa sa uštedom
4. **O meni** — Bio tekst + fotografija
5. **Zakaži termin** — Multi-step wizard

### Booking Flow

```
1. Odaberi uslugu
       ↓
2. Odaberi datum i vrijeme
       ↓
3. Ambijent (Tišina / Muzika / Razgovor)
       ↓
4. Medicinski upitnik ── samo ako je hidžama
       ↓
5. Pregled i potvrda
```

- Klik na uslugu u "Usluge i cijene" automatski bira tu uslugu i scrolla do booking sekcije
- Medicinski upitnik se prikazuje samo kada je odabrana usluga iz kategorije hidžama — za ostale usluge se korak preskače (4 koraka umjesto 5)
- Booking state upravljan putem `useReducer` hook-a

### Smjene i dostupnost

Smjene označavaju sate **drugog posla** — kada je terapeutkinja zauzeta drugim poslom, a ne kada radi masaže:

| Smjena | Na drugom poslu | Slobodni za masažu |
|--------|-------------------|---------------------|
| Smjena 1 | 08–16 | 17, 18, 19, 20 |
| Smjena 2 | 13–21 | 08, 09, 10, 11 |
| Među | 10–18 | 08, 09, 19, 20 |
| — (nije odabrano) | — | Svi slobodni |
| Zatvoreno | — | Svi zauzeti |

Trenutno koristi mock podatke — kada se Convex backend implementira, dostupnost će se čitati iz baze.

## Admin panel (/admin)

Zasebna stranica sa vlastitim headerom (bez klijentskog Navbar/Footer).

### Sekcije

1. **Današnji termini** — Kartice sa klijentima, uslugom, statusom + akcije (potvrdi/otkaži)
2. **Dostupnost** — Sedmični prikaz sa navigacijom, svaki dan ima vlastitu smjenu dropdown
3. **Svi termini** — Tabela (desktop) / kartice (mobile) sa svim rezervacijama

### Mobile-first

- Svi touch targeti minimalno 44px (Apple preporuka)
- Admin header sa hamburger menijem na mobilnom
- AppointmentTable prikazuje kartice na mobilnom, tabelu na desktopu
- DayColumn slot grid 4 kolone na mobilnom, 6 na desktopu
- `safe-area-inset` padding za iPhone notch
- PWA standalone mode bez overscroll bounce

## PWA podrška

- `manifest.json` — standalone display, theme_color, ikona
- `sw.js` — stale-while-revalidate caching strategija
- Meta tagovi — `apple-mobile-web-app-capable`, `theme-color`, `viewport-fit=cover`
- Auto-registracija service workera u `index.html`

## Dizajn sistem

| Token | Upotreba |
|-------|----------|
| `sage-*` | Primarna boja (zelena), CTA dugmad, aktivni elementi |
| `cream-*` | Pozadine, kartice, borderi |
| `terra-*` | Akcent (terakota), upozorenja, zatvoreni slotovi |
| `warm-*` | Tekst, sekundarni elementi |
| `Playfair Display` | Naslovi (font-serif) |
| `Inter` | Body tekst (font-sans) |

## Backend — Sljedeći koraci

Kompletna specifikacija backend implementacije sa Convex bazom i Resend.com emailovima se nalazi u **[backend_plan.md](./backend_plan.md)**.

Ključne tačke:
- Convex za real-time bazu, queries i mutations
- Resend.com za email potvrde, podsjetnike i obavještenja adminu
- Booking uvijek ide u "čekanje" — admin potvrđuje ručno
- Loyalty sistem po broju telefona
- Cron job za dnevne podsjetnike 24h prije termina
