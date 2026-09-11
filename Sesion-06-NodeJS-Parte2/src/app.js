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
import { Readable } from 'node:stream';
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
// Componentes y módulos
// =====================================================

/**
 * TODO 1: crea un módulo `src/math.js` (named exports) con:
 *   - const PI = 3.14159
 *   - function sumar(a, b)
 *   - function restar(a, b)
 *
 * TODO 2: crea un módulo `src/logger.js` (default export) con:
 *   - default function registrarProceso(msg) → string con formato
 *     `[fecha ISO] msg` (solo devuelve el string, no lo imprime)
 *
 * TODO 3: en `src/index.js` re-exporta (barrel exports) todo lo anterior:
 *   export { PI, sumar, restar } from "./math.js";
 *   export { default as logger } from "./logger.js";
 *   export { ... } from "./app.js";
 */

// =====================================================
// Día 3 — pendiente
// Streams y pipeline
// =====================================================

/**
 * Filtra las líneas de un archivo de log que contienen un texto y
 * escribe el resultado en otro archivo, usando Streams + pipeline.
 *
 * IMPORTANTE: usa `import { createReadStream, createWriteStream } from 'node:fs'`
 * y `pipeline` de 'node:stream/promises' (ya importados arriba).
 *
 * @param {string} origen  - Ruta del archivo de entrada.
 * @param {string} destino - Ruta del archivo de salida.
 * @param {string} texto   - Texto que deben contener las líneas.
 * @returns {Promise<number>} cantidad de líneas que coincidieron (0 si no hay).
 */
export async function filtrarLogs(origen, destino, texto) {
    throw new Error('Not implemented: filtrarLogs');
}

/**
 * Lee un archivo de texto y devuelve las líneas como arreglo,
 * sin líneas vacías.
 *
 * NO uses readFile: debes usar un Readable + recolección.
 *
 * @param {string} ruta
 * @returns {Promise<string[]>}
 */
export async function leerLineas(ruta) {
    throw new Error('Not implemented: leerLineas');
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