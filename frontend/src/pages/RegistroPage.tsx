import { useState } from 'react';
import type { FormEvent } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import LogoMark from '../components/LogoMark';
import SystemBadge from '../components/SystemBadge';
import PasswordField from '../components/PasswordField';
import SubmitButton from '../components/SubmitButton';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import Toast from '../components/Toast';
import { validatePassword, INVALID_PASSWORD_MESSAGE } from '../lib/passwordPolicy';

const CAMPO = ['nombre', 'correo', 'password', 'confirm'] as const;
type Campo = (typeof CAMPO)[number];

const PATRON_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.-]+$/;
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEMORA_ENVIO = 1100;

/* Registro de un nuevo usuario Administrador
   Usado por el SuperAdministrador desde Mi Perfil — hoy accesible en /registro. */
export default function RegistroPage() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<Record<Campo, string>>({
    nombre: '',
    correo: '',
    password: '',
    confirm: '',
  });

  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState<{ nombre: string; correo: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null);

  function validar(): boolean {
    const siguiente: Record<Campo, string> = { nombre: '', correo: '', password: '', confirm: '' };

    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) siguiente.nombre = 'El nombre completo es obligatorio.';
    else if (nombreLimpio.length < 3 || nombreLimpio.length > 80)
      siguiente.nombre = 'El nombre debe tener entre 3 y 80 caracteres.';
    else if (!PATRON_NOMBRE.test(nombreLimpio))
      siguiente.nombre = 'Solo se admiten letras, tildes, puntos y guiones.';

    const correoLimpio = correo.trim();
    if (!correoLimpio) siguiente.correo = 'El correo es obligatorio.';
    else if (!PATRON_CORREO.test(correoLimpio))
      siguiente.correo = 'Ingrese una dirección de correo válida.';

    if (!password) siguiente.password = 'La contraseña provisional es obligatoria.';
    else if (!validatePassword(password)) siguiente.password = INVALID_PASSWORD_MESSAGE;

    if (!confirmPassword) siguiente.confirm = 'Debe confirmar la contraseña provisional.';
    else if (password !== confirmPassword)
      siguiente.confirm = 'Las contraseñas no coinciden. Verifique ambas claves.';

    setErrors(siguiente);
    return CAMPO.every((campo) => siguiente[campo] === '');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validar()) {
      const primerInvalido = document.querySelector('.is-invalid');
      if (primerInvalido instanceof HTMLElement) primerInvalido.focus();
      return;
    }

    setEnviando(true);
    await new Promise((resolve) => window.setTimeout(resolve, DEMORA_ENVIO));

    setExito({ nombre: nombre.trim(), correo: correo.trim() });
    setToast({ message: 'Cuenta creada y correo de verificación enviado', icon: 'check_circle' });
    setEnviando(false);
  }

  function registrarOtro() {
    setNombre('');
    setCorreo('');
    setPassword('');
    setConfirmPassword('');
    setErrors({ nombre: '', correo: '', password: '', confirm: '' });
    setExito(null);
  }

  function reenviarEnlace() {
    setToast({
      message: `Enlace reenviado a ${exito?.correo ?? correo}`,
      icon: 'forward_to_inbox',
    });
  }

  return (
    <AuthLayout>
      <header className="text-center mb-4">
        <div className="mb-2">
          <LogoMark />
        </div>
        <SystemBadge label="Sistema Administrativo Oficial" />
        <h1 id="titulo-registro" className="text-headline-md text-on-surface mt-1 mb-1">
          Registrar nuevo usuario
        </h1>
        <p
          className="text-body-sm text-on-surface-variant mb-0 mx-auto"
          style={{ maxWidth: '24rem' }}
        >
          Creación de la cuenta de un nuevo Administrador por parte del SuperAdministrador.
        </p>
      </header>

      {exito ? (
        <div className="success-card" role="status" aria-live="polite">
          <div className="success-icon" aria-hidden="true">
            <span className="material-symbols-outlined">mark_email_read</span>
          </div>

          <h2 className="text-headline-lg text-on-surface">Cuenta creada correctamente</h2>

          <p className="text-body-md mb-0">
            La cuenta de <strong className="text-on-surface">{exito.nombre}</strong> quedó en
            estado:
          </p>

          <span className="status-chip status-chip--pending text-label-sm">
            <span className="material-symbols-outlined" aria-hidden="true">
              schedule
            </span>
            Pendiente de verificación
          </span>

          <p className="text-body-sm text-on-surface-variant mb-0">
            Enviamos el enlace de activación a{' '}
            <strong className="text-primary">{exito.correo}</strong>.
          </p>

          <div className="success-note text-body-sm">
            <span className="material-symbols-outlined" aria-hidden="true">
              info
            </span>
            <span>
              El enlace expira en 24 horas y solo puede usarse una vez. El nuevo usuario no podrá
              iniciar sesión hasta verificarlo y cambiar su clave provisional.
            </span>
          </div>

          <div className="success-actions">
            <a className="btn-submit" href="/usuarios/gestion-usuarios.html">
              <span className="material-symbols-outlined" aria-hidden="true">
                group
              </span>
              <span>Volver a Gestión de Usuarios</span>
            </a>
            <button
              className="btn-aeteme-secondary text-label-md"
              type="button"
              onClick={registrarOtro}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                add_circle
              </span>
              <span>Registrar otro usuario</span>
            </button>
            <button
              className="btn-aeteme-secondary text-label-md"
              type="button"
              onClick={reenviarEnlace}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                forward_to_inbox
              </span>
              <span>Reenviar enlace</span>
            </button>
          </div>
        </div>
      ) : (
        <form className="registro-form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <div className="form-group-aeteme">
            <label className="form-label-aeteme" htmlFor="inputNombre">
              <span>
                Nombre completo{' '}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </span>
            </label>
            <div className="input-field">
              <span
                className="material-symbols-outlined input-icon input-icon-start"
                aria-hidden="true"
              >
                badge
              </span>
              <input
                className={`form-control-aeteme${errors.nombre ? ' is-invalid' : ''}`}
                id="inputNombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Roberto Méndez Castro"
                required
                minLength={3}
                maxLength={80}
                aria-describedby="ayudaNombre"
                aria-invalid={Boolean(errors.nombre)}
              />
            </div>
            <p className="input-feedback-helper" id="ayudaNombre">
              Nombre legal y apellidos según registro de la asociación (3 a 80 caracteres).
            </p>
            {errors.nombre ? (
              <p className="input-feedback-error" role="alert">
                {errors.nombre}
              </p>
            ) : null}
          </div>

          <div className="form-group-aeteme">
            <label className="form-label-aeteme" htmlFor="inputCorreo">
              <span>
                Correo{' '}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </span>
            </label>
            <div className="input-field">
              <span
                className="material-symbols-outlined input-icon input-icon-start"
                aria-hidden="true"
              >
                mail
              </span>
              <input
                className={`form-control-aeteme${errors.correo ? ' is-invalid' : ''}`}
                id="inputCorreo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="usuario@aeteme.cr"
                required
                autoComplete="email"
                aria-describedby="ayudaCorreo"
                aria-invalid={Boolean(errors.correo)}
              />
            </div>
            <p className="input-feedback-helper" id="ayudaCorreo">
              Dirección donde recibirá el enlace de verificación de la cuenta.
            </p>
            {errors.correo ? (
              <p className="input-feedback-error" role="alert">
                {errors.correo}
              </p>
            ) : null}
          </div>

          <div className="form-group-aeteme">
            <label className="form-label-aeteme" htmlFor="inputRolVisual">
              <span>Rol asignado</span>
            </label>
            <div className="input-field">
              <span
                className="material-symbols-outlined input-icon input-icon-start"
                aria-hidden="true"
              >
                verified
              </span>
              <input
                className="form-control-aeteme"
                id="inputRolVisual"
                type="text"
                value="Administrador"
                readOnly
              />
              <span className="material-symbols-outlined input-icon-end" aria-hidden="true">
                lock
              </span>
              <input type="hidden" name="rol" value="administrador" />
            </div>
            <p className="input-feedback-helper">
              El rol lo asigna el sistema; no puede modificarse. Las facultades de
              SuperAdministrador no son delegables por este medio.
            </p>
          </div>

          <div className="form-group-aeteme">
            <PasswordField
              id="inputPassword"
              label="Contraseña provisional"
              value={password}
              onChange={setPassword}
              placeholder="Ingrese contraseña provisional"
              autoComplete="new-password"
              required
              minLength={8}
            />
            {errors.password ? (
              <p className="input-feedback-error" role="alert">
                {errors.password}
              </p>
            ) : null}
            <PasswordStrengthMeter value={password} />
          </div>

          <div className="form-group-aeteme">
            <PasswordField
              id="inputConfirmPassword"
              label="Confirmar contraseña provisional"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Repita la contraseña provisional"
              autoComplete="new-password"
              required
              minLength={8}
            />
            <p className="input-feedback-helper">
              Ambas contraseñas deben ser exactamente idénticas.
            </p>
            {errors.confirm ? (
              <p className="input-feedback-error" role="alert">
                {errors.confirm}
              </p>
            ) : null}
          </div>

          <div className="form-actions">
            <a
              className="btn-aeteme-secondary text-label-md"
              href="/usuarios/gestion-usuarios.html"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_back
              </span>
              <span>Volver a Gestión de Usuarios</span>
            </a>
            <SubmitButton
              label={enviando ? 'Creando…' : 'Registrar usuario'}
              icon={enviando ? 'progress_activity' : 'person_add'}
              disabled={enviando}
            />
          </div>
        </form>
      )}

      <Toast message={toast?.message ?? null} icon={toast?.icon} onDismiss={() => setToast(null)} />
    </AuthLayout>
  );
}
