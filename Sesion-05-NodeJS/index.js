/**
 * Punto de entrada — Tarea Sesión 5
 * Servidor HTTP con Node.js
 *
 * Día 1:
 * - Revisión de la estructura del proyecto.
 * - Configuración mediante variables de entorno.
 * - Punto de entrada preparado para iniciar el servidor.
 *
 * Uso:
 *   npm start
 *   npm run dev
 */

import {
    iniciarServidor,
    obtenerConfig,
    infoSistema,
} from './src/app.js';

// Obtiene la configuración desde:
// PORT, NOMBRE_APP y ARCHIVO_DATOS.
const config = obtenerConfig(process.env);

// Muestra información inicial de la aplicación.
console.log(
    `🚀 Iniciando ${config.nombreApp} en el puerto ${config.puerto}`,
);

console.log(
    '🖥️  Sistema:',
    infoSistema(),
);

// Inicia el servidor HTTP.
iniciarServidor(config);

console.log(
    '⏹️  Presiona Ctrl+C para detener.',
);