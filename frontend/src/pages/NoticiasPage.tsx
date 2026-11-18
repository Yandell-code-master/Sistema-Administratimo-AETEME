import { useCallback, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ConfirmDialog from '../components/ConfirmDialog';
import NoticiaEstadoChip from '../components/NoticiaEstadoChip';
import Toast from '../components/Toast';
import {
  CATEGORIAS_NOTICIA,
  ESTADOS_NOTICIA,
  ETIQUETA_ESTADO,
  FILTROS_VACIOS,
  contarPorEstado,
  crearExtracto,
  esCategoriaNoticia,
  esEstadoVisible,
  estadoVisible,
  filtrarNoticias,
  formatearFecha,
  hayFiltrosActivos,
  leerAviso,
} from '../lib/noticias';
import type { AvisoNoticias, FiltrosNoticias, Noticia } from '../lib/noticias';
import { desactivarNoticia, useNoticias } from '../lib/noticiasStore';

const POR_PAGINA = 5;

const TARJETAS_RESUMEN = [
  { estado: 'publicada', etiqueta: 'Publicadas', icono: 'public' },
  { estado: 'programada', etiqueta: 'Programadas', icono: 'schedule' },
  { estado: 'borrador', etiqueta: 'Borradores', icono: 'edit_note' },
  { estado: 'archivada', etiqueta: 'Archivadas', icono: 'inventory_2' },
] as const;

/* Noticias Deportivas — listado administrativo del Subsistema de Noticias (RF-SN-01.01).
   Lo usan el Administrador y el SuperAdministrador. */
export default function NoticiasPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const noticias = useNoticias();

  const [filtros, setFiltros] = useState<FiltrosNoticias>(FILTROS_VACIOS);
  const [pagina, setPagina] = useState(1);
  const [destino, setDestino] = useState<Noticia | null>(null);
  // El formulario deja su aviso (creada, modificada...) en el estado de la navegación.
  const [toast, setToast] = useState<AvisoNoticias | null>(() => leerAviso(location.state));

  const totales = useMemo(() => contarPorEstado(noticias), [noticias]);
  const filtradas = useMemo(() => filtrarNoticias(noticias, filtros), [noticias, filtros]);

  // La página se acota al calcularla: si los filtros reducen el listado no queda fuera de rango.
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * POR_PAGINA;
  const visibles = filtradas.slice(inicio, inicio + POR_PAGINA);

  const cerrarToast = useCallback(() => {
    setToast(null);
    // Se limpia el estado de la navegación para que el aviso no reaparezca al recargar.
    if (location.state !== null) navigate(location.pathname, { replace: true, state: null });
  }, [navigate, location.pathname, location.state]);

  function cambiarFiltro<K extends keyof FiltrosNoticias>(campo: K, valor: FiltrosNoticias[K]) {
    setFiltros((previos) => ({ ...previos, [campo]: valor }));
    setPagina(1);
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_VACIOS);
    setPagina(1);
  }

  function descargarPdf(noticia: Noticia) {
    // Prototipo: la API generará el archivo (RF-SN-01.01.05, componente Generador de PDF).
    setToast({ message: `Generando el PDF de «${noticia.titulo}»…`, icon: 'picture_as_pdf' });
  }

  function confirmarDesactivacion() {
    if (!destino) return;
    desactivarNoticia(destino.id);
    setToast({
      message: 'Noticia desactivada y retirada del portal público',
      icon: 'visibility_off',
    });
    setDestino(null);
  }

  return (
    <AdminLayout>
      <nav className="breadcrumb-aeteme text-label-sm" aria-label="Ruta de navegación">
        <Link to="/">
          <span className="material-symbols-outlined" aria-hidden="true">
            home
          </span>
          Consola AETEME
        </Link>
        <span className="material-symbols-outlined breadcrumb-sep" aria-hidden="true">
          chevron_right
        </span>
        <span>Gestión de Contenido</span>
        <span className="material-symbols-outlined breadcrumb-sep" aria-hidden="true">
          chevron_right
        </span>
        <span className="breadcrumb-current" aria-current="page">
          Noticias Deportivas
        </span>
      </nav>

      <div className="page-head">
        <div className="page-head-text">
          <h1 className="text-headline-xl text-on-surface">Noticias Deportivas</h1>
          <p className="page-subtitle text-body-md">
            Creación, edición, programación y publicación de las noticias y comunicados oficiales de
            la Asociación Esparzana de Tenis de Mesa (AETEME).
          </p>
        </div>
        <div>
          <Link className="btn-aeteme-primary text-label-lg" to="/noticias/nueva">
            <span className="material-symbols-outlined" aria-hidden="true">
              add
            </span>
            <span>Nueva noticia</span>
          </Link>
        </div>
      </div>

      <section className="stat-grid" aria-label="Resumen de noticias activas">
        {TARJETAS_RESUMEN.map((tarjeta) => (
          <div className="stat-card" key={tarjeta.estado}>
            <div>
              <span className="stat-label text-label-sm">{tarjeta.etiqueta}</span>
              <span className="stat-value text-headline-xl">{totales[tarjeta.estado]}</span>
            </div>
            <span className={`stat-icon stat-icon--${tarjeta.estado}`} aria-hidden="true">
              <span className="material-symbols-outlined">{tarjeta.icono}</span>
            </span>
          </div>
        ))}
      </section>

      <section className="advisory-banner" aria-label="Flujo de publicación">
        <div className="advisory-icon">
          <span className="material-symbols-outlined" aria-hidden="true">
            publish
          </span>
        </div>
        <div>
          <span className="advisory-title text-label-md">Flujo de publicación</span>
          <p className="text-body-md">
            Cada noticia pasa por cuatro estados: <strong>Borrador</strong>,{' '}
            <strong>Programada</strong>, <strong>Publicada</strong> y <strong>Archivada</strong>. El
            portal público solo muestra las noticias activas, publicadas y con fecha de publicación
            igual o anterior a hoy.
          </p>
        </div>
      </section>

      <section className="panel-card" aria-labelledby="tituloTablaNoticias">
        <h2 className="visually-hidden" id="tituloTablaNoticias">
          Listado de noticias
        </h2>

        <div className="panel-toolbar noticias-toolbar">
          <div className="search-field">
            <span className="material-symbols-outlined" aria-hidden="true">
              search
            </span>
            <label className="visually-hidden" htmlFor="buscadorNoticias">
              Buscar noticias por título o contenido
            </label>
            <input
              className="search-input"
              type="search"
              id="buscadorNoticias"
              placeholder="Buscar por título o contenido"
              autoComplete="off"
              value={filtros.termino}
              onChange={(evento) => cambiarFiltro('termino', evento.target.value)}
            />
          </div>

          <div className="filter-field">
            <label className="text-label-sm" htmlFor="filtroCategoria">
              Categoría
            </label>
            <select
              className="filter-control"
              id="filtroCategoria"
              value={filtros.categoria}
              onChange={(evento) => {
                const valor = evento.target.value;
                cambiarFiltro('categoria', esCategoriaNoticia(valor) ? valor : '');
              }}
            >
              <option value="">Todas</option>
              {CATEGORIAS_NOTICIA.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label className="text-label-sm" htmlFor="filtroEstado">
              Estado
            </label>
            <select
              className="filter-control"
              id="filtroEstado"
              value={filtros.estado}
              onChange={(evento) => {
                const valor = evento.target.value;
                cambiarFiltro('estado', esEstadoVisible(valor) ? valor : '');
              }}
            >
              <option value="">Todos</option>
              {ESTADOS_NOTICIA.map((estado) => (
                <option key={estado} value={estado}>
                  {ETIQUETA_ESTADO[estado]}
                </option>
              ))}
              <option value="desactivada">Desactivada</option>
            </select>
          </div>

          <div className="filter-field">
            <label className="text-label-sm" htmlFor="filtroDesde">
              Publicada desde
            </label>
            <input
              className="filter-control"
              type="date"
              id="filtroDesde"
              value={filtros.desde}
              max={filtros.hasta || undefined}
              onChange={(evento) => cambiarFiltro('desde', evento.target.value)}
            />
          </div>

          <div className="filter-field">
            <label className="text-label-sm" htmlFor="filtroHasta">
              Hasta
            </label>
            <input
              className="filter-control"
              type="date"
              id="filtroHasta"
              value={filtros.hasta}
              min={filtros.desde || undefined}
              onChange={(evento) => cambiarFiltro('hasta', evento.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn-aeteme-secondary text-label-md"
            onClick={limpiarFiltros}
            disabled={!hayFiltrosActivos(filtros)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              filter_alt_off
            </span>
            <span>Limpiar filtros</span>
          </button>
        </div>

        <div className="table-scroll">
          <table className="admin-table">
            <caption className="visually-hidden">Noticias registradas en AETEME</caption>
            <thead>
              <tr className="text-label-sm">
                <th scope="col">Noticia</th>
                <th scope="col" className="col-categoria">
                  Categoría
                </th>
                <th scope="col">Estado</th>
                <th scope="col" className="col-fecha">
                  Publicación
                </th>
                <th scope="col" className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-body-sm text-on-surface-variant p-4">
                    Ninguna noticia coincide con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                visibles.map((noticia) => {
                  const inactiva = !noticia.activo;
                  const fecha = noticia.fechaPublicacion
                    ? formatearFecha(noticia.fechaPublicacion)
                    : null;
                  return (
                    <tr key={noticia.id} className={inactiva ? 'noticia-row--inactive' : undefined}>
                      <td>
                        <div className="noticia-cell">
                          <span className="noticia-thumb" aria-hidden="true">
                            {noticia.imagenUrl ? (
                              <img src={noticia.imagenUrl} alt="" />
                            ) : (
                              <span className="material-symbols-outlined">newspaper</span>
                            )}
                          </span>
                          <div className="noticia-text">
                            <span className="noticia-title" title={noticia.titulo}>
                              {noticia.titulo}
                            </span>
                            <span className="noticia-excerpt text-body-sm">
                              {crearExtracto(noticia.cuerpo)}
                            </span>
                            {/* En pantallas medianas, la categoría y la fecha se muestran en esta línea. */}
                            <span className="noticia-meta text-body-sm">
                              {noticia.categoria} · {fecha ?? 'Sin fecha'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="col-categoria">
                        <span className="category-pill text-label-sm">{noticia.categoria}</span>
                      </td>
                      <td>
                        <NoticiaEstadoChip estado={estadoVisible(noticia)} />
                      </td>
                      <td className="col-fecha fecha-cell text-body-md">
                        {fecha ?? <span className="text-on-surface-variant">Sin fecha</span>}
                      </td>
                      <td className="text-end">
                        <div className="row-actions">
                          {inactiva ? (
                            <button
                              type="button"
                              className="btn-icon-aeteme"
                              disabled
                              title="Una noticia desactivada no puede modificarse"
                              aria-label={`Editar «${noticia.titulo}» (no disponible: noticia desactivada)`}
                            >
                              <span className="material-symbols-outlined" aria-hidden="true">
                                edit
                              </span>
                            </button>
                          ) : (
                            <Link
                              className="btn-icon-aeteme"
                              to={`/noticias/${noticia.id}/editar`}
                              title={`Editar «${noticia.titulo}»`}
                              aria-label={`Editar «${noticia.titulo}»`}
                            >
                              <span className="material-symbols-outlined" aria-hidden="true">
                                edit
                              </span>
                            </Link>
                          )}
                          <button
                            type="button"
                            className="btn-icon-aeteme"
                            disabled={inactiva}
                            title="Descargar en PDF"
                            aria-label={`Descargar «${noticia.titulo}» en PDF`}
                            onClick={() => descargarPdf(noticia)}
                          >
                            <span className="material-symbols-outlined" aria-hidden="true">
                              picture_as_pdf
                            </span>
                          </button>
                          <button
                            type="button"
                            className="btn-icon-danger"
                            disabled={inactiva}
                            title={inactiva ? 'Noticia ya desactivada' : 'Desactivar noticia'}
                            aria-label={
                              inactiva
                                ? `«${noticia.titulo}» ya está desactivada`
                                : `Desactivar «${noticia.titulo}»`
                            }
                            onClick={() => setDestino(noticia)}
                          >
                            <span className="material-symbols-outlined" aria-hidden="true">
                              visibility_off
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtradas.length > 0 ? (
          <div className="panel-footer text-body-sm">
            <span>
              Mostrando {inicio + 1} a {inicio + visibles.length} de {filtradas.length} noticias
            </span>
            <nav className="pager" aria-label="Paginación del listado de noticias">
              <button
                type="button"
                className="pager-btn"
                aria-label="Página anterior"
                disabled={paginaActual === 1}
                onClick={() => setPagina(paginaActual - 1)}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  chevron_left
                </span>
              </button>
              {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map((numero) => (
                <button
                  key={numero}
                  type="button"
                  className="pager-btn"
                  aria-label={`Página ${numero}`}
                  aria-current={numero === paginaActual ? 'page' : undefined}
                  onClick={() => setPagina(numero)}
                >
                  {numero}
                </button>
              ))}
              <button
                type="button"
                className="pager-btn"
                aria-label="Página siguiente"
                disabled={paginaActual === totalPaginas}
                onClick={() => setPagina(paginaActual + 1)}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  chevron_right
                </span>
              </button>
            </nav>
          </div>
        ) : null}
      </section>

      <ConfirmDialog
        open={destino !== null}
        title={`Desactivar «${destino?.titulo ?? ''}»`}
        description="La noticia se retirará del portal público. El registro se conserva (eliminación lógica)."
        confirmLabel="Desactivar"
        note="La desactivación es lógica: la noticia y su historial quedan registrados en el sistema, pero deja de mostrarse al público."
        confirmIcon="visibility_off"
        onConfirm={confirmarDesactivacion}
        onClose={() => setDestino(null)}
      />

      <Toast message={toast?.message ?? null} icon={toast?.icon} onDismiss={cerrarToast} />
    </AdminLayout>
  );
}
