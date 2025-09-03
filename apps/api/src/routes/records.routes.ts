import { Router } from "express";
import { prisma } from "../prisma";
import { authGuard } from "../auth/guard";
import { recordCreateSchema } from "@game-app/shared";
import { DEFAULT_LEADERBOARD_LIMIT } from "@game-app/shared";

export const recordsRouter = Router();

// Todas as rotas abaixo exigem JWT
recordsRouter.use(authGuard);

// Retorna seu melhor score e histórico
recordsRouter.get("/me", async (req: any, res) => {
  const userId = req.user.sub as string;
  const records = await prisma.record.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const best = records.length > 0 
    ? records.reduce((prev, current) => (prev.score > current.score) ? prev : current)
    : null;
  
  res.json({ 
    best, 
    records,
    total: records.length,
    averageScore: records.length > 0 ? Math.round(records.reduce((acc, r) => acc + r.score, 0) / records.length) : 0
  });
});

// Cria um novo record com campos adicionais de jogo
recordsRouter.post("/", async (req: any, res) => {
  const parse = recordCreateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const userId = req.user.sub as string;
  const created = await prisma.record.create({
    data: { 
      userId, 
      score: parse.data.score,
      gameType: parse.data.gameType || "speed_color",
      reactionTime: parse.data.reactionTime,
      level: parse.data.level || 1,
      accuracy: parse.data.accuracy,
    }
  });

  const best = await prisma.record.findFirst({
    where: { userId },
    orderBy: { score: "desc" }
  });

  res.status(201).json({ created, highScore: best?.score ?? created.score });
});

// Leaderboard global com mais informações
recordsRouter.get("/leaderboard", async (req, res) => {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || DEFAULT_LEADERBOARD_LIMIT));
  
  // Buscar usuários com seus melhores scores
  const users = await prisma.user.findMany({
    include: {
      records: {
        orderBy: { score: "desc" },
        take: 1,
      },
      _count: {
        select: { records: true }
      }
    },
    take: limit * 2, // Buscar mais para filtrar depois
  });

  // Filtrar usuários que têm pelo menos um jogo e formatar o leaderboard
  const leaderboard = users
    .filter(user => user.records.length > 0)
    .map(user => {
      const bestRecord = user.records[0];
      return {
        user: {
          name: user.name,
          email: user.email,
        },
        bestScore: bestRecord.score,
        gamesPlayed: user._count.records,
        gameType: bestRecord.gameType,
        reactionTime: bestRecord.reactionTime,
        accuracy: bestRecord.accuracy,
        achievedAt: bestRecord.createdAt,
      };
    })
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, limit);

  res.json(leaderboard);
});

// Estatísticas globais do jogo
recordsRouter.get("/stats", async (req, res) => {
  try {
    const totalGames = await prisma.record.count();
    const totalPlayers = await prisma.user.count({
      where: {
        records: {
          some: {}
        }
      }
    });

    const highestScore = await prisma.record.findFirst({
      orderBy: { score: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    // Estatísticas de tempo de reação
    const reactionTimes = await prisma.record.findMany({
      where: {
        reactionTime: {
          not: null
        }
      },
      select: {
        reactionTime: true
      }
    });

    const avgReactionTime = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((acc, r) => acc + (r.reactionTime || 0), 0) / reactionTimes.length)
      : 0;

    res.json({
      totalGames,
      totalPlayers,
      averageReactionTime: avgReactionTime,
      highestScore: highestScore ? {
        score: highestScore.score,
        user: highestScore.user,
        gameType: highestScore.gameType,
        reactionTime: highestScore.reactionTime,
        accuracy: highestScore.accuracy,
        createdAt: highestScore.createdAt,
      } : null,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});
