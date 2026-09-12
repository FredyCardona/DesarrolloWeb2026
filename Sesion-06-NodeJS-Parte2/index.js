/**
 * Punto de entrada — Tarea Sesión 6
 * Uso: npm start
 *       npm run dev
 */

import {
    filtrarLogs,
    rutaAbsoluta,
    parsearEnv,
    registrarProceso,
    __dirname,
} from './src/index.js';

import { readFile } from 'node:fs/promises';

/**
 * Carga la configuración desde config.env.
 * Si no existe, utiliza valores por defecto.
 */
async function cargarConfig() {
    try {
        const texto = await readFile(
            rutaAbsoluta('../config.env'),
            'utf8',
        );

        return parsearEnv(texto);
    } catch {
        return {
            ARCHIVO_ORIGEN: 'data/app.log',
            ARCHIVO_DESTINO: 'data/filtrado.log',
            TEXTO: 'ERROR',
        };
    }
}

const config = await cargarConfig();

const origen = rutaAbsoluta(
    `../${config.ARCHIVO_ORIGEN || 'data/app.log'}`,
);

const destino = rutaAbsoluta(
    `../${config.ARCHIVO_DESTINO || 'data/filtrado.log'}`,
);

const texto = config.TEXTO || 'ERROR';

console.log(
    registrarProceso(
        `Ruta del proyecto: ${__dirname}`,
    ),
);

console.log(
    registrarProceso(
        `Filtrando '${texto}' de ${origen} → ${destino}`,
    ),
);

const encontradas = await filtrarLogs(
    origen,
    destino,
    texto,
);

console.log(
    registrarProceso(
        `Líneas coincidentes: ${encontradas}`,
    ),
);

console.log(
    registrarProceso(
        'Proceso terminado ✔',
    ),
);