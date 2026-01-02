import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { createUser, getUserByEmail, getUserById } from '../db/queries'
import { BadRequestError, ConflictError } from '../types/errors'
import { decryptPrivateKey, encryptPrivateKey } from '../utils/encryptDecrypt'
import { hashData, verifyHash } from '../utils/hash'
import { executeTransaction } from '../contract/executeTransaction'
import { checkEtherBalance, transferEth } from '../contract/transferEth'

export class UserService {
  async normalizeEmail(email: string): Promise<string> {
    return email.trim().toLowerCase()
  }
  async createUser(email: string, password: string) {
    // first validate if there is a user with that email
    const normalizeEmail = await this.normalizeEmail(email)
    const existingUser = await getUserByEmail(normalizeEmail)
    if (existingUser) {
      throw new ConflictError('Invalid email')
    }
    // Generate a random private key
    const privateKey = generatePrivateKey()

    // Create an account from the private key
    const account = privateKeyToAccount(privateKey)

    // encrypt the private key
    const encryptedPrivateKey = encryptPrivateKey(privateKey)

    // hash the password
    const passwordHash = await hashData(password)

    const user = await createUser(normalizeEmail, passwordHash, account.address, encryptedPrivateKey)
    return user
  }

  async loginUser(email: string, password: string) {
    const normalizeEmail = await this.normalizeEmail(email)
    const user = await getUserByEmail(normalizeEmail)
    if (!user) {
      throw new BadRequestError('Invalid email or password')
    }
    // verify password
    const isPasswordValid = await verifyHash(user.password!, password)
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid email or password')
    }
    return user
  }

  async sendTransaction(userId: number): Promise<string> {
    const user = await getUserById(userId)
    if (!user) {
      throw new BadRequestError('User not found')
    }

    const BALANCE_THRESHOLD_ETH = 0.0003
    // Decrypt the private key
    const decryptedPrivateKey = decryptPrivateKey(user.pk!)
    //! THE ACCOUNT MUST HAVE SEPOLIA ETH TO EXECUTE THE TRANSACTION
    const { ethBalance } = await checkEtherBalance(user.wallet!)
    if (ethBalance < BALANCE_THRESHOLD_ETH) {
      console.log('Insufficient balance. Sending ETH to user wallet...')
      await transferEth(user.wallet!, 0.0006)
    }
    const txHash = await executeTransaction(decryptedPrivateKey)

    return txHash

  }
}

export const userService = new UserService()
