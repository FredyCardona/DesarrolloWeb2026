/**
 * Lista de Tareas — JS Parte 1
 * Universidad Mariano Gálvez de Guatemala · Desarrollo Web
 *
 * Funciones:
 * - Agregar tareas
 * - Eliminar tareas
 * - Completar tareas
 * - Filtrar tareas
 * - Guardar en localStorage
 * - Cargar desde localStorage
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

    tareas = tareas.filter(
        (tarea) => tarea.id !== id,
    );

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

    tareaEncontrada.completada =
        !tareaEncontrada.completada;

    return true;
}

/**
 * Filtra las tareas según su estado.
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
 * Guarda el array de tareas en localStorage.
 */
export function guardar() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tareas),
    );
}

/**
 * Carga las tareas almacenadas en localStorage.
 * Si no existen datos o hay un error,
 * se utiliza un arreglo vacío.
 */
export function cargar() {
    try {
        const datosGuardados =
            localStorage.getItem(STORAGE_KEY);

        if (!datosGuardados) {
            tareas = [];
            return;
        }

        const datos = JSON.parse(datosGuardados);

        if (Array.isArray(datos)) {
            tareas = datos;
        } else {
            tareas = [];
        }
    } catch (error) {
        tareas = [];
    }
}

// =====================================================
// Renderizado y eventos
// =====================================================

let filtroActual = "todas";

/**
 * Renderiza las tareas en el DOM.
 * @param {"todas"|"pendientes"|"completadas"} filtro
 */
export function render(filtro = "todas") {
    const lista =
        document.getElementById("lista-tareas");

    const contador =
        document.getElementById("contador");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    const tareasVisibles =
        filtrarTareas(filtro);

    for (const tarea of tareasVisibles) {
        const li =
            document.createElement("li");

        if (tarea.completada) {
            li.classList.add("completada");
        }

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = tarea.completada;
        checkbox.dataset.id = tarea.id;

        checkbox.setAttribute(
            "aria-label",
            `Marcar "${tarea.texto}" como hecha`,
        );

        checkbox.addEventListener(
            "change",
            () => {
                toggleTarea(tarea.id);

                guardar();

                render(filtroActual);
            },
        );

        const span =
            document.createElement("span");

        span.className = "texto";
        span.textContent = tarea.texto;

        const btnEliminar =
            document.createElement("button");

        btnEliminar.type = "button";
        btnEliminar.className = "eliminar";
        btnEliminar.textContent = "✕";

        btnEliminar.setAttribute(
            "aria-label",
            `Eliminar "${tarea.texto}"`,
        );

        btnEliminar.addEventListener(
            "click",
            () => {
                eliminarTarea(tarea.id);

                guardar();

                render(filtroActual);
            },
        );

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
 * Inicializa la aplicación.
 */
function init() {
    cargar();

    render(filtroActual);

    const form =
        document.getElementById("form-tarea");

    const input =
        document.getElementById("input-tarea");

    if (form && input) {
        form.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const creada =
                    agregarTarea(input.value);

                if (creada) {
                    guardar();

                    render(filtroActual);

                    input.value = "";
                    input.focus();
                }
            },
        );
    }

    const botonesFiltro =
        document.querySelectorAll(".filtro");

    botonesFiltro.forEach((boton) => {
        boton.addEventListener(
            "click",
            () => {
                filtroActual =
                    boton.dataset.filtro;

                botonesFiltro.forEach(
                    (otroBoton) => {
                        otroBoton.classList.remove(
                            "activo",
                        );
                    },
                );

                boton.classList.add("activo");

                render(filtroActual);
            },
        );
    });
}

// Inicializar únicamente cuando existe un DOM.
if (
    typeof document !== "undefined" &&
    document.getElementById("lista-tareas")
) {
    document.addEventListener(
        "DOMContentLoaded",
        init,
    );
}