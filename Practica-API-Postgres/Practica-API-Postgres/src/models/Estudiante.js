import { DataTypes } from 'sequelize';

export function crearModeloEstudiante(sequelize) {
  return sequelize.define('estudiante', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    carrera: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'estudiantes',
  });
}
