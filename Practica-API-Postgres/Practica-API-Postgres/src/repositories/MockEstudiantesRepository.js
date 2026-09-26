import crypto from 'node:crypto';
import { IEstudiantesRepository } from './IEstudiantesRepository.js';

export class MockEstudiantesRepository extends IEstudiantesRepository {
  constructor(datos = []) {
    super();
    this.datos = datos.map((x) => ({ ...x }));
  }

  async listar() {
    return [...this.datos].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  async obtener(id) {
    return this.datos.find((x) => x.id === id) ?? null;
  }

  async crear(datos) {
    if (this.datos.some((x) => x.email === datos.email)) {
      const error = new Error('Ese email ya existe');
      error.name = 'SequelizeUniqueConstraintError';
      throw error;
    }

    const nuevo = { id: crypto.randomUUID(), ...datos };
    this.datos.push(nuevo);
    return nuevo;
  }

  async actualizar(id, cambios) {
    const i = this.datos.findIndex((x) => x.id === id);
    if (i === -1) return null;
    this.datos[i] = { ...this.datos[i], ...cambios };
    return this.datos[i];
  }

  async eliminar(id) {
    const i = this.datos.findIndex((x) => x.id === id);
    if (i === -1) return 0;
    this.datos.splice(i, 1);
    return 1;
  }
}
