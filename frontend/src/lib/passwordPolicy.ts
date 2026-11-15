/* ============================================================
   AETEME · Política de contraseñas (RF-SU: mínimo 8 caracteres,
   al menos una mayúscula, un número y un símbolo).
   Compartida por todos los formularios que piden clave.
   ============================================================ */

const RULES = [
  { id: 'longitud', label: 'Mínimo 8 caracteres', test: (value: string) => value.length >= 8 },
  {
    id: 'mayuscula',
    label: 'Una mayúscula (A-Z)',
    test: (value: string) => /[A-ZÁÉÍÓÚÑ]/.test(value),
  },
  { id: 'numero', label: 'Un número (0-9)', test: (value: string) => /[0-9]/.test(value) },
  {
    id: 'simbolo',
    label: 'Un símbolo especial (!@#$…)',
    test: (value: string) => /[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñüÜ]/.test(value),
  },
] as const;

export type PasswordRuleId = (typeof RULES)[number]['id'];

export interface PasswordEvaluation {
  checks: Record<PasswordRuleId, boolean>;
  cumplidos: number;
  total: number;
  valida: boolean;
}

export function evaluatePassword(value: string): PasswordEvaluation {
  const checks = {} as Record<PasswordRuleId, boolean>;
  RULES.forEach((rule) => {
    checks[rule.id] = rule.test(value);
  });
  const cumplidos = RULES.filter((rule) => checks[rule.id]).length;
  return { checks, cumplidos, total: RULES.length, valida: cumplidos === RULES.length };
}

export function validatePassword(value: string): boolean {
  return evaluatePassword(value).valida;
}

export const PASSWORD_REQUIREMENTS = RULES.map((rule) => ({
  id: rule.id,
  label: rule.label,
}));

export const INVALID_PASSWORD_MESSAGE =
  'La contraseña debe tener al menos 8 caracteres e incluir una mayúscula, un número y un símbolo.';
