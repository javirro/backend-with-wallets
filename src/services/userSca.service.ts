import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { createUser, createUserSCA, getUserByEmail, getUserById, getUserSCAById } from '../db/queries'
import { BadRequestError, ConflictError } from '../types/errors'
import { decryptPrivateKey, encryptPrivateKey } from '../utils/encryptDecrypt'
import { hashData, verifyHash } from '../utils/hash'
import { executeTransaction } from '../contract/eoaAccount/executeTransaction'
import { checkEtherBalance, transferEth } from '../contract/eoaAccount/transferEth'
import { createSmartContractAccount } from '../contract/smartcontractAccount/createSmartContractAccount'
import { sendScaTransaction } from '../contract/smartcontractAccount/sendScaTransaction'
import { DEPOSIT_ESCROW_ADDRESS } from '../contract/addresses'

export class UserScaService {
  async normalizeEmail(email: string): Promise<string> {
    return email.trim().toLowerCase()
  }
  async createUserSCA(email: string, password: string) {
    // first validate if there is a user with that email
    const normalizeEmail = await this.normalizeEmail(email)
    const existingUser = await getUserByEmail(normalizeEmail)
    if (existingUser) {
      throw new ConflictError('Invalid email')
    }

    const { scaAddress, txHash } = await createSmartContractAccount(normalizeEmail)

    const user = await createUserSCA(normalizeEmail, password, scaAddress, txHash)
    return user
  }

  async loginUserSca(email: string, password: string) {
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

  async sendTransactionSca(userId: number): Promise<string> {
    const user = await getUserSCAById(userId)
    if (!user) {
      throw new BadRequestError('User not found')
    }
    const randomBeneficiary = '0x0000000000000000000000000000000000000001'
    const maxValidationTime =  86400 // 24 hours in seconds
    const txHash = await sendScaTransaction(user.sca!, DEPOSIT_ESCROW_ADDRESS, randomBeneficiary, maxValidationTime)

    return txHash
  }
}

export const userScaService = new UserScaService()
