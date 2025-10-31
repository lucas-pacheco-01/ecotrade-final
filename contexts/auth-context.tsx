"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { AuthUser, UserRole } from "@/lib/types"
import { getUserById, getCurrentUserId, setCurrentUser, clearCurrentUser } from "@/lib/storage"

interface AuthContextType {
  user: AuthUser | null
  login: (userId: string) => void
  logout: () => void
  isAuthenticated: boolean
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const userId = getCurrentUserId()
    if (userId) {
      const userData = getUserById(userId)
      if (userData) {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          userType: userData.userType,
          document: userData.document,
        })
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userId: string) => {
    const userData = getUserById(userId)
    if (userData) {
      setCurrentUser(userId)
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        userType: userData.userType,
        document: userData.document,
      })
    }
  }

  const logout = () => {
    clearCurrentUser()
    setUser(null)
  }

  const hasRole = (role: UserRole) => {
    return user?.role === role
  }

  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
