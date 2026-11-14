/* ============================================================
   AETEME · Gestión de Usuarios (exclusivo de usuarios/gestion-usuarios.html)
   Búsqueda en la tabla, baja lógica simulada, aviso de confirmación
   y menú lateral en pantallas pequeñas.
   No hay conexión a la API todavía; las cuentas vienen del HTML.
   ============================================================ */

const buscadorUsuarios = document.getElementById('buscadorUsuarios');
const cuerpoTablaUsuarios = document.getElementById('cuerpoTablaUsuarios');

const modalConfirmarBaja = document.getElementById('modalConfirmarBaja');
const tituloModalBaja = document.getElementById('tituloModalBaja');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnCancelarBaja = document.getElementById('btnCancelarBaja');
const btnConfirmarBaja = document.getElementById('btnConfirmarBaja');

const toastConfirmacion = document.getElementById('toastConfirmacion');
const toastMensaje = document.getElementById('toastMensaje');

const barraLateral = document.getElementById('barraLateral');
const respaldoMenu = document.getElementById('respaldoMenu');
const btnMenuLateral = document.getElementById('btnMenuLateral');

const DURACION_AVISO = 3500;

let filaObjetivo = null;
let temporizadorAviso = null;

/* Normaliza el texto para que la búsqueda ignore tildes y mayúsculas. */
function normalizarTexto(texto) {
    return texto
        .toLocaleLowerCase('es')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/* ---- Búsqueda por nombre o correo ---- */
function filtrarUsuarios() {
    const termino = normalizarTexto(buscadorUsuarios.value.trim());

    cuerpoTablaUsuarios.querySelectorAll('.user-row').forEach((fila) => {
        const nombre = normalizarTexto(fila.dataset.nombre || '');
        const correo = normalizarTexto(fila.dataset.correo || '');
        const coincide = termino === '' || nombre.includes(termino) || correo.includes(termino);

        fila.classList.toggle('d-none', !coincide);
    });
}

/* ---- Aviso emergente de operación completada ---- */
function mostrarAviso(mensaje) {
    toastMensaje.textContent = mensaje;
    toastConfirmacion.classList.add('is-visible');

    window.clearTimeout(temporizadorAviso);
    temporizadorAviso = window.setTimeout(() => {
        toastConfirmacion.classList.remove('is-visible');
    }, DURACION_AVISO);
}

/* ---- Baja lógica de una cuenta ---- */
function abrirModalBaja(boton) {
    filaObjetivo = boton.closest('.user-row');
    if (!filaObjetivo) return;

    tituloModalBaja.textContent = `Dar de baja a ${boton.dataset.usuario}`;

    if (!modalConfirmarBaja.open) {
        modalConfirmarBaja.showModal();
    }
}

function confirmarBaja() {
    if (!filaObjetivo) return;

    const nombre = filaObjetivo.dataset.nombre || 'la cuenta';

    filaObjetivo.remove();
    filaObjetivo = null;

    modalConfirmarBaja.close();
    mostrarAviso(`Cuenta de ${nombre} desactivada correctamente`);
}

function cerrarModalBaja() {
    if (modalConfirmarBaja.open) modalConfirmarBaja.close();
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
if (buscadorUsuarios) buscadorUsuarios.addEventListener('input', filtrarUsuarios);

if (cuerpoTablaUsuarios) {
    cuerpoTablaUsuarios.addEventListener('click', (evento) => {
        const botonBaja = evento.target.closest('.js-baja');
        if (botonBaja) abrirModalBaja(botonBaja);
    });
}

if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModalBaja);
if (btnCancelarBaja) btnCancelarBaja.addEventListener('click', cerrarModalBaja);
if (btnConfirmarBaja) btnConfirmarBaja.addEventListener('click', confirmarBaja);

if (modalConfirmarBaja) {
    // Un clic sobre el fondo del dialog (fuera de su contenido) cierra la ventana.
    modalConfirmarBaja.addEventListener('click', (evento) => {
        if (evento.target === modalConfirmarBaja) cerrarModalBaja();
    });
    modalConfirmarBaja.addEventListener('close', () => {
        filaObjetivo = null;
    });
}

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
