/**
 * Lista de Tareas — JS Parte 1
 * Universidad Mariano Gálvez de Guatemala · Desarrollo Web
 *
 * Día 2:
 * - agregarTarea
 * - eliminarTarea
 * - render básico del DOM
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
 * Marca o desmarca una tarea.
 * Se implementará en el Día 3.
 */
export function toggleTarea(id) {
    // TODO: Día 3
    return false;
}

/**
 * Filtra las tareas.
 * Se implementará en el Día 3.
 */
export function filtrarTareas(filtro) {
    // TODO: Día 3
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

/**
 * Renderiza las tareas actuales en el DOM.
 */
export function render(filtro = "todas") {
    const lista = document.getElementById("lista-tareas");
    const contador = document.getElementById("contador");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    for (const tarea of tareas) {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarea.completada;
        checkbox.dataset.id = tarea.id;
        checkbox.setAttribute(
            "aria-label",
            `Marcar "${tarea.texto}" como hecha`,
        );

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
            render(filtro);
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

        contador.textContent =
            `${total} tarea${total === 1 ? "" : "s"}`;
    }
}

let filtroActual = "todas";

/**
 * Inicializa los eventos de la página.
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
}

// Inicializar únicamente cuando existe el DOM.
if (
    typeof document !== "undefined" &&
    document.getElementById("lista-tareas")
) {
    document.addEventListener("DOMContentLoaded", init);
}