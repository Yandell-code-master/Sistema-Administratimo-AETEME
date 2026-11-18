/* ============================================================
   AETEME · Almacén de noticias en memoria (prototipo sin API)
   Permite que el listado y el formulario compartan datos mientras
   la pestaña esté abierta; al recargar vuelven los datos de ejemplo.

   Cuando exista la API REST, cada función de aquí se reemplaza por
   su endpoint (GET / POST / PUT / DELETE lógico) sin tocar las pantallas.
   ============================================================ */

import { useSyncExternalStore } from 'react';
import { NOTICIAS_INICIALES } from './noticias';
import type { EntradaNoticia, Noticia } from './noticias';

let noticias: Noticia[] = NOTICIAS_INICIALES;
let siguienteId = Math.max(...NOTICIAS_INICIALES.map((noticia) => noticia.id)) + 1;

const oyentes = new Set<() => void>();

function notificar() {
  oyentes.forEach((oyente) => oyente());
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}

const obtenerNoticias = () => noticias;

/* Cada cambio reemplaza el arreglo (nunca lo muta) para que React detecte la novedad. */
export function useNoticias(): Noticia[] {
  return useSyncExternalStore(suscribir, obtenerNoticias);
}

export function crearNoticia(entrada: EntradaNoticia): Noticia {
  const nueva: Noticia = {
    ...entrada,
    id: siguienteId,
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaModificacion: null,
  };
  siguienteId += 1;
  noticias = [nueva, ...noticias];
  notificar();
  return nueva;
}

export function actualizarNoticia(id: number, entrada: EntradaNoticia): void {
  noticias = noticias.map((noticia) =>
    noticia.id === id
      ? { ...noticia, ...entrada, fechaModificacion: new Date().toISOString() }
      : noticia,
  );
  notificar();
}

// Eliminación lógica (Activo = 0): la noticia se conserva pero se retira del portal público.
export function desactivarNoticia(id: number): void {
  noticias = noticias.map((noticia) =>
    noticia.id === id
      ? { ...noticia, activo: false, fechaModificacion: new Date().toISOString() }
      : noticia,
  );
  notificar();
}
