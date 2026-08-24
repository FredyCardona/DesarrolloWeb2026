/**
 * Lista de Tareas — JS Parte 1
 * Universidad Mariano Gálvez de Guatemala · Desarrollo Web
 *
 * Día 3:
 * - agregarTarea
 * - eliminarTarea
 * - toggleTarea
 * - filtrarTareas
 * - render del DOM
 * - conexión de botones de filtro
 */

const STORAGE_KEY = "tareas-dw-s4";

// Estado en memoria
let tareas = [];

/**
 * Devuelve todas las tareas.
 * @returns {Array<{id: string, texto: string, completada: boolean}>}
 */
export function obtenerTareas() {
    return tareas;
}

/**
 * Crea un id único para cada tarea.
 * @returns {string}
 */
export function generarId() {
    return `t-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

/**
 * Agrega una tarea al modelo.
 * @param {string} texto
 * @returns {{id: string, texto: string, completada: boolean} | null}
 */
export function agregarTarea(texto) {
    const textoLimpio = texto.trim();

    if (textoLimpio === "") {
        return null;
    }

    const nuevaTarea = {
        id: generarId(),
        texto: textoLimpio,
        completada: false,
    };

    tareas.push(nuevaTarea);

    return nuevaTarea;
}

/**
 * Elimina una tarea por id.
 * @param {string} id
 * @returns {boolean}
 */
export function eliminarTarea(id) {
    const cantidadAnterior = tareas.length;

    tareas = tareas.filter((tarea) => tarea.id !== id);

    return tareas.length < cantidadAnterior;
}

/**
 * Marca o desmarca una tarea como completada.
 * @param {string} id
 * @returns {boolean}
 */
export function toggleTarea(id) {
    const tareaEncontrada = tareas.find(
        (tarea) => tarea.id === id,
    );

    if (!tareaEncontrada) {
        return false;
    }

    tareaEncontrada.completada = !tareaEncontrada.completada;

    return true;
}

/**
 * Devuelve las tareas correspondientes al filtro.
 * @param {"todas"|"pendientes"|"completadas"} filtro
 * @returns {Array}
 */
export function filtrarTareas(filtro) {
    if (filtro === "pendientes") {
        return tareas.filter(
            (tarea) => !tarea.completada,
        );
    }

    if (filtro === "completadas") {
        return tareas.filter(
            (tarea) => tarea.completada,
        );
    }

    return tareas;
}

/**
 * Guarda las tareas en localStorage.
 * Se implementará en el Día 4.
 */
export function guardar() {
    // TODO: Día 4
}

/**
 * Carga las tareas desde localStorage.
 * Se implementará en el Día 4.
 */
export function cargar() {
    // TODO: Día 4
}

// =====================================================
// Renderizado y eventos
// =====================================================

let filtroActual = "todas";

/**
 * Renderiza las tareas en el DOM aplicando el filtro.
 * @param {"todas"|"pendientes"|"completadas"} filtro
 */
export function render(filtro = "todas") {
    const lista = document.getElementById("lista-tareas");
    const contador = document.getElementById("contador");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    const tareasVisibles = filtrarTareas(filtro);

    for (const tarea of tareasVisibles) {
        const li = document.createElement("li");

        if (tarea.completada) {
            li.classList.add("completada");
        }

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = tarea.completada;
        checkbox.dataset.id = tarea.id;

        checkbox.setAttribute(
            "aria-label",
            `Marcar "${tarea.texto}" como hecha`,
        );

        checkbox.addEventListener("change", () => {
            toggleTarea(tarea.id);
            render(filtroActual);
        });

        const span = document.createElement("span");

        span.className = "texto";
        span.textContent = tarea.texto;

        const btnEliminar = document.createElement("button");

        btnEliminar.type = "button";
        btnEliminar.className = "eliminar";
        btnEliminar.textContent = "✕";

        btnEliminar.setAttribute(
            "aria-label",
            `Eliminar "${tarea.texto}"`,
        );

        btnEliminar.addEventListener("click", () => {
            eliminarTarea(tarea.id);
            render(filtroActual);
        });

        li.append(
            checkbox,
            span,
            btnEliminar,
        );

        lista.appendChild(li);
    }

    if (contador) {
        const total = tareas.length;

        const hechas = tareas.filter(
            (tarea) => tarea.completada,
        ).length;

        contador.textContent =
            `${total} tarea${total === 1 ? "" : "s"} (${hechas} hechas)`;
    }
}

/**
 * Inicializa los eventos de la aplicación.
 */
function init() {
    render(filtroActual);

    const form = document.getElementById("form-tarea");

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const input = document.getElementById("input-tarea");

            if (!input) {
                return;
            }

            const creada = agregarTarea(input.value);

            if (creada) {
                render(filtroActual);

                input.value = "";
                input.focus();
            }
        });
    }

    const botonesFiltro =
        document.querySelectorAll(".filtro");

    botonesFiltro.forEach((boton) => {
        boton.addEventListener("click", () => {
            filtroActual = boton.dataset.filtro;

            botonesFiltro.forEach((otroBoton) => {
                otroBoton.classList.remove("activo");
            });

            boton.classList.add("activo");

            render(filtroActual);
        });
    });
}

// Inicializar únicamente cuando existe un DOM.
if (
    typeof document !== "undefined" &&
    document.getElementById("lista-tareas")
) {
    document.addEventListener("DOMContentLoaded", init);
}