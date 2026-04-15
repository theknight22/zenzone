/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Packages } from '@/components/Packages';
import { AboutMe } from '@/components/AboutMe';
import { BookingFlow } from '@/components/BookingFlow';
import { useBooking } from '@/hooks/useBooking';
import type { Service } from '@/types';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const [booking, dispatch] = useBooking();

  function handleServiceClick(service: Service, serviceId: string) {
    dispatch({ type: 'SELECT_SERVICE', service, serviceId });
    dispatch({ type: 'GO_TO_STEP', step: 2 });
    document.getElementById('zakazi')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <Hero />
      <Services onServiceSelect={handleServiceClick} />
      <Packages />
      <AboutMe />
      <BookingFlow booking={booking} dispatch={dispatch} />
    </>
  );
}
