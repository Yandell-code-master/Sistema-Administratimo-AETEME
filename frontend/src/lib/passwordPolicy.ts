/* ============================================================
   AETEME · Política de contraseñas (RF-SU: mínimo 8 caracteres,
   al menos una mayúscula, un número y un símbolo).
   Compartida por todos los formularios que piden clave.
   ============================================================ */

const RULES = [
  { id: 'longitud', test: (value: string) => value.length >= 8 },
  { id: 'mayuscula', test: (value: string) => /[A-ZÁÉÍÓÚÑ]/.test(value) },
  { id: 'numero', test: (value: string) => /[0-9]/.test(value) },
  { id: 'simbolo', test: (value: string) => /[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñüÜ]/.test(value) },
] as const;

export type PasswordRuleId = (typeof RULES)[number]['id'];

export function validatePassword(value: string): boolean {
  return RULES.every((rule) => rule.test(value));
}

export const INVALID_PASSWORD_MESSAGE =
  'La contraseña debe tener al menos 8 caracteres e incluir una mayúscula, un número y un símbolo.';
