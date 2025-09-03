import { Router } from "express";
import { prisma } from "../prisma";
import { hashPassword, comparePassword } from "../auth/hash";
import { signToken } from "../auth/jwt";
import { registerSchema, loginSchema } from "@game-app/shared";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { email, password, name } = parse.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, password: hashed, name: name ?? null } });

  const token = signToken({ sub: user.id, email: user.email });
  return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt } });
});

authRouter.post("/login", async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { email, password } = parse.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await comparePassword(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ sub: user.id, email: user.email });
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt } });
});

authRouter.get("/me", async (req, res) => {
  // opcional: mover para rota protegida com guard e ler req.user
  return res.status(501).json({ error: "Not implemented here. Use /records/me on protected routes." });
});
