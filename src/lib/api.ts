/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Type-safe API shim for Convex.
 * This file provides a stand-in for the generated API until `npx convex dev` is run.
 * Once Convex code generation runs, replace imports of this file with:
 *   import { api } from '../../convex/_generated/api';
 */
import { makeFunctionReference } from "convex/server";
import type { DefaultFunctionArgs } from "convex/server";

const q = <A extends DefaultFunctionArgs = any, R = any>(name: string) =>
  makeFunctionReference<"query", A, R>(name);
const m = <A extends DefaultFunctionArgs = any, R = any>(name: string) =>
  makeFunctionReference<"mutation", A, R>(name);
const a = <A extends DefaultFunctionArgs = any, R = any>(name: string) =>
  makeFunctionReference<"action", A, R>(name);

export const api = {
  queries: {
    services: {
      getServices: q("queries/services:getServices"),
      getServicePackages: q("queries/services:getServicePackages"),
    },
    bookings: {
      getBookings: q<{ sessionToken: string; status?: string }>("queries/bookings:getBookings"),
      getBookingsByDate: q<{ date: string; sessionToken: string }>("queries/bookings:getBookingsByDate"),
      getBooking: q<{ id: string; sessionToken: string }>("queries/bookings:getBooking"),
    },
    availability: {
      getWeekAvailability: q<{ offset: number; sessionToken: string }>("queries/availability:getWeekAvailability"),
      getAvailableSlots: q<{ date: string }>("queries/availability:getAvailableSlots"),
    },
    loyalty: {
      getLoyaltyByPhone: q<{ phone: string }>("queries/loyalty:getLoyaltyByPhone"),
    },
  },
  mutations: {
    services: {
      addService: m("mutations/services:addService"),
      updateService: m("mutations/services:updateService"),
      toggleService: m("mutations/services:toggleService"),
    },
    bookings: {
      createBooking: m("mutations/bookings:createBooking"),
      createAdminBooking: m<{ clientName: string; date: string; time: string; serviceId: string; sessionToken: string }>("mutations/bookings:createAdminBooking"),
      updateBookingStatus: m<{ id: string; status: string; sessionToken: string }>("mutations/bookings:updateBookingStatus"),
      cancelBooking: m<{ id: string; sessionToken: string }>("mutations/bookings:cancelBooking"),
    },
    availability: {
      setShift: m<{ date: string; shift: string; sessionToken: string }>("mutations/availability:setShift"),
      setWeekShifts: m<{ offset: number; shifts: string[]; sessionToken: string }>("mutations/availability:setWeekShifts"),
      toggleBlockedSlot: m<{ date: string; time: string; sessionToken: string }>("mutations/availability:toggleBlockedSlot"),
    },
    loyalty: {
      incrementVisit: m("mutations/loyalty:incrementVisit"),
    },
  },
  actions: {
    auth: {
      createAdminSession: a<
        { password: string },
        | { success: false }
        | { success: true; sessionToken: string; expiresAt: number }
      >("actions/auth:createAdminSession"),
      verifyAdminSession: a<{ sessionToken: string }, { valid: boolean; expiresAt?: number }>("actions/auth:verifyAdminSession"),
      logoutAdminSession: a<{ sessionToken: string }, { success: boolean }>("actions/auth:logoutAdminSession"),
    },
    emails: {
      sendBookingReceived: a("actions/emails:sendBookingReceived"),
      sendBookingConfirmed: a("actions/emails:sendBookingConfirmed"),
      sendBookingCancelled: a("actions/emails:sendBookingCancelled"),
      sendDailyReminder: a("actions/emails:sendDailyReminder"),
      sendNewBookingAdmin: a("actions/emails:sendNewBookingAdmin"),
      sendDailyReminders: a("actions/emails:sendDailyReminders"),
    },
  },
  cron: {
    dailyReminders: m("cron:dailyReminders"),
  },
  seed: {
    seedServicesAndPackages: m("seed:seedServicesAndPackages"),
  },
};
