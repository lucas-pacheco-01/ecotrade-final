export type UserRole = "producer" | "company" | "admin"

export type UserType = "cpf" | "cnpj"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  userType: UserType
  document: string // CPF or CNPJ
  createdAt: string
}

export type CreditStatus = "pending" | "approved" | "rejected" | "sold"

export interface CarbonCredit {
  id: string
  producerId: string
  producerName: string
  amount: number // in tons
  origin: string
  generationDate: string
  registrationDate: string
  status: CreditStatus
  price: number // price per ton in BRL
  auditNotes?: string
}

export interface Transaction {
  id: string
  creditId: string
  sellerId: string
  sellerName: string
  buyerId: string
  buyerName: string
  amount: number // in tons
  totalPrice: number
  transactionDate: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  userType: UserType
  document: string
}
