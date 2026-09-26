import 'dotenv/config';
import { config } from './config.js';
import { crearSequelize } from './db/sequelize.js';
import { crearModeloEstudiante } from './models/Estudiante.js';
import { SequelizeEstudiantesRepository } from './repositories/SequelizeEstudiantesRepository.js';
import { crearApp } from './app.js';

const sequelize = crearSequelize(config.db);
const Estudiante = crearModeloEstudiante(sequelize);
const repo = new SequelizeEstudiantesRepository(Estudiante);

await sequelize.authenticate();
await sequelize.sync();

const app = crearApp({ repo });
app.listen(config.puerto, () => {
  console.log(`Servidor en http://localhost:${config.puerto}`);
});
