"use client"

import { useState, useEffect } from "react"
import { getTransactions } from "@/lib/storage"
import type { Transaction } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Search, Calendar, DollarSign } from "lucide-react"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const allTransactions = getTransactions()
    const sorted = allTransactions.sort(
      (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime(),
    )
    setTransactions(sorted)
  }, [])

  const filteredTransactions = transactions.filter(
    (t) =>
      t.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalValue = transactions.reduce((sum, t) => sum + t.totalPrice, 0)
  const averagePrice = totalVolume > 0 ? totalValue / totalVolume : 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground">
              Histórico Público de Transações
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              Transparência completa na negociação de créditos de carbono. Veja todas as transações na plataforma
              EcoTrade.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Transações</CardDescription>
              <CardTitle className="text-3xl">{transactions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">negociações concluídas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Volume Total</CardDescription>
              <CardTitle className="text-3xl">{totalVolume.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">toneladas de CO₂ negociadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Preço Médio</CardDescription>
              <CardTitle className="text-3xl">R$ {averagePrice.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">por tonelada de CO₂</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todas as Transações</CardTitle>
            <CardDescription>
              Registro público de todas as negociações de créditos de carbono. Informações pessoais são protegidas.
            </CardDescription>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por vendedor, comprador ou ID da transação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {transactions.length === 0 ? "Nenhuma transação ainda" : "Nenhuma transação correspondente"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {transactions.length === 0
                    ? "As transações aparecerão aqui assim que os créditos de carbono forem negociados"
                    : "Tente ajustar seus termos de busca"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/30"
                  >
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{transaction.amount} toneladas CO₂</h4>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Concluída
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span>
                              De <span className="font-medium text-foreground">{transaction.sellerName}</span> para{" "}
                              <span className="font-medium text-foreground">{transaction.buyerName}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(transaction.transactionDate).toLocaleString("pt-BR")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>ID da Transação: {transaction.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">R$ {transaction.totalPrice.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          R$ {(transaction.totalPrice / transaction.amount).toFixed(2)}/ton
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Transparência e Privacidade</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Todas as transações na EcoTrade são publicamente visíveis para garantir transparência no mercado de
                  créditos de carbono. Embora os detalhes das transações sejam públicos, informações pessoais como
                  detalhes de contato e documentos permanecem privadas e protegidas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-12 border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © 2025 EcoTrade. Plataforma regional de negociação de créditos de carbono.
          </p>
        </div>
      </footer>
    </div>
  )
}
