import "dotenv/config";

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  JWT_SECRET: process.env.JWT_SECRET ?? "dev-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  DATABASE_URL: process.env.DATABASE_URL ?? "file:./dev.db",
  WEB_ORIGIN: process.env.WEB_ORIGIN ?? "http://localhost:3000"
};
