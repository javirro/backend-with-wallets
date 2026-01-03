import { User, UserSCA } from '../types/types'
import dbClient from './connectionDB'

export const createUser = async (email: string, passwordHash: string, wallet: string, privateKeyEncrypted: string) => {
  const query = `INSERT INTO users (email, password, wallet, pk)
                 VALUES ($1, $2, $3, $4) RETURNING *`
  const values = [email, passwordHash, wallet, privateKeyEncrypted]
  const result = await dbClient.query(query, values)
  return result.rows[0]
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const query = `SELECT * FROM users WHERE email = $1`
  const values = [email]
  const result = await dbClient.query(query, values)
  const user: User = result?.rows?.[0]
  return user
}

export const getUserById = async (id: number): Promise<User | null> => {
  const query = `SELECT * FROM users WHERE id = $1`
  const values = [id]
  const result = await dbClient.query(query, values)
  const user: User = result?.rows?.[0]
  return user
}

// SCA

export const createUserSCA = async (email: string, password: string, sca: string, txHash: string): Promise<UserSCA> => {
  const query = `INSERT INTO users_sca (email, password, sca, tx_hash)
                 VALUES ($1, $2, $3, $4) RETURNING *`
  const values = [email, password, sca, txHash]
  const result = await dbClient.query(query, values)
  return result.rows[0]
}

export const getUserSCAByEmail = async (email: string): Promise<UserSCA | null> => {
  const query = `SELECT * FROM users_sca WHERE email = $1`
  const values = [email]
  const result = await dbClient.query(query, values)
  const user: UserSCA = result?.rows?.[0]
  return user
}

export const getUserSCAById = async (id: number): Promise<UserSCA | null> => {
  const query = `SELECT * FROM users_sca WHERE id = $1`
  const values = [id]
  const result = await dbClient.query(query, values)
  const user: UserSCA = result?.rows?.[0]
  return user
}
