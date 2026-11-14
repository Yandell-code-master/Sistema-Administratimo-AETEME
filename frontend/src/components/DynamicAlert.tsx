const ALERTS = {
  invalid: {
    variant: 'alert-error',
    icon: 'error',
    title: 'Fallo de Autenticación',
    message: 'El correo o la contraseña no son correctos. Verifique y vuelva a intentar.',
  },
  weakPassword: {
    variant: 'alert-error',
    icon: 'lock',
    title: 'Contraseña débil',
    message:
      'La contraseña debe tener al menos 8 caracteres e incluir una mayúscula, un número y un símbolo.',
  },
  success: {
    variant: 'alert-success',
    icon: 'check_circle',
    title: 'Acceso Concedido',
    message: 'Credenciales verificadas. Redirigiendo a la consola administrativa de AETEME...',
  },
} as const;

export type DynamicAlertType = keyof typeof ALERTS;

interface DynamicAlertProps {
  type: DynamicAlertType;
  onDismiss?: () => void;
}

/* Aviso reutilizable para el flujo de autenticación.
   Se muestra y se oculta controlado por el padre (visible sólo si hay tipo). */
export default function DynamicAlert({ type, onDismiss }: DynamicAlertProps) {
  const config = ALERTS[type];

  return (
    <div className={`alert ${config.variant}`} role="alert" aria-live="polite">
      <span className="material-symbols-outlined alert-icon" aria-hidden="true">
        {config.icon}
      </span>
      <div className="alert-content flex-grow-1">
        <p className="alert-title">{config.title}</p>
        <p className="alert-message">{config.message}</p>
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="alert-close"
          onClick={onDismiss}
          aria-label="Descartar aviso"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            close
          </span>
        </button>
      ) : null}
    </div>
  );
}
