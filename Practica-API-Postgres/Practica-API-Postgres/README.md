# Práctica API Postgres

Práctica sencilla con Express, Sequelize y PostgreSQL. Mantiene el Repository Pattern, valida entradas y protege las rutas de escritura con JWT.

## 1. Instalar

```bash
npm install
```

## 2. Levantar PostgreSQL

Si tienes Docker:

```bash
docker compose up -d
```

## 3. Crear el archivo .env

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

El archivo queda así:

```env
PORT=3000
DATABASE_URL=postgres://postgres:secreto@localhost:5432/web
JWT_SECRET=cambia-esta-clave
```

No subas `.env` a Git.

## 4. Probar

```bash
npm test
```

Los tests usan mocks y no necesitan PostgreSQL.

## 5. Ejecutar

```bash
npm run dev
```

Prueba primero:

- `GET http://localhost:3000/api/health`
- `GET http://localhost:3000/estudiantes`

## Crear usuario y obtener token

```bash
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"email\":\"demo@umg.edu.gt\",\"password\":\"demo1234\"}"
```

```bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"demo@umg.edu.gt\",\"password\":\"demo1234\"}"
```

Copia el token y úsalo así:

```bash
curl -X POST http://localhost:3000/estudiantes -H "Content-Type: application/json" -H "Authorization: Bearer TU_TOKEN" -d "{\"nombre\":\"Ana\",\"email\":\"ana@umg.edu.gt\",\"carrera\":\"Sistemas\"}"
```

## Capturas para entregar

Toma capturas de:

1. `npm test` pasando.
2. `GET /estudiantes` funcionando.
3. Registro/login mostrando que recibes el token.
4. `POST /estudiantes` respondiendo 201.
5. Si puedes, la tabla `estudiantes` vista en PostgreSQL o pgAdmin.

Para esta práctica se usa `sequelize.sync()` por simplicidad. En un proyecto de producción conviene usar migraciones.
