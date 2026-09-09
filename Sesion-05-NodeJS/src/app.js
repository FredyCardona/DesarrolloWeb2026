/**
 * Servidor HTTP con Node.js — Tarea Sesión 5
 * Universidad Mariano Gálvez de Guatemala · Desarrollo Web
 *
 * Implementa las funciones marcadas con TODO para que los tests pasen.
 * No cambies los nombres exportados ni su firma.
 *
 * Temas de la sesión aplicados aquí:
 *   - process.argv            → parsearArgumentos
 *   - variables de entorno    → obtenerConfig
 *   - módulo os               → infoSistema
 *   - EventEmitter            → crearLogger
 *   - módulo fs/promises      → leerMensajes / agregarMensaje
 *   - módulo http             → crearServidor / iniciarServidor
 */

import http from 'node:http';
import { EventEmitter } from 'node:events';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';

// =====================================================
// Utilidades
// =====================================================

/**
 * Crea un id único para cada mensaje.
 * @returns {string}
 */
export function generarId() {
    return `m-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

/**
 * Lee el body (cuerpo) de una petición HTTP como string.
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<string>}
 */
function leerBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            resolve(data);
        });

        req.on('error', reject);
    });
}

/**
 * Envía una respuesta en formato JSON.
 * @param {import('node:http').ServerResponse} res
 * @param {number} statusCode
 * @param {unknown} data
 */
function responderJson(res, statusCode, data) {
    res.statusCode = statusCode;

    res.setHeader(
        'Content-Type',
        'application/json; charset=utf-8',
    );

    res.end(JSON.stringify(data));
}

// =====================================================
// Día 2
// Argumentos, configuración y sistema
// =====================================================

/**
 * Parsea los argumentos de la línea de comandos.
 *
 * Acepta:
 * --nombre <valor>
 * --puerto <valor>
 *
 * @param {string[]} argv
 * @returns {{ nombre: string, puerto: number }}
 */
export function parsearArgumentos(argv) {
    const resultado = {
        nombre: 'invitado',
        puerto: 3000,
    };

    for (let i = 2; i < argv.length; i += 1) {
        const argumento = argv[i];

        if (
            argumento === '--nombre' &&
            argv[i + 1]
        ) {
            resultado.nombre = argv[i + 1];
            i += 1;
        } else if (
            argumento === '--puerto' &&
            argv[i + 1]
        ) {
            const puerto = Number(argv[i + 1]);

            if (
                Number.isInteger(puerto) &&
                puerto > 0
            ) {
                resultado.puerto = puerto;
            }

            i += 1;
        }
    }

    return resultado;
}

/**
 * Obtiene la configuración desde variables de entorno.
 *
 * @param {NodeJS.ProcessEnv} env
 * @returns {{
 *   puerto: number,
 *   nombreApp: string,
 *   archivoDatos: string
 * }}
 */
export function obtenerConfig(env) {
    const variables = env ?? {};

    const puertoConvertido =
        Number(variables.PORT);

    const puerto =
        Number.isInteger(puertoConvertido) &&
        puertoConvertido > 0
            ? puertoConvertido
            : 3000;

    return {
        puerto,

        nombreApp:
            variables.NOMBRE_APP ||
            'mensajes-api',

        archivoDatos:
            variables.ARCHIVO_DATOS ||
            'data/mensajes.json',
    };
}

/**
 * Devuelve información del sistema usando
 * el módulo os.
 *
 * @returns {{
 *   plataforma: string,
 *   nucleos: number,
 *   memoriaLibreMB: number,
 *   hostname: string
 * }}
 */
export function infoSistema() {
    return {
        plataforma: os.platform(),

        nucleos:
            os.cpus().length,

        memoriaLibreMB:
            Math.round(
                os.freemem() / 1024 / 1024,
            ),

        hostname:
            os.hostname(),
    };
}

// =====================================================
// Día 3
// EventEmitter y fs/promises
// =====================================================

/**
 * Crea un logger basado en EventEmitter.
 *
 * @returns {{
 *   registrar: (mensaje: string) => void,
 *   onRegistro: (fn: (linea: string) => void) => void
 * }}
 */
export function crearLogger() {
    const emitter = new EventEmitter();

    function registrar(mensaje) {
        const fecha =
            new Date().toISOString();

        const linea =
            `[${fecha}] ${mensaje}`;

        emitter.emit(
            'registro',
            linea,
        );
    }

    function onRegistro(fn) {
        emitter.on(
            'registro',
            fn,
        );
    }

    return {
        registrar,
        onRegistro,
    };
}

/**
 * Lee los mensajes desde un archivo JSON.
 *
 * Si el archivo no existe devuelve [].
 * Si el contenido no es un arreglo devuelve [].
 *
 * @param {string} archivoDatos
 * @returns {Promise<Array<{
 *   id: string,
 *   texto: string,
 *   fecha: string
 * }>>}
 */
export async function leerMensajes(
    archivoDatos,
) {
    try {
        const contenido =
            await fs.readFile(
                archivoDatos,
                'utf8',
            );

        const datos =
            JSON.parse(contenido);

        if (!Array.isArray(datos)) {
            return [];
        }

        return datos;
    } catch (error) {
        if (
            error.code === 'ENOENT' ||
            error instanceof SyntaxError
        ) {
            return [];
        }

        throw error;
    }
}

/**
 * Agrega un mensaje al archivo JSON.
 *
 * Si el texto está vacío devuelve null.
 *
 * @param {string} archivoDatos
 * @param {string} texto
 * @returns {Promise<{
 *   id: string,
 *   texto: string,
 *   fecha: string
 * } | null>}
 */
export async function agregarMensaje(
    archivoDatos,
    texto,
) {
    if (
        typeof texto !== 'string' ||
        texto.trim() === ''
    ) {
        return null;
    }

    const mensajes =
        await leerMensajes(
            archivoDatos,
        );

    const nuevoMensaje = {
        id: generarId(),

        texto:
            texto.trim(),

        fecha:
            new Date().toISOString(),
    };

    mensajes.push(
        nuevoMensaje,
    );

    const directorio =
        path.dirname(
            archivoDatos,
        );

    await fs.mkdir(
        directorio,
        {
            recursive: true,
        },
    );

    await fs.writeFile(
        archivoDatos,
        JSON.stringify(
            mensajes,
            null,
            2,
        ),
        'utf8',
    );

    return nuevoMensaje;
}

// =====================================================
// Día 4
// Servidor HTTP
// =====================================================

/**
 * Crea un servidor HTTP sin escuchar todavía.
 *
 * Rutas:
 * GET  /           → información de la aplicación
 * GET  /mensajes   → lista de mensajes
 * POST /mensajes   → crea un mensaje
 *
 * @param {{
 *   archivoDatos?: string,
 *   nombreApp?: string,
 *   logger?: ReturnType<typeof crearLogger>
 * }} [config]
 *
 * @returns {import('node:http').Server}
 */
export function crearServidor(
    config = {},
) {
    const archivoDatos =
        config.archivoDatos ||
        'data/mensajes.json';

    const nombreApp =
        config.nombreApp ||
        'mensajes-api';

    const logger =
        config.logger ||
        crearLogger();

    const servidor =
        http.createServer(
            async (req, res) => {
                const metodo =
                    req.method || 'GET';

                const url =
                    new URL(
                        req.url || '/',
                        'http://localhost',
                    );

                const ruta =
                    url.pathname;

                logger.registrar(
                    `${metodo} ${ruta}`,
                );

                try {
                    // ==========================
                    // GET /
                    // ==========================
                    if (
                        metodo === 'GET' &&
                        ruta === '/'
                    ) {
                        responderJson(
                            res,
                            200,
                            {
                                mensaje:
                                    `Bienvenido a ${nombreApp}`,

                                hora:
                                    new Date().toISOString(),

                                sistema:
                                    infoSistema(),
                            },
                        );

                        return;
                    }

                    // ==========================
                    // GET /mensajes
                    // ==========================
                    if (
                        metodo === 'GET' &&
                        ruta === '/mensajes'
                    ) {
                        const mensajes =
                            await leerMensajes(
                                archivoDatos,
                            );

                        responderJson(
                            res,
                            200,
                            mensajes,
                        );

                        return;
                    }

                    // ==========================
                    // POST /mensajes
                    // ==========================
                    if (
                        metodo === 'POST' &&
                        ruta === '/mensajes'
                    ) {
                        const body =
                            await leerBody(
                                req,
                            );

                        let datos;

                        try {
                            datos =
                                JSON.parse(
                                    body || '{}',
                                );
                        } catch {
                            responderJson(
                                res,
                                400,
                                {
                                    error:
                                        'JSON inválido',
                                },
                            );

                            return;
                        }

                        const nuevoMensaje =
                            await agregarMensaje(
                                archivoDatos,
                                datos.texto,
                            );

                        if (!nuevoMensaje) {
                            responderJson(
                                res,
                                400,
                                {
                                    error:
                                        'El campo texto es requerido',
                                },
                            );

                            return;
                        }

                        responderJson(
                            res,
                            201,
                            nuevoMensaje,
                        );

                        return;
                    }

                    // ==========================
                    // Ruta no encontrada
                    // ==========================
                    responderJson(
                        res,
                        404,
                        {
                            error:
                                'Ruta no encontrada',
                        },
                    );
                } catch {
                    responderJson(
                        res,
                        500,
                        {
                            error:
                                'Error interno del servidor',
                        },
                    );
                }
            },
        );

    return servidor;
}

/**
 * Crea y arranca el servidor en el puerto indicado.
 *
 * Al arrancar registra:
 * "Servidor en http://localhost:<puerto>"
 *
 * @param {{
 *   puerto?: number,
 *   archivoDatos?: string,
 *   nombreApp?: string,
 *   logger?: ReturnType<typeof crearLogger>
 * }} [config]
 *
 * @returns {import('node:http').Server}
 */
export function iniciarServidor(
    config = {},
) {
    const puerto =
        config.puerto ||
        3000;

    const logger =
        config.logger ||
        crearLogger();

    const servidor =
        crearServidor({
            ...config,
            logger,
        });

    servidor.listen(
        puerto,
        () => {
            logger.registrar(
                `Servidor en http://localhost:${puerto}`,
            );
        },
    );

    return servidor;
}