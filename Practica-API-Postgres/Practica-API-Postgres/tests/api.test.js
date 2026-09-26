import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';
import { MockEstudiantesRepository } from '../src/repositories/MockEstudiantesRepository.js';
import { limpiarUsuarios } from '../src/auth/usuarios.js';

process.env.JWT_SECRET = 'secreto-de-prueba';
const repo = new MockEstudiantesRepository();
const app = crearApp({ repo });
const servidor = app.listen(0, '127.0.0.1');
const base = `http://127.0.0.1:${servidor.address().port}`;

const json = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

let token;

before(async () => {
  limpiarUsuarios();
  await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: json(),
    body: JSON.stringify({ email: 'demo@umg.edu.gt', password: 'demo1234' }),
  });

  const login = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: json(),
    body: JSON.stringify({ email: 'demo@umg.edu.gt', password: 'demo1234' }),
  });

  token = (await login.json()).token;
});

after(() => servidor.close());

describe('API /estudiantes', () => {
  it('POST sin token devuelve 401', async () => {
    const res = await fetch(`${base}/estudiantes`, {
      method: 'POST',
      headers: json(),
      body: JSON.stringify({ nombre: 'Ana', email: 'ana@umg.edu.gt', carrera: 'Sistemas' }),
    });
    assert.equal(res.status, 401);
  });

  it('POST con token crea y responde 201', async () => {
    const res = await fetch(`${base}/estudiantes`, {
      method: 'POST',
      headers: json(token),
      body: JSON.stringify({ nombre: 'Ana', email: 'ana@umg.edu.gt', carrera: 'Sistemas' }),
    });
    assert.equal(res.status, 201);
  });

  it('valida datos y responde 400', async () => {
    const res = await fetch(`${base}/estudiantes`, {
      method: 'POST',
      headers: json(token),
      body: JSON.stringify({ nombre: '', email: 'mal', carrera: '' }),
    });
    assert.equal(res.status, 400);
  });

  it('GET lista estudiantes', async () => {
    const res = await fetch(`${base}/estudiantes`);
    assert.equal(res.status, 200);
    const datos = await res.json();
    assert.ok(Array.isArray(datos));
  });
});
