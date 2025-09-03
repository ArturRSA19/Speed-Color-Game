"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { formatScore } from "@game-app/shared"
import { 
  Calendar, 
  Trophy, 
  Target, 
  LogOut, 
  Gamepad2,
  Mail,
  Crown
} from "lucide-react"

interface UserRecord {
  id: string
  score: number
  createdAt: string
}

interface RecordsData {
  best: UserRecord | null
  records: UserRecord[]
}

export default function DashboardPage() {
  const { user, logout, token } = useAuth()
  const router = useRouter()
  const [records, setRecords] = useState<RecordsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9999"

  useEffect(() => {
    if (!token || !user) {
      router.push("/login")
      return
    }

    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API_URL}/records/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setRecords(data)
        }
      } catch (error) {
        console.error("Erro ao buscar records:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecords()
  }, [token, user, router, API_URL])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getUserInitials = (name: string | null, email: string) => {
    if (name && name.trim()) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric"
    })
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Game App</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/game">
              <Button className="mr-2">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Jogar
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card do Usuário */}
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {getUserInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-2xl">
                    {user.name || "Usuário"}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </CardDescription>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Card de Melhor Score */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Melhor Score</CardTitle>
              <Crown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {records?.best ? formatScore(records.best.score) : "0 pts"}
              </div>
              <p className="text-xs text-muted-foreground">
                {records?.best 
                  ? `Obtido em ${formatDate(records.best.createdAt)}`
                  : "Nenhum score registrado"
                }
              </p>
            </CardContent>
          </Card>

          {/* Card de Total de Jogos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Jogos</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {records?.records.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Partidas jogadas
              </p>
            </CardContent>
          </Card>

          {/* Histórico de Scores */}
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Histórico de Scores</span>
              </CardTitle>
              <CardDescription>
                Seus últimos resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : records?.records.length ? (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {records.records.slice(0, 10).map((record, index) => (
                    <div key={record.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">
                              {formatScore(record.score)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(record.createdAt)}
                            </p>
                          </div>
                        </div>
                        {index === 0 && records.best?.id === record.id && (
                          <Badge variant="secondary" className="text-yellow-600">
                            <Crown className="h-3 w-3 mr-1" />
                            Melhor
                          </Badge>
                        )}
                      </div>
                      {index < records.records.length - 1 && index < 9 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum score registrado ainda</p>
                  <p className="text-sm">Comece jogando para ver seus resultados aqui!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
