/* eslint-disable react-refresh/only-export-components */
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const location = useRouterState({ select: (s) => s.location });
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
