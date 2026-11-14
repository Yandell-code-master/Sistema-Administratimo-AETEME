/* ============================================================
   AETEME · Registrar usuario (exclusivo de usuarios/registro-usuario.html)
   Validación del formulario, medidor de fortaleza de la contraseña,
   estado de éxito sin recargar y avisos del sistema.
   No hay conexión a la API todavía; el envío es demostrativo.
   ============================================================ */

const formRegistro = document.getElementById('formRegistroUsuario');

const inputNombre = document.getElementById('inputNombreCompleto');
const inputCorreo = document.getElementById('inputCorreo');
const inputPassword = document.getElementById('inputPassword');
const inputConfirmPassword = document.getElementById('inputConfirmPassword');

const errorNombre = document.getElementById('errorNombre');
const errorCorreo = document.getElementById('errorCorreo');
const errorPassword = document.getElementById('errorPassword');
const errorConfirmPassword = document.getElementById('errorConfirmPassword');
const advertenciaDominio = document.getElementById('advertenciaDominio');

const btnSubmit = document.getElementById('btnSubmitRegistro');
const btnSubmitTexto = document.getElementById('btnSubmitTexto');
const btnTogglePass1 = document.getElementById('btnTogglePass1');
const btnTogglePass2 = document.getElementById('btnTogglePass2');

const medidorFortaleza = document.getElementById('medidorFortaleza');
const labelFortalezaTexto = document.getElementById('labelFortalezaTexto');

const requisitos = {
    longitud: document.getElementById('reqLongitud'),
    mayuscula: document.getElementById('reqMayuscula'),
    minuscula: document.getElementById('reqMinuscula'),
    numero: document.getElementById('reqNumero'),
    simbolo: document.getElementById('reqSimbolo')
};

const estadoExito = document.getElementById('estadoExitoRegistro');
const exitoNombreUsuario = document.getElementById('exitoNombreUsuario');
const exitoCorreoUsuario = document.getElementById('exitoCorreoUsuario');
const btnRegistrarOtro = document.getElementById('btnRegistrarOtro');
const btnReenviarEnlace = document.getElementById('btnReenviarEnlace');

const toastRegistro = document.getElementById('toastRegistro');
const toastMensaje = document.getElementById('toastMensaje');
const toastIcono = document.getElementById('toastIcono');

const barraLateral = document.getElementById('barraLateral');
const respaldoMenu = document.getElementById('respaldoMenu');
const btnMenuLateral = document.getElementById('btnMenuLateral');

const DURACION_AVISO = 4000;
const DEMORA_ENVIO = 1100;
const TIEMPO_REENVIO = 3000;

let ultimoCorreoRegistrado = '';
let temporizadorAviso = null;

/* ---- Aviso emergente ---- */
function mostrarAviso(mensaje, icono = 'check_circle') {
    toastMensaje.textContent = mensaje;
    if (toastIcono) toastIcono.textContent = icono;
    toastRegistro.classList.add('is-visible');

    window.clearTimeout(temporizadorAviso);
    temporizadorAviso = window.setTimeout(() => {
        toastRegistro.classList.remove('is-visible');
    }, DURACION_AVISO);
}

