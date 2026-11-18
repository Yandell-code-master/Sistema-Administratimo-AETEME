import type { CategoriaNoticia } from '../lib/noticias';

interface NoticiaVistaPreviaProps {
  titulo: string;
  categoria: CategoriaNoticia | '';
  fecha: string;
  extracto: string;
  imagenUrl: string | null;
}

/* Tarjeta de noticia tal como la vería el visitante en el portal público (RF-SN-01.01.06).
   Se usa como vista previa del formulario y queda lista para el portal público. */
export default function NoticiaVistaPrevia({
  titulo,
  categoria,
  fecha,
  extracto,
  imagenUrl,
}: NoticiaVistaPreviaProps) {
  return (
    <article className="noticia-preview">
      <div className="noticia-preview-media">
        {imagenUrl ? (
          <img src={imagenUrl} alt="" />
        ) : (
          <span className="material-symbols-outlined" aria-hidden="true">
            image
          </span>
        )}
        {categoria ? <span className="noticia-preview-tag text-label-sm">{categoria}</span> : null}
      </div>
      <div className="noticia-preview-body">
        <span className="noticia-preview-date text-body-sm">{fecha}</span>
        <h3 className={`noticia-preview-title text-headline-sm${titulo ? '' : ' is-placeholder'}`}>
          {titulo || 'Título de la noticia'}
        </h3>
        <p className={`noticia-preview-excerpt text-body-md${extracto ? '' : ' is-placeholder'}`}>
          {extracto || 'El inicio del contenido aparecerá aquí.'}
        </p>
      </div>
    </article>
  );
}
