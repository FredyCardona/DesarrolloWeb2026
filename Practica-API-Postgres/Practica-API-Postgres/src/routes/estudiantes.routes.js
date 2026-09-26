import { Router } from 'express';
import { join } from 'node:path';
import { authJWT } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/errores.js';
import { validarEstudiante, revisarErrores } from '../validators/estudianteValidator.js';
import { registrarLog } from '../log.js';

export function estudiantesRoutes(repo) {
  const router = Router();

  router.get('/', asyncHandler(async (req, res) => {
    res.json(await repo.listar());
  }));

  router.get('/:id', asyncHandler(async (req, res) => {
    const estudiante = await repo.obtener(req.params.id);
    if (!estudiante) return res.status(404).json({ error: 'No encontrado' });
    res.json(estudiante);
  }));

  router.post('/', authJWT, validarEstudiante, revisarErrores,
    asyncHandler(async (req, res) => {
      const estudiante = await repo.crear(req.body);

      registrarLog(join(process.cwd(), 'data', 'acciones.log'), `Creado ${estudiante.email}`)
        .catch((error) => console.error('No se pudo guardar el log:', error.message));

      res.status(201).json(estudiante);
    }));

  router.put('/:id', authJWT, validarEstudiante, revisarErrores,
    asyncHandler(async (req, res) => {
      const actualizado = await repo.actualizar(req.params.id, req.body);
      if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
      res.json(actualizado);
    }));

  router.delete('/:id', authJWT, asyncHandler(async (req, res) => {
    const eliminado = await repo.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).end();
  }));

  return router;
}
