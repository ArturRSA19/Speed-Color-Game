"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Gamepad2, Zap, Trophy, Timer, Users, ArrowRight, Play } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router])

  // Se ainda está carregando
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se usuário está logado, vai redirecionar
  if (user) {
    return null
  }

  // Landing page para usuários não logados
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Speed Color Challenge</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Criar Conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <Zap className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Speed Color Challenge
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Teste seus reflexos neste jogo de velocidade e precisão. Clique quando a cor certa aparecer e 
            veja quão rápido você consegue reagir!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                <Play className="h-4 w-4 mr-2" />
                Começar Agora
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Já tenho conta
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Timer className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <CardTitle>Teste de Velocidade</CardTitle>
              <CardDescription>
                Meça seu tempo de reação em milissegundos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <CardTitle>Sistema de Pontuação</CardTitle>
              <CardDescription>
                Ganhe pontos baseados na sua velocidade e precisão
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <CardTitle>Ranking Global</CardTitle>
              <CardDescription>
                Compete com outros jogadores pelo melhor score
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How to Play */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Como Jogar</CardTitle>
            <CardDescription>
              Simples de aprender, difícil de dominar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Veja a cor alvo</h3>
                    <p className="text-sm text-muted-foreground">
                      Uma cor específica será mostrada como objetivo
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Observe as cores</h3>
                    <p className="text-sm text-muted-foreground">
                      Cores aleatórias aparecerão na tela constantemente
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Clique na hora certa</h3>
                    <p className="text-sm text-muted-foreground">
                      Quando a cor alvo aparecer, clique o mais rápido possível
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Ganhe pontos</h3>
                    <p className="text-sm text-muted-foreground">
                      Quanto mais rápido você reagir, mais pontos ganha
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link href="/register">
                <Button size="lg">
                  Pronto para jogar?
                  <Gamepad2 className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2025 Speed Color Challenge. Teste seus reflexos!</p>
        </div>
      </footer>
    </div>
  )
}
