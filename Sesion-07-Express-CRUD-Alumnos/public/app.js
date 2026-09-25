/**
 * app.js — Lógica del sitio (Fetch + Dialogs)
 * Tarea Sesión 7 · Desarrollo Web · UMG
 */

const API = '/alumnos';
const API_KEY = 'umg-2026';

// Cabeceras para las operaciones protegidas
const cabeceras = (conJson = true) => ({
    ...(conJson
        ? { 'Content-Type': 'application/json' }
        : {}),
    'x-api-key': API_KEY,
});

// Referencias del DOM
const tabla = document.querySelector(
    '#tablaAlumnos tbody',
);

const mensaje = document.querySelector(
    '#mensaje',
);

const dialogoForm = document.querySelector(
    '#dialogoForm',
);

const dialogoEliminar = document.querySelector(
    '#dialogoEliminar',
);

const form = document.querySelector(
    '#formAlumno',
);

const tituloForm = document.querySelector(
    '#tituloForm',
);

const nombreEliminar = document.querySelector(
    '#nombreEliminar',
);

let idEnEdicion = null;
let idAEliminar = null;
let alumnosActuales = [];

/**
 * Obtiene los alumnos desde la API
 * y los muestra en la tabla.
 */
async function cargarAlumnos() {
    try {
        const respuesta = await fetch(API);

        if (!respuesta.ok) {
            throw new Error(
                'No se pudieron cargar los alumnos',
            );
        }

        alumnosActuales =
            await respuesta.json();

        tabla.innerHTML = '';

        for (const alumno of alumnosActuales) {
            const fila =
                document.createElement('tr');

            const celdaId =
                document.createElement('td');
            celdaId.textContent = alumno.id;

            const celdaNombre =
                document.createElement('td');
            celdaNombre.textContent =
                alumno.nombre;

            const celdaApellido =
                document.createElement('td');
            celdaApellido.textContent =
                alumno.apellido;

            const celdaEmail =
                document.createElement('td');
            celdaEmail.textContent =
                alumno.email;

            const celdaEdad =
                document.createElement('td');
            celdaEdad.textContent =
                alumno.edad ?? '';

            const celdaAcciones =
                document.createElement('td');

            celdaAcciones.classList.add(
                'acciones-tabla',
            );

            const btnEditar =
                document.createElement('button');

            btnEditar.type = 'button';
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add(
                'btn-editar',
            );

            btnEditar.addEventListener(
                'click',
                () => {
                    abrirDialogoEditar(
                        alumno.id,
                    );
                },
            );

            const btnEliminar =
                document.createElement('button');

            btnEliminar.type = 'button';
            btnEliminar.textContent =
                'Eliminar';

            btnEliminar.classList.add(
                'btn-eliminar',
            );

            btnEliminar.addEventListener(
                'click',
                () => {
                    eliminarAlumno(
                        alumno.id,
                    );
                },
            );

            celdaAcciones.append(
                btnEditar,
                btnEliminar,
            );

            fila.append(
                celdaId,
                celdaNombre,
                celdaApellido,
                celdaEmail,
                celdaEdad,
                celdaAcciones,
            );

            tabla.appendChild(fila);
        }
    } catch (error) {
        mostrarMensaje(
            error.message,
            'error',
        );
    }
}

/**
 * Abre el formulario para crear
 * un alumno nuevo.
 */
function abrirDialogoNuevo() {
    idEnEdicion = null;

    form.reset();

    tituloForm.textContent =
        'Nuevo alumno';

    dialogoForm.showModal();
}

/**
 * Abre el formulario con los datos
 * del alumno seleccionado.
 */
function abrirDialogoEditar(id) {
    const alumno =
        alumnosActuales.find(
            (item) => item.id === id,
        );

    if (!alumno) {
        mostrarMensaje(
            'Alumno no encontrado',
            'error',
        );

        return;
    }

    idEnEdicion = id;

    tituloForm.textContent =
        'Editar alumno';

    document.querySelector(
        '#nombre',
    ).value = alumno.nombre;

    document.querySelector(
        '#apellido',
    ).value = alumno.apellido;

    document.querySelector(
        '#email',
    ).value = alumno.email;

    document.querySelector(
        '#edad',
    ).value = alumno.edad ?? '';

    dialogoForm.showModal();
}

