/* eslint-disable react-refresh/only-export-components */
import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/lib/api';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { DayOverview } from '@/components/admin/DayOverview';
import { WeekAvailability } from '@/components/admin/WeekAvailability';
import { AppointmentTable } from '@/components/admin/AppointmentTable';
import { mapConvexBooking, mapConvexAvailability } from '@/lib/mappers';
import type { Appointment, AppointmentStatus, Shift } from '@/types/admin';
import { clearStoredAdminSession, getStoredAdminSession, setStoredAdminSession } from '@/lib/adminSession';

interface AdminSession {
  sessionToken: string;
  expiresAt: number;
}

function sessionsEqual(a: AdminSession | null, b: AdminSession | null): boolean {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.sessionToken === b.sessionToken && a.expiresAt === b.expiresAt;
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const Route = createLazyFileRoute('/admin')({
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<AdminSession | null>(() => getStoredAdminSession());
  const [verifiedSession, setVerifiedSession] = useState<AdminSession | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const todayStr = fmtDate(new Date());
  const verifyAdminSession = useAction(api.actions.auth.verifyAdminSession);
  const logoutAdminSession = useAction(api.actions.auth.logoutAdminSession);

  useEffect(() => {
    if (!session) {
      return;
    }

    let cancelled = false;

    void verifyAdminSession({ sessionToken: session.sessionToken })
      .then((result) => {
        if (cancelled) {
          return;
        }

        if (!result.valid) {
          clearStoredAdminSession();
          setSession(null);
          setVerifiedSession(null);
          return;
        }

        if (typeof result.expiresAt === 'number' && result.expiresAt !== session.expiresAt) {
          const nextSession = { ...session, expiresAt: result.expiresAt };
          setStoredAdminSession(nextSession);
          setSession((prev) => (sessionsEqual(prev, nextSession) ? prev : nextSession));
          setVerifiedSession((prev) => (sessionsEqual(prev, nextSession) ? prev : nextSession));
          return;
        }

        setVerifiedSession((prev) => (sessionsEqual(prev, session) ? prev : session));
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        clearStoredAdminSession();
        setSession(null);
        setVerifiedSession(null);
      });

    return () => {
      cancelled = true;
    };
  }, [session, verifyAdminSession]);

  // Convex queries
  const bookingsData = useQuery(
    api.queries.bookings.getBookings,
    verifiedSession ? { sessionToken: verifiedSession.sessionToken } : 'skip',
  );
  const todayBookingsData = useQuery(
    api.queries.bookings.getBookingsByDate,
    verifiedSession ? { date: todayStr, sessionToken: verifiedSession.sessionToken } : 'skip',
  );
  const availabilityData = useQuery(
    api.queries.availability.getWeekAvailability,
    verifiedSession ? { offset: weekOffset, sessionToken: verifiedSession.sessionToken } : 'skip',
  );

  // Convex mutations
  const updateBookingStatus = useMutation(api.mutations.bookings.updateBookingStatus);
  const setShift = useMutation(api.mutations.availability.setShift);

  // Map to frontend types
  const appointments: Appointment[] = (bookingsData ?? []).map(mapConvexBooking);
  const todayAppointments: Appointment[] = (todayBookingsData ?? []).map(mapConvexBooking);
  const availability = mapConvexAvailability(availabilityData ?? []);
  const todayApts = todayAppointments.filter((a) => a.status !== 'otkazan');

  function handleStatusChange(id: string, status: AppointmentStatus) {
    if (!verifiedSession) {
      return;
    }
    updateBookingStatus({ id: id as any, status, sessionToken: verifiedSession.sessionToken }); // eslint-disable-line @typescript-eslint/no-explicit-any -- Convex Id type
  }

  function handleShiftChange(date: string, shift: Shift) {
    if (!verifiedSession) {
      return;
    }
    setShift({ date, shift: shift ?? '', sessionToken: verifiedSession.sessionToken });
  }

  function handleLogin(nextSession: AdminSession) {
    setStoredAdminSession(nextSession);
    setSession(nextSession);
    setVerifiedSession(nextSession);
  }

  function handleLogout() {
    const currentSession = verifiedSession ?? session;
    clearStoredAdminSession();
    setSession(null);
    setVerifiedSession(null);

    if (!currentSession) {
      return;
    }

    void logoutAdminSession({ sessionToken: currentSession.sessionToken });
  }

  if (session && !verifiedSession) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="text-warm-600 text-sm">Provjera sesije...</div>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <AdminHeader onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Section 1: Today's overview */}
        <section id="pregled">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-xl sm:text-2xl text-sage-800">Današnji termini</h2>
            <span className="text-xs sm:text-sm text-warm-400">{todayApts.length} termina</span>
          </div>
          <DayOverview appointments={todayApts} onStatusChange={handleStatusChange} />
        </section>

        {/* Section 2: Week availability */}
        <section id="dostupnost">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-xl sm:text-2xl text-sage-800">Dostupnost</h2>
          </div>
          <WeekAvailability
            availability={availability}
            weekOffset={weekOffset}
            onWeekOffsetChange={setWeekOffset}
            onShiftChange={handleShiftChange}
          />
        </section>

        {/* Section 3: All appointments */}
        <section id="lista">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-xl sm:text-2xl text-sage-800">Svi termini</h2>
            <span className="text-xs sm:text-sm text-warm-400">{appointments.length} ukupno</span>
          </div>
          <div className="bg-white rounded-xl border border-cream-200 overflow-hidden">
            <AppointmentTable appointments={appointments} onStatusChange={handleStatusChange} />
          </div>
        </section>
      </div>
    </div>
  );
}
