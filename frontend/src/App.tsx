/* Página temporal de la Fase 0: confirma que Vite compila, que los estilos
   compartidos cargan y que el proxy hacia /api está configurado.
   Se reemplaza por las pantallas reales en las fases 1-3. */

const fases = [
  {
    nombre: 'Fase 0 · Andamiaje',
    detalle: 'Vite, TypeScript, estilos y Docker de desarrollo',
    estado: 'actual',
  },
  {
    nombre: 'Fase 1 · Inicio de sesión',
    detalle: 'AuthLayout, alertas, captcha y campos de formulario',
    estado: 'pendiente',
  },
  {
    nombre: 'Fase 2 · Registro de usuario',
    detalle: 'Formulario reutilizando los campos compartidos',
    estado: 'pendiente',
  },
  {
    nombre: 'Fase 3 · Gestión de usuarios',
    detalle: 'Tabla, búsqueda, modal de baja y avisos',
    estado: 'pendiente',
  },
  {
    nombre: 'Fase 4 · Conexión con la API',
    detalle: 'Autenticación real y consultas tipadas',
    estado: 'pendiente',
  },
];

export default function App() {
  return (
    <main className="auth-body">
      <section className="auth-card" aria-labelledby="titulo-migracion">
        <header className="text-center mb-4">
          <div className="mb-2">
            <div className="logo-mark" role="img" aria-label="Logo AETEME">
              AETEME
            </div>
          </div>
          <span className="badge-system mb-1">
            <span className="dot" aria-hidden="true" />
            Frontend en migración
          </span>
          <h1 id="titulo-migracion" className="text-headline-md text-on-surface mt-1 mb-1">
            React + Vite + TypeScript
          </h1>
          <p
            className="text-body-sm text-on-surface-variant mb-0 mx-auto"
            style={{ maxWidth: '24rem' }}
          >
            El frontend ya se compila con Vite y reutiliza los estilos del sistema. Las pantallas se
            portan una por una en las siguientes fases.
          </p>
        </header>

        <ol className="list-group list-group-flush mb-4">
          {fases.map((fase) => (
            <li
              key={fase.nombre}
              className="list-group-item d-flex justify-content-between align-items-start gap-3 px-0"
            >
              <div>
                <p className="text-label-lg text-on-surface mb-0">{fase.nombre}</p>
                <p className="text-body-sm text-on-surface-variant mb-0">{fase.detalle}</p>
              </div>
              <span
                className={`badge ${fase.estado === 'actual' ? 'text-bg-primary' : 'text-bg-light'}`}
              >
                {fase.estado}
              </span>
            </li>
          ))}
        </ol>

        <div className="policy-note">
          <span className="material-symbols-outlined" aria-hidden="true">
            shield_person
          </span>
          <p>
            Las pantallas antiguas en <code>frontend/usuarios/</code> siguen disponibles para
            comparación visual hasta terminar las fases 1 a 3.
          </p>
        </div>
      </section>
    </main>
  );
}
