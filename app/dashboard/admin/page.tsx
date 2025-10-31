"use client"

import { useState, useEffect } from "react"
import { getCredits, getTransactions, getUsers, updateCredit } from "@/lib/storage"
import type { CarbonCredit, Transaction, User } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Users, TrendingUp, Clock, CheckCircle, XCircle, Shield } from "lucide-react"

function AdminDashboardContent() {
  const [credits, setCredits] = useState<CarbonCredit[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedCredit, setSelectedCredit] = useState<CarbonCredit | null>(null)
  const [auditNotes, setAuditNotes] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")

  const loadData = () => {
    setCredits(getCredits())
    setTransactions(getTransactions())
    setUsers(getUsers())
  }

  useEffect(() => {
    loadData()
  }, [])

  const pendingCredits = credits.filter((c) => c.status === "pending")
  const approvedCredits = credits.filter((c) => c.status === "approved")
  const totalVolume = credits.reduce((sum, c) => sum + c.amount, 0)
  const totalTransactions = transactions.length

  const openAuditDialog = (credit: CarbonCredit, action: "approve" | "reject") => {
    setSelectedCredit(credit)
    setActionType(action)
    setAuditNotes("")
    setIsDialogOpen(true)
  }

  const handleAuditAction = () => {
    if (!selectedCredit) return

    updateCredit(selectedCredit.id, {
      status: actionType === "approve" ? "approved" : "rejected",
      auditNotes: auditNotes || undefined,
    })

    setIsDialogOpen(false)
    setSelectedCredit(null)
    setAuditNotes("")
    loadData()
  }

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
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel do Administrador</h1>
            <p className="text-muted-foreground">Gerenciamento da plataforma e controle de auditoria</p>
          </div>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Auditorias Pendentes</CardDescription>
              <CardTitle className="text-3xl">{pendingCredits.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">créditos aguardando revisão</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Usuários</CardDescription>
              <CardTitle className="text-3xl">{users.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">registrados na plataforma</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Volume Total</CardDescription>
              <CardTitle className="text-3xl">{totalVolume.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">toneladas CO₂ registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Transações</CardDescription>
              <CardTitle className="text-3xl">{totalTransactions}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">negociações concluídas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Auditorias Pendentes
              {pendingCredits.length > 0 && (
                <Badge className="ml-2 bg-yellow-500 text-yellow-950">{pendingCredits.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all-credits">Todos os Créditos</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Créditos Pendentes de Auditoria</CardTitle>
                <CardDescription>Revise e aprove ou rejeite submissões de créditos de carbono</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingCredits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold text-foreground">Tudo em dia!</h3>
                    <p className="text-sm text-muted-foreground">Nenhum crédito pendente de auditoria no momento</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingCredits.map((credit) => (
                      <div key={credit.id} className="rounded-lg border border-border p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{credit.amount} toneladas CO₂</h4>
                              {getStatusBadge(credit.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">Produtor: {credit.producerName}</p>
                          </div>
                        </div>

                        <div className="mb-4 grid gap-2 text-sm md:grid-cols-2">
                          <div>
                            <span className="text-muted-foreground">Origem:</span>
                            <span className="ml-2 text-foreground">{credit.origin}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Gerado em:</span>
                            <span className="ml-2 text-foreground">
                              {new Date(credit.generationDate).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Registrado em:</span>
                            <span className="ml-2 text-foreground">
                              {new Date(credit.registrationDate).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Preço:</span>
                            <span className="ml-2 font-medium text-primary">
                              R$ {credit.price.toLocaleString()}/ton
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button size="sm" onClick={() => openAuditDialog(credit, "approve")} className="flex-1">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openAuditDialog(credit, "reject")}
                            className="flex-1"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-credits">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Créditos de Carbono</CardTitle>
                <CardDescription>Lista completa de todos os créditos no sistema</CardDescription>
              </CardHeader>
              <CardContent>
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
                          {credit.producerName} • {credit.origin} •{" "}
                          {new Date(credit.generationDate).toLocaleDateString("pt-BR")}
                        </p>
                        {credit.auditNotes && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            Observação de auditoria: {credit.auditNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Usuários Registrados</CardTitle>
                <CardDescription>Todos os usuários na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          {user.role === "producer" ? "Produtor" : user.role === "company" ? "Empresa" : "Admin"}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {user.userType.toUpperCase()}: {user.document}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === "approve" ? "Aprovar" : "Rejeitar"} Crédito de Carbono</DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Este crédito estará disponível para compra no marketplace."
                : "Este crédito será rejeitado e o produtor será notificado."}
            </DialogDescription>
          </DialogHeader>

          {selectedCredit && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-semibold text-foreground">{selectedCredit.amount} toneladas CO₂</p>
                <p className="text-muted-foreground">
                  {selectedCredit.producerName} • {selectedCredit.origin}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auditNotes">Observações de Auditoria (Opcional)</Label>
                <Textarea
                  id="auditNotes"
                  placeholder="Adicione observações ou feedback para o produtor..."
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAuditAction} variant={actionType === "approve" ? "default" : "destructive"}>
              {actionType === "approve" ? "Aprovar Crédito" : "Rejeitar Crédito"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
