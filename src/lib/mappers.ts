import type { Service } from '@/types';
import type { Appointment, Shift } from '@/types/admin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConvexDoc = any;

/**
 * Map a Convex service document to the frontend Service type.
 * Convex docs have _id (Id type) which we convert to string id.
 */
export function mapConvexService(doc: ConvexDoc): Service {
  return {
    id: doc._id.toString(),
    name: doc.name,
    duration: doc.duration,
    description: doc.description,
    price: doc.price,
    category: doc.category,
  };
}

/**
 * Map a Convex booking document (with joined service data) to the frontend Appointment type.
 * The getBookings query returns bookings with serviceName, servicePrice, etc. attached.
 */
export function mapConvexBooking(doc: ConvexDoc): Appointment {
  return {
    id: doc._id.toString(),
    date: doc.date,
    time: doc.time,
    service: {
      id: doc.serviceId.toString(),
      name: doc.serviceName,
      duration: doc.serviceDuration,
      description: '',
      price: doc.servicePrice,
      category: doc.serviceCategory,
    },
    mood: doc.mood,
    clientName: doc.clientName,
    clientPhone: doc.clientPhone,
    status: doc.status,
    referralSource: doc.referralSource,
  };
}

/**
 * Map Convex availability records to DayAvailability[].
 */
export function mapConvexAvailability(docs: ConvexDoc[]): { date: string; shift: Shift; blockedSlots: string[] }[] {
  return docs.map((doc) => ({
    date: doc.date,
    shift: (doc.shift || null) as Shift,
    blockedSlots: doc.blockedSlots ?? [],
  }));
}
