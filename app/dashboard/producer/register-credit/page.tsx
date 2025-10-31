"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { addCredit } from "@/lib/storage"
import type { CarbonCredit } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function RegisterCreditContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [origin, setOrigin] = useState("")
  const [generationDate, setGenerationDate] = useState("")
  const [price, setPrice] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Por favor, insira uma quantidade válida")
      setIsLoading(false)
      return
    }

    const priceNum = Number.parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Por favor, insira um preço válido")
      setIsLoading(false)
      return
    }

    const genDate = new Date(generationDate)
    if (genDate > new Date()) {
      setError("A data de geração não pode ser no futuro")
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    const newCredit: CarbonCredit = {
      id: `credit-${Date.now()}`,
      producerId: user!.id,
      producerName: user!.name,
      amount: amountNum,
      origin,
      generationDate: genDate.toISOString(),
      registrationDate: new Date().toISOString(),
      status: "pending",
      price: priceNum,
    }

    addCredit(newCredit)
    router.push("/dashboard/producer")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard/producer">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Painel
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registrar Crédito de Carbono</CardTitle>
            <CardDescription>
              Envie seu crédito de carbono para aprovação de auditoria. Uma vez aprovado, estará disponível para
              negociação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Quantidade (toneladas de CO₂)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="10.50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Insira a quantidade total de créditos de carbono em toneladas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">Origem / Localização</Label>
                <Input
                  id="origin"
                  type="text"
                  placeholder="ex: Floresta Amazônica, Estado do Acre"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Especifique onde os créditos de carbono foram gerados</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="generationDate">Data de Geração</Label>
                <Input
                  id="generationDate"
                  type="date"
                  value={generationDate}
                  onChange={(e) => setGenerationDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
                <p className="text-xs text-muted-foreground">Quando esses créditos de carbono foram gerados?</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço por Tonelada (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Defina seu preço por tonelada de CO₂</p>
              </div>

              {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-semibold text-foreground">O que acontece a seguir?</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Seu crédito será enviado para revisão de auditoria</li>
                  <li>• Um administrador verificará as informações</li>
                  <li>• Uma vez aprovado, seu crédito estará disponível para compra</li>
                  <li>• Você será notificado sobre quaisquer mudanças de status</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar para Aprovação"}
                </Button>
                <Link href="/dashboard/producer" className="flex-1">
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

export default function RegisterCreditPage() {
  return (
    <ProtectedRoute allowedRoles={["producer"]}>
      <RegisterCreditContent />
    </ProtectedRoute>
  )
}
