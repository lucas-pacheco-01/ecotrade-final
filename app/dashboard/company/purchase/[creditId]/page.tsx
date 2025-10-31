"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getCredits, updateCredit, addTransaction } from "@/lib/storage"
import type { CarbonCredit, Transaction } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Leaf } from "lucide-react"
import Link from "next/link"

function PurchaseCreditContent() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const creditId = params.creditId as string

  const [credit, setCredit] = useState<CarbonCredit | null>(null)
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const credits = getCredits()
    const foundCredit = credits.find((c) => c.id === creditId && c.status === "approved")
    if (foundCredit) {
      setCredit(foundCredit)
      setAmount(foundCredit.amount.toString())
    }
  }, [creditId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!credit || !user) {
      setError("Solicitação de compra inválida")
      setIsLoading(false)
      return
    }

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Por favor, insira uma quantidade válida")
      setIsLoading(false)
      return
    }

    if (amountNum > credit.amount) {
      setError(`Máximo disponível: ${credit.amount} toneladas`)
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    const totalPrice = amountNum * credit.price

    const newTransaction: Transaction = {
      id: `transaction-${Date.now()}`,
      creditId: credit.id,
      sellerId: credit.producerId,
      sellerName: credit.producerName,
      buyerId: user.id,
      buyerName: user.name,
      amount: amountNum,
      totalPrice,
      transactionDate: new Date().toISOString(),
    }

    addTransaction(newTransaction)

    if (amountNum === credit.amount) {
      updateCredit(credit.id, { status: "sold" })
    } else {
      updateCredit(credit.id, { amount: credit.amount - amountNum })
    }

    router.push("/dashboard/company")
  }

  if (!credit) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Leaf className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">Crédito não encontrado</h3>
              <p className="mb-4 text-sm text-muted-foreground">Este crédito pode não estar mais disponível</p>
              <Link href="/dashboard/company">
                <Button>Voltar ao Painel</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const totalPrice = Number.parseFloat(amount) * credit.price

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard/company">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Painel
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Comprar Crédito de Carbono</CardTitle>
            <CardDescription>Complete sua compra para compensar sua pegada de carbono</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 rounded-lg bg-muted p-4">
              <h3 className="mb-3 font-semibold text-foreground">Detalhes do Crédito</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produtor:</span>
                  <span className="font-medium text-foreground">{credit.producerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Origem:</span>
                  <span className="font-medium text-foreground">{credit.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gerado em:</span>
                  <span className="font-medium text-foreground">
                    {new Date(credit.generationDate).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disponível:</span>
                  <span className="font-medium text-foreground">{credit.amount} toneladas CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preço por tonelada:</span>
                  <span className="font-medium text-primary">R$ {credit.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Quantidade a Comprar (toneladas de CO₂)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  max={credit.amount}
                  placeholder="10.50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Máximo disponível: {credit.amount} toneladas</p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="mb-3 font-semibold text-card-foreground">Resumo da Compra</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantidade:</span>
                    <span className="text-foreground">{amount || "0"} toneladas CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço por tonelada:</span>
                    <span className="text-foreground">R$ {credit.price.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total:</span>
                      <span className="text-lg font-bold text-primary">
                        R$ {isNaN(totalPrice) ? "0,00" : totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Processando..." : "Concluir Compra"}
                </Button>
                <Link href="/dashboard/company" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PurchaseCreditPage() {
  return (
    <ProtectedRoute allowedRoles={["company"]}>
      <PurchaseCreditContent />
    </ProtectedRoute>
  )
}
