import type { ChangeEvent } from 'react';

interface TextFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email';
  value: string;
  onChange: (value: string) => void;
  icon: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}

/* Campo de texto reutilizable (icono Material Symbols + input).
   Se usa en el login y reutilizada por el resto de formularios. */
export default function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  icon,
  placeholder,
  autoComplete,
  required,
  minLength,
}: TextFieldProps) {
  return (
    <div>
      <label className="form-label-aeteme" htmlFor={id}>
        {label}
      </label>
      <div className="input-field mt-1">
        <span className="material-symbols-outlined input-icon input-icon-start" aria-hidden="true">
          {icon}
        </span>
        <input
          className="form-control-aeteme"
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
        />
      </div>
    </div>
  );
}
