export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export function manejadorErrores(err, req, res, next) {
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ errores: err.errors.map((e) => e.message) });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Ese email ya existe' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Error interno' });
}
