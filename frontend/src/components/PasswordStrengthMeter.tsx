import { PASSWORD_REQUIREMENTS, evaluatePassword } from '../lib/passwordPolicy';

interface PasswordStrengthMeterProps {
  value: string;
}

/* Medidor de fortaleza de contraseña (clase .password-strength ya existente en admin.css). */
export default function PasswordStrengthMeter({ value }: PasswordStrengthMeterProps) {
  const evaluacion = evaluatePassword(value || '');

  let level: string = 'none';
  let label = 'Sin ingresar';

  if (value !== '') {
    if (!evaluacion.checks.longitud) {
      level = 'muy-debil';
      label = 'Muy débil';
    } else if (evaluacion.cumplidos === evaluacion.total) {
      level = 'fuerte';
      label = 'Fuerte';
    } else if (evaluacion.cumplidos === evaluacion.total - 1) {
      level = 'aceptable';
      label = 'Aceptable';
    } else {
      level = 'debil';
      label = 'Débil';
    }
  }

  return (
    <div className="password-strength" id="medidorFortaleza" data-level={level} aria-live="polite">
      <div className="strength-meter-head">
        <span className="text-label-sm">Fortaleza de contraseña</span>
        <span className="text-label-sm strength-level">{label}</span>
      </div>

      <div className="strength-bars" aria-hidden="true">
        <div className="strength-segment" />
        <div className="strength-segment" />
        <div className="strength-segment" />
        <div className="strength-segment" />
      </div>

      <ul className="strength-requirements" aria-label="Requisitos de seguridad de la contraseña">
        {PASSWORD_REQUIREMENTS.map((requirement) => {
          const valido = evaluacion.checks[requirement.id];
          return (
            <li
              key={requirement.id}
              className={`requirement-item${valido ? ' is-valid' : ''}`}
              aria-checked={valido}
              role="checkbox"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {valido ? 'check_circle' : 'cancel'}
              </span>
              <span>{requirement.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
