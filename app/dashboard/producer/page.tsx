"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getCreditsByProducer, getTransactionsByUser } from "@/lib/storage"
import type { CarbonCredit, Transaction } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Plus, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

function ProducerDashboardContent() {
  const { user } = useAuth()
  const [credits, setCredits] = useState<CarbonCredit[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (user) {
      setCredits(getCreditsByProducer(user.id))
      setTransactions(getTransactionsByUser(user.id))
    }
  }, [user])

  const totalCredits = credits.reduce((sum, credit) => {
    if (credit.status === "approved") return sum + credit.amount
    return sum
  }, 0)

  const soldCredits = credits.filter((c) => c.status === "sold").reduce((sum, c) => sum + c.amount, 0)
  const pendingCredits = credits.filter((c) => c.status === "pending").length
  const totalRevenue = transactions.filter((t) => t.sellerId === user?.id).reduce((sum, t) => sum + t.totalPrice, 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
            <Clock className="mr-1 h-3 w-3" />
            Pendente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Aprovado
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/20">
            <XCircle className="mr-1 h-3 w-3" />
            Rejeitado
          </Badge>
        )
      case "sold":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20">
            <TrendingUp className="mr-1 h-3 w-3" />
            Vendido
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel do Produtor</h1>
            <p className="mt-1 text-muted-foreground">Bem-vindo de volta, {user?.name}</p>
          </div>
          <Link href="/dashboard/producer/register-credit">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Registrar Crédito
            </Button>
          </Link>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Créditos Disponíveis</CardDescription>
              <CardTitle className="text-3xl">{totalCredits.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">toneladas de CO₂</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Créditos Vendidos</CardDescription>
              <CardTitle className="text-3xl">{soldCredits.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">toneladas de CO₂</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Aguardando Aprovação</CardDescription>
              <CardTitle className="text-3xl">{pendingCredits}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">créditos em auditoria</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Receita Total</CardDescription>
              <CardTitle className="text-3xl">R$ {totalRevenue.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">de {transactions.length} vendas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meus Créditos de Carbono</CardTitle>
            <CardDescription>Todos os créditos que você registrou na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            {credits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Leaf className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">Nenhum crédito ainda</h3>
                <p className="mb-4 text-sm text-muted-foreground">Comece registrando seu primeiro crédito de carbono</p>
                <Link href="/dashboard/producer/register-credit">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Crédito
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {credits.map((credit) => (
                  <div
                    key={credit.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{credit.amount} toneladas CO₂</h4>
                        {getStatusBadge(credit.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Origem: {credit.origin} • Gerado em:{" "}
                        {new Date(credit.generationDate).toLocaleDateString("pt-BR")}
                      </p>
                      {credit.status === "approved" && (
                        <p className="mt-1 text-sm font-medium text-primary">R$ {credit.price}/ton</p>
                      )}
                      {credit.auditNotes && (
                        <p className="mt-1 text-sm text-muted-foreground">Observação: {credit.auditNotes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {transactions.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Vendas Recentes</CardTitle>
              <CardDescription>Suas últimas transações de créditos de carbono</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <h4 className="font-semibold text-foreground">{transaction.amount} toneladas CO₂</h4>
                      <p className="text-sm text-muted-foreground">
                        Vendido para {transaction.buyerName} •{" "}
                        {new Date(transaction.transactionDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">R$ {transaction.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function ProducerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["producer"]}>
      <ProducerDashboardContent />
    </ProtectedRoute>
  )
}
