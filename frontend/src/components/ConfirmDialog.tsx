import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  icon?: string;
  note?: string;
  confirmIcon?: string;
  onConfirm: () => void;
  onClose: () => void;
}

/* Modal genérico de confirmación que usa <dialog> nativo (estilo .confirm-dialog).
   `icon`, `note` y `confirmIcon` son opcionales: sin ellos conserva el texto y los íconos
   de la baja de usuarios. */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  icon = 'warning',
  note = 'La baja es lógica: la cuenta y su historial quedan registrados, pero el acceso se bloquea de forma permanente.',
  confirmIcon = 'person_off',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      className="confirm-dialog"
      ref={dialogRef}
      aria-labelledby="tituloConfirmDialog"
      aria-describedby="descripcionConfirmDialog"
      onClose={onClose}
      onClick={(evento) => {
        if (evento.target === dialogRef.current) onClose();
      }}
    >
      <div className="confirm-dialog-accent" aria-hidden="true" />
      <button
        type="button"
        className="confirm-dialog-close"
        onClick={onClose}
        aria-label="Cerrar ventana"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          close
        </span>
      </button>

      <div className="confirm-dialog-body">
        <div className="confirm-dialog-head">
          <div className="confirm-dialog-icon">
            <span className="material-symbols-outlined" aria-hidden="true">
              {icon}
            </span>
          </div>
          <div>
            <h2 className="confirm-dialog-title text-headline-md" id="tituloConfirmDialog">
              {title}
            </h2>
            <p className="confirm-dialog-desc text-body-md" id="descripcionConfirmDialog">
              {description}
            </p>
          </div>
        </div>
        <div className="confirm-dialog-note text-body-sm">
          <span className="material-symbols-outlined" aria-hidden="true">
            info
          </span>
          <span>{note}</span>
        </div>
      </div>

      <div className="confirm-dialog-footer">
        <button type="button" className="btn-aeteme-secondary text-label-md" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn-aeteme-danger text-label-md" onClick={onConfirm}>
          <span className="material-symbols-outlined" aria-hidden="true">
            {confirmIcon}
          </span>
          <span>{confirmLabel}</span>
        </button>
      </div>
    </dialog>
  );
}
