/* ============================================================
   AETEME · Iniciar Sesión (exclusivo de usuarios/login.html)
   Simulación del flujo: validación anti-bot + credenciales.
   No hay conexión a la API todavía; el envío es demostrativo.
   ============================================================ */

const alertBox = document.getElementById('dynamicAlert');
const alertIcon = document.getElementById('dynamicAlertIcon');
const alertTitle = document.getElementById('dynamicAlertTitle');
const alertMessage = document.getElementById('dynamicAlertMessage');
const alertClose = document.getElementById('dynamicAlertClose');

const emailInput = document.getElementById('adminEmail');
const emailBadge = document.getElementById('emailValidBadge');
const passwordInput = document.getElementById('adminPassword');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const eyeIcon = document.getElementById('eyeIcon');
const recoveryBtn = document.getElementById('recoveryBtn');

const captchaCheckbox = document.getElementById('captchaCheckbox');
const captchaSpinner = document.getElementById('captchaSpinner');
const captchaCheckIcon = document.getElementById('captchaCheckIcon');
const captchaStatusText = document.getElementById('captchaStatusText');

const loginForm = document.getElementById('loginForm');

let isCaptchaVerified = false;

const ALERTS = {
    invalid: {
        variant: 'alert-error',
        icon: 'error',
        title: 'Fallo de Autenticación',
        message: 'Credenciales inválidas o verificación anti-bot sin completar. Verifique su usuario @aeteme.cr y vuelva a intentar.'
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

function handleCaptchaToggle() {
    const checked = captchaCheckbox.checked;

    if (checked) {
        captchaSpinner.classList.remove('d-none');
        captchaCheckIcon.classList.add('d-none');
        captchaStatusText.textContent = 'Validando token anti-bot...';
        captchaStatusText.classList.remove('is-valid');

        window.setTimeout(() => {
            captchaSpinner.classList.add('d-none');
            captchaCheckIcon.classList.remove('d-none');
            captchaStatusText.textContent = 'Identidad validada con éxito';
            captchaStatusText.classList.add('is-valid');
            isCaptchaVerified = true;
        }, 700);
        return;
    }

    captchaSpinner.classList.add('d-none');
    captchaCheckIcon.classList.add('d-none');
    captchaStatusText.textContent = 'Verificación de seguridad requerida';
    captchaStatusText.classList.remove('is-valid');
    isCaptchaVerified = false;
}

function handleFormSubmit(event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!isCaptchaVerified || !email.endsWith('@aeteme.cr') || password.length < 4) {
        showAlert('invalid');
        return;
    }

    showAlert('success');
    // Cuando la API de autenticación exista, aquí iría el fetch + credenciales.
}

function updateEmailBadge() {
    const value = emailInput.value.trim();
    const isAeteme = value.includes('@aeteme.cr') && value.length > 11;
    emailBadge.classList.toggle('d-none', !isAeteme);
}

if (alertClose) alertClose.addEventListener('click', dismissAlert);
if (togglePasswordBtn) togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
if (recoveryBtn) recoveryBtn.addEventListener('click', () => showAlert('recovery'));
if (captchaCheckbox) captchaCheckbox.addEventListener('change', handleCaptchaToggle);
if (emailInput) emailInput.addEventListener('input', updateEmailBadge);
if (loginForm) loginForm.addEventListener('submit', handleFormSubmit);
