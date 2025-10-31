"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addUser, getUserByEmail } from "@/lib/storage";
import {
  validateCPF,
  validateCNPJ,
  formatCPF,
  formatCNPJ,
} from "@/lib/validators";
import type { UserRole, UserType, User } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import { TrendingUp } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("producer");
  const [userType, setUserType] = useState<UserType>("cpf");
  const [document, setDocument] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDocumentChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    setDocument(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    if (userType === "cpf" && !validateCPF(document)) {
      setError("CPF inválido");
      setIsLoading(false);
      return;
    }

    if (userType === "cnpj" && !validateCNPJ(document)) {
      setError("CNPJ inválido");
      setIsLoading(false);
      return;
    }

    if (getUserByEmail(email)) {
      setError("E-mail já cadastrado");
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role,
      userType,
      document: userType === "cpf" ? formatCPF(document) : formatCNPJ(document),
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);
    router.push("/login");
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
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>
              Junte-se à EcoTrade e comece a negociar créditos de carbono
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                <Label htmlFor="role">Tipo de Conta</Label>
                <Select
                  value={role}
                  onValueChange={(value) => setRole(value as UserRole)}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="producer">Produtor Rural</SelectItem>
                    <SelectItem value="company">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de Documento</Label>
                <Select
                  value={userType}
                  onValueChange={(value) => setUserType(value as UserType)}
                >
                  <SelectTrigger id="userType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpf">CPF (Pessoa Física)</SelectItem>
                    <SelectItem value="cnpj">CNPJ (Pessoa Jurídica)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">
                  {userType === "cpf" ? "CPF" : "CNPJ"}
                </Label>
                <Input
                  id="document"
                  type="text"
                  placeholder={
                    userType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"
                  }
                  value={document}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  maxLength={userType === "cpf" ? 11 : 14}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/login" className="text-primary hover:underline">
                Entre aqui
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
