import bcrypt from 'bcrypt';

export function hashearPassword(password) {
  return bcrypt.hash(password, 10);
}

export function verificarPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
