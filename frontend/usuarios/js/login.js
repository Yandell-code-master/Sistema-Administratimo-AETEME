/* ============================================================
   AETEME · Iniciar Sesión (exclusivo de usuarios/login.html)
   Validación de política de contraseñas + simulación del flujo.
   No hay conexión a la API todavía; el envío es demostrativo.
   La política de contraseñas vive en js/password-policy.js.
   ============================================================ */

const alertBox = document.getElementById('dynamicAlert');
const alertIcon = document.getElementById('dynamicAlertIcon');
const alertTitle = document.getElementById('dynamicAlertTitle');
const alertMessage = document.getElementById('dynamicAlertMessage');
const alertClose = document.getElementById('dynamicAlertClose');

const emailInput = document.getElementById('adminEmail');
const passwordInput = document.getElementById('adminPassword');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const eyeIcon = document.getElementById('eyeIcon');
const recoveryBtn = document.getElementById('recoveryBtn');

const loginForm = document.getElementById('loginForm');

const ALERTS = {
    invalid: {
        variant: 'alert-error',
        icon: 'error',
        title: 'Fallo de Autenticación',
        message: 'El correo o la contraseña no son correctos. Verifique y vuelva a intentar.'
    },
    timeout: {
        variant: 'alert-neutral',
        icon: 'history_toggle_off',
        title: 'Sesión Expirada',
        message: 'Su sesión ha expirado tras 15 minutos de inactividad por regulaciones de seguridad de AETEME. Por favor ingrese de nuevo.'
    },
    recovery: {
        variant: 'alert-primary',
        icon: 'contact_support',
        title: 'Restablecimiento de Credenciales',
        message: 'Para reiniciar su clave deportiva institucional, comuníquese con el SuperAdministrador o escriba a soporte@aeteme.cr desde su cuenta registrada.'
    },
    weakPassword: {
        variant: 'alert-error',
        icon: 'lock',
        title: 'Contraseña débil',
        message: 'La contraseña debe tener al menos 8 caracteres e incluir una mayúscula, un número y un símbolo.'
    },
    success: {
        variant: 'alert-success',
        icon: 'check_circle',
        title: 'Acceso Concedido',
        message: 'Credenciales verificadas. Redirigiendo a la consola administrativa de AETEME...'
    }
};

function showAlert(type) {
    const config = ALERTS[type];
    if (!config) return;

    alertBox.classList.remove('d-none', 'alert-error', 'alert-neutral', 'alert-primary', 'alert-success');
    alertBox.classList.add(config.variant);

    alertIcon.textContent = config.icon;
    alertTitle.textContent = config.title;
    alertMessage.textContent = config.message;
}

function dismissAlert() {
    alertBox.classList.add('d-none');
}

function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
    togglePasswordBtn.setAttribute('aria-pressed', String(isPassword));
    togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Ver contraseña');
    togglePasswordBtn.setAttribute('title', isPassword ? 'Ocultar contraseña' : 'Ver contraseña');
}

function handleFormSubmit(event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showAlert('invalid');
        return;
    }

    // El frontend solo anticipa la política del servidor (Requerimientos).
    if (!window.AetemePasswordPolicy || !window.AetemePasswordPolicy.isValid(password)) {
        showAlert('weakPassword');
        return;
    }

    showAlert('success');
    // Cuando la API de autenticación exista, aquí iría el fetch + credentials:'include'.
}

if (alertClose) alertClose.addEventListener('click', dismissAlert);
if (togglePasswordBtn) togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
if (recoveryBtn) recoveryBtn.addEventListener('click', () => showAlert('recovery'));
if (loginForm) loginForm.addEventListener('submit', handleFormSubmit);
