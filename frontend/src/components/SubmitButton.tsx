interface SubmitButtonProps {
  label?: string;
  icon?: string;
}

/* Botón principal del formulario de acceso (ícono + flecha). */
export default function SubmitButton({
  label = 'Iniciar sesión',
  icon = 'login',
}: SubmitButtonProps) {
  return (
    <button className="btn-submit" type="submit">
      <span className="material-symbols-outlined" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
      <span className="material-symbols-outlined btn-submit-arrow" aria-hidden="true">
        arrow_forward
      </span>
    </button>
  );
}
