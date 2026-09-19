/**
 * app.js — Servidor Express (API REST + sitio estático)
 * Tarea Sesión 7 · Desarrollo Web · UMG
 *
 * Implementa los middlewares y las rutas del CRUD de alumnos.
 * Los tests de tests/api.test.js definen el contrato de la API.
 */

import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// __dirname en ES Modules
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// ============================================================
// MIDDLEWARES
// ============================================================

/**
 * "Autenticación falsa": exige el header x-api-key.
 *
 * @type {import('express').RequestHandler}
 */
export function autenticacionFalsa(req, res, next) {
    const claveRecibida = req.get('x-api-key');

    const claveEsperada =
        process.env.API_KEY || 'umg-2026';

    if (claveRecibida !== claveEsperada) {
        return res.status(401).json({
            error: 'No autorizado',
        });
    }

    next();
}

/**
 * Validación básica del cuerpo de un alumno.
 *
 * nombre, apellido y email son obligatorios.
 * email debe contener @.
 * edad es opcional, pero si viene debe ser un número >= 0.
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

    if (
        typeof nombre !== 'string' ||
        nombre.trim() === ''
    ) {
        return res.status(400).json({
            error: 'El nombre es obligatorio',
        });
    }

    if (
        typeof apellido !== 'string' ||
        apellido.trim() === ''
    ) {
        return res.status(400).json({
            error: 'El apellido es obligatorio',
        });
    }

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

    if (
        edad !== undefined &&
        (
            typeof edad !== 'number' ||
            !Number.isFinite(edad) ||
            edad < 0
        )
    ) {
        return res.status(400).json({
            error: 'La edad debe ser un número mayor o igual a 0',
        });
    }

    next();
}

// ============================================================
// APP
// ============================================================

/**
 * Crea la app de Express con sus rutas.
 * Recibe el repositorio por parámetro.
 *
 * @param {import('./repositorio.js').RepositorioAlumnos} repositorio
 * @returns {import('express').Express}
 */
export function crearApp(repositorio) {
    const app = express();

    // Permite recibir JSON en el body.
    app.use(express.json());

    // Sitio web estático.
    app.use(
        express.static(
            join(__dirname, '..', 'public'),
        ),
    );

    // ========================================================
    // GET /alumnos
    // Devuelve todos los alumnos
    // ========================================================
    app.get('/alumnos', (req, res) => {
        const alumnos =
            repositorio.listar();

        res.status(200).json(alumnos);
    });

    // ========================================================
    // GET /alumnos/:id
    // Devuelve un alumno o 404
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

        res.status(200).json(alumno);
    });

    // ========================================================
    // POST /alumnos
    // Requiere autenticación y validación
    // ========================================================
    app.post(
        '/alumnos',
        autenticacionFalsa,
        validarAlumno,
        (req, res) => {
            const alumno =
                repositorio.crear(
                    req.body,
                );

            res.status(201).json(alumno);
        },
    );

    // ========================================================
    // PUT /alumnos/:id
    // Requiere autenticación y validación
    // ========================================================
    app.put(
        '/alumnos/:id',
        autenticacionFalsa,
        validarAlumno,
        (req, res) => {
            const alumno =
                repositorio.actualizar(
                    req.params.id,
                    req.body,
                );

            if (!alumno) {
                return res.status(404).json({
                    error: 'Alumno no encontrado',
                });
            }

            res.status(200).json(alumno);
        },
    );

    // ========================================================
    // DELETE /alumnos/:id
    // Requiere autenticación
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
                    error: 'Alumno no encontrado',
                });
            }

            res.status(204).end();
        },
    );

    return app;
}