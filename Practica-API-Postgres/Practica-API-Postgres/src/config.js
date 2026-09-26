export const config = {
  puerto: Number(process.env.PORT ?? 3000),
  db: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};
