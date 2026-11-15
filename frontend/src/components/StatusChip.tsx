export type StatusChipVariant = 'active' | 'pending' | 'baja';

const CONFIG: Record<StatusChipVariant, { clase: string; icono: string; texto: string }> = {
  active: { clase: 'status-chip--active', icono: '', texto: 'Activo' },
  pending: { clase: 'status-chip--pending', icono: 'schedule', texto: 'Pendiente de verificación' },
  baja: { clase: 'status-chip--baja', icono: 'person_off', texto: 'Dado de baja' },
};

interface StatusChipProps {
  variant: StatusChipVariant;
}

export default function StatusChip({ variant }: StatusChipProps) {
  const { clase, icono, texto } = CONFIG[variant];

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
