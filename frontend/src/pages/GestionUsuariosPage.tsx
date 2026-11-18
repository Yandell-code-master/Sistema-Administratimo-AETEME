import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

interface UsuarioAdmin {
  id: string;
  nombre: string;
  correo: string;
  avatar: string;
}

const USUARIOS_INICIALES: UsuarioAdmin[] = [
  {
    id: 'u-2',
    nombre: 'Lic. Roberto Méndez Castro',
    correo: 'r.mendez@aeteme.cr',
    avatar: 'RM',
  },
  {
    id: 'u-3',
    nombre: 'Lic. Gabriel Fallas Mora',
    correo: 'g.fallas@aeteme.cr',
    avatar: 'GF',
  },
  {
    id: 'u-4',
    nombre: 'Prof. Marlon Araya Rojas',
    correo: 'm.araya@aeteme.cr',
    avatar: 'MA',
  },
];

const normalizar = (texto: string) =>
  texto
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/* Gestión de Usuarios — pantalla exclusiva del SuperAdministrador (RF-SU-01.02).
   La eliminación de una cuenta es lógica (Activo = 0 en base de datos), pero la
   cuenta dada de baja se retira de esta vista: el atributo estado/Activo es un
   detalle de persistencia y no se muestra. */
export default function GestionUsuariosPage() {
  const [termino, setTermino] = useState('');
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>(USUARIOS_INICIALES);
  const [destino, setDestino] = useState<UsuarioAdmin | null>(null);
  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null);

  const filtrados = useMemo(() => {
    const q = normalizar(termino.trim());
    if (!q) return usuarios;
    return usuarios.filter(
      (usuario) => normalizar(usuario.nombre).includes(q) || normalizar(usuario.correo).includes(q),
    );
  }, [termino, usuarios]);

  function confirmarBaja() {
    if (!destino) return;
    setUsuarios((prev) => prev.filter((usuario) => usuario.id !== destino.id));
    setToast({
      message: `Cuenta de ${destino.nombre} desactivada correctamente`,
      icon: 'person_off',
    });
    setDestino(null);
  }

  return (
    <AdminLayout>
      <nav className="breadcrumb-aeteme text-label-sm" aria-label="Ruta de navegación">
        <a href="/">
          <span className="material-symbols-outlined" aria-hidden="true">
            home
          </span>
          Consola AETEME
        </a>
        <span className="material-symbols-outlined breadcrumb-sep" aria-hidden="true">
          chevron_right
        </span>
        <span>Subsistema Operativo</span>
        <span className="material-symbols-outlined breadcrumb-sep" aria-hidden="true">
          chevron_right
        </span>
        <span className="breadcrumb-current" aria-current="page">
          Gestión de Usuarios
        </span>
      </nav>

      <div className="page-head">
        <div className="page-head-text">
          <h1 className="text-headline-xl text-on-surface">Gestión de Usuarios</h1>
          <p className="page-subtitle text-body-md">
            Administración centralizada, control estricto de roles jerárquicos y estados de acceso
            federado para el equipo de gestión de la Asociación Esparzana de Tenis de Mesa (AETEME).
          </p>
        </div>
        <div>
          <Link className="btn-aeteme-primary text-label-lg" to="/registro">
            <span className="material-symbols-outlined" aria-hidden="true">
              person_add
            </span>
            <span>Registrar usuario</span>
          </Link>
        </div>
      </div>

      <section className="advisory-banner" aria-label="Control de accesos institucionales">
        <div className="advisory-icon">
          <span className="material-symbols-outlined" aria-hidden="true">
            verified_user
          </span>
        </div>
        <div>
          <span className="advisory-title text-label-md">Control de Accesos Institucionales</span>
          <p className="text-body-md">
            Como <strong>SuperAdministrador</strong>, usted tiene la facultad exclusiva de registrar
            administradores y gestionar estados de cuentas activas en la Asociación Esparzana de
            Tenis de Mesa.
          </p>
        </div>
      </section>

      <section className="panel-card" aria-labelledby="tituloTablaUsuarios">
        <h2 className="visually-hidden" id="tituloTablaUsuarios">
          Listado de usuarios administrativos
        </h2>

        <div className="panel-toolbar">
          <div className="search-field">
            <span className="material-symbols-outlined" aria-hidden="true">
              search
            </span>
            <label className="visually-hidden" htmlFor="buscadorUsuarios">
              Buscar usuarios por nombre o correo
            </label>
            <input
              className="search-input"
              type="search"
              id="buscadorUsuarios"
              placeholder="Buscar por nombre o correo"
              autoComplete="off"
              value={termino}
              onChange={(evento) => setTermino(evento.target.value)}
            />
          </div>
        </div>

        <div className="table-scroll">
          <table className="admin-table">
            <caption className="visually-hidden">
              Cuentas administrativas registradas en AETEME
            </caption>
            <thead>
              <tr className="text-label-sm">
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col" className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-body-sm text-on-surface-variant p-4">
                    {termino.trim()
                      ? 'Ningún usuario coincide con la búsqueda.'
                      : 'No hay usuarios registrados.'}
                  </td>
                </tr>
              ) : (
                filtrados.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="user-row"
                    data-nombre={usuario.nombre}
                    data-correo={usuario.correo}
                  >
                    <td>
                      <div className="user-cell">
                        <span className="user-avatar user-avatar--soft" aria-hidden="true">
                          {usuario.avatar}
                        </span>
                        <span className="user-name text-on-surface">{usuario.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <a className="user-email text-body-md" href={`mailto:${usuario.correo}`}>
                        {usuario.correo}
                      </a>
                    </td>
                    <td className="text-end action-cell">
                      <button
                        type="button"
                        className="btn-icon-danger js-baja"
                        data-usuario={usuario.nombre}
                        title={`Dar de baja a ${usuario.nombre}`}
                        aria-label={`Dar de baja a ${usuario.nombre}`}
                        onClick={() => setDestino(usuario)}
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        open={destino !== null}
        title={`Dar de baja a ${destino?.nombre ?? ''}`}
        description="La cuenta se desactivará y sus tokens se revocarán. El historial se conserva (eliminación lógica)."
        confirmLabel="Dar de baja"
        onConfirm={confirmarBaja}
        onClose={() => setDestino(null)}
      />

      <Toast
        message={toast?.message ?? null}
        icon={toast?.icon ?? 'check_circle'}
        onDismiss={() => setToast(null)}
      />
    </AdminLayout>
  );
}
