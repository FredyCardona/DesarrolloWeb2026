/**
 * app.js — Servidor Express (API REST + sitio estático)
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * Responsabilidad:
 * - Servir el sitio estático.
 * - Exponer el CRUD REST de alumnos.
 * - Validar los datos recibidos.
 * - Proteger las operaciones de escritura con x-api-key.
 */

import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ============================================================
// __dirname en ES Modules
// ============================================================

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// ============================================================
// MIDDLEWARES
// ============================================================

/**
 * Autenticación falsa mediante el header x-api-key.
 *
 * POST, PUT y DELETE deben utilizar este middleware.
 *
 * @type {import('express').RequestHandler}
 */
export function autenticacionFalsa(req, res, next) {
    const clave = req.get('x-api-key');

    const claveCorrecta =
        process.env.API_KEY ?? 'umg-2026';

    if (clave !== claveCorrecta) {
        return res.status(401).json({
            error: 'No autorizado',
        });
    }

    next();
}

/**
 * Valida los datos enviados para un alumno.
 *
 * Reglas:
 * - nombre obligatorio
 * - apellido obligatorio
 * - email obligatorio
 * - email debe contener @
 * - edad es opcional
 * - si edad viene, debe ser número >= 0
 *
 * @type {import('express').RequestHandler}
 */
export function validarAlumno(req, res, next) {
    const {
        nombre,
        apellido,
        email,
        edad,
    } = req.body;

    // Validar nombre
    if (
        typeof nombre !== 'string' ||
        nombre.trim() === ''
    ) {
        return res.status(400).json({
            error: 'El nombre es obligatorio',
        });
    }

    // Validar apellido
    if (
        typeof apellido !== 'string' ||
        apellido.trim() === ''
    ) {
        return res.status(400).json({
            error: 'El apellido es obligatorio',
        });
    }

    // Validar email
    if (
        typeof email !== 'string' ||
        email.trim() === ''
    ) {
        return res.status(400).json({
            error: 'El email es obligatorio',
        });
    }

    if (!email.includes('@')) {
        return res.status(400).json({
            error: 'El email no es válido',
        });
    }

    // Validar edad solamente si fue enviada
    if (edad !== undefined) {
        if (
            typeof edad !== 'number' ||
            !Number.isFinite(edad) ||
            edad < 0
        ) {
            return res.status(400).json({
                error:
                    'La edad debe ser un número mayor o igual a 0',
            });
        }
    }

    next();
}

// ============================================================
// APP EXPRESS
// ============================================================

/**
 * Crea la aplicación Express.
 *
 * El repositorio se recibe como parámetro para mantener
 * separada la capa HTTP de la capa de datos.
 *
 * @param {import('./repositorio.js').RepositorioAlumnos} repositorio
 * @returns {import('express').Express}
 */
export function crearApp(repositorio) {
    const app = express();

    // ========================================================
    // Middlewares base
    // ========================================================

    app.use(express.json());

    // Servir:
    // public/index.html
    // public/styles.css
    // public/app.js
    app.use(
        express.static(
            join(__dirname, '..', 'public'),
        ),
    );

    // ========================================================
    // GET /alumnos
    // Lista completa
    // ========================================================

    app.get('/alumnos', (req, res) => {
        const alumnos =
            repositorio.listar();

        return res.status(200).json(
            alumnos,
        );
    });

    // ========================================================
    // GET /alumnos/:id
    // Devuelve uno o 404
    // ========================================================

    app.get('/alumnos/:id', (req, res) => {
        const alumno =
            repositorio.obtener(
                req.params.id,
            );

        if (!alumno) {
            return res.status(404).json({
                error: 'Alumno no encontrado',
            });
        }

        return res.status(200).json(
            alumno,
        );
    });

    // ========================================================
    // POST /alumnos
    // Auth + validación + creación
    // ========================================================

    app.post(
        '/alumnos',
        autenticacionFalsa,
        validarAlumno,
        (req, res) => {
            const alumno =
                repositorio.crear({
                    nombre:
                        req.body.nombre.trim(),

                    apellido:
                        req.body.apellido.trim(),

                    email:
                        req.body.email.trim(),

                    ...(req.body.edad !== undefined
                        ? { edad: req.body.edad }
                        : {}),
                });

            return res
                .status(201)
                .json(alumno);
        },
    );

    // ========================================================
    // PUT /alumnos/:id
    // Auth + validación + actualización
    // ========================================================

    app.put(
        '/alumnos/:id',
        autenticacionFalsa,
        validarAlumno,
        (req, res) => {
            const alumno =
                repositorio.actualizar(
                    req.params.id,
                    {
                        nombre:
                            req.body.nombre.trim(),

                        apellido:
                            req.body.apellido.trim(),

                        email:
                            req.body.email.trim(),

                        ...(req.body.edad !== undefined
                            ? { edad: req.body.edad }
                            : {}),
                    },
                );

            if (!alumno) {
                return res.status(404).json({
                    error:
                        'Alumno no encontrado',
                });
            }

            return res
                .status(200)
                .json(alumno);
        },
    );

    // ========================================================
    // DELETE /alumnos/:id
    // Auth + eliminación
    // ========================================================

    app.delete(
        '/alumnos/:id',
        autenticacionFalsa,
        (req, res) => {
            const eliminado =
                repositorio.eliminar(
                    req.params.id,
                );

            if (!eliminado) {
                return res.status(404).json({
                    error:
                        'Alumno no encontrado',
                });
            }

            return res
                .status(204)
                .end();
        },
    );

    return app;
}