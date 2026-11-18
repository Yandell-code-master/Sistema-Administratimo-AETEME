import type { EstadoVisible } from '../lib/noticias';

const CONFIG: Record<EstadoVisible, { clase: string; icono: string; texto: string }> = {
  borrador: { clase: 'status-chip--draft', icono: 'edit_note', texto: 'Borrador' },
  programada: { clase: 'status-chip--scheduled', icono: 'schedule', texto: 'Programada' },
  publicada: { clase: 'status-chip--published', icono: '', texto: 'Publicada' },
  archivada: { clase: 'status-chip--archived', icono: 'inventory_2', texto: 'Archivada' },
  desactivada: { clase: 'status-chip--baja', icono: 'visibility_off', texto: 'Desactivada' },
};

interface NoticiaEstadoChipProps {
  estado: EstadoVisible;
}

/* Chip de estado de una noticia. Reutiliza el modificador de baja de StatusChip para
   «desactivada»; los demás estados tienen su propio modificador en css/noticias.css. */
export default function NoticiaEstadoChip({ estado }: NoticiaEstadoChipProps) {
  const { clase, icono, texto } = CONFIG[estado];

  return (
    <span className={`status-chip ${clase} text-label-sm`}>
      {icono ? (
        <span className="material-symbols-outlined" aria-hidden="true">
          {icono}
        </span>
      ) : (
        <span className="dot" aria-hidden="true" />
      )}
      {texto}
    </span>
  );
}
