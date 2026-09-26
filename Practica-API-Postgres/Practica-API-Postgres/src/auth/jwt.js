import jwt from 'jsonwebtoken';

function secreto() {
  const valor = process.env.JWT_SECRET;
  if (!valor) throw new Error('Falta JWT_SECRET');
  return valor;
}

export function firmarToken(payload, expira = '1h') {
  return jwt.sign(payload, secreto(), { expiresIn: expira });
}

export function verificarToken(token) {
  return jwt.verify(token, secreto());
}
