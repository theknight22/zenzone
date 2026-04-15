import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  services: defineTable({
    name: v.string(),
    duration: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(), // "masaze" | "parcijalni" | "hidzama"
    active: v.boolean(),
  }),

  packages: defineTable({
    name: v.string(),
    description: v.string(),
    originalPrice: v.number(),
    price: v.number(),
    terms: v.string(),
    active: v.boolean(),
  }),

  bookings: defineTable({
    serviceId: v.id("services"),
    date: v.string(), // "YYYY-MM-DD"
    time: v.string(), // "HH:MM"
    mood: v.string(), // "tisina" | "muzika" | "razgovor"
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.string(),
    status: v.string(), // "čekanje" | "potvrđen" | "otkazan"
    medicalChecks: v.object({
      noBloodThinners: v.boolean(),
      noAnemia: v.boolean(),
      notPregnant: v.boolean(),
      noRecentFood: v.boolean(),
    }),
    referralSource: v.string(),
  })
    .index("by_date_time", ["date", "time"])
    .index("by_status", ["status"]),

  availability: defineTable({
    date: v.string(), // "YYYY-MM-DD"
    shift: v.string(), // "smjena1" | "smjena2" | "medu" | "zatvoreno" | ""
    blockedSlots: v.array(v.string()), // ["09:00", "10:00"] - individually blocked times
  }).index("by_date", ["date"]),

  loyalty: defineTable({
    clientPhone: v.string(),
    visitCount: v.number(),
    lastVisit: v.string(), // "YYYY-MM-DD"
  }).index("by_phone", ["clientPhone"]),

  adminSessions: defineTable({
    tokenHash: v.string(),
    expiresAt: v.number(),
    revokedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_tokenHash", ["tokenHash"])
    .index("by_expiresAt", ["expiresAt"]),
});
