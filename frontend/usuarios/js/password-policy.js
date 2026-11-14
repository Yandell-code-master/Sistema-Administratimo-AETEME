/* ============================================================
   AETEME · Política de contraseñas (fuente de verdad del cliente)
   Requerimientos.docx:
   - Al menos 8 caracteres
   - Al menos una mayúscula (A-Z)
   - Al menos un número (0-9)
   - Al menos un símbolo especial
   Se usa en login.html y registro-usuario.html.
   ============================================================ */

(function (global) {
    const REGLAS = [
        { id: 'longitud',  texto: 'Mínimo 8 caracteres', prueba: (v) => v.length >= 8 },
        { id: 'mayuscula', texto: 'Una mayúscula (A-Z)', prueba: (v) => /[A-ZÁÉÍÓÚÑ]/.test(v) },
        { id: 'numero',    texto: 'Un número (0-9)',     prueba: (v) => /[0-9]/.test(v) },
        { id: 'simbolo',   texto: 'Un símbolo especial (!@#$…)', prueba: (v) => /[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñüÜ]/.test(v) },
    ];

    function evaluatePassword(valor) {
        const checks = {};
        REGLAS.forEach((r) => { checks[r.id] = r.prueba(valor || ''); });
        const cumplidos = Object.values(checks).filter(Boolean).length;
        return { checks, cumplidos, total: REGLAS.length, valida: cumplidos === REGLAS.length };
    }

    function isValid(valor) {
        return evaluatePassword(valor).valida;
    }

    global.AetemePasswordPolicy = { REGLAS, evaluatePassword, isValid };
})(window);
