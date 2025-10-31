"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { TrendingUp, Shield, Zap, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section
        className="relative overflow-hidden bg-cover bg-center py-20"
        style={{ backgroundImage: "url('/images/arvores-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
              <TrendingUp className="h-12 w-12 text-primary" />
            </div>
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Negocie Créditos de Carbono com Confiança
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg leading-relaxed text-gray-200">
              A EcoTrade conecta produtores rurais com empresas que buscam
              compensar sua pegada de carbono. Nossa plataforma garante
              transparência, segurança e créditos de carbono verificados para um
              futuro sustentável.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Começar Agora
                </Button>
              </Link>
              <Link href="/transactions">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base bg-white/20 text-white border-white hover:bg-white/30"
                >
                  Ver Transações
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/arvores-bg.png')" }}
      >
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground">
              Como Funciona a EcoTrade
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
              Uma plataforma transparente e segura para negociação de créditos
              de carbono
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  Cadastro
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Produtores e empresas criam contas com documentação CPF/CNPJ
                  verificada
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  Gerar Créditos
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Produtores rurais registram créditos de carbono com detalhes
                  de origem e geração
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  Auditoria e Aprovação
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Administradores validam os créditos antes de ficarem
                  disponíveis para negociação
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  Negociar
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Empresas compram créditos verificados com total transparência
                  nas transações
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/folhas-bg2.webp')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-balance text-3xl font-bold text-white">
            Pronto para Fazer a Diferença?
          </h2>
          <p className="mb-8 text-pretty text-lg text-gray-200">
            Junte-se à EcoTrade hoje e faça parte do futuro sustentável
          </p>
          <Link href="/register">
            <Button size="lg" className="text-base">
              Criar Sua Conta
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © 2025 EcoTrade. Plataforma regional de negociação de créditos de
            carbono.
          </p>
        </div>
      </footer>
    </div>
  );
}
