import express from 'express';
import { estudiantesRoutes } from './routes/estudiantes.routes.js';
import { asyncHandler, manejadorErrores } from './middlewares/errores.js';
import { iniciarSesion, registrarUsuario } from './auth/usuarios.js';

export function crearApp({ repo }) {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ ok: true });
  });

  app.post('/auth/register', asyncHandler(async (req, res) => {
    const usuario = await registrarUsuario(req.body.email, req.body.password);
    res.status(201).json(usuario);
  }));

  app.post('/auth/login', asyncHandler(async (req, res) => {
    const token = await iniciarSesion(req.body.email, req.body.password);
    if (!token) return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json({ token });
  }));

  app.use('/estudiantes', estudiantesRoutes(repo));
  app.use(manejadorErrores);

  return app;
}
