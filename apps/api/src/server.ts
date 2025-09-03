import express from "express";
import cors from "cors";
import { env } from "./env";
import { errorHandler } from "./middlewares/error";
import { authRouter } from "./routes/auth.routes";
import { recordsRouter } from "./routes/records.routes";

export function buildServer() {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: env.WEB_ORIGIN, credentials: false }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/auth", authRouter);
  app.use("/records", recordsRouter);

  app.use(errorHandler);
  return app;
}