/* ---- Mostrar y ocultar contraseñas ---- */
function configurarTogglePassword(boton, input, etiquetaMostrar, etiquetaOcultar) {
    if (!boton || !input) return;

    boton.addEventListener('click', () => {
        const esPassword = input.getAttribute('type') === 'password';
        const icono = boton.querySelector('.material-symbols-outlined');

        input.setAttribute('type', esPassword ? 'text' : 'password');
        if (icono) icono.textContent = esPassword ? 'visibility_off' : 'visibility';
        boton.setAttribute('aria-pressed', String(esPassword));
        boton.setAttribute('aria-label', esPassword ? etiquetaOcultar : etiquetaMostrar);
        boton.setAttribute('title', esPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
}

function restablecerTogglePassword(boton, input) {
    if (!boton || !input) return;

    const icono = boton.querySelector('.material-symbols-outlined');
    input.setAttribute('type', 'password');
    if (icono) icono.textContent = 'visibility';
    boton.setAttribute('aria-pressed', 'false');
}

configurarTogglePassword(btnTogglePass1, inputPassword, 'Mostrar contraseña provisional', 'Ocultar contraseña provisional');
configurarTogglePassword(btnTogglePass2, inputConfirmPassword, 'Mostrar confirmación de contraseña', 'Ocultar confirmación de contraseña');

/* ---- Medidor de fortaleza de la contraseña ---- */
function marcarRequisito(elemento, esValido) {
    const icono = elemento.querySelector('.material-symbols-outlined');
    elemento.classList.toggle('is-valid', esValido);
    if (icono) icono.textContent = esValido ? 'check_circle' : 'cancel';
}

function evaluarFortaleza(clave) {
    const checks = {
        longitud: clave.length >= 12,
        mayuscula: /[A-Z]/.test(clave),
        minuscula: /[a-z]/.test(clave),
        numero: /[0-9]/.test(clave),
        simbolo: /[^A-Za-z0-9]/.test(clave)
    };

    Object.keys(checks).forEach((nombre) => {
        marcarRequisito(requisitos[nombre], checks[nombre]);
    });

    const cumplidos = Object.values(checks).filter(Boolean).length;

    if (clave.length === 0) {
        medidorFortaleza.dataset.level = 'none';
        labelFortalezaTexto.textContent = 'Sin ingresar';
        return { cumplidos: 0, valida: false };
    }

    let nivel = 'muy-debil';
    let etiqueta = 'Muy débil';

    // La longitud mínima es indispensable: sin ella la clave nunca supera "Muy débil".
    if (checks.longitud) {
        if (cumplidos === 5) {
            nivel = 'fuerte';
            etiqueta = 'Fuerte';
        } else if (cumplidos === 4) {
            nivel = 'aceptable';
            etiqueta = 'Aceptable';
        } else {
            nivel = 'debil';
            etiqueta = 'Débil';
        }
    }

    medidorFortaleza.dataset.level = nivel;
    labelFortalezaTexto.textContent = etiqueta;

    // La clave provisional solo es válida cuando cumple los cinco requisitos.
    return { cumplidos, valida: cumplidos === 5 };
}

function reiniciarFortaleza() {
    medidorFortaleza.dataset.level = 'none';
    labelFortalezaTexto.textContent = 'Sin ingresar';
    Object.values(requisitos).forEach((elemento) => marcarRequisito(elemento, false));
}

/* ---- Validaciones individuales ---- */
function mostrarError(input, contenedorError, mensaje) {
    input.classList.add('is-invalid');
    contenedorError.textContent = mensaje;
    contenedorError.classList.remove('d-none');
}

function limpiarError(input, contenedorError) {
    input.classList.remove('is-invalid');
    contenedorError.textContent = '';
    contenedorError.classList.add('d-none');
}

function validarNombre() {
    const valor = inputNombre.value.trim();
    const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.-]+$/;

    if (!valor) {
        mostrarError(inputNombre, errorNombre, 'El nombre completo es obligatorio.');
        return false;
    }
    if (valor.length < 3 || valor.length > 80) {
        mostrarError(inputNombre, errorNombre, 'El nombre debe tener entre 3 y 80 caracteres.');
        return false;
    }
    if (!patron.test(valor)) {
        mostrarError(inputNombre, errorNombre, 'El nombre contiene caracteres inválidos. Solo se admiten letras, tildes, puntos y guiones.');
        return false;
    }

    limpiarError(inputNombre, errorNombre);
    return true;
}

function validarCorreo() {
    const valor = inputCorreo.value.trim();
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!valor) {
        mostrarError(inputCorreo, errorCorreo, 'El correo institucional es obligatorio.');
        advertenciaDominio.classList.add('d-none');
        return false;
    }
    if (!patron.test(valor)) {
        mostrarError(inputCorreo, errorCorreo, 'Por favor ingrese una dirección de correo válida.');
        advertenciaDominio.classList.add('d-none');
        return false;
    }

    limpiarError(inputCorreo, errorCorreo);

    // Se advierte, pero no se bloquea, cuando el dominio no es el federado.
    advertenciaDominio.classList.toggle('d-none', valor.toLowerCase().endsWith('@aeteme.cr'));
    return true;
}

function validarPassword() {
    const valor = inputPassword.value;
    const evaluacion = evaluarFortaleza(valor);

    if (!valor) {
        mostrarError(inputPassword, errorPassword, 'La contraseña provisional es obligatoria.');
        return false;
    }
    if (!evaluacion.valida) {
        mostrarError(inputPassword, errorPassword, 'La contraseña debe cumplir los 12 caracteres mínimos y todos los requisitos de seguridad.');
        return false;
    }

    limpiarError(inputPassword, errorPassword);
    return true;
}

function validarConfirmacion() {
    const clave = inputPassword.value;
    const confirmacion = inputConfirmPassword.value;

    if (!confirmacion) {
        mostrarError(inputConfirmPassword, errorConfirmPassword, 'Debe confirmar la contraseña provisional.');
        return false;
    }
    if (clave !== confirmacion) {
        mostrarError(inputConfirmPassword, errorConfirmPassword, 'Las contraseñas no coinciden. Verifique ambas claves.');
        return false;
    }

    limpiarError(inputConfirmPassword, errorConfirmPassword);
    return true;
}

/* ---- Envío simulado ---- */
// TODO: reemplazar por POST /api/usuarios cuando exista el endpoint.
function enviarRegistro(datos) {
    return new Promise((resolve) => {
        window.setTimeout(() => {
            resolve({
                exito: true,
                mensaje: 'Usuario registrado exitosamente',
                usuarioId: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
                fechaRegistro: new Date().toISOString(),
                datos
            });
        }, DEMORA_ENVIO);
    });
}

/* ---- Envío del formulario ---- */
async function manejarEnvio(evento) {
    evento.preventDefault();

    const nombreValido = validarNombre();
    const correoValido = validarCorreo();
    const claveValida = validarPassword();
    const confirmacionValida = validarConfirmacion();

    if (!nombreValido || !correoValido || !claveValida || !confirmacionValida) {
        const primerInvalido = formRegistro.querySelector('.is-invalid');
        if (primerInvalido) primerInvalido.focus();
        return;
    }

    const iconoBoton = btnSubmit.querySelector('.material-symbols-outlined');
    const iconoOriginal = iconoBoton ? iconoBoton.textContent : 'person_add';

    btnSubmit.disabled = true;
    btnSubmit.classList.add('is-loading');
    btnSubmitTexto.textContent = 'Registrando…';
    if (iconoBoton) iconoBoton.textContent = 'progress_activity';

    const datosUsuario = {
        nombreCompleto: inputNombre.value.trim(),
        correo: inputCorreo.value.trim(),
        rol: 'administrador',
        passwordProvisional: inputPassword.value
    };

    try {
        const respuesta = await enviarRegistro(datosUsuario);

        if (respuesta && respuesta.exito) {
            ultimoCorreoRegistrado = datosUsuario.correo;

            // textContent: los datos del usuario nunca se inyectan como HTML.
            exitoNombreUsuario.textContent = datosUsuario.nombreCompleto;
            exitoCorreoUsuario.textContent = datosUsuario.correo;

            formRegistro.classList.add('d-none');
            estadoExito.classList.remove('d-none');

            document.getElementById('contenedorFormularioRegistro')
                .scrollIntoView({ behavior: 'smooth', block: 'start' });

            mostrarAviso('Cuenta creada y correo de verificación enviado');
        }
    } catch (error) {
        mostrarAviso('Ocurrió un error al procesar el registro institucional.', 'error');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.classList.remove('is-loading');
        btnSubmitTexto.textContent = 'Registrar usuario';
        if (iconoBoton) iconoBoton.textContent = iconoOriginal;
    }
}

/* ---- Reinicio para registrar otra cuenta ---- */
function registrarOtroUsuario() {
    formRegistro.reset();

    limpiarError(inputNombre, errorNombre);
    limpiarError(inputCorreo, errorCorreo);
    limpiarError(inputPassword, errorPassword);
    limpiarError(inputConfirmPassword, errorConfirmPassword);
    advertenciaDominio.classList.add('d-none');

    restablecerTogglePassword(btnTogglePass1, inputPassword);
    restablecerTogglePassword(btnTogglePass2, inputConfirmPassword);
    reiniciarFortaleza();

    estadoExito.classList.add('d-none');
    formRegistro.classList.remove('d-none');

    inputNombre.focus();
}

/* ---- Reenvío del enlace de activación ---- */
function reenviarEnlace() {
    btnReenviarEnlace.disabled = true;
    mostrarAviso(`Enlace reenviado a ${ultimoCorreoRegistrado || 'la dirección del usuario'}`);

    window.setTimeout(() => {
        btnReenviarEnlace.disabled = false;
    }, TIEMPO_REENVIO);
}

/* ---- Menú lateral en pantallas pequeñas ---- */
function alternarMenuLateral(abrir) {
    const estaAbierto = typeof abrir === 'boolean'
        ? abrir
        : !barraLateral.classList.contains('is-open');

    barraLateral.classList.toggle('is-open', estaAbierto);
    respaldoMenu.hidden = !estaAbierto;
    btnMenuLateral.setAttribute('aria-expanded', String(estaAbierto));
    document.body.classList.toggle('menu-abierto', estaAbierto);
}

/* ---- Eventos ---- */
if (inputPassword) {
    inputPassword.addEventListener('input', () => {
        evaluarFortaleza(inputPassword.value);
        if (inputPassword.classList.contains('is-invalid')) validarPassword();
        if (inputConfirmPassword.value.trim() !== '') validarConfirmacion();
    });
}

if (inputNombre) {
    inputNombre.addEventListener('blur', validarNombre);
    inputNombre.addEventListener('input', () => {
        if (inputNombre.classList.contains('is-invalid')) validarNombre();
    });
}

if (inputCorreo) {
    inputCorreo.addEventListener('blur', validarCorreo);
    inputCorreo.addEventListener('input', () => {
        if (inputCorreo.classList.contains('is-invalid')) validarCorreo();
    });
}

if (inputPassword) {
    inputPassword.addEventListener('blur', validarPassword);
}

if (inputConfirmPassword) {
    inputConfirmPassword.addEventListener('blur', validarConfirmacion);
    inputConfirmPassword.addEventListener('input', () => {
        if (inputConfirmPassword.classList.contains('is-invalid')) validarConfirmacion();
    });
}

if (formRegistro) formRegistro.addEventListener('submit', manejarEnvio);
if (btnRegistrarOtro) btnRegistrarOtro.addEventListener('click', registrarOtroUsuario);
if (btnReenviarEnlace) btnReenviarEnlace.addEventListener('click', reenviarEnlace);

if (btnMenuLateral) {
    btnMenuLateral.addEventListener('click', () => alternarMenuLateral());
}

if (respaldoMenu) {
    respaldoMenu.addEventListener('click', () => alternarMenuLateral(false));
}

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && barraLateral.classList.contains('is-open')) {
        alternarMenuLateral(false);
    }
});

const consultaEscritorio = window.matchMedia('(min-width: 992px)');
consultaEscritorio.addEventListener('change', (evento) => {
    if (evento.matches) alternarMenuLateral(false);
});
