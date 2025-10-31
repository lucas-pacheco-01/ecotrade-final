export const validateCPF = (cpf: string): boolean => {
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, "")

  if (cleanCPF.length !== 11) return false

  // Check for known invalid CPFs
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  // Validate check digits
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== Number.parseInt(cleanCPF.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== Number.parseInt(cleanCPF.charAt(10))) return false

  return true
}

export const validateCNPJ = (cnpj: string): boolean => {
  // Remove non-numeric characters
  const cleanCNPJ = cnpj.replace(/\D/g, "")

  if (cleanCNPJ.length !== 14) return false

  // Check for known invalid CNPJs
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false

  // Validate first check digit
  let sum = 0
  let weight = 5
  for (let i = 0; i < 12; i++) {
    sum += Number.parseInt(cleanCNPJ.charAt(i)) * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (digit !== Number.parseInt(cleanCNPJ.charAt(12))) return false

  // Validate second check digit
  sum = 0
  weight = 6
  for (let i = 0; i < 13; i++) {
    sum += Number.parseInt(cleanCNPJ.charAt(i)) * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (digit !== Number.parseInt(cleanCNPJ.charAt(13))) return false

  return true
}

export const formatCPF = (cpf: string): string => {
  const clean = cpf.replace(/\D/g, "")
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export const formatCNPJ = (cnpj: string): string => {
  const clean = cnpj.replace(/\D/g, "")
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}
