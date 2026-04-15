# ZenZone

Web platforma za fizioterapeutkinju — klijentski sajt za zakazivanje termina + admin panel za upravljanje.

## Tech Stack

| Layer | Tehnologija |
|-------|-------------|
| Frontend | React 19, TypeScript |
| Routing | TanStack Router (file-based) |
| State | React useReducer (booking flow) |
| Backend | Convex (production deployment) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Build | Vite 8 |
| PWA | Service Worker, manifest.json |
| Email | Resend.com (via Convex actions) |
| Hosting | Vercel (frontend), Convex Cloud (backend) |

## Live URLs

- **Frontend:** https://zen-zone-besic.vercel.app
- **Admin:** https://zen-zone-besic.vercel.app/admin
- **Backend API:** https://clean-seahorse-627.eu-west-1.convex.cloud

## Pokretanje (razvoj)

```bash
npm install
npm run dev        # frontend + Convex dev server
npx convex dev     # start Convex backend (ako nije pokrenut)
```

## Production deploy

```bash
git push                    # Vercel auto-deploy
npx convex deploy --prod    # Convex backend
```

---

## Arhitektura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Convex Backend │────▶│   Resend Email  │
│   (Vercel)      │◀────│   (Cloud)        │     │   (API)         │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │
        │              ┌─────────┴─────────┐
        │              │                  │
        ▼              ▼                  ▼
   PWA App       Queries             Mutations
   - booking     - getServices       - createBooking
   - admin       - getBookings       - updateBookingStatus
                  - getAvailableSlots - setShift
                  - getWeekAvail     - toggleBlockedSlot
                  - getLoyalty
