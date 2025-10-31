"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { getUserByEmail } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { TrendingUp } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = getUserByEmail(email);

    if (!user) {
      setError("Usuário não encontrado");
      setIsLoading(false);
      return;
    }

    if (user.password !== password) {
      setError("Senha inválida");
      setIsLoading(false);
      return;
    }

    login(user.id);

    switch (user.role) {
      case "producer":
        router.push("/dashboard/producer");
        break;
      case "company":
        router.push("/dashboard/company");
        break;
      case "admin":
        router.push("/dashboard/admin");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div
        className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/folhas-bg-login.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <Card className="w-full max-w-md relative z-10">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Bem-vindo de Volta</CardTitle>
            <CardDescription>Entre na sua conta EcoTrade</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link href="/register" className="text-primary hover:underline">
                Cadastre-se aqui
              </Link>
            </div>

            <div className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              <p className="font-semibold">Credenciais de Demonstração:</p>
              <p>Admin: admin@ecotrade.com / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
