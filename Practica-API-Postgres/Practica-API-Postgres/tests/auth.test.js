import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { hashearPassword, verificarPassword } from '../src/auth/passwords.js';
import { firmarToken, verificarToken } from '../src/auth/jwt.js';

before(() => {
  process.env.JWT_SECRET = 'secreto-de-prueba';
});

describe('passwords', () => {
  it('hashea y verifica la contraseña', async () => {
    const hash = await hashearPassword('demo1234');
    assert.ok(!hash.includes('demo1234'));
    assert.equal(await verificarPassword('demo1234', hash), true);
    assert.equal(await verificarPassword('otra', hash), false);
  });
});

describe('jwt', () => {
  it('firma y verifica el payload', () => {
    const payload = verificarToken(firmarToken({ sub: 'u-1' }, '1h'));
    assert.equal(payload.sub, 'u-1');
    assert.ok(payload.exp);
  });

  it('rechaza un token inválido', () => {
    assert.throws(() => verificarToken('no-es-token'));
  });
});