```

---

## Struktura projekta

```
zenzone/
├── convex/                  # Convex backend
│   ├── schema.ts            # Tabele: services, packages, bookings, availability, loyalty, adminSessions
│   ├── queries/             # getServices, getBookings, getAvailableSlots, getWeekAvailability
│   ├── mutations/           # createBooking, updateBookingStatus, setShift, toggleBlockedSlot
│   ├── actions/             # Resend email slanje, auth verifikacija
│   ├── lib/                 # adminAuth, slots helper, constants
│   ├── seed.ts              # seedServicesAndPackages funkcija
│   └── _generated/          # Auto-generated Convex types
├── public/
│   ├── masaza.jpg
│   ├── hidzama1.jpg, hidzama2.jpg
│   ├── o meni.jpg
│   ├── icon.svg             # PWA ikona
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service Worker (stale-while-revalidate)
├── src/
│   ├── main.tsx
│   ├── router.ts
│   ├── index.css            # Tailwind v4 + sage/cream/terra/warm theme
│   ├── routeTree.gen.ts
│   ├── routes/
│   │   ├── __root.tsx       # Root layout — Navbar+Footer (ne na /admin)
│   │   ├── index.tsx        # Klijentska stranica + "Admin pristup" link na dnu
│   │   └── admin.lazy.tsx   # Admin panel (/admin)
│   ├── components/
│   │   ├── Navbar.tsx        # Fixed, padding-top za iPhone notch
│   │   ├── Hero.tsx          # Landing + phone/maps linkovi
│   │   ├── Services.tsx      # Usluge iz Convex baze
│   │   ├── Packages.tsx      # Paketi iz Convex baze
│   │   ├── AboutMe.tsx
│   │   ├── BookingFlow.tsx   # Multi-step booking orchestrator
│   │   ├── ServicePicker.tsx
│   │   ├── CalendarPicker.tsx# Datum + slotovi (nedjelja UKLJUCENA)
│   │   ├── MoodPicker.tsx
│   │   ├── MedicalForm.tsx   # Samo za hidžamu
│   │   ├── BookingSummary.tsx# Klijent podaci + submit
│   │   ├── Footer.tsx         # Phone + maps linkovi, admin link
│   │   └── admin/
│   │       ├── AdminLogin.tsx
│   │       ├── AdminHeader.tsx
│   │       ├── DayOverview.tsx      # Današnji termini
│   │       ├── WeekAvailability.tsx # Sedmica + clickable slotovi
│   │       ├── DayColumn.tsx        # Jedan dan, expand, shift dropdown
│   │       ├── ShiftSelector.tsx    # smjena1/smjena2/medu/zatvoreno
│   │       ├── AppointmentTable.tsx
│   │       └── StatusBadge.tsx
│   ├── hooks/
│   │   └── useBooking.ts    # useReducer state machine
│   ├── lib/
│   │   ├── api.ts           # Convex API imports
│   │   ├── convex.ts        # Convex client setup
│   │   ├── mappers.ts       # Convex → frontend types
│   │   └── adminSession.ts  # Session storage
│   └── types/
│       ├── index.ts
│       └── admin.ts
└── vercel.json              # SPA rewrite rules
```

---

## Šta je implementirano

### ✅ Klijentski sajt

- **Hero** — naslov, CTA, phone link (+387 62 598 756), maps link (Hajderevac, Gračanica 75320)
- **Services** — 9 usluga iz Convex baze, 3 kategorije (Masaže, Parcijalni, Hidžama)
- **Packages** — 4 paketa iz Convex baze
- **AboutMe** — bio + fotka
- **Booking Flow** — 5 koraka (usluga → datum → ambijent → medicinski → pregled)
  - Nedjelja je SADA dostupna za zakazivanje
  - Medicinski upitnik samo za hidžamu
- **Footer** — clickable phone i maps linkovi, admin link

### ✅ Admin panel

- **Auth** — login sa šifrom (ENV: ADMIN_PASSWORD na Convex)
- **Današnji termini** — kartice sa potvrdi/otkaži akcijama
- **Dostupnost** — sedmični prikaz sa navigacijom
  - Shift dropdown (smjena1/smjena2/medu/zatvoreno)
  - Klik na sat = toggle blocked/slobodan
  - Podaci se čuvaju u Convex bazi
- **Svi termini** — tabela sa filterom

### ✅ Convex backend (production)

- **Schema:** services, packages, bookings, availability, loyalty, adminSessions
- **Queries:** getServices, getServicePackages, getBookings, getBookingsByDate, getAvailableSlots, getWeekAvailability, getLoyaltyByPhone
- **Mutations:** createBooking, updateBookingStatus, cancelBooking, setShift, setWeekShifts, toggleBlockedSlot, addService, updateService, toggleService
- **Actions:** verifyAdminSession, createAdminSession, logoutAdminSession, email slanje (booking received, confirmed, cancelled, daily reminder)

### ✅ PWA

- manifest.json sa icon.svg
- Service Worker (cache + offline)
- Apple meta tagi (standalone mode)
- Safe area insets za iPhone notch
- "Add to Home Screen" funkcioniše

### ✅ Email (Resend)

- Termin primljen → klijent
- Termin potvrđen → klijent  
- Termin otkazan → klijent
- Podsjetnik 24h prije → klijent
- Novi termin → admin

---

## Dizajn sistem

| Token | Upotreba |
|-------|----------|
| `sage-*` | Primarna (zelena), CTA, aktivni |
| `cream-*` | Pozadine, kartice |
| `terra-*` | Akcent (terakota), warning, blocked |
| `warm-*` | Tekst |
| `Playfair Display` | Naslovi (serif) |
| `Inter` | Body |

---

## Admin pristup

- URL: https://zen-zone-besic.vercel.app/admin
- Šifra: postavljena via `npx convex env set ADMIN_PASSWORD "..." --prod`

## Environment varijable (Convex)

```
ADMIN_PASSWORD    — admin šifra za prijavu
RESEND_API_KEY    — za email slanje (opcionalno)
```

---

## Kako seed-ati usluge (ako treba)

```bash
npx convex run --prod seed:seedServicesAndPackages
```

Output: `{ services: 9, packages: 4 }`