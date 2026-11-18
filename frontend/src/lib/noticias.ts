/* ============================================================
   AETEME · Subsistema de Noticias (RF-SN-01.01)
   Tipos, catálogos, datos de ejemplo y reglas de negocio puras.
   Refleja las tablas Noticia, CategoriaNoticia y EstadoNoticia del
   diseño de datos (Etapa VI). Cuando exista la API, los tipos de
   este archivo pasan a ser el contrato de las respuestas.
   ============================================================ */

/* ---- Catálogos ---- */

// Flujo de publicación (tabla EstadoNoticia).
export const ESTADOS_NOTICIA = ['borrador', 'programada', 'publicada', 'archivada'] as const;
export type EstadoNoticia = (typeof ESTADOS_NOTICIA)[number];

// Lo que ve el usuario administrativo: el estado del flujo o «desactivada» (Activo = 0).
export const ESTADOS_VISIBLES = [...ESTADOS_NOTICIA, 'desactivada'] as const;
export type EstadoVisible = (typeof ESTADOS_VISIBLES)[number];

export const ETIQUETA_ESTADO: Record<EstadoNoticia, string> = {
  borrador: 'Borrador',
  programada: 'Programada',
  publicada: 'Publicada',
  archivada: 'Archivada',
};

// Valores sugeridos (tabla CategoriaNoticia); AETEME debe confirmarlos o ajustarlos.
export const CATEGORIAS_NOTICIA = [
  'Torneos',
  'Comunicados',
  'Resultados',
  'Entrenamientos',
] as const;
export type CategoriaNoticia = (typeof CATEGORIAS_NOTICIA)[number];

function perteneceA<T extends string>(lista: readonly T[], valor: string): valor is T {
  return (lista as readonly string[]).includes(valor);
}

export const esEstadoNoticia = (valor: string): valor is EstadoNoticia =>
  perteneceA(ESTADOS_NOTICIA, valor);
export const esEstadoVisible = (valor: string): valor is EstadoVisible =>
  perteneceA(ESTADOS_VISIBLES, valor);
export const esCategoriaNoticia = (valor: string): valor is CategoriaNoticia =>
  perteneceA(CATEGORIAS_NOTICIA, valor);

/* ---- Límites del modelo de datos ---- */

export const TITULO_MIN = 5;
export const TITULO_MAX = 200; // Titulo nvarchar(200)
export const CUERPO_MIN = 20;
export const IMAGEN_MAX_BYTES = 2 * 1024 * 1024; // PNG o JPG, máximo 2 MB
export const IMAGEN_TIPOS = ['image/png', 'image/jpeg'];

/* ---- Tipos ---- */

