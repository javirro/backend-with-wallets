export interface User {
  id: number
  email: string
  password?: string
  wallet: string
  pk: string
  createdAt: Date
}

export interface UserSCA {
  id: number
  email: string
  password?: string
  sca: string
  txHash: string
  createdAt: Date
}