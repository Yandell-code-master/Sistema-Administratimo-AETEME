import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import FormField from '../components/FormField';
import NoticiaVistaPrevia from '../components/NoticiaVistaPrevia';
import {
  CATEGORIAS_NOTICIA,
  CUERPO_MIN,
  ESTADOS_NOTICIA,
  ETIQUETA_ESTADO,
  IMAGEN_TIPOS,
  TITULO_MAX,
  TITULO_MIN,
  construirEntrada,
  crearExtracto,
  datosIniciales,
  esCategoriaNoticia,
  esEstadoNoticia,
  etiquetaFechaVista,
  validarImagen,
  validarNoticia,
} from '../lib/noticias';
import type { DatosNoticia, ErroresNoticia, EstadoNoticia, Noticia } from '../lib/noticias';
import { actualizarNoticia, crearNoticia, useNoticias } from '../lib/noticiasStore';

// Orden en que aparecen los campos, para enfocar el primero que tenga error.
const ORDEN_CAMPOS: { campo: keyof DatosNoticia; id: string }[] = [
  { campo: 'titulo', id: 'noticiaTitulo' },
  { campo: 'cuerpo', id: 'noticiaCuerpo' },
  { campo: 'categoria', id: 'noticiaCategoria' },
  { campo: 'fechaProgramada', id: 'noticiaFecha' },
  { campo: 'imagenUrl', id: 'noticiaImagen' },
];

const AYUDA_ESTADO: Record<EstadoNoticia, string> = {
  borrador: 'Se guarda sin fecha de publicación y no es visible para el público.',
  programada: 'Se publicará automáticamente en la fecha y hora indicadas.',
  publicada: 'Se publica de inmediato al guardar y pasa a ser visible para el público.',
  archivada: 'Se retira del portal público, pero se conserva en el sistema.',
};

interface AccionFormulario {
  etiqueta: string;
  icono: string;
  aviso: string;
}

// Botón principal y aviso de éxito según el estado elegido al crear una noticia.
const ACCION_POR_ESTADO: Record<EstadoNoticia, AccionFormulario> = {
  borrador: {
    etiqueta: 'Guardar borrador',
    icono: 'save',
    aviso: 'Borrador guardado correctamente',
  },
  programada: {
    etiqueta: 'Programar noticia',
    icono: 'schedule',
    aviso: 'Noticia programada correctamente',
  },
  publicada: {
    etiqueta: 'Publicar noticia',
    icono: 'publish',
    aviso: 'Noticia publicada correctamente',
  },
  archivada: {
    etiqueta: 'Archivar noticia',
    icono: 'inventory_2',
    aviso: 'Noticia archivada correctamente',
  },
};

const ACCION_EDICION: AccionFormulario = {
  etiqueta: 'Guardar cambios',
  icono: 'save',
  aviso: 'Cambios guardados correctamente',
};

function describir(id: string, conError: boolean) {
  return `${id}-ayuda${conError ? ` ${id}-error` : ''}`;
}

interface PanelAvisoProps {
  icono: string;
  titulo: string;
  descripcion: string;
}

function PanelAviso({ icono, titulo, descripcion }: PanelAvisoProps) {
  return (
    <section className="panel-card" role="status">
      <div className="empty-state">
        <div className="empty-state-icon" aria-hidden="true">
          <span className="material-symbols-outlined">{icono}</span>
        </div>
        <h2 className="text-headline-lg text-on-surface">{titulo}</h2>
        <p className="text-body-md text-on-surface-variant mb-0">{descripcion}</p>
        <Link className="btn-aeteme-primary text-label-lg" to="/noticias">
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
          <span>Volver al listado</span>
        </Link>
      </div>
    </section>
  );
}

interface NoticiaFormProps {
  // Sin noticia se crea una nueva; con noticia se edita.
  inicial?: Noticia;
}

