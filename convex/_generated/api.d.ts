/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_auth from "../actions/auth.js";
import type * as actions_emails from "../actions/emails.js";
import type * as authSessions from "../authSessions.js";
import type * as cron from "../cron.js";
import type * as lib_adminAuth from "../lib/adminAuth.js";
import type * as lib_constants from "../lib/constants.js";
import type * as lib_slots from "../lib/slots.js";
import type * as mutations_availability from "../mutations/availability.js";
import type * as mutations_bookings from "../mutations/bookings.js";
import type * as mutations_loyalty from "../mutations/loyalty.js";
import type * as mutations_services from "../mutations/services.js";
import type * as queries_availability from "../queries/availability.js";
import type * as queries_bookings from "../queries/bookings.js";
import type * as queries_loyalty from "../queries/loyalty.js";
import type * as queries_services from "../queries/services.js";
import type * as seed from "../seed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/auth": typeof actions_auth;
  "actions/emails": typeof actions_emails;
  authSessions: typeof authSessions;
  cron: typeof cron;
  "lib/adminAuth": typeof lib_adminAuth;
  "lib/constants": typeof lib_constants;
  "lib/slots": typeof lib_slots;
  "mutations/availability": typeof mutations_availability;
  "mutations/bookings": typeof mutations_bookings;
  "mutations/loyalty": typeof mutations_loyalty;
  "mutations/services": typeof mutations_services;
  "queries/availability": typeof queries_availability;
  "queries/bookings": typeof queries_bookings;
  "queries/loyalty": typeof queries_loyalty;
  "queries/services": typeof queries_services;
  seed: typeof seed;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
