"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getApprovedCredits, getTransactionsByUser } from "@/lib/storage"
import type { CarbonCredit, Transaction } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Leaf } from "lucide-react"
import Link from "next/link"

function CompanyDashboardContent() {
  const { user } = useAuth()
  const [availableCredits, setAvailableCredits] = useState<CarbonCredit[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    setAvailableCredits(getApprovedCredits())
    if (user) {
      setTransactions(getTransactionsByUser(user.id))
    }
  }, [user])

  const totalPurchased = transactions.filter((t) => t.buyerId === user?.id).reduce((sum, t) => sum + t.amount, 0)
  const totalSpent = transactions.filter((t) => t.buyerId === user?.id).reduce((sum, t) => sum + t.totalPrice, 0)
  const carbonOffset = totalPurchased

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Painel da Empresa</h1>
          <p className="mt-1 text-muted-foreground">Bem-vindo de volta, {user?.name}</p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Compensação de Carbono</CardDescription>
              <CardTitle className="text-3xl">{carbonOffset.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">toneladas de CO₂ compensadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Compras</CardDescription>
              <CardTitle className="text-3xl">{transactions.filter((t) => t.buyerId === user?.id).length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">transações de créditos de carbono</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Investimento Total</CardDescription>
              <CardTitle className="text-3xl">R$ {totalSpent.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">em créditos de carbono</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Créditos de Carbono Disponíveis</CardTitle>
            <CardDescription>Navegue e compre créditos de carbono verificados de produtores rurais</CardDescription>
          </CardHeader>
          <CardContent>
            {availableCredits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Leaf className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">Nenhum crédito disponível</h3>
                <p className="text-sm text-muted-foreground">
                  Volte mais tarde para novos créditos de carbono dos produtores
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableCredits.map((credit) => (
                  <div
                    key={credit.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{credit.amount} toneladas CO₂</h4>
                        <span className="text-sm text-muted-foreground">por {credit.producerName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Origem: {credit.origin} • Gerado em:{" "}
                        {new Date(credit.generationDate).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-primary">R$ {credit.price.toLocaleString()}/ton</p>
                    </div>
                    <Link href={`/dashboard/company/purchase/${credit.id}`}>
                      <Button>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Comprar
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {transactions.filter((t) => t.buyerId === user?.id).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Compras</CardTitle>
              <CardDescription>Suas compras de créditos de carbono</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions
                  .filter((t) => t.buyerId === user?.id)
                  .slice(0, 5)
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div>
                        <h4 className="font-semibold text-foreground">{transaction.amount} toneladas CO₂</h4>
                        <p className="text-sm text-muted-foreground">
                          De {transaction.sellerName} •{" "}
                          {new Date(transaction.transactionDate).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">R$ {transaction.totalPrice.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          R$ {(transaction.totalPrice / transaction.amount).toFixed(2)}/ton
                        </p>
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

export default function CompanyDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["company"]}>
      <CompanyDashboardContent />
    </ProtectedRoute>
  )
}