function NoticiaForm({ inicial }: NoticiaFormProps) {
  const navigate = useNavigate();
  const inputImagen = useRef<HTMLInputElement>(null);
  const esEdicion = inicial !== undefined;

  const [datos, setDatos] = useState<DatosNoticia>(() => datosIniciales(inicial));
  const [errores, setErrores] = useState<ErroresNoticia>({});

  const accion = esEdicion ? ACCION_EDICION : ACCION_POR_ESTADO[datos.estado];

  function actualizar<K extends keyof DatosNoticia>(campo: K, valor: DatosNoticia[K]) {
    setDatos((previos) => ({ ...previos, [campo]: valor }));
    // Al corregir un campo se retira su mensaje de error.
    setErrores((previos) => (previos[campo] ? { ...previos, [campo]: undefined } : previos));
  }

  function cambiarEstado(estado: EstadoNoticia) {
    actualizar('estado', estado);
    // La fecha solo aplica a «Programada»: al cambiar de estado se descarta su error.
    setErrores((previos) => ({ ...previos, fechaProgramada: undefined }));
  }

  function seleccionarImagen(evento: ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    const mensaje = validarImagen(archivo);
    if (mensaje) {
      evento.target.value = '';
      setErrores((previos) => ({ ...previos, imagenUrl: mensaje }));
      return;
    }

    // Se lee como URL de datos para poder mostrarla también en el listado dentro del prototipo.
    const lector = new FileReader();
    lector.onload = () => {
      if (typeof lector.result === 'string') actualizar('imagenUrl', lector.result);
    };
    lector.readAsDataURL(archivo);
  }

  function quitarImagen() {
    actualizar('imagenUrl', null);
    if (inputImagen.current) inputImagen.current.value = '';
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const nuevos = validarNoticia(datos);
    // Un archivo rechazado al seleccionarlo sigue bloqueando el envío hasta corregirlo o quitarlo.
    if (errores.imagenUrl) nuevos.imagenUrl = errores.imagenUrl;
    setErrores(nuevos);

    const primerInvalido = ORDEN_CAMPOS.find(({ campo }) => nuevos[campo]);
    if (primerInvalido) {
      document.getElementById(primerInvalido.id)?.focus();
      return;
    }

    const entrada = construirEntrada(datos, inicial);
    if (!entrada) return;

    if (inicial) actualizarNoticia(inicial.id, entrada);
    else crearNoticia(entrada);

    navigate('/noticias', { state: { aviso: { message: accion.aviso, icon: accion.icono } } });
  }

  const estadosDisponibles = ESTADOS_NOTICIA.filter(
    (estado) => esEdicion || estado !== 'archivada',
  );
  const hayImagen = datos.imagenUrl !== null || Boolean(errores.imagenUrl);

  return (
    <form className="noticia-editor" onSubmit={enviar} noValidate autoComplete="off">
      <section className="panel-card" aria-labelledby="tituloContenido">
        <div className="editor-section">
          <h2 className="editor-section-title text-headline-sm" id="tituloContenido">
            <span className="material-symbols-outlined" aria-hidden="true">
              article
            </span>
            Contenido
          </h2>

          <FormField
            id="noticiaTitulo"
            label="Título"
            required
            helper={`Entre ${TITULO_MIN} y ${TITULO_MAX} caracteres (${datos.titulo.length}/${TITULO_MAX}).`}
            error={errores.titulo}
          >
            <div className="input-field">
              <span
                className="material-symbols-outlined input-icon input-icon-start"
                aria-hidden="true"
              >
                title
              </span>
              <input
                className={`form-control-aeteme${errores.titulo ? ' is-invalid' : ''}`}
                id="noticiaTitulo"
                type="text"
                value={datos.titulo}
                onChange={(evento) => actualizar('titulo', evento.target.value)}
                placeholder="Ej. Esparza asegura 4 plazas para los Juegos Deportivos Nacionales"
                maxLength={TITULO_MAX}
                aria-describedby={describir('noticiaTitulo', Boolean(errores.titulo))}
                aria-invalid={Boolean(errores.titulo)}
              />
            </div>
          </FormField>

          <FormField
            id="noticiaCuerpo"
            label="Contenido de la noticia"
            required
            helper={`Texto completo que se mostrará en el portal y en el PDF. Mínimo ${CUERPO_MIN} caracteres.`}
            error={errores.cuerpo}
          >
            <textarea
              className={`form-control-aeteme form-control-aeteme--area${
                errores.cuerpo ? ' is-invalid' : ''
              }`}
              id="noticiaCuerpo"
              value={datos.cuerpo}
              onChange={(evento) => actualizar('cuerpo', evento.target.value)}
              placeholder="Redacte aquí el contenido de la noticia…"
              rows={10}
              aria-describedby={describir('noticiaCuerpo', Boolean(errores.cuerpo))}
              aria-invalid={Boolean(errores.cuerpo)}
            />
          </FormField>
        </div>
      </section>

      <div className="noticia-editor-side">
        <section className="panel-card" aria-labelledby="tituloPublicacion">
          <div className="editor-section">
            <h2 className="editor-section-title text-headline-sm" id="tituloPublicacion">
              <span className="material-symbols-outlined" aria-hidden="true">
                tune
              </span>
              Publicación
            </h2>

            <FormField
              id="noticiaCategoria"
              label="Categoría"
              required
              helper="Clasifica la noticia en el portal público."
              error={errores.categoria}
            >
              <div className="input-field">
                <span
                  className="material-symbols-outlined input-icon input-icon-start"
                  aria-hidden="true"
                >
                  sell
                </span>
                <select
                  className={`form-control-aeteme${errores.categoria ? ' is-invalid' : ''}`}
                  id="noticiaCategoria"
                  value={datos.categoria}
                  onChange={(evento) => {
                    const valor = evento.target.value;
                    actualizar('categoria', esCategoriaNoticia(valor) ? valor : '');
                  }}
                  aria-describedby={describir('noticiaCategoria', Boolean(errores.categoria))}
                  aria-invalid={Boolean(errores.categoria)}
                >
                  <option value="">Seleccione una categoría</option>
                  {CATEGORIAS_NOTICIA.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>

            <FormField
              id="noticiaEstado"
              label="Estado"
              required
              helper={AYUDA_ESTADO[datos.estado]}
            >
              <div className="input-field">
                <span
                  className="material-symbols-outlined input-icon input-icon-start"
                  aria-hidden="true"
                >
                  flag
                </span>
                <select
                  className="form-control-aeteme"
                  id="noticiaEstado"
                  value={datos.estado}
                  onChange={(evento) => {
                    const valor = evento.target.value;
                    if (esEstadoNoticia(valor)) cambiarEstado(valor);
                  }}
                  aria-describedby={describir('noticiaEstado', false)}
                >
                  {estadosDisponibles.map((estado) => (
                    <option key={estado} value={estado}>
                      {ETIQUETA_ESTADO[estado]}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>

            {datos.estado === 'programada' ? (
              <FormField
                id="noticiaFecha"
                label="Fecha y hora de publicación"
                required
                helper="Debe ser una fecha futura."
                error={errores.fechaProgramada}
              >
                <div className="input-field">
                  <span
                    className="material-symbols-outlined input-icon input-icon-start"
                    aria-hidden="true"
                  >
                    event
                  </span>
                  <input
                    className={`form-control-aeteme${errores.fechaProgramada ? ' is-invalid' : ''}`}
                    id="noticiaFecha"
                    type="datetime-local"
                    value={datos.fechaProgramada}
                    onChange={(evento) => actualizar('fechaProgramada', evento.target.value)}
                    aria-describedby={describir('noticiaFecha', Boolean(errores.fechaProgramada))}
                    aria-invalid={Boolean(errores.fechaProgramada)}
                  />
                </div>
              </FormField>
            ) : null}
          </div>
        </section>

        <section className="panel-card" aria-labelledby="tituloImagen">
          <div className="editor-section">
            <h2 className="editor-section-title text-headline-sm" id="tituloImagen">
              <span className="material-symbols-outlined" aria-hidden="true">
                image
              </span>
              Imagen destacada
            </h2>

            <div className="image-upload">
              <div className="image-upload-preview">
                {datos.imagenUrl ? (
                  <img src={datos.imagenUrl} alt="Vista previa de la imagen destacada" />
                ) : (
                  <span className="material-symbols-outlined" aria-hidden="true">
                    add_photo_alternate
                  </span>
                )}
              </div>

              <FormField
                id="noticiaImagen"
                label="Archivo de imagen"
                helper="PNG o JPG, máximo 2 MB. Es opcional."
                error={errores.imagenUrl}
              >
                <input
                  ref={inputImagen}
                  className={`form-control-aeteme form-control-aeteme--file${
                    errores.imagenUrl ? ' is-invalid' : ''
                  }`}
                  id="noticiaImagen"
                  type="file"
                  accept={IMAGEN_TIPOS.join(',')}
                  onChange={seleccionarImagen}
                  aria-describedby={describir('noticiaImagen', Boolean(errores.imagenUrl))}
                  aria-invalid={Boolean(errores.imagenUrl)}
                />
              </FormField>

              {hayImagen ? (
                <button
                  type="button"
                  className="btn-aeteme-secondary text-label-md"
                  onClick={quitarImagen}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    hide_image
                  </span>
                  <span>Quitar imagen</span>
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <section className="panel-card" aria-labelledby="tituloVistaPrevia">
          <div className="editor-section">
            <h2 className="editor-section-title text-headline-sm" id="tituloVistaPrevia">
              <span className="material-symbols-outlined" aria-hidden="true">
                preview
              </span>
              Vista previa
            </h2>

            <NoticiaVistaPrevia
              titulo={datos.titulo.trim()}
              categoria={datos.categoria}
              fecha={etiquetaFechaVista(datos.estado, datos.fechaProgramada, inicial)}
              extracto={crearExtracto(datos.cuerpo, 140)}
              imagenUrl={datos.imagenUrl}
            />
            <p className="input-feedback-helper">
              Así se mostrará la noticia en el portal público una vez que esté publicada.
            </p>
          </div>
        </section>
      </div>

      <div className="noticia-editor-actions">
        <Link className="btn-aeteme-secondary text-label-lg" to="/noticias">
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
          <span>Cancelar y volver</span>
        </Link>
        <button className="btn-aeteme-primary text-label-lg" type="submit">
          <span className="material-symbols-outlined" aria-hidden="true">
            {accion.icono}
          </span>
          <span>{accion.etiqueta}</span>
        </button>
      </div>
    </form>
  );
}

/* Crear / editar noticia — RF-SN-01.01.01 (crear y publicar) y RF-SN-01.01.03 (modificar).
   La ruta /noticias/nueva crea; /noticias/:id/editar modifica. */
export default function NoticiaFormPage() {
  const { id } = useParams<{ id: string }>();
  const noticias = useNoticias();

  const esEdicion = id !== undefined;
  const existente = esEdicion ? noticias.find((noticia) => noticia.id === Number(id)) : undefined;
  const titulo = esEdicion ? 'Editar noticia' : 'Nueva noticia';

  let contenido: ReactNode;
  if (esEdicion && !existente) {
    contenido = (
      <PanelAviso
        icono="search_off"
        titulo="Noticia no encontrada"
        descripcion="La noticia que intenta modificar no existe o el enlace no es correcto."
      />
    );
  } else if (existente && !existente.activo) {
    contenido = (
      <PanelAviso
        icono="visibility_off"
        titulo="La noticia está desactivada"
        descripcion="Una noticia desactivada se conserva en el historial, pero ya no puede modificarse."
      />
    );
  } else {
    // La key reinicia el formulario al pasar de «nueva» a «editar» (o entre dos noticias).
    contenido = <NoticiaForm key={existente?.id ?? 'nueva'} inicial={existente} />;
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
        <Link to="/noticias">Noticias Deportivas</Link>
        <span className="material-symbols-outlined breadcrumb-sep" aria-hidden="true">
          chevron_right
        </span>
        <span className="breadcrumb-current" aria-current="page">
          {titulo}
        </span>
      </nav>

      <div className="page-head">
        <div className="page-head-text">
          <h1 className="text-headline-xl text-on-surface">{titulo}</h1>
          <p className="page-subtitle text-body-md">
            {esEdicion
              ? 'Modifique la información de la noticia. Si está publicada, los cambios se reflejan en el portal público.'
              : 'Redacte la noticia y guárdela como borrador, publíquela de inmediato o prográmela para una fecha futura.'}
          </p>
        </div>
      </div>

      {contenido}
    </AdminLayout>
  );
}
