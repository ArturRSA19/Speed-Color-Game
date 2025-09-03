'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { ArrowLeft, Trophy, Timer, Target, Zap } from 'lucide-react';

interface GameState {
  status: 'ready' | 'playing' | 'waiting' | 'finished';
  score: number;
  level: number;
  targetColor: string;
  currentColor: string;
  timeLeft: number;
  reactionTimes: number[];
  correctClicks: number;
  totalClicks: number;
  bestTime: number;
}

const COLORS = [
  { name: 'Vermelho', hex: '#ef4444', bg: 'bg-red-500' },
  { name: 'Azul', hex: '#3b82f6', bg: 'bg-blue-500' },
  { name: 'Verde', hex: '#22c55e', bg: 'bg-green-500' },
  { name: 'Amarelo', hex: '#eab308', bg: 'bg-yellow-500' },
  { name: 'Roxo', hex: '#a855f7', bg: 'bg-purple-500' },
  { name: 'Rosa', hex: '#ec4899', bg: 'bg-pink-500' },
];

const GAME_DURATION = 30; // segundos
const COLOR_CHANGE_INTERVAL = 1000; // ms

export default function GamePage() {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>({
    status: 'ready',
    score: 0,
    level: 1,
    targetColor: '',
    currentColor: '',
    timeLeft: GAME_DURATION,
    reactionTimes: [],
    correctClicks: 0,
    totalClicks: 0,
    bestTime: 0,
  });
  const [colorChangeTime, setColorChangeTime] = useState<number>(0);

  const getRandomColor = useCallback(() => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }, []);

  const startGame = useCallback(() => {
    const targetColor = getRandomColor();
    setGameState(prev => ({
      ...prev,
      status: 'playing',
      targetColor: targetColor.name,
      currentColor: getRandomColor().name,
      timeLeft: GAME_DURATION,
      score: 0,
      reactionTimes: [],
      correctClicks: 0,
      totalClicks: 0,
      bestTime: 0,
    }));
    setColorChangeTime(Date.now());
  }, [getRandomColor]);

  const handleColorClick = useCallback(() => {
    if (gameState.status !== 'playing') return;

    const reactionTime = Date.now() - colorChangeTime;
    const isCorrect = gameState.currentColor === gameState.targetColor;
    
    setGameState(prev => {
      const newReactionTimes = isCorrect ? [...prev.reactionTimes, reactionTime] : prev.reactionTimes;
      const newScore = isCorrect ? prev.score + Math.max(1000 - reactionTime, 100) : prev.score;
      const newCorrectClicks = isCorrect ? prev.correctClicks + 1 : prev.correctClicks;
      const newBestTime = isCorrect && reactionTime < (prev.bestTime || Infinity) ? reactionTime : prev.bestTime;

      return {
        ...prev,
        score: newScore,
        reactionTimes: newReactionTimes,
        correctClicks: newCorrectClicks,
        totalClicks: prev.totalClicks + 1,
        bestTime: newBestTime || prev.bestTime,
      };
    });
  }, [gameState.status, gameState.currentColor, gameState.targetColor, colorChangeTime]);

  const saveScore = useCallback(async () => {
    if (!user) return;

    const avgReactionTime = gameState.reactionTimes.length > 0
      ? gameState.reactionTimes.reduce((a, b) => a + b, 0) / gameState.reactionTimes.length
      : 0;

    const accuracy = gameState.totalClicks > 0
      ? (gameState.correctClicks / gameState.totalClicks) * 100
      : 0;

    try {
      const response = await fetch('http://localhost:9999/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          score: gameState.score,
          gameType: 'speed_color',
          reactionTime: avgReactionTime,
          level: gameState.level,
          accuracy: accuracy,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar pontuação');
      }

      console.log('Score salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar score:', error);
    }
  }, [user, gameState]);

  // Timer do jogo
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          // Jogo acabou
          return {
            ...prev,
            status: 'finished',
            timeLeft: 0,
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status]);

  // Mudança de cores
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        currentColor: getRandomColor().name,
      }));
      setColorChangeTime(Date.now());
    }, COLOR_CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, [gameState.status, getRandomColor]);

  // Salvar score quando o jogo termina
  useEffect(() => {
    if (gameState.status === 'finished' && gameState.score > 0) {
      saveScore();
    }
  }, [gameState.status, gameState.score, saveScore]);

  const currentColorObj = COLORS.find(c => c.name === gameState.currentColor);
  const targetColorObj = COLORS.find(c => c.name === gameState.targetColor);

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Speed Color Challenge</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Game Status */}
        {gameState.status === 'ready' && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="h-6 w-6" />
                Pronto para jogar?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-lg">Como jogar:</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>1. Uma cor alvo será mostrada</p>
                  <p>2. Clique na tela quando a cor atual for igual à cor alvo</p>
                  <p>3. Quanto mais rápido, mais pontos você ganha!</p>
                  <p>4. Você tem {GAME_DURATION} segundos</p>
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="w-40">
                Começar Jogo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Playing */}
        {gameState.status === 'playing' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <Timer className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{gameState.timeLeft}s</p>
                  <p className="text-xs text-muted-foreground">Tempo</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">{gameState.score}</p>
                  <p className="text-xs text-muted-foreground">Pontos</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <Target className="h-5 w-5 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{gameState.correctClicks}</p>
                  <p className="text-xs text-muted-foreground">Acertos</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <Zap className="h-5 w-5 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">
                    {gameState.bestTime > 0 ? `${gameState.bestTime}ms` : '--'}
                  </p>
                  <p className="text-xs text-muted-foreground">Melhor tempo</p>
                </CardContent>
              </Card>
            </div>

            {/* Target Color */}
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-lg mb-4">Clique quando a cor for:</p>
                <div className="flex items-center justify-center gap-4">
                  <div 
                    className={`w-16 h-16 rounded-full ${targetColorObj?.bg || 'bg-gray-300'}`}
                  />
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {gameState.targetColor}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Game Area */}
            <Card 
              className="cursor-pointer transition-all hover:scale-105 active:scale-95"
              onClick={handleColorClick}
            >
              <CardContent className="p-0">
                <div 
                  className={`h-64 rounded-lg flex items-center justify-center ${currentColorObj?.bg || 'bg-gray-300'}`}
                >
                  <div className="text-center text-white">
                    <p className="text-4xl font-bold mb-2">{gameState.currentColor}</p>
                    <p className="text-lg opacity-90">Clique se for a cor alvo!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Finished */}
        {gameState.status === 'finished' && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Jogo Finalizado!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-3xl font-bold text-yellow-500">{gameState.score}</p>
                  <p className="text-sm text-muted-foreground">Pontuação Final</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-500">{gameState.correctClicks}</p>
                  <p className="text-sm text-muted-foreground">Acertos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-500">
                    {gameState.totalClicks > 0 ? Math.round((gameState.correctClicks / gameState.totalClicks) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Precisão</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-500">
                    {gameState.bestTime > 0 ? `${gameState.bestTime}ms` : '--'}
                  </p>
                  <p className="text-sm text-muted-foreground">Melhor Tempo</p>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={startGame} size="lg">
                  Jogar Novamente
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    Ver Ranking
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
