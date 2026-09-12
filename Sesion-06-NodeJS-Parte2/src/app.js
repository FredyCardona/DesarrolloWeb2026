/**
 * Procesador de logs y sistema de inventario — Tarea Sesión 6
 * Universidad Mariano Gálvez de Guatemala · Desarrollo Web
 *
 * Implementa las funciones marcadas con TODO para que los tests pasen.
 * No cambies los nombres exportados ni su firma.
 *
 * Temas de la sesión aplicados aquí:
 *   - ES Modules avanzado (named/default exports, re-exports)  → ./src/index.js
 *   - __dirname/__filename con import.meta.url                 → este archivo
 *   - Streams y pipelines (Transform para filtrar)             → filtrarLogs
 *   - Testing con node:test (unitario + integración)           → tests/
 *   - better-sqlite3 (CRUD, transacciones)                     → ./src/db.js
 */

import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// __dirname y __filename reproducidos con import.meta.url (ES Modules)
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// =====================================================
// Utilidades (ya implementadas — no las modifiques)
// =====================================================

/**
 * Crea un id único.
 * @returns {string}
 */
export function generarId() {
    return `r-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

// =====================================================
// Día 3
// Streams y pipeline
// =====================================================

/**
 * Filtra las líneas de un archivo de log que contienen un texto y
 * escribe el resultado en otro archivo, usando Streams + pipeline.
 *
 * @param {string} origen
 * @param {string} destino
 * @param {string} texto
 * @returns {Promise<number>}
 */
export async function filtrarLogs(origen, destino, texto) {
    let coincidencias = 0;
    let buffer = '';

    const filtro = new Transform({
        transform(chunk, encoding, callback) {
            buffer += chunk.toString();

            const lineas = buffer.split(/\r?\n/);
            buffer = lineas.pop() ?? '';

            for (const linea of lineas) {
                if (linea.includes(texto)) {
                    coincidencias += 1;
                    this.push(`${linea}\n`);
                }
            }

            callback();
        },

        flush(callback) {
            if (
                buffer !== '' &&
                buffer.includes(texto)
            ) {
                coincidencias += 1;
                this.push(`${buffer}\n`);
            }

            callback();
        },
    });

    await pipeline(
        createReadStream(origen, {
            encoding: 'utf8',
        }),
        filtro,
        createWriteStream(destino, {
            encoding: 'utf8',
        }),
    );

    return coincidencias;
}

/**
 * Lee un archivo de texto y devuelve sus líneas
 * como arreglo, ignorando las líneas vacías.
 *
 * @param {string} ruta
 * @returns {Promise<string[]>}
 */
export async function leerLineas(ruta) {
    const stream = createReadStream(
        ruta,
        {
            encoding: 'utf8',
        },
    );

    let contenido = '';

    for await (const chunk of stream) {
        contenido += chunk;
    }

    return contenido
        .split(/\r?\n/)
        .filter(
            (linea) =>
                linea.trim() !== '',
        );
}

// =====================================================
// Día 2
// import.meta.url, rutas y configuración .env
// =====================================================

/**
 * Devuelve una ruta absoluta a partir de una ruta relativa.
 * Usa el __dirname definido arriba junto con join().
 *
 * @param {string} rutaRelativa
 * @returns {string}
 */
export function rutaAbsoluta(rutaRelativa) {
    return join(__dirname, rutaRelativa);
}

/**
 * Parsea el contenido de un archivo de configuración ".env".
 *
 * Formato:
 * CLAVE=VALOR
 *
 * Ignora:
 * - líneas vacías
 * - comentarios que empiezan con #
 *
 * Las claves se devuelven en mayúsculas.
 *
 * @param {string} contenido
 * @returns {Record<string, string>}
 */
export function parsearEnv(contenido) {
    const resultado = {};

    const lineas = contenido.split(/\r?\n/);

    for (const linea of lineas) {
        const lineaLimpia = linea.trim();

        if (
            lineaLimpia === '' ||
            lineaLimpia.startsWith('#')
        ) {
            continue;
        }

        const posicionIgual =
            lineaLimpia.indexOf('=');

        if (posicionIgual === -1) {
            continue;
        }

        const clave =
            lineaLimpia
                .slice(0, posicionIgual)
                .trim()
                .toUpperCase();

        const valor =
            lineaLimpia
                .slice(posicionIgual + 1)
                .trim();

        if (clave !== '') {
            resultado[clave] = valor;
        }
    }

    return resultado;
}