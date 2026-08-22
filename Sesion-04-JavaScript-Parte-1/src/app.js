/**
 * Lista de Tareas — JS Parte 1
 * Universidad Mariano Gálvez de Guatemala · Desarrollo Web
 *
 * Implementa las funciones marcadas con TODO para que los tests pasen.
 * No cambies los nombres exportados ni su firma.
 */

// Día 1: configuración inicial del proyecto.
// Este archivo está enlazado desde index.html como módulo JavaScript.

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
 * Día 2.
 */
export function agregarTarea(texto) {
    // TODO: implementar en el día 2
}

/**
 * Elimina una tarea por id.
 * Día 2.
 */
export function eliminarTarea(id) {
    // TODO: implementar en el día 2
}

/**
 * Marca o desmarca una tarea como completada.
 * Día 3.
 */
export function toggleTarea(id) {
    // TODO: implementar en el día 3
}

/**
 * Filtra las tareas.
 * Día 3.
 */
export function filtrarTareas(filtro) {
    // TODO: implementar en el día 3
}

/**
 * Guarda las tareas en localStorage.
 * Día 4.
 */
export function guardar() {
    // TODO: implementar en el día 4
}

/**
 * Carga las tareas desde localStorage.
 * Día 4.
 */
export function cargar() {
    // TODO: implementar en el día 4
}

// =====================================================
// Renderizado y eventos
// =====================================================

export function render(filtro = "todas") {
    const lista = document.getElementById("lista-tareas");
    const contador = document.getElementById("contador");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    // El render funcional se completará durante los siguientes días.

    if (contador) {
        contador.textContent = "0 tareas";
    }
}

let filtroActual = "todas";

function init() {
    render(filtroActual);
}

// Inicializar solamente cuando existe un DOM.
if (
    typeof document !== "undefined" &&
    document.getElementById("lista-tareas")
) {
    document.addEventListener("DOMContentLoaded", init);
}