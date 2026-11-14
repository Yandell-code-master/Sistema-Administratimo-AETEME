import { useState } from 'react';
import type { ChangeEvent } from 'react';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}

/* Campo de contraseña con botón "ver/ocultar". */
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  minLength,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="form-label-aeteme" htmlFor={id}>
        {label}
      </label>
      <div className="input-field mt-1">
        <span className="material-symbols-outlined input-icon input-icon-start" aria-hidden="true">
          lock
        </span>
        <input
          className="form-control-aeteme"
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
        />
        <button
          type="button"
          className="btn-toggle-password"
          onClick={() => setVisible((activo) => !activo)}
          aria-pressed={visible}
          aria-label={visible ? 'Ocultar contraseña' : 'Ver contraseña'}
          title={visible ? 'Ocultar contraseña' : 'Ver contraseña'}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {visible ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    </div>
  );
}