/**
 * Crea o actualiza un alumno.
 */
async function guardarAlumno(event) {
    event.preventDefault();

    const nombre =
        document.querySelector(
            '#nombre',
        ).value.trim();

    const apellido =
        document.querySelector(
            '#apellido',
        ).value.trim();

    const email =
        document.querySelector(
            '#email',
        ).value.trim();

    const edadTexto =
        document.querySelector(
            '#edad',
        ).value;

    const datos = {
        nombre,
        apellido,
        email,
    };

    if (edadTexto !== '') {
        datos.edad =
            Number(edadTexto);
    }

    const editando =
        idEnEdicion !== null;

    const url = editando
        ? `${API}/${idEnEdicion}`
        : API;

    const metodo = editando
        ? 'PUT'
        : 'POST';

    try {
        const respuesta = await fetch(
            url,
            {
                method: metodo,
                headers: cabeceras(),
                body: JSON.stringify(datos),
            },
        );

        if (!respuesta.ok) {
            let textoError =
                'No se pudo guardar el alumno';

            try {
                const error =
                    await respuesta.json();

                if (error?.error) {
                    textoError =
                        error.error;
                }
            } catch {
                // Se conserva el mensaje general.
            }

            throw new Error(textoError);
        }

        dialogoForm.close();

        form.reset();

        idEnEdicion = null;

        await cargarAlumnos();

        mostrarMensaje(
            editando
                ? 'Alumno actualizado correctamente'
                : 'Alumno creado correctamente',
            'ok',
        );
    } catch (error) {
        mostrarMensaje(
            error.message,
            'error',
        );
    }
}

/**
 * Abre el diálogo para confirmar
 * la eliminación.
 */
function eliminarAlumno(id) {
    const alumno =
        alumnosActuales.find(
            (item) => item.id === id,
        );

    if (!alumno) {
        mostrarMensaje(
            'Alumno no encontrado',
            'error',
        );

        return;
    }

    idAEliminar = id;

    nombreEliminar.textContent =
        `${alumno.nombre} ${alumno.apellido}`;

    dialogoEliminar.showModal();
}

/**
 * Ejecuta la eliminación confirmada.
 */
async function confirmarEliminacion() {
    if (!idAEliminar) {
        return;
    }

    try {
        const respuesta = await fetch(
            `${API}/${idAEliminar}`,
            {
                method: 'DELETE',
                headers:
                    cabeceras(false),
            },
        );

        if (!respuesta.ok) {
            let textoError =
                'No se pudo eliminar el alumno';

            try {
                const error =
                    await respuesta.json();

                if (error?.error) {
                    textoError =
                        error.error;
                }
            } catch {
                // Se conserva el mensaje general.
            }

            throw new Error(textoError);
        }

        dialogoEliminar.close();

        idAEliminar = null;

        await cargarAlumnos();

        mostrarMensaje(
            'Alumno eliminado correctamente',
            'ok',
        );
    } catch (error) {
        mostrarMensaje(
            error.message,
            'error',
        );
    }
}

/**
 * Muestra mensajes de éxito o error.
 */
function mostrarMensaje(
    texto,
    tipo = 'ok',
) {
    mensaje.textContent = texto;

    mensaje.classList.remove(
        'ok',
        'error',
    );

    mensaje.classList.add(tipo);
}

// ============================================================
// Eventos
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    () => {
        const btnNuevo =
            document.querySelector(
                '#btnNuevo',
            );

        const btnCancelar =
            document.querySelector(
                '#btnCancelar',
            );

        const btnCancelarEliminar =
            document.querySelector(
                '#btnCancelarEliminar',
            );

        const btnConfirmarEliminar =
            document.querySelector(
                '#btnConfirmarEliminar',
            );

        btnNuevo.addEventListener(
            'click',
            abrirDialogoNuevo,
        );

        form.addEventListener(
            'submit',
            guardarAlumno,
        );

        btnCancelar.addEventListener(
            'click',
            () => {
                dialogoForm.close();
                form.reset();
                idEnEdicion = null;
            },
        );

        btnCancelarEliminar.addEventListener(
            'click',
            () => {
                dialogoEliminar.close();
                idAEliminar = null;
            },
        );

        btnConfirmarEliminar.addEventListener(
            'click',
            confirmarEliminacion,
        );

        cargarAlumnos();
    },
);