import crypto from 'node:crypto';
import { hashearPassword, verificarPassword } from './passwords.js';
import { firmarToken } from './jwt.js';

const usuarios = [];

export async function registrarUsuario(email, password) {
  if (!email || !password) throw new Error('Email y password son obligatorios');
  if (usuarios.some((u) => u.email === email)) throw new Error('Usuario ya existe');

  const usuario = {
    id: crypto.randomUUID(),
    email,
    password: await hashearPassword(password),
  };
  usuarios.push(usuario);
  return { id: usuario.id, email: usuario.email };
}

export async function iniciarSesion(email, password) {
  const usuario = usuarios.find((u) => u.email === email);
  if (!usuario) return null;

  const ok = await verificarPassword(password, usuario.password);
  if (!ok) return null;

  return firmarToken({ sub: usuario.id, email: usuario.email });
}

export function limpiarUsuarios() {
  usuarios.length = 0;
}
