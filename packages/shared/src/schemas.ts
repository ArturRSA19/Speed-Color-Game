import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(80).optional().nullable()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const recordCreateSchema = z.object({
  score: z.number().int().min(0),
  gameType: z.string().default("speed_color"),
  reactionTime: z.number().optional(),
  level: z.number().int().min(1).default(1),
  accuracy: z.number().min(0).max(100).optional(),
});
