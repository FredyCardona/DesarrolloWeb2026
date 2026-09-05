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
// Utilidades (ya implementadas — no las modifiques)
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

// =====================================================
// Día 2
// process.argv, variables de entorno y módulo os
// =====================================================

/**
 * Parsea los argumentos de la línea de comandos (process.argv).
 * Acepta: --nombre <valor> y --puerto <valor>.
 * Valores por defecto: nombre = "invitado", puerto = 3000.
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

        if (argumento === '--nombre' && argv[i + 1]) {
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
 * Construye la configuración de la app a partir
 * de variables de entorno.
 *
 * Lee:
 * - PORT
 * - NOMBRE_APP
 * - ARCHIVO_DATOS
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
 * Devuelve información del sistema usando el módulo os.
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
// Día 3 — todavía pendiente
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
    throw new Error(
        'Not implemented: crearLogger',
    );
}

/**
 * Lee el arreglo de mensajes desde un archivo JSON.
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
    throw new Error(
        'Not implemented: leerMensajes',
    );
}

/**
 * Agrega un mensaje al archivo y lo devuelve.
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
    throw new Error(
        'Not implemented: agregarMensaje',
    );
}

// =====================================================
// Día 4 — todavía pendiente
// =====================================================

/**
 * Crea un servidor HTTP sin escuchar todavía.
 *
 * Rutas:
 *   GET  /
 *   GET  /mensajes
 *   POST /mensajes
 *
 * @param {{
 *   archivoDatos?: string,
 *   nombreApp?: string,
 *   logger?: ReturnType<typeof crearLogger>
 * }} [config]
 *
 * @returns {import('node:http').Server}
 */
export function crearServidor(config = {}) {
    throw new Error(
        'Not implemented: crearServidor',
    );
}

/**
 * Crea y arranca el servidor.
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
    throw new Error(
        'Not implemented: iniciarServidor',
    );
}