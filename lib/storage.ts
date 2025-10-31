import type { User, CarbonCredit, Transaction } from "./types"

const USERS_KEY = "ecotrade_users"
const CREDITS_KEY = "ecotrade_credits"
const TRANSACTIONS_KEY = "ecotrade_transactions"
const CURRENT_USER_KEY = "ecotrade_current_user"

// Initialize with default admin user
const initializeStorage = () => {
  if (typeof window === "undefined") return

  const users = localStorage.getItem(USERS_KEY)
  if (!users) {
    const defaultAdmin: User = {
      id: "admin-1",
      name: "Administrator",
      email: "admin@ecotrade.com",
      password: "admin123",
      role: "admin",
      userType: "cpf",
      document: "000.000.000-00",
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultAdmin]))
  }

  if (!localStorage.getItem(CREDITS_KEY)) {
    localStorage.setItem(CREDITS_KEY, JSON.stringify([]))
  }

  if (!localStorage.getItem(TRANSACTIONS_KEY)) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]))
  }
}

// User operations
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  initializeStorage()
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export const addUser = (user: User): void => {
  const users = getUsers()
  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers()
  return users.find((u) => u.email === email)
}

export const getUserById = (id: string): User | undefined => {
  const users = getUsers()
  return users.find((u) => u.id === id)
}

// Carbon credit operations
export const getCredits = (): CarbonCredit[] => {
  if (typeof window === "undefined") return []
  initializeStorage()
  const credits = localStorage.getItem(CREDITS_KEY)
  return credits ? JSON.parse(credits) : []
}

export const addCredit = (credit: CarbonCredit): void => {
  const credits = getCredits()
  credits.push(credit)
  localStorage.setItem(CREDITS_KEY, JSON.stringify(credits))
}

export const updateCredit = (creditId: string, updates: Partial<CarbonCredit>): void => {
  const credits = getCredits()
  const index = credits.findIndex((c) => c.id === creditId)
  if (index !== -1) {
    credits[index] = { ...credits[index], ...updates }
    localStorage.setItem(CREDITS_KEY, JSON.stringify(credits))
  }
}

export const getCreditsByProducer = (producerId: string): CarbonCredit[] => {
  return getCredits().filter((c) => c.producerId === producerId)
}

export const getApprovedCredits = (): CarbonCredit[] => {
  return getCredits().filter((c) => c.status === "approved")
}

// Transaction operations
export const getTransactions = (): Transaction[] => {
  if (typeof window === "undefined") return []
  initializeStorage()
  const transactions = localStorage.getItem(TRANSACTIONS_KEY)
  return transactions ? JSON.parse(transactions) : []
}

export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions()
  transactions.push(transaction)
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
}

export const getTransactionsByUser = (userId: string): Transaction[] => {
  return getTransactions().filter((t) => t.sellerId === userId || t.buyerId === userId)
}

// Current user session
export const setCurrentUser = (userId: string): void => {
  localStorage.setItem(CURRENT_USER_KEY, userId)
}

export const getCurrentUserId = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CURRENT_USER_KEY)
}

export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY)
}
