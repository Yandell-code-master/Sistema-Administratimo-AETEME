/* Pie institucional: enlaces y aviso de derechos reservados. */
export default function FooterInstitucional() {
  return (
    <footer className="mt-4 pt-3 border-top d-flex flex-column align-items-center gap-1 text-center">
      <nav
        className="d-flex flex-wrap align-items-center justify-content-center gap-3"
        aria-label="Enlaces institucionales"
      >
        <a className="footer-link" href="#">
          <span className="material-symbols-outlined" aria-hidden="true">
            public
          </span>
          Portal Público AETEME
        </a>
        <span className="footer-sep" aria-hidden="true">
          •
        </span>
        <a className="footer-link" href="mailto:soporte@aeteme.cr">
          <span className="material-symbols-outlined" aria-hidden="true">
            support_agent
          </span>
          Mesa de Ayuda (Esparza)
        </a>
        <span className="footer-sep" aria-hidden="true">
          •
        </span>
        <span className="footer-plain">Puntarenas, CR</span>
      </nav>
      <p className="text-label-sm text-outline mt-1 mb-0">
        © Asociación Esparzana de Tenis de Mesa. Todos los derechos reservados.
      </p>
    </footer>
  );
}
