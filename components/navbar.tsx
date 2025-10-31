"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { TrendingUp, LogOut } from "lucide-react"

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const getDashboardLink = () => {
    if (!user) return "/"
    switch (user.role) {
      case "producer":
        return "/dashboard/producer"
      case "company":
        return "/dashboard/company"
      case "admin":
        return "/dashboard/admin"
      default:
        return "/"
    }
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">EcoTrade</span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="ghost">Painel</Button>
                </Link>
                <Link href="/transactions">
                  <Button variant="ghost">Transações</Button>
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {user?.name} (
                    {user?.role === "producer" ? "Produtor" : user?.role === "company" ? "Empresa" : "Admin"})
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/transactions">
                  <Button variant="ghost">Transações</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline">Entrar</Button>
                </Link>
                <Link href="/register">
                  <Button>Cadastrar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
