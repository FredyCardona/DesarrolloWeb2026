import { Sequelize } from 'sequelize';

export function crearSequelize(url) {
  if (!url) throw new Error('Falta DATABASE_URL');

  return new Sequelize(url, {
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
    },
  });
}
