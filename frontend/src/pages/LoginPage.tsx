import { useState } from 'react';
import type { FormEvent } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import LogoMark from '../components/LogoMark';
import SystemBadge from '../components/SystemBadge';
import DynamicAlert from '../components/DynamicAlert';
import type { DynamicAlertType } from '../components/DynamicAlert';
import TextField from '../components/TextField';
import PasswordField from '../components/PasswordField';
import SubmitButton from '../components/SubmitButton';
import PolicyNote from '../components/PolicyNote';
import FooterInstitucional from '../components/FooterInstitucional';
import { validatePassword } from '../lib/passwordPolicy';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertType, setAlertType] = useState<DynamicAlertType | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setAlertType('invalid');
      return;
    }

    if (!validatePassword(password)) {
      setAlertType('weakPassword');
      return;
    }

    setAlertType('success');
  }

  return (
    <AuthLayout>
      <header className="text-center mb-4">
        <div className="mb-2">
          <LogoMark />
        </div>
        <SystemBadge />
        <h1 id="titulo-login" className="text-headline-md text-on-surface mt-1 mb-1">
          Ingreso al Portal Administrativo
        </h1>
        <p
          className="text-body-sm text-on-surface-variant mb-0 mx-auto"
          style={{ maxWidth: '24rem' }}
        >
          Gestión interna institucional, reglamentaria y deportiva de Esparza, Costa Rica.
        </p>
      </header>

      {alertType ? <DynamicAlert type={alertType} onDismiss={() => setAlertType(null)} /> : null}

      <form className="d-flex flex-column gap-3" onSubmit={handleSubmit} autoComplete="off">
        <TextField
          id="adminEmail"
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={setEmail}
          icon="alternate_email"
          placeholder="usuario@aeteme.cr"
          autoComplete="email"
          required
        />

        <PasswordField
          id="adminPassword"
          label="Contraseña de Acceso"
          value={password}
          onChange={setPassword}
          placeholder="••••••••••••"
          autoComplete="current-password"
          required
          minLength={8}
        />

        <div className="pt-1">
          <SubmitButton />
        </div>
      </form>

      <PolicyNote />

      <FooterInstitucional />
    </AuthLayout>
  );
}
