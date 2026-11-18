import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

interface AdminLayoutProps {
  children: ReactNode;
}

/* Layout del panel administrativo: barra lateral con secciones y encabezado superior.
   Replica la estructura del legacy (admin-body + admin-sidebar + admin-header). */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar-link${isActive ? ' is-active' : ''}`;

  return (
    <div className="admin-body">
      <a className="skip-link text-label-md" href="#contenidoPrincipal">
        Saltar al contenido principal
      </a>

      <aside
        className={`admin-sidebar${isOpen ? ' is-open' : ''}`}
        aria-label="Navegación principal"
      >
        <div className="sidebar-scroll">
          <div className="sidebar-brand">
            <span className="sidebar-logo" aria-hidden="true">
              AE
            </span>
            <span className="d-flex flex-column">
              <span className="text-headline-sm text-primary">AETEME</span>
              <span className="text-label-sm text-on-surface-variant text-uppercase">
                Admin Ops CR
              </span>
            </span>
          </div>

          <nav className="sidebar-nav text-label-md" aria-label="Secciones del sistema">
            <span className="sidebar-group-label text-label-sm">Principal</span>
            <a className="sidebar-link" href="#">
              <span className="material-symbols-outlined" aria-hidden="true">
                grid_view
              </span>
              Dashboard
            </a>

            <span className="sidebar-group-label text-label-sm">
              <span>Seguridad &amp; Control</span>
              <span className="sidebar-badge">SuperAdmin</span>
            </span>
            <NavLink to="/usuarios" className={linkClass} onClick={() => setIsOpen(false)}>
              <span className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined" aria-hidden="true">
                  manage_accounts
                </span>
                Gestión de Usuarios
              </span>
              <span className="sidebar-link-dot" aria-hidden="true" />
            </NavLink>
            <NavLink to="/registro" className={linkClass} onClick={() => setIsOpen(false)}>
              <span className="material-symbols-outlined" aria-hidden="true">
                person_add
              </span>
              Registrar usuario
            </NavLink>
            <a className="sidebar-link sidebar-link--between" href="#">
              <span className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined" aria-hidden="true">
                  history_edu
                </span>
                Bitácora Auditoría
              </span>
              <span className="material-symbols-outlined sidebar-lock" aria-hidden="true">
                lock
              </span>
            </a>

            <span className="sidebar-group-label text-label-sm">Gestión Contenido</span>
            <NavLink to="/noticias" className={linkClass} onClick={() => setIsOpen(false)}>
              <span className="material-symbols-outlined" aria-hidden="true">
                newspaper
              </span>
              Noticias Deportivas
            </NavLink>
            <a className="sidebar-link" href="#">
              <span className="material-symbols-outlined" aria-hidden="true">
                emoji_events
              </span>
              Eventos &amp; Torneos
            </a>
            <a className="sidebar-link" href="#">
              <span className="material-symbols-outlined" aria-hidden="true">
                handshake
              </span>
              Patrocinadores
            </a>

            <span className="sidebar-group-label text-label-sm">Alianzas &amp; Sistemas</span>
            <a
              className="sidebar-link sidebar-link--between"
              href="#"
              rel="noreferrer"
              target="_blank"
            >
              <span className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined" aria-hidden="true">
                  groups
                </span>
                CheerSquad
              </span>
              <span className="material-symbols-outlined sidebar-lock" aria-hidden="true">
                open_in_new
              </span>
            </a>
            <a
              className="sidebar-link sidebar-link--between"
              href="#"
              rel="noreferrer"
              target="_blank"
            >
              <span className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined" aria-hidden="true">
                  sports_score
                </span>
                TTplayBook
              </span>
              <span className="material-symbols-outlined sidebar-lock" aria-hidden="true">
                open_in_new
              </span>
            </a>

            <span className="sidebar-group-label text-label-sm">Cuenta</span>
            <a className="sidebar-link" href="#">
              <span className="material-symbols-outlined" aria-hidden="true">
                badge
              </span>
              Mi Perfil
            </a>
          </nav>
        </div>
      </aside>

      <div className="sidebar-backdrop" hidden={!isOpen} onClick={() => setIsOpen(false)} />

      <header className="admin-header">
        <div className="admin-header-brand">
          <button
            type="button"
            className="admin-menu-btn"
            aria-label="Abrir menú de navegación"
            aria-controls="barraLateral"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((abierto) => !abierto)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              menu
            </span>
          </button>
          <div className="admin-header-title">
            <span className="material-symbols-outlined" aria-hidden="true">
              admin_panel_settings
            </span>
            Sistema Administrativo AETEME
          </div>
        </div>

        <div className="admin-header-user">
          <div className="admin-user-meta">
            <span className="admin-user-name text-label-md">
              Licda. Carmen Solís
              <span className="material-symbols-outlined" aria-hidden="true">
                workspace_premium
              </span>
            </span>
            <span className="admin-user-role">SuperAdministrador</span>
          </div>
          <span className="admin-avatar" aria-hidden="true">
            CS
          </span>
          <ThemeToggle inline />
          <a className="btn-logout" href="/" title="Cerrar sesión" aria-label="Cerrar sesión">
            <span className="material-symbols-outlined" aria-hidden="true">
              logout
            </span>
          </a>
        </div>
      </header>

      <main className="admin-main" id="contenidoPrincipal">
        {children}
      </main>
    </div>
  );
}
