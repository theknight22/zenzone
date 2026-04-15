# ZenZone Backend — IMPLEMENTIRAN

## Status: ✅ COMPLETE

Sve je implementirano i deploy-ano na production.

## Live Deployment

- **URL:** https://clean-seahorse-627.eu-west-1.convex.cloud
- **Frontend:** https://zen-zone-besic.vercel.app

---

## Schema — `convex/schema.ts`

```ts
services: defineTable({
  name: string,
  duration: string,
  description: string,
  price: number,
  category: string,     // "masaze" | "parcijalni" | "hidzama"
  active: boolean,
}).index("by_category", ["category"])

packages: defineTable({
  name: string,
  description: string,
  originalPrice: number,
  price: number,
  terms: string,
  active: boolean,
})

bookings: defineTable({
  serviceId: v.id("services"),
  date: string,          // "2026-04-20"
  time: string,          // "09:00"
  mood: string,           // "tisina" | "muzika" | "razgovor"
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  status: string,         // "čekanje" | "potvrđen" | "otkazan"
  medicalChecks: object,
  referralSource: string,
}).index("by_date_time", ["date", "time"])
  .index("by_status", ["status"])

availability: defineTable({
  date: string,
  shift: string,          // "smjena1" | "smjena2" | "medu" | "zatvoreno" | ""
  blockedSlots: optional(array(string)),  // ["09:00", "10:00"]
}).index("by_date", ["date"])

loyalty: defineTable({
  clientPhone: string,
  visitCount: number,
  lastVisit: string,
}).index("by_phone", ["clientPhone"])

adminSessions: defineTable({
  tokenHash: string,
  expiresAt: number,
  revokedAt: optional(number),
  createdAt: number,
}).index("by_tokenHash", ["tokenHash"])
  .index("by_expiresAt", ["expiresAt"])
```

---

## Queries — `convex/queries/`

| Query | Opis |
|-------|------|
| `getServices` | Sve aktivne usluge |
| `getServicePackages` | Svi aktivni paketi |
| `getBookings(sessionToken)` | Svi termini (admin) |
| `getBookingsByDate(date, sessionToken)` | Termini za datum |
| `getBooking(id)` | Jedan termin |
| `getAvailableSlots(date)` | Slobodni termini za dan |
| `getWeekAvailability(offset, sessionToken)` | Dostupnost za sedmicu |
| `getLoyaltyByPhone(phone)` | Loyalty podaci |

---

## Mutations — `convex/mutations/`

| Mutation | Opis |
|----------|------|
| `createBooking(...)` | Kreiraj termin (status: čekanje) |
| `updateBookingStatus(id, status, sessionToken)` | Potvrdi/otkaži |
| `cancelBooking(id, sessionToken)` | Otkaži termin |
| `setShift(date, shift, sessionToken)` | Postavi smjenu za dan |
| `setWeekShifts(offset, shifts[], sessionToken)` | Postavi smjene za sedmicu |
| `toggleBlockedSlot(date, time, sessionToken)` | Blokiraj/odblokiraj sat |
| `addService(...)` | Dodaj uslugu |
| `updateService(id, ...)` | Uredi uslugu |
| `toggleService(id)` | Aktiviraj/deaktiviraj |

---

## Actions — `convex/actions/`

| Action | Opis |
|--------|------|
| `verifyAdminSession(sessionToken)` | Verifikuj admin sesiju |
| `createAdminSession(password)` | Kreiraj sesiju (login) |
| `logoutAdminSession(sessionToken)` | Logout |
| `sendBookingReceived(bookingId)` | Email: termin primljen |
| `sendBookingConfirmed(bookingId)` | Email: termin potvrđen |
| `sendBookingCancelled(bookingId)` | Email: termin otkazan |
| `sendNewBookingAdmin(bookingId)` | Email: admin o novom terminu |
| `sendDailyReminder(bookingId)` | Email: podsjetnik 24h prije |
| `sendDailyReminders()` | Cron: šalje sve podsjetnike |

---

## Kako seed-ati usluge

```bash
npx convex run --prod seed:seedServicesAndPackages
```

Output: `{ services: 9, packages: 4 }`

---

## Dostupnost / Smjene

### Slotovi

Dostupni sati: 08, 09, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20

### Shift logika

| Shift | Zauzet (drugi posao) | Slobodan za masažu |
|-------|----------------------|-------------------|
| `null` (nema zapisa) | — | Svi |
| `smjena1` | 08–16 | 17, 18, 19, 20 |
| `smjena2` | 13–21 | 08, 09, 10, 11 |
| `medu` | 10–18 | 08, 09, 19, 20 |
| `zatvoreno` | Svi | Nijedan |

### Individualno blokiranje

Svaki sat se može individualno blokirati/odblokirati klikom u admin panelu (WeekAvailability → DayColumn → klik na sat).

---

## Environment varijable

Postavljanje na Convex production:

```bash
npx convex env set ADMIN_PASSWORD "tvoja-sifra" --prod
npx convex env set RESEND_API_KEY "re_xxx" --prod  # ako koristiš email
```

---

## Kako dodati nove usluge

1. U `convex/seed.ts` dodaj u `servicesCatalog` array
2. Run `npx convex run --prod seed:seedServicesAndPackages`

---

## Cron job

Postoji `sendDailyReminders` action koji se može pozvati ručno:

```bash
npx convex run --prod actions/emails:sendDailyReminders
```

Šalje podsjetnike za sve potvrđene termine za sutra.