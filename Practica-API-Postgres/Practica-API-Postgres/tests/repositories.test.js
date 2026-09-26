import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MockEstudiantesRepository } from '../src/repositories/MockEstudiantesRepository.js';
import { SequelizeEstudiantesRepository } from '../src/repositories/SequelizeEstudiantesRepository.js';

const dato = { nombre: 'Ana', email: 'ana@umg.edu.gt', carrera: 'Sistemas' };

describe('MockEstudiantesRepository', () => {
  it('crea y lista estudiantes', async () => {
    const repo = new MockEstudiantesRepository();
    const creado = await repo.crear(dato);
    assert.ok(creado.id);
    assert.equal((await repo.listar()).length, 1);
  });

  it('rechaza email duplicado', async () => {
    const repo = new MockEstudiantesRepository();
    await repo.crear(dato);
    await assert.rejects(() => repo.crear(dato), /email/i);
  });
});

class ModeloFalso {
  constructor(filas = []) { this.filas = filas; }
  async findAll() { return this.filas; }
  async findByPk(id) { return this.filas.find((f) => f.id === id) ?? null; }
  async create(datos) { const f = { id: 'e-1', ...datos }; this.filas.push(f); return f; }
  async update(cambios, { where }) {
    const i = this.filas.findIndex((f) => f.id === where.id);
    if (i === -1) return [0];
    this.filas[i] = { ...this.filas[i], ...cambios };
    return [1];
  }
  async destroy({ where }) {
    const antes = this.filas.length;
    this.filas = this.filas.filter((f) => f.id !== where.id);
    return antes === this.filas.length ? 0 : 1;
  }
}

describe('SequelizeEstudiantesRepository', () => {
  it('listar usa el modelo', async () => {
    const repo = new SequelizeEstudiantesRepository(new ModeloFalso([{ id: 'e-1', ...dato }]));
    assert.equal((await repo.listar()).length, 1);
  });

  it('actualizar devuelve null si no existe', async () => {
    const repo = new SequelizeEstudiantesRepository(new ModeloFalso());
    assert.equal(await repo.actualizar('x', { carrera: 'Derecho' }), null);
  });
});
