"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/lib/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.push("/")
    }
  }, [isAuthenticated, user, allowedRoles, router])

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