export interface Noticia {
  id: number;
  titulo: string;
  cuerpo: string;
  categoria: CategoriaNoticia;
  estado: EstadoNoticia;
  // ISO 8601. Futura si está Programada; null en Borrador.
  fechaPublicacion: string | null;
  imagenUrl: string | null;
  // Eliminación lógica: false = desactivada y retirada del portal público.
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

// Lo que se envía al crear o modificar (el resto lo asigna el servidor).
export type EntradaNoticia = Pick<
  Noticia,
  'titulo' | 'cuerpo' | 'categoria' | 'estado' | 'fechaPublicacion' | 'imagenUrl'
>;

// Valores del formulario tal como los edita la persona usuaria.
export interface DatosNoticia {
  titulo: string;
  cuerpo: string;
  categoria: CategoriaNoticia | '';
  estado: EstadoNoticia;
  // Valor de <input type="datetime-local"> (hora local, sin zona).
  fechaProgramada: string;
  imagenUrl: string | null;
}

export type ErroresNoticia = Partial<Record<keyof DatosNoticia, string>>;

export interface FiltrosNoticias {
  termino: string;
  categoria: CategoriaNoticia | '';
  estado: EstadoVisible | '';
  // Fechas en formato AAAA-MM-DD (valor de <input type="date">).
  desde: string;
  hasta: string;
}

export const FILTROS_VACIOS: FiltrosNoticias = {
  termino: '',
  categoria: '',
  estado: '',
  desde: '',
  hasta: '',
};

// Aviso que el formulario deja al listado mediante el estado de la navegación.
export interface AvisoNoticias {
  message: string;
  icon: string;
}

export function leerAviso(state: unknown): AvisoNoticias | null {
  if (typeof state !== 'object' || state === null || !('aviso' in state)) return null;
  const { aviso } = state;
  if (
    typeof aviso === 'object' &&
    aviso !== null &&
    'message' in aviso &&
    'icon' in aviso &&
    typeof aviso.message === 'string' &&
    typeof aviso.icon === 'string'
  ) {
    return { message: aviso.message, icon: aviso.icon };
  }
  return null;
}

/* ---- Texto y fechas ---- */

export const normalizarTexto = (texto: string) =>
  texto
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const FORMATO_FECHA = new Intl.DateTimeFormat('es-CR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const FORMATO_FECHA_HORA = new Intl.DateTimeFormat('es-CR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export const formatearFecha = (iso: string) => FORMATO_FECHA.format(new Date(iso));
export const formatearFechaHora = (iso: string) => FORMATO_FECHA_HORA.format(new Date(iso));

const dosDigitos = (numero: number) => String(numero).padStart(2, '0');

// AAAA-MM-DD en hora local.
function aFechaLocal(fecha: Date): string {
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;
}

// ISO → valor de <input type="datetime-local">.
export function aInputDatetime(iso: string): string {
  const fecha = new Date(iso);
  return `${aFechaLocal(fecha)}T${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}`;
}

// Valor de <input type="datetime-local"> → ISO (null si está vacío o es inválido).
export function desdeInputDatetime(valor: string): string | null {
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha.toISOString();
}

export function crearExtracto(cuerpo: string, maximo = 120): string {
  const plano = cuerpo.replace(/\s+/g, ' ').trim();
  return plano.length > maximo ? `${plano.slice(0, maximo).trimEnd()}…` : plano;
}

/* ---- Consulta y filtrado (RF-SN-01.01.02) ---- */

export const estadoVisible = (noticia: Noticia): EstadoVisible =>
  noticia.activo ? noticia.estado : 'desactivada';

export function filtrarNoticias(noticias: Noticia[], filtros: FiltrosNoticias): Noticia[] {
  const termino = normalizarTexto(filtros.termino.trim());
  const hayFechas = filtros.desde !== '' || filtros.hasta !== '';

  return noticias.filter((noticia) => {
    if (termino) {
      const texto = normalizarTexto(`${noticia.titulo} ${noticia.cuerpo}`);
      if (!texto.includes(termino)) return false;
    }
    if (filtros.categoria && noticia.categoria !== filtros.categoria) return false;
    if (filtros.estado && estadoVisible(noticia) !== filtros.estado) return false;

    if (hayFechas) {
      if (!noticia.fechaPublicacion) return false;
      const dia = aFechaLocal(new Date(noticia.fechaPublicacion));
      if (filtros.desde && dia < filtros.desde) return false;
      if (filtros.hasta && dia > filtros.hasta) return false;
    }
    return true;
  });
}

export const hayFiltrosActivos = (filtros: FiltrosNoticias) =>
  Object.values(filtros).some((valor) => valor !== '');

// Totales por estado del flujo (solo noticias activas), para las tarjetas de resumen.
export function contarPorEstado(noticias: Noticia[]): Record<EstadoNoticia, number> {
  const totales: Record<EstadoNoticia, number> = {
    borrador: 0,
    programada: 0,
    publicada: 0,
    archivada: 0,
  };
  noticias.forEach((noticia) => {
    if (noticia.activo) totales[noticia.estado] += 1;
  });
  return totales;
}

/* ---- Validación del formulario (RF-SN-01.01.01 y RF-SN-01.01.03) ---- */

export function validarNoticia(datos: DatosNoticia, ahora: Date = new Date()): ErroresNoticia {
  const errores: ErroresNoticia = {};

  const titulo = datos.titulo.trim();
  if (!titulo) errores.titulo = 'El título es obligatorio.';
  else if (titulo.length < TITULO_MIN || titulo.length > TITULO_MAX)
    errores.titulo = `El título debe tener entre ${TITULO_MIN} y ${TITULO_MAX} caracteres.`;

  if (!datos.categoria) errores.categoria = 'Seleccione una categoría.';

  const cuerpo = datos.cuerpo.trim();
  if (!cuerpo) errores.cuerpo = 'El contenido de la noticia es obligatorio.';
  else if (cuerpo.length < CUERPO_MIN)
    errores.cuerpo = `El contenido debe tener al menos ${CUERPO_MIN} caracteres.`;

  if (datos.estado === 'programada') {
    const fecha = desdeInputDatetime(datos.fechaProgramada);
    if (!datos.fechaProgramada) errores.fechaProgramada = 'Indique la fecha y hora de publicación.';
    else if (fecha === null) errores.fechaProgramada = 'La fecha indicada no es válida.';
    else if (new Date(fecha).getTime() <= ahora.getTime())
      errores.fechaProgramada = 'La fecha de publicación debe ser futura.';
  }

  return errores;
}

// Devuelve el mensaje de error, o una cadena vacía si la imagen es válida.
export function validarImagen(archivo: File): string {
  if (!IMAGEN_TIPOS.includes(archivo.type)) return 'La imagen debe ser PNG o JPG.';
  if (archivo.size > IMAGEN_MAX_BYTES) return 'La imagen no puede superar los 2 MB.';
  return '';
}

/* ---- Del formulario al modelo ---- */

export function datosIniciales(noticia?: Noticia): DatosNoticia {
  return {
    titulo: noticia?.titulo ?? '',
    cuerpo: noticia?.cuerpo ?? '',
    categoria: noticia?.categoria ?? '',
    estado: noticia?.estado ?? 'borrador',
    fechaProgramada:
      noticia?.estado === 'programada' && noticia.fechaPublicacion
        ? aInputDatetime(noticia.fechaPublicacion)
        : '',
    imagenUrl: noticia?.imagenUrl ?? null,
  };
}

/* Regla de publicación: Borrador no tiene fecha; Programada usa la fecha elegida;
   Publicada conserva su fecha original si ya la tenía, o se publica en este momento;
   Archivada conserva la fecha que tuviera. */
function resolverFechaPublicacion(
  datos: DatosNoticia,
  previa: Noticia | undefined,
  ahora: Date,
): string | null {
  switch (datos.estado) {
    case 'borrador':
      return null;
    case 'programada':
      return desdeInputDatetime(datos.fechaProgramada);
    case 'publicada': {
      const anterior = previa?.fechaPublicacion ?? null;
      return anterior !== null && new Date(anterior).getTime() <= ahora.getTime()
        ? anterior
        : ahora.toISOString();
    }
    case 'archivada':
      return previa?.fechaPublicacion ?? null;
  }
}

// Null solo si falta la categoría (no ocurre después de validarNoticia).
export function construirEntrada(
  datos: DatosNoticia,
  previa?: Noticia,
  ahora: Date = new Date(),
): EntradaNoticia | null {
  if (datos.categoria === '') return null;
  return {
    titulo: datos.titulo.trim(),
    cuerpo: datos.cuerpo.trim(),
    categoria: datos.categoria,
    estado: datos.estado,
    fechaPublicacion: resolverFechaPublicacion(datos, previa, ahora),
    imagenUrl: datos.imagenUrl,
  };
}

// Texto de fecha para la vista previa del formulario.
export function etiquetaFechaVista(
  estado: EstadoNoticia,
  fechaProgramada: string,
  previa?: Noticia,
): string {
  switch (estado) {
    case 'borrador':
      return 'Borrador · sin fecha';
    case 'programada': {
      const iso = desdeInputDatetime(fechaProgramada);
      return iso ? `Se publica el ${formatearFechaHora(iso)}` : 'Fecha de publicación por definir';
    }
    case 'publicada':
      return previa?.fechaPublicacion
        ? formatearFecha(previa.fechaPublicacion)
        : 'Se publica al guardar';
    case 'archivada':
      return 'Noticia archivada';
  }
}

/* ---- Datos de ejemplo ----
   Las fechas son relativas a hoy para que el prototipo siempre luzca vigente. */

const MS_POR_DIA = 24 * 60 * 60 * 1000;

function enDias(dias: number, hora = 9): string {
  const fecha = new Date(Date.now() + dias * MS_POR_DIA);
  fecha.setHours(hora, 0, 0, 0);
  return fecha.toISOString();
}

export const NOTICIAS_INICIALES: Noticia[] = [
  {
    id: 10,
    titulo: 'Taller de arbitraje para nuevos jueces de tenis de mesa',
    cuerpo:
      'La asociación prepara un taller práctico para formar a los nuevos jueces que atenderán los torneos del cantón. Se revisarán el reglamento vigente, el manejo de la mesa y la forma de resolver los casos más comunes durante un encuentro.',
    categoria: 'Entrenamientos',
    estado: 'borrador',
    fechaPublicacion: null,
    imagenUrl: null,
    activo: true,
    fechaCreacion: enDias(-1),
    fechaModificacion: null,
  },
  {
    id: 9,
    titulo: 'Clínica de servicio y devolución con entrenadores nacionales',
    cuerpo:
      'Una jornada técnica enfocada en el servicio, la devolución y la preparación física, dirigida a atletas seleccionados de la academia. Los cupos son limitados y se asignarán por orden de inscripción.',
    categoria: 'Entrenamientos',
    estado: 'programada',
    fechaPublicacion: enDias(12, 8),
    imagenUrl: null,
    activo: true,
    fechaCreacion: enDias(-3),
    fechaModificacion: enDias(-1),
  },
  {
    id: 8,
    titulo: 'Clasificatorio Abierto Intercantonal Esparza - Puntarenas',
    cuerpo:
      'Se abre la convocatoria para el clasificatorio intercantonal en categoría libre masculina y femenina. La competencia se realizará en el Gimnasio Multiuso de Esparza y otorgará cupos al regional del Pacífico.',
    categoria: 'Torneos',
    estado: 'programada',
    fechaPublicacion: enDias(6, 10),
    imagenUrl: null,
    activo: true,
    fechaCreacion: enDias(-4),
    fechaModificacion: null,
  },
  {
    id: 7,
    titulo: 'Nuevo horario de entrenamientos en el Gimnasio Multiuso',
    cuerpo:
      'A partir del próximo mes los entrenamientos de la academia cambiarán de horario para dar espacio a las categorías infantiles. El detalle por grupo se publicará una vez que lo confirme la junta directiva.',
    categoria: 'Comunicados',
    estado: 'borrador',
    fechaPublicacion: null,
    imagenUrl: null,
    activo: true,
    fechaCreacion: enDias(-5),
    fechaModificacion: enDias(-4),
  },
  {
    id: 6,
    titulo: 'Resultados del Campeonato Cantonal U-15 y U-19 de Esparza',
    cuerpo:
      'Concluyó el campeonato cantonal con una amplia participación de jóvenes de todo el cantón. Los campeones de cada categoría clasifican al torneo regional; la tabla completa de posiciones está disponible en TTplayBook.',
    categoria: 'Resultados',
    estado: 'publicada',
    fechaPublicacion: enDias(-3),
    imagenUrl: null,
    activo: true,
    fechaCreacion: enDias(-6),
    fechaModificacion: null,
  },
  {
    id: 5,
    titulo: 'Esparza asegura 4 plazas para los Juegos Deportivos Nacionales',
    cuerpo:
      'Las jóvenes promesas de la academia lograron clasificar tras una intensa jornada de competencia. Representarán al cantón en los Juegos Deportivos Nacionales.',
    categoria: 'Torneos',
    estado: 'publicada',
    fechaPublicacion: enDias(-9),
    imagenUrl: null,
    activo: true,
    fechaCreacion: enDias(-10),
    fechaModificacion: enDias(-8),
  },
  {
    id: 4,
    titulo: 'Convocatoria abierta para el semillero infantil de iniciación deportiva',
    cuerpo:
      'Dirigido a niñas y niños entre 7 y 12 años con deseos de aprender los fundamentos del tenis de mesa. No se requiere experiencia previa; el equipo básico lo facilita la asociación.',
    categoria: 'Comunicados',
    estado: 'publicada',
    fechaPublicacion: enDias(-14),
    imagenUrl: null,
    activo: true,
    fechaCreacion: enDias(-15),
    fechaModificacion: null,
  },
  {
    id: 3,
    titulo: 'Rifa pro-fondos para la delegación regional',
    cuerpo:
      'La asociación realizará una rifa para recaudar fondos que cubran el transporte y la alimentación de la delegación que viajará al torneo regional.',
    categoria: 'Comunicados',
    estado: 'publicada',
    fechaPublicacion: enDias(-20),
    imagenUrl: null,
    activo: false,
    fechaCreacion: enDias(-22),
    fechaModificacion: enDias(-2),
  },
  {
    id: 2,
    titulo: 'Balance de la temporada 2025 de la asociación',
    cuerpo:
      'Repaso de los logros deportivos y administrativos de la temporada: participación en torneos, nuevos convenios con patrocinadores y crecimiento del semillero infantil.',
    categoria: 'Resultados',
    estado: 'archivada',
    fechaPublicacion: enDias(-90),
    imagenUrl: null,
    activo: true,
    fechaCreacion: enDias(-92),
    fechaModificacion: enDias(-60),
  },
  {
    id: 1,
    titulo: 'Inscripciones abiertas al Torneo Interescolar de Tenis de Mesa',
    cuerpo:
      'Los centros educativos del cantón ya pueden inscribir a sus equipos. El torneo se jugará por categorías y la inscripción se realiza desde el enlace externo indicado en la convocatoria.',
    categoria: 'Torneos',
    estado: 'publicada',
    fechaPublicacion: enDias(-30),
    imagenUrl: null,
    activo: true,
    fechaCreacion: enDias(-31),
    fechaModificacion: null,
  },
];
