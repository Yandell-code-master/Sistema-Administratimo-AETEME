import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: ReactNode;
}

/* Grupo de formulario del panel: etiqueta, control, ayuda y error (mismas clases que
   RegistroPage). El control debe llevar el mismo `id` y referenciar `${id}-ayuda` y
   `${id}-error` en aria-describedby. */
export default function FormField({
  id,
  label,
  required,
  helper,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="form-group-aeteme">
      <label className="form-label-aeteme" htmlFor={id}>
        <span>
          {label}
          {required ? (
            <>
              {' '}
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            </>
          ) : null}
        </span>
      </label>
      {children}
      {helper ? (
        <p className="input-feedback-helper" id={`${id}-ayuda`}>
          {helper}
        </p>
      ) : null}
      {error ? (
        <p className="input-feedback-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
