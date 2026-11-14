import type { ReactNode } from 'react';
import ThemeToggle from '../components/ThemeToggle';

interface AuthLayoutProps {
  children: ReactNode;
}

/* Layout de pantallas administrativas de autenticación:
   fondo institucional, tarjeta centrada y footer. */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="auth-body">
      <ThemeToggle />
      <section className="auth-card" aria-labelledby="titulo-login">
        {children}
      </section>
    </main>
  );
}
