interface SystemBadgeProps {
  label?: string;
}

export default function SystemBadge({
  label = 'Sistema Administrativo Oficial',
}: SystemBadgeProps) {
  return (
    <span className="badge-system mb-1">
      <span className="dot" aria-hidden="true" />
      {label}
    </span>
  );
}
